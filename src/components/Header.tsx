import React, { useRef } from 'react';
import { MOTION_TEMPLATES } from '../constants/templates';
import { CustomSelect } from './common/CustomSelect';

interface HeaderProps {
  projectTitle: string;
  onUpdateTitle: (title: string) => void;
  onSelectTemplate: (templateId: string) => void;
  onSaveJson: () => void;
  onImportJson: (file: File) => void;
  onResetProject: () => void;
  onOpenAiTemplate: () => void;
  onOpenExportModal: () => void;
  isPreflightValid: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  projectTitle,
  onUpdateTitle,
  onSelectTemplate,
  onSaveJson,
  onImportJson,
  onResetProject,
  onOpenAiTemplate,
  onOpenExportModal,
  isPreflightValid
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      e.target.value = '';
    }
  };

  const templateOptions = MOTION_TEMPLATES.map((tmpl) => ({
    value: tmpl.id,
    label: tmpl.title,
    badge: `${tmpl.fps} FPS`,
    group: tmpl.category
  }));

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="brand-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="url(#h-grad)" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="10,8 16,12 10,16" fill="url(#h-grad)" />
              <defs>
                <linearGradient id="h-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-titles">
            <span className="brand-name">H-MOTION</span>
            <span className="brand-tag">4K STUDIO</span>
          </div>
        </div>

        <div className="project-title-box">
          <input
            type="text"
            className="project-title-input"
            value={projectTitle}
            onChange={(e) => onUpdateTitle(e.target.value)}
            placeholder="Untitled Motion"
            title="Click to rename project"
          />
        </div>

        <div className="template-picker-wrapper" style={{ width: '230px' }}>
          <CustomSelect
            options={templateOptions}
            value=""
            placeholder="Load Template Preset..."
            onChange={(val) => onSelectTemplate(String(val))}
            size="sm"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="action-buttons-group">
          <button
            type="button"
            className="btn-ghost btn-ai-template"
            onClick={onOpenAiTemplate}
            title="Create a motion template with Gemini"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 3-1.7 5.3L5 10l5.3 1.7L12 17l1.7-5.3L19 10l-5.3-1.7L12 3Z" />
              <path d="m19 15-.8 2.2L16 18l2.2.8L19 21l.8-2.2L22 18l-2.2-.8L19 15Z" />
            </svg>
            <span>Gemini AI</span>
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={onSaveJson}
            title="Download project as .json"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Save JSON</span>
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={() => fileInputRef.current?.click()}
            title="Open saved project .json"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Open JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="btn-ghost text-muted"
            onClick={onResetProject}
            title="Reset code to current template"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Reset</span>
          </button>
        </div>

        <div className="export-cta-wrapper">
          <button
            type="button"
            className={`btn-primary btn-export ${!isPreflightValid ? 'btn-warning' : ''}`}
            onClick={onOpenExportModal}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="2" y1="7" x2="7" y2="7" />
              <line x1="2" y1="17" x2="7" y2="17" />
              <line x1="17" y1="17" x2="22" y2="17" />
              <line x1="17" y1="7" x2="22" y2="7" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
