import React, { useState } from 'react';
import { StockPreset, CodeSnippet } from '../../types';
import { OutputSettingsPanel } from './OutputSettingsPanel';
import { PreflightPanel } from './PreflightPanel';
import { SnippetPanel } from './SnippetPanel';

interface SidebarProps {
  preset: StockPreset;
  fps: number;
  duration: number;
  jsCode: string;
  runtimeError: string | null;
  onSelectPreset: (preset: StockPreset) => void;
  onChangeFps: (fps: number) => void;
  onChangeDuration: (duration: number) => void;
  onInsertSnippet: (snippet: CodeSnippet) => void;
}

type SidebarTab = 'specs' | 'preflight' | 'snippets';

export const Sidebar: React.FC<SidebarProps> = ({
  preset,
  fps,
  duration,
  jsCode,
  runtimeError,
  onSelectPreset,
  onChangeFps,
  onChangeDuration,
  onInsertSnippet
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('specs');

  return (
    <aside className="app-sidebar">
      <div className="sidebar-nav">
        <div className="sidebar-nav-inner">
          <button
            type="button"
            className={`sidebar-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <span>Specs</span>
          </button>

          <button
            type="button"
            className={`sidebar-tab-btn ${activeTab === 'preflight' ? 'active' : ''}`}
            onClick={() => setActiveTab('preflight')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Preflight</span>
            {runtimeError && <span className="error-dot" />}
          </button>

          <button
            type="button"
            className={`sidebar-tab-btn ${activeTab === 'snippets' ? 'active' : ''}`}
            onClick={() => setActiveTab('snippets')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
            <span>Snippets</span>
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        {activeTab === 'specs' && (
          <OutputSettingsPanel
            preset={preset}
            fps={fps}
            duration={duration}
            onSelectPreset={onSelectPreset}
            onChangeFps={onChangeFps}
            onChangeDuration={onChangeDuration}
          />
        )}

        {activeTab === 'preflight' && (
          <PreflightPanel
            preset={preset}
            fps={fps}
            duration={duration}
            jsCode={jsCode}
            runtimeError={runtimeError}
          />
        )}

        {activeTab === 'snippets' && (
          <SnippetPanel onInsertSnippet={onInsertSnippet} />
        )}
      </div>
    </aside>
  );
};
