import React, { useEffect, useState } from 'react';
import { BACKGROUND_COLOR_PRESETS } from '../../constants/colors';
import { DEFAULT_GEMINI_MODEL, GEMINI_MODELS } from '../../constants/models';
import { ALLOWED_FPS, STOCK_PRESETS } from '../../constants/presets';
import { GeminiTemplateRequest, StockPreset } from '../../types';
import { clearGeminiApiKey, loadGeminiApiKey, saveGeminiApiKey } from '../../utils/storage';
import { CustomSelect } from '../common/CustomSelect';

interface GeminiTemplateModalProps {
  isOpen: boolean;
  defaultPreset: StockPreset;
  defaultFps: number;
  defaultDuration: number;
  onClose: () => void;
  onGenerate: (request: GeminiTemplateRequest) => Promise<void>;
}

export const GeminiTemplateModal: React.FC<GeminiTemplateModalProps> = ({
  isOpen,
  defaultPreset,
  defaultFps,
  defaultDuration,
  onClose,
  onGenerate
}) => {
  const [apiKey, setApiKey] = useState(loadGeminiApiKey);
  const [prompt, setPrompt] = useState('A premium abstract motion background with a modern neon color palette.');
  const [model, setModel] = useState(DEFAULT_GEMINI_MODEL);
  const [presetId, setPresetId] = useState(defaultPreset.id);
  const [fps, setFps] = useState(defaultFps);
  const [duration, setDuration] = useState(defaultDuration);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [customColorHex, setCustomColorHex] = useState('#00FF00');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPresetId(defaultPreset.id);
    setFps(defaultFps);
    setDuration(defaultDuration);
    setError(null);
    if (!GEMINI_MODELS.some((m) => m.id === model)) {
      setModel(DEFAULT_GEMINI_MODEL);
    }
  }, [isOpen, defaultPreset.id, defaultFps, defaultDuration, model]);

  if (!isOpen) return null;

  const selectedPreset = STOCK_PRESETS.find((preset) => preset.id === presetId) ?? defaultPreset;
  const supportedFps = selectedPreset.recommendedFps;

  const handlePresetChange = (nextPresetId: string) => {
    const nextPreset = STOCK_PRESETS.find((preset) => preset.id === nextPresetId);
    setPresetId(nextPresetId);
    if (nextPreset && !nextPreset.recommendedFps.includes(fps)) {
      setFps(nextPreset.recommendedFps[0]);
    }
  };

  const handleApplyColor = (colorName: string, hex: string, description: string, presetId?: string) => {
    setSelectedColorId(presetId || 'custom');
    const colorClause = `Background & Color Palette: ${colorName} (${hex}) — ${description}.`;
    setPrompt((prev) => {
      const regex = /Background & Color Palette:.*$/m;
      if (regex.test(prev)) {
        return prev.replace(regex, colorClause);
      }
      const trimmed = prev.trim();
      if (!trimmed) return colorClause;
      return `${trimmed}\n\n${colorClause}`;
    });
  };

  const presetOptions = STOCK_PRESETS.map((p) => ({
    value: p.id,
    label: p.name,
    badge: p.aspectRatio,
    group: p.category
  }));

  const fpsOptions = ALLOWED_FPS.filter((val) => supportedFps.includes(val)).map((val) => ({
    value: val,
    label: `${val} FPS`
  }));

  const modelOptions = GEMINI_MODELS.map((m) => ({
    value: m.id,
    label: m.label,
    badge: m.tierBadge,
    group: m.group,
    subLabel: m.subLabel
  }));

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      setError('Masukkan Gemini API key dari Google AI Studio.');
      return;
    }
    if (!prompt.trim()) {
      setError('Jelaskan template yang ingin dibuat.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    try {
      await onGenerate({
        apiKey: apiKey.trim(),
        prompt: prompt.trim(),
        model,
        settings: {
          presetId: selectedPreset.id,
          presetName: selectedPreset.name,
          width: selectedPreset.width,
          height: selectedPreset.height,
          aspectRatio: selectedPreset.aspectRatio,
          fps,
          duration
        }
      });
      onClose();
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="export-modal gemini-modal" role="dialog" aria-modal="true" aria-labelledby="gemini-modal-title">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon gemini-modal-icon">✦</div>
            <div>
              <h3 id="gemini-modal-title">Generate Template with Gemini</h3>
              <p className="modal-subtitle">Gemini menghasilkan HTML, CSS, dan JavaScript siap preview.</p>
            </div>
          </div>
          {!isGenerating && <button type="button" className="btn-close" onClick={onClose} aria-label="Close">✕</button>}
        </div>

        <div className="modal-body gemini-modal-body">
          <label className="form-group">
            <span className="form-label">Gemini API key</span>
            <input
              className="form-input"
              type="password"
              autoComplete="current-password"
              value={apiKey}
              onChange={(event) => {
                const nextApiKey = event.target.value;
                setApiKey(nextApiKey);
                saveGeminiApiKey(nextApiKey);
              }}
              placeholder="AIza..."
              disabled={isGenerating}
            />
          </label>

          {apiKey && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setApiKey('');
                clearGeminiApiKey();
              }}
              disabled={isGenerating}
            >
              Hapus API key tersimpan
            </button>
          )}

          <div className="form-group">
            <span className="form-label">Creative brief</span>
            <textarea
              className="form-input gemini-prompt-input"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Contoh: promo teknologi futuristik dengan teks yang mudah diganti"
              disabled={isGenerating}
            />
          </div>

          <div className="gemini-color-palette-group">
            <div className="gemini-color-header">
              <span className="gemini-color-title">🎨 Pilih Warna Background & Tema</span>
              <span className="gemini-color-hint">Klik untuk memasukkan ke brief</span>
            </div>
            <div className="gemini-color-buttons">
              {BACKGROUND_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`gemini-color-chip ${selectedColorId === preset.id ? 'active' : ''}`}
                  onClick={() => handleApplyColor(preset.name, preset.hex, preset.description, preset.id)}
                  title={`${preset.name} (${preset.hex}) - ${preset.description}`}
                  disabled={isGenerating}
                >
                  <span className="color-swatch" style={{ backgroundColor: preset.hex }} />
                  <span className="color-name">{preset.name}</span>
                </button>
              ))}

              <label
                className={`gemini-color-chip gemini-custom-color-chip ${selectedColorId === 'custom' ? 'active' : ''}`}
                title="Pilih warna custom HEX"
              >
                <input
                  type="color"
                  value={customColorHex}
                  onChange={(e) => {
                    const hex = e.target.value;
                    setCustomColorHex(hex);
                    handleApplyColor('Custom HEX', hex, `Latar belakang warna khusus (${hex})`, 'custom');
                  }}
                  disabled={isGenerating}
                  className="sr-only-color-input"
                />
                <span className="color-swatch custom-swatch" style={{ backgroundColor: customColorHex }} />
                <span className="color-name">{selectedColorId === 'custom' ? customColorHex.toUpperCase() : 'Custom…'}</span>
              </label>
            </div>
          </div>

          <div className="gemini-settings-grid">
            <div className="form-group">
              <span className="form-label">Output preset</span>
              <CustomSelect
                options={presetOptions}
                value={presetId}
                onChange={(val) => handlePresetChange(String(val))}
                disabled={isGenerating}
              />
            </div>
            <div className="form-group">
              <span className="form-label">FPS</span>
              <CustomSelect
                options={fpsOptions}
                value={fps}
                onChange={(val) => setFps(Number(val))}
                disabled={isGenerating}
              />
            </div>
            <div className="form-group">
              <span className="form-label">Duration</span>
              <input
                className="form-input"
                type="number"
                min="5"
                max="60"
                value={duration}
                onChange={(event) => setDuration(Math.max(5, Math.min(60, Number(event.target.value) || 5)))}
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Model Gemini</span>
            <CustomSelect
              options={modelOptions}
              value={model}
              onChange={(val) => setModel(String(val))}
              disabled={isGenerating}
            />
          </div>

          {error && (
            <div className="error-banner gemini-error">
              <div className="error-content">
                <h4>Gemini tidak dapat membuat template</h4>
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={isGenerating}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary btn-modal-export"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="btn-spinner" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <span>✦</span>
                <span>Generate Template</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
