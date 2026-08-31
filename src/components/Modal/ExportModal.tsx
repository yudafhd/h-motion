import React from 'react';
import { StockPreset, ExportProgress } from '../../types';
import { calculateTotalFrames, estimateFileSizeMb } from '../../utils/timecode';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExport: () => void;
  preset: StockPreset;
  fps: number;
  duration: number;
  projectTitle: string;
  exportProgress: ExportProgress;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onStartExport,
  preset,
  fps,
  duration,
  projectTitle,
  exportProgress
}) => {
  if (!isOpen) return null;

  const totalFrames = calculateTotalFrames(fps, duration);
  const estSize = estimateFileSizeMb(preset.width, preset.height, fps, duration);
  const isBusy = exportProgress.stage === 'preparing' || exportProgress.stage === 'rendering' || exportProgress.stage === 'encoding';
  const isComplete = exportProgress.stage === 'completed';
  const isError = exportProgress.stage === 'error';

  const isFfmpegMissing = exportProgress.error?.toLowerCase().includes('ffmpeg') ||
    exportProgress.error?.toLowerCase().includes('enoent');

  return (
    <div className="modal-backdrop">
      <div className="export-modal">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <div>
              <h3>Export Stock Video Master</h3>
              <p className="modal-subtitle">Generate frame-deterministic 4K MP4 for stock submission</p>
            </div>
          </div>
          {!isBusy && (
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          )}
        </div>

        <div className="modal-body">
          {/* Video Specs Summary Grid */}
          <div className="specs-summary-grid">
            <div className="spec-card">
              <span className="spec-label">Resolution</span>
              <span className="spec-val">{preset.width} × {preset.height}</span>
              <span className="spec-sub">{preset.aspectRatio} Aspect</span>
            </div>

            <div className="spec-card">
              <span className="spec-label">Framerate</span>
              <span className="spec-val">{fps} FPS</span>
              <span className="spec-sub">Frame-accurate</span>
            </div>

            <div className="spec-card">
              <span className="spec-label">Duration</span>
              <span className="spec-val">{duration} Seconds</span>
              <span className="spec-sub">{totalFrames} frames</span>
            </div>

            <div className="spec-card">
              <span className="spec-label">Codec / Container</span>
              <span className="spec-val">H.264 MP4</span>
              <span className="spec-sub">CRF 15 / yuv420p</span>
            </div>
          </div>

          {/* Export Pipeline Status */}
          {exportProgress.stage !== 'idle' && (
            <div className="export-pipeline-status">
              <div className="pipeline-steps">
                <div className={`step-item ${exportProgress.stage === 'preparing' ? 'active' : isBusy || isComplete ? 'done' : ''}`}>
                  <div className="step-bullet">1</div>
                  <span>Prepare DOM</span>
                </div>
                <div className="step-line" />
                <div className={`step-item ${exportProgress.stage === 'rendering' ? 'active' : (exportProgress.stage === 'encoding' || isComplete) ? 'done' : ''}`}>
                  <div className="step-bullet">2</div>
                  <span>Chromium Frames</span>
                </div>
                <div className="step-line" />
                <div className={`step-item ${exportProgress.stage === 'encoding' ? 'active' : isComplete ? 'done' : ''}`}>
                  <div className="step-bullet">3</div>
                  <span>FFmpeg Master</span>
                </div>
              </div>

              <div className="progress-status-box">
                <div className="status-spinner-row">
                  {isBusy && <div className="spinner" />}
                  <span className="status-msg">{exportProgress.message}</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Box */}
          {isComplete && (
            <div className="success-banner">
              <div className="success-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="success-content">
                <h4>Render & Export Successful!</h4>
                <p className="output-path-text">{exportProgress.outputPath}</p>
              </div>
            </div>
          )}

          {/* Error Box */}
          {isError && (
            <div className="error-banner">
              <div className="error-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div className="error-content">
                <h4>Export Error</h4>
                <p>{exportProgress.error}</p>

                {isFfmpegMissing && (
                  <div className="ffmpeg-troubleshoot">
                    <p className="troubleshoot-hint">
                      <strong>Tip:</strong> FFmpeg is required for assembling video frames into MP4. You can install it on macOS using Homebrew:
                    </p>
                    <div className="command-box">
                      <code>brew install ffmpeg</code>
                      <button
                        type="button"
                        className="btn-copy-cmd"
                        onClick={() => navigator.clipboard.writeText('brew install ffmpeg')}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-ghost"
            onClick={onClose}
            disabled={isBusy}
          >
            {isComplete ? 'Done' : 'Cancel'}
          </button>

          {!isComplete && (
            <button
              type="button"
              className="btn-primary btn-modal-export"
              onClick={onStartExport}
              disabled={isBusy}
            >
              {isBusy ? (
                <>
                  <span className="btn-spinner" />
                  <span>Exporting ({preset.aspectRatio} 4K)...</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  <span>{isError ? 'Retry Export' : 'Start 4K Export'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
