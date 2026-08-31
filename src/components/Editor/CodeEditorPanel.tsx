import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { EditorTab } from '../../types';

interface CodeEditorPanelProps {
  html: string;
  css: string;
  js: string;
  activeTab: EditorTab;
  onChangeTab: (tab: EditorTab) => void;
  onChangeHtml: (val: string) => void;
  onChangeCss: (val: string) => void;
  onChangeJs: (val: string) => void;
  runtimeError: string | null;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  html,
  css,
  js,
  activeTab,
  onChangeTab,
  onChangeHtml,
  onChangeCss,
  onChangeJs,
  runtimeError
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const currentCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
  const currentLanguage = activeTab === 'html' ? 'html' : activeTab === 'css' ? 'css' : 'javascript';

  const handleCodeChange = (value: string | undefined) => {
    const nextVal = value ?? '';
    if (activeTab === 'html') onChangeHtml(nextVal);
    else if (activeTab === 'css') onChangeCss(nextVal);
    else onChangeJs(nextVal);
  };

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const lineCount = currentCode.split('\n').length;
  const charCount = currentCode.length;

  if (isHidden) {
    return (
      <div className="code-editor-restore">
        <button
          type="button"
          className="editor-tool-btn"
          onClick={() => setIsHidden(false)}
          title="Show code editor"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          Show Code Editor
        </button>
      </div>
    );
  }

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('antigravity-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64687d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'f3f4f6' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'f472b6' },
        { token: 'tag', foreground: 'f87171' },
        { token: 'attribute.name', foreground: 'fbbf24' },
        { token: 'attribute.value', foreground: '34d399' },
        { token: 'delimiter', foreground: '9ca3af' },
        { token: 'type', foreground: '60a5fa' }
      ],
      colors: {
        'editor.background': '#1b1c24',
        'editor.foreground': '#f3f4f6',
        'editor.lineHighlightBackground': '#22242f',
        'editor.selectionBackground': '#36394c',
        'editorCursor.foreground': '#818cf8',
        'editorWhitespace.foreground': '#2e303f',
        'editorLineNumber.foreground': '#54586d',
        'editorLineNumber.activeForeground': '#a5b4fc',
        'editorIndentGuide.background1': '#262837',
        'editorIndentGuide.activeBackground1': '#43475f'
      }
    });
  };

  return (
    <section className={`code-editor-panel ${isExpanded ? 'is-expanded' : ''}`}>
      <div className="editor-tab-bar">
        <div className="tab-group-left">
          <button
            type="button"
            className={`editor-tab ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => onChangeTab('html')}
          >
            <span className="tab-icon icon-html">&lt;/&gt;</span>
            <span className="tab-label">index.html</span>
            <span className="tab-badge">DOM</span>
          </button>

          <button
            type="button"
            className={`editor-tab ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => onChangeTab('css')}
          >
            <span className="tab-icon icon-css">#</span>
            <span className="tab-label">style.css</span>
            <span className="tab-badge">Style</span>
          </button>

          <button
            type="button"
            className={`editor-tab ${activeTab === 'js' ? 'active' : ''}`}
            onClick={() => onChangeTab('js')}
          >
            <span className="tab-icon icon-js">JS</span>
            <span className="tab-label">motion.js</span>
            <span className="tab-badge">Render API</span>
            {runtimeError && <span className="tab-error-dot" title="JavaScript runtime error" />}
          </button>
        </div>

        <div className="tab-group-right">
          <div className="editor-stats">
            <span>{lineCount} lines</span>
            <span className="dot-sep">•</span>
            <span>{charCount} chars</span>
          </div>

          <button
            type="button"
            className="editor-tool-btn"
            onClick={handleCopyCurrent}
            title="Copy current tab code"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>

          <button
            type="button"
            className="editor-tool-btn"
            onClick={() => setIsHidden(true)}
            title="Hide code editor"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l18 18" />
              <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
              <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c6.5 0 10 8 10 8a18.2 18.2 0 0 1-3.2 4.2" />
              <path d="M6.2 6.2A18.1 18.1 0 0 0 2 12s3.5 8 10 8a10.4 10.4 0 0 0 3.3-.6" />
            </svg>
            Hide Editor
          </button>

          <button
            type="button"
            className="editor-tool-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse Editor' : 'Expand Editor'}
          >
            {isExpanded ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="4 14 10 14 10 20"/>
                <polyline points="20 10 14 10 14 4"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9"/>
                <polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="monaco-wrapper">
        <Editor
          height="100%"
          theme="antigravity-dark"
          beforeMount={handleEditorWillMount}
          language={currentLanguage}
          value={currentCode}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            automaticLayout: true,
            tabSize: 2,
            scrollBeyondLastLine: false,
            bracketPairColorization: { enabled: true },
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
            smoothScrolling: true,
            cursorBlinking: 'smooth'
          }}
        />
      </div>
    </section>
  );
};
