import React from 'react';
import { StockPreset } from '../../types';
import { STOCK_PRESETS, ALLOWED_FPS, MIN_DURATION, MAX_DURATION } from '../../constants/presets';
import { calculateTotalFrames, estimateFileSizeMb } from '../../utils/timecode';
import { CustomSelect } from '../common/CustomSelect';

interface OutputSettingsPanelProps {
  preset: StockPreset;
  fps: number;
  duration: number;
  onSelectPreset: (preset: StockPreset) => void;
  onChangeFps: (fps: number) => void;
  onChangeDuration: (duration: number) => void;
}

export const OutputSettingsPanel: React.FC<OutputSettingsPanelProps> = ({
  preset,
  fps,
  duration,
  onSelectPreset,
  onChangeFps,
  onChangeDuration
}) => {
  const totalFrames = calculateTotalFrames(fps, duration);
  const estimatedSize = estimateFileSizeMb(preset.width, preset.height, fps, duration);

  const presetOptions = STOCK_PRESETS.map((p) => ({
    value: p.id,
    label: p.name,
    subLabel: `${p.width} × ${p.height}`,
    badge: p.aspectRatio,
    group: p.category
  }));

  const fpsOptions = ALLOWED_FPS.map((f) => ({
    value: f,
    label: `${f} FPS`,
    badge: f === 30 ? 'Standard' : f === 60 ? 'High Motion' : undefined
  }));

  return (
    <div className="settings-panel">
      <div className="panel-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span>Stock Format & Dimensions</span>
      </div>

      <div className="form-group">
        <label htmlFor="preset-select" className="form-label">
          Resolution Preset
          <span className="aspect-tag">{preset.aspectRatio}</span>
        </label>
        <CustomSelect
          id="preset-select"
          options={presetOptions}
          value={preset.id}
          onChange={(val) => {
            const found = STOCK_PRESETS.find(p => p.id === val);
            if (found) onSelectPreset(found);
          }}
        />
        <div className="preset-dimension-tag">
          <span>{preset.width} × {preset.height} px</span>
          <span className="badge-pill">{preset.category}</span>
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="fps-select" className="form-label">Framerate</label>
          <CustomSelect
            id="fps-select"
            options={fpsOptions}
            value={fps}
            onChange={(val) => onChangeFps(Number(val))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration-input" className="form-label">
            Duration
            <span className="text-secondary">{duration}s</span>
          </label>
          <div className="duration-input-wrapper">
            <input
              id="duration-input"
              type="number"
              min={MIN_DURATION}
              max={MAX_DURATION}
              className="form-input"
              value={duration}
              onChange={(e) => {
                const val = Math.max(MIN_DURATION, Math.min(MAX_DURATION, Number(e.target.value) || MIN_DURATION));
                onChangeDuration(val);
              }}
            />
            <span className="unit-label">sec</span>
          </div>
        </div>
      </div>

      <div className="form-slider-group">
        <input
          type="range"
          min={MIN_DURATION}
          max={MAX_DURATION}
          value={duration}
          onChange={(e) => onChangeDuration(Number(e.target.value))}
          className="range-slider"
        />
        <div className="range-bounds">
          <span>{MIN_DURATION}s (Min)</span>
          <span>{MAX_DURATION}s (Max)</span>
        </div>
      </div>

      <div className="stat-cards-grid">
        <div className="stat-card">
          <span className="stat-label">Total Frames</span>
          <span className="stat-value">{totalFrames.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Est. File Size</span>
          <span className="stat-value">~{estimatedSize}</span>
        </div>
      </div>
    </div>
  );
};
