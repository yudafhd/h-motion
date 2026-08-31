export type EditorTab = 'html' | 'css' | 'js';

export interface StockPreset {
  id: string;
  name: string;
  category: 'Landscape' | 'Vertical' | 'Square' | 'Cinema';
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  recommendedFps: number[];
}

export interface MotionTemplate {
  id: string;
  title: string;
  category: 'Title' | 'Abstract' | 'Tech' | 'LowerThird' | 'Promo';
  description: string;
  presetId: string;
  fps: number;
  duration: number;
  html: string;
  css: string;
  js: string;
}

export interface GeminiTemplateSettings {
  presetId: string;
  presetName: string;
  width: number;
  height: number;
  aspectRatio: string;
  fps: number;
  duration: number;
}

export interface GeminiTemplateRequest {
  apiKey: string;
  prompt: string;
  model: string;
  settings: GeminiTemplateSettings;
}

export interface GeneratedMotionTemplate {
  title: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  category: 'Easing' | 'Animation' | 'Math' | 'Utility';
  code: string;
}

export interface PreflightCheckResult {
  id: string;
  label: string;
  passed: boolean;
  message: string;
  severity: 'success' | 'warning' | 'error';
}

export interface ProjectData {
  title: string;
  html: string;
  css: string;
  js: string;
  preset: StockPreset;
  fps: number;
  duration: number;
  updatedAt: number;
}

export type ExportStage = 'idle' | 'preparing' | 'rendering' | 'encoding' | 'completed' | 'error';

export interface ExportProgress {
  stage: ExportStage;
  message: string;
  currentFrame?: number;
  totalFrames?: number;
  outputPath?: string;
  error?: string;
}
