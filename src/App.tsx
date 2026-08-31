import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { EditorTab, StockPreset, CodeSnippet, ExportProgress, GeneratedMotionTemplate, GeminiTemplateRequest } from './types';
import { STOCK_PRESETS, DEFAULT_PRESET } from './constants/presets';
import { MOTION_TEMPLATES } from './constants/templates';
import { buildPreviewDocument } from './preview';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { PreviewStage } from './components/Preview/PreviewStage';
import { TimelineBar } from './components/Preview/TimelineBar';
import { CodeEditorPanel } from './components/Editor/CodeEditorPanel';
import { ExportModal } from './components/Modal/ExportModal';
import { GeminiTemplateModal } from './components/Modal/GeminiTemplateModal';
import {
  saveProjectToStorage,
  getInitialProject,
  exportProjectToJson
} from './utils/storage';
import { calculateTotalFrames } from './utils/timecode';

export default function App() {
  // Load initial project from storage or default template
  const initial = useMemo(() => getInitialProject(), []);

  const [projectTitle, setProjectTitle] = useState<string>(initial.title);
  const [html, setHtml] = useState<string>(initial.html);
  const [css, setCss] = useState<string>(initial.css);
  const [js, setJs] = useState<string>(initial.js);
  const [activeTab, setActiveTab] = useState<EditorTab>('html');

  const [preset, setPreset] = useState<StockPreset>(initial.preset || DEFAULT_PRESET);
  const [fps, setFps] = useState<number>(initial.fps || 30);
  const [duration, setDuration] = useState<number>(initial.duration || 8);

  // Playback & Timeline State
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Export Workflow State
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [geminiModalOpen, setGeminiModalOpen] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    stage: 'idle',
    message: 'Ready to export'
  });

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Auto-save project changes to localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProjectToStorage({
        title: projectTitle,
        html,
        css,
        js,
        preset,
        fps,
        duration
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [projectTitle, html, css, js, preset, fps, duration]);

  // Build the preview HTML document whenever code or FPS changes
  const iframeDoc = useMemo(() => {
    return buildPreviewDocument(html, css, js, currentTime, fps);
  }, [html, css, js, fps]);

  // Dispatch frame seek to iframe
  const postSeekToIframe = useCallback((time: number) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const frame = Math.floor(time * fps);
      iframeRef.current.contentWindow.postMessage({
        type: 'SEEK_FRAME',
        time,
        frame,
        fps
      }, '*');
    }
  }, [fps]);

  // Handle postMessage runtime error events from iframe
  useEffect(() => {
    const handleMessage = (evt: MessageEvent) => {
      if (!evt || !evt.data) return;
      if (evt.data.type === 'MOTION_RUNTIME_ERROR') {
        setRuntimeError(evt.data.error || 'JavaScript execution failed');
      } else if (evt.data.type === 'MOTION_CODE_SUCCESS') {
        setRuntimeError(null);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Animation Playback Engine
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimestampRef.current = null;
      return;
    }

    const stepAnimation = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prevTime) => {
        let nextTime = prevTime + deltaSec;
        if (nextTime >= duration) {
          if (isLooping) {
            nextTime = 0;
          } else {
            setIsPlaying(false);
            nextTime = duration;
          }
        }
        postSeekToIframe(nextTime);
        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(stepAnimation);
    };

    animFrameRef.current = requestAnimationFrame(stepAnimation);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, duration, isLooping, postSeekToIframe]);

  // Manual Seek
  const handleSeekTime = (time: number) => {
    const clamped = Math.max(0, Math.min(duration, time));
    setCurrentTime(clamped);
    postSeekToIframe(clamped);
  };

  // Step Frame
  const handleStepFrame = (direction: -1 | 1) => {
    setIsPlaying(false);
    const frameDuration = 1 / fps;
    handleSeekTime(currentTime + direction * frameDuration);
  };

  // Jump to Start / End
  const handleJumpToStart = () => {
    setIsPlaying(false);
    handleSeekTime(0);
  };

  const handleJumpToEnd = () => {
    setIsPlaying(false);
    handleSeekTime(duration);
  };

  // Keyboard Shortcuts (Space to play/pause, Arrows to step frame)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.classList.contains('monaco-editor');
      if (isInput) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepFrame(-1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepFrame(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fps, currentTime, duration]);

  // Load Template
  const handleSelectTemplate = (templateId: string) => {
    const tmpl = MOTION_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;
    setIsPlaying(false);
    setProjectTitle(tmpl.title);
    setHtml(tmpl.html);
    setCss(tmpl.css);
    setJs(tmpl.js);
    setFps(tmpl.fps);
    setDuration(tmpl.duration);
    const matchedPreset = STOCK_PRESETS.find(p => p.id === tmpl.presetId);
    if (matchedPreset) setPreset(matchedPreset);
    handleSeekTime(0);
  };

  // Insert Snippet into JS tab
  const handleInsertSnippet = (snippet: CodeSnippet) => {
    setJs((prev) => `${prev}\n\n// ${snippet.title}\n${snippet.code}`);
    setActiveTab('js');
  };

  const handleGenerateGeminiTemplate = async (request: GeminiTemplateRequest) => {
    const generated = await invoke<GeneratedMotionTemplate>('generate_gemini_template', { request });
    const generatedPreset = STOCK_PRESETS.find((item) => item.id === request.settings.presetId);
    if (!generatedPreset) throw new Error('Output preset tidak ditemukan.');

    setIsPlaying(false);
    setProjectTitle(generated.title);
    setHtml(generated.html);
    setCss(generated.css);
    setJs(generated.js);
    setPreset(generatedPreset);
    setFps(request.settings.fps);
    setDuration(request.settings.duration);
    setActiveTab('html');
    handleSeekTime(0);
  };

  // Save JSON
  const handleSaveJson = () => {
    exportProjectToJson({
      title: projectTitle,
      html,
      css,
      js,
      preset,
      fps,
      duration
    });
  };

  // Import JSON
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        if (data && typeof data.html === 'string') {
          setIsPlaying(false);
          setProjectTitle(data.title || file.name.replace('.json', ''));
          setHtml(data.html || '');
          setCss(data.css || '');
          setJs(data.js || '');
          if (data.preset) setPreset(data.preset);
          if (data.fps) setFps(data.fps);
          if (data.duration) setDuration(data.duration);
          handleSeekTime(0);
        }
      } catch (err) {
        alert('Invalid project JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Reset to default
  const handleResetProject = () => {
    if (confirm('Reset project back to default template? Unsaved changes will be lost.')) {
      localStorage.removeItem('microstock_motion_project_v1');
      handleSelectTemplate(MOTION_TEMPLATES[0].id);
    }
  };

  // Export Workflow with Tauri backend
  const handleStartExport = async () => {
    setExportProgress({
      stage: 'preparing',
      message: 'Compiling DOM scene & preparing frame sequence...'
    });

    try {
      // Small simulated step feedback before handing to backend
      await new Promise(r => setTimeout(r, 600));

      setExportProgress({
        stage: 'rendering',
        message: `Rendering ${calculateTotalFrames(fps, duration)} frames in Headless Chromium...`
      });

      const result = await invoke<string>('export_video', {
        project: {
          html,
          css,
          javascript: js,
          width: preset.width,
          height: preset.height,
          fps,
          duration
        }
      });

      setExportProgress({
        stage: 'completed',
        message: 'Master video generated successfully!',
        outputPath: result
      });
    } catch (err: any) {
      setExportProgress({
        stage: 'error',
        message: 'Export pipeline error',
        error: String(err && err.message ? err.message : err)
      });
    }
  };

  const isPreflightValid = Boolean(
    preset.width >= 1920 &&
    preset.height >= 1080 &&
    duration >= 5 &&
    duration <= 60 &&
    !runtimeError
  );

  return (
    <div className="app-container">
      <Header
        projectTitle={projectTitle}
        onUpdateTitle={setProjectTitle}
        onSelectTemplate={handleSelectTemplate}
        onSaveJson={handleSaveJson}
        onImportJson={handleImportJson}
        onResetProject={handleResetProject}
        onOpenAiTemplate={() => setGeminiModalOpen(true)}
        onOpenExportModal={() => {
          setExportProgress({ stage: 'idle', message: 'Ready' });
          setExportModalOpen(true);
        }}
        isPreflightValid={isPreflightValid}
      />

      <div className="workspace-grid">
        <Sidebar
          preset={preset}
          fps={fps}
          duration={duration}
          jsCode={js}
          runtimeError={runtimeError}
          onSelectPreset={setPreset}
          onChangeFps={setFps}
          onChangeDuration={setDuration}
          onInsertSnippet={handleInsertSnippet}
        />

        <main className="center-work-area">
          <PreviewStage
            iframeDoc={iframeDoc}
            preset={preset}
            iframeRef={iframeRef}
            runtimeError={runtimeError}
          />

          <TimelineBar
            currentTime={currentTime}
            duration={duration}
            fps={fps}
            isPlaying={isPlaying}
            isLooping={isLooping}
            onTogglePlay={() => setIsPlaying(prev => !prev)}
            onSeekTime={handleSeekTime}
            onStepFrame={handleStepFrame}
            onToggleLoop={() => setIsLooping(prev => !prev)}
            onJumpToStart={handleJumpToStart}
            onJumpToEnd={handleJumpToEnd}
          />
        </main>
      </div>

      <CodeEditorPanel
        html={html}
        css={css}
        js={js}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onChangeHtml={setHtml}
        onChangeCss={setCss}
        onChangeJs={setJs}
        runtimeError={runtimeError}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onStartExport={handleStartExport}
        preset={preset}
        fps={fps}
        duration={duration}
        projectTitle={projectTitle}
        exportProgress={exportProgress}
      />

      <GeminiTemplateModal
        isOpen={geminiModalOpen}
        defaultPreset={preset}
        defaultFps={fps}
        defaultDuration={duration}
        onClose={() => setGeminiModalOpen(false)}
        onGenerate={handleGenerateGeminiTemplate}
      />
    </div>
  );
}
