# Microstock Motion MVP

Tauri desktop MVP that turns HTML + CSS + JavaScript motion compositions into frame-based 4K MP4 files.

## Current MVP
- React + TypeScript + Vite + Tauri v2
- Monaco HTML/CSS/JS editor
- live iframe preview
- Adobe Stock oriented 4K landscape / vertical / square presets
- 24/25/30/60 FPS and 5–60 second duration
- deterministic `motion.render((time, frame, fps) => {})` API
- Playwright Chromium frame renderer
- PNG sequence -> H.264 MP4 via FFmpeg
- basic preflight in Tauri backend

## Development prerequisites
- Node.js 20+
- Rust stable + Tauri OS prerequisites
- FFmpeg available in PATH

## Run
```bash
npm install
npm run renderer:install
npm run tauri dev
```

## Test export
Open the app and click **Export Adobe Stock MP4**. Output is written to `microstock-motion-output.mp4` in the project directory.

## Animation API
```js
motion.render((time, frame, fps) => {
  const el = document.querySelector('.title');
  el.style.opacity = Math.min(time / 1, 1);
});
```
Do not rely on realtime CSS animation for final export. Drive final animation state from `time` for deterministic frames.

## Gemini AI Studio template generator

Click **Gemini AI** in the header, paste an API key created in Google AI Studio, describe the motion graphic, then choose the output preset, FPS, duration, and Gemini model. The key is saved locally by the app so it remains available after restart, but is never included in project JSON exports. Use **Hapus API key tersimpan** in the dialog to remove it.

### Model Tersedia (Free Tier & Paid Tier):
- **Tier Gratis & Berbayar (Flash — Kuota 15 RPM Free)**:
  - `gemini-3.6-flash`: *Rekomendasi Utama* — Model resmi standar dari Google AI Studio untuk pembuatan template gerak deterministik yang cepat dan stabil.
  - `gemini-3.7-flash`: Generasi termutakhir dengan kemampuan hybrid reasoning adaptif dan respon instan.
  - `gemini-3.5-flash-lite`: Varian ultra-ringan hemat kuota untuk iterasi cepat.
- **Tier Berbayar (Pro Reasoning)**:
  - `gemini-3.1-pro-preview`: Penalaran tingkat tinggi untuk kalkulasi matematika rumit, geometri SVG presisi, dan arsitektur motion kompleks (Disarankan untuk Pay-as-you-go / 2 RPM di Free Tier).

## MVP limitation
Node, Playwright Chromium and FFmpeg are development dependencies. Production packaging should convert renderer + FFmpeg into bundled Tauri sidecars. Asset manager, save/open project, cancel/progress events, alpha ProRes and post-render ffprobe validation are next milestones.
