import React from 'react';
import { StockPreset, PreflightCheckResult } from '../../types';
import { MIN_DURATION, MAX_DURATION, ALLOWED_FPS } from '../../constants/presets';

interface PreflightPanelProps {
  preset: StockPreset;
  fps: number;
  duration: number;
  jsCode: string;
  runtimeError: string | null;
}

export const PreflightPanel: React.FC<PreflightPanelProps> = ({
  preset,
  fps,
  duration,
  jsCode,
  runtimeError
}) => {
  const is4K = (preset.width >= 3840 || preset.height >= 3840);
  const isFhd = (preset.width >= 1920 || preset.height >= 1920);
  const isFpsValid = ALLOWED_FPS.includes(fps);
  const isDurationValid = duration >= MIN_DURATION && duration <= MAX_DURATION;
  const hasMotionRender = jsCode.includes('motion.render');
  const hasRuntimeError = Boolean(runtimeError);

  const checks: PreflightCheckResult[] = [
    {
      id: 'resolution',
      label: is4K ? '4K Ultra HD Preset' : 'Full HD 1080p Preset',
      passed: is4K || isFhd,
      message: `${preset.width} × ${preset.height} (${preset.aspectRatio})`,
      severity: is4K || isFhd ? 'success' : 'error'
    },
    {
      id: 'duration',
      label: 'Duration (5s - 60s)',
      passed: isDurationValid,
      message: isDurationValid ? `${duration}s (Stock Compliant)` : `Must be ${MIN_DURATION}–${MAX_DURATION}s`,
      severity: isDurationValid ? 'success' : 'error'
    },
    {
      id: 'framerate',
      label: 'Standard Stock FPS',
      passed: isFpsValid,
      message: `${fps} FPS`,
      severity: isFpsValid ? 'success' : 'error'
    },
    {
      id: 'api',
      label: 'Deterministic Frame API',
      passed: hasMotionRender,
      message: hasMotionRender ? 'motion.render() active' : 'Missing motion.render callback',
      severity: hasMotionRender ? 'success' : 'warning'
    },
    {
      id: 'runtime',
      label: 'JavaScript Execution',
      passed: !hasRuntimeError,
      message: hasRuntimeError ? `Error: ${runtimeError}` : 'No syntax / runtime errors',
      severity: !hasRuntimeError ? 'success' : 'error'
    },
    {
      id: 'audio',
      label: 'Audio Stream',
      passed: true,
      message: 'Muted Video Master (Standard)',
      severity: 'success'
    }
  ];

  const allPassed = checks.every(c => c.passed);

  return (
    <div className="preflight-panel">
      <div className="panel-heading">
        <div className="heading-left">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Microstock Preflight Audit</span>
        </div>
        <span className={`status-pill ${allPassed ? 'pill-success' : 'pill-warning'}`}>
          {allPassed ? 'READY TO EXPORT' : 'ISSUES DETECTED'}
        </span>
      </div>

      <ul className="preflight-list">
        {checks.map((chk) => (
          <li key={chk.id} className={`preflight-item item-${chk.severity}`}>
            <div className="check-icon">
              {chk.passed ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              )}
            </div>
            <div className="check-details">
              <span className="check-title">{chk.label}</span>
              <span className="check-sub">{chk.message}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
