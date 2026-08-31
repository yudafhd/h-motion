import { ProjectData, StockPreset } from '../types';
import { STOCK_PRESETS } from '../constants/presets';
import { MOTION_TEMPLATES } from '../constants/templates';

const STORAGE_KEY = 'microstock_motion_project_v1';
const GEMINI_API_KEY_STORAGE_KEY = 'microstock_motion_gemini_api_key_v1';

export function loadGeminiApiKey(): string {
  try {
    return localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) ?? '';
  } catch (err) {
    console.warn('Failed to read Gemini API key from localStorage:', err);
    return '';
  }
}

export function saveGeminiApiKey(apiKey: string): void {
  try {
    localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, apiKey);
  } catch (err) {
    console.warn('Failed to save Gemini API key to localStorage:', err);
  }
}

export function clearGeminiApiKey(): void {
  try {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to remove Gemini API key from localStorage:', err);
  }
}

export function saveProjectToStorage(data: {
  title: string;
  html: string;
  css: string;
  js: string;
  preset: StockPreset;
  fps: number;
  duration: number;
}): void {
  try {
    const payload: ProjectData = {
      ...data,
      updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save project to localStorage:', err);
  }
}

export function loadProjectFromStorage(): ProjectData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.html === 'string' && parsed.preset) {
      return parsed as ProjectData;
    }
  } catch (err) {
    console.warn('Failed to read project from localStorage:', err);
  }
  return null;
}

export function exportProjectToJson(project: {
  title: string;
  html: string;
  css: string;
  js: string;
  preset: StockPreset;
  fps: number;
  duration: number;
}): void {
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.title.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}_project.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function getInitialProject(): {
  title: string;
  html: string;
  css: string;
  js: string;
  preset: StockPreset;
  fps: number;
  duration: number;
} {
  const saved = loadProjectFromStorage();
  if (saved) {
    return {
      title: saved.title || 'Untitled Motion Project',
      html: saved.html,
      css: saved.css,
      js: saved.js,
      preset: saved.preset,
      fps: saved.fps || 30,
      duration: saved.duration || 8
    };
  }

  const defaultTemplate = MOTION_TEMPLATES[0];
  const matchedPreset = STOCK_PRESETS.find(p => p.id === defaultTemplate.presetId) || STOCK_PRESETS[0];

  return {
    title: defaultTemplate.title,
    html: defaultTemplate.html,
    css: defaultTemplate.css,
    js: defaultTemplate.js,
    preset: matchedPreset,
    fps: defaultTemplate.fps,
    duration: defaultTemplate.duration
  };
}
