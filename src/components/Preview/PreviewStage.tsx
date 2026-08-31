import React, { useState } from 'react';
import { StockPreset } from '../../types';

interface PreviewStageProps {
  iframeDoc: string;
  preset: StockPreset;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  runtimeError: string | null;
}

export const PreviewStage: React.FC<PreviewStageProps> = ({
  iframeDoc,
  preset,
  iframeRef,
  runtimeError
}) => {
  const [showSafeGuides, setShowSafeGuides] = useState<boolean>(false);
  const [showCheckerboard, setShowCheckerboard] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<'fit' | '75' | '100'>('fit');

  const aspectRatio = `${preset.width} / ${preset.height}`;

  return (
    <div className="preview-stage-container">
      <div className="preview-stage-toolbar">
        <div className="toolbar-left">
          <span className="resolution-badge">
            <span className="preset-name">{preset.name}</span>
            <span className="res-dim">{preset.width} × {preset.height}</span>
          </span>
        </div>

        <div className="toolbar-right">
          <button
            type="button"
            className={`toolbar-btn ${showSafeGuides ? 'active' : ''}`}
            onClick={() => setShowSafeGuides(!showSafeGuides)}
            title="Toggle Action & Title Safe Area Guides"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <rect x="6" y="6" width="12" height="12"/>
            </svg>
            <span>Safe Guides</span>
          </button>

          <button
            type="button"
            className={`toolbar-btn ${showCheckerboard ? 'active' : ''}`}
            onClick={() => setShowCheckerboard(!showCheckerboard)}
            title="Toggle Transparent Grid Background"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            <span>Grid BG</span>
          </button>

          <div className="zoom-toggle-group">
            <button
              type="button"
              className={`zoom-btn ${zoomScale === 'fit' ? 'active' : ''}`}
              onClick={() => setZoomScale('fit')}
            >
              Fit
            </button>
            <button
              type="button"
              className={`zoom-btn ${zoomScale === '75' ? 'active' : ''}`}
              onClick={() => setZoomScale('75')}
            >
              75%
            </button>
            <button
              type="button"
              className={`zoom-btn ${zoomScale === '100' ? 'active' : ''}`}
              onClick={() => setZoomScale('100')}
            >
              100%
            </button>
          </div>
        </div>
      </div>

      <div className={`preview-viewport ${showCheckerboard ? 'bg-checkerboard' : ''}`}>
        <div
          className={`preview-canvas-wrapper scale-${zoomScale}`}
          style={{ aspectRatio }}
        >
          <iframe
            ref={iframeRef}
            title="Microstock Motion Live Canvas"
            className="preview-iframe"
            srcDoc={iframeDoc}
            sandbox="allow-scripts allow-same-origin"
          />

          {showSafeGuides && (
            <div className="safe-guides-overlay" pointer-events="none">
              <div className="guide-action-safe" title="Action Safe Zone (90%)">
                <span className="guide-label tl">90% Action</span>
              </div>
              <div className="guide-title-safe" title="Title Safe Zone (80%)">
                <span className="guide-label tl">80% Title</span>
              </div>
            </div>
          )}

          {runtimeError && (
            <div className="preview-error-overlay">
              <div className="error-card">
                <div className="error-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Motion Runtime Exception</span>
                </div>
                <pre className="error-message">{runtimeError}</pre>
                <div className="error-hint">Fix errors in the JavaScript editor to resume playback.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
