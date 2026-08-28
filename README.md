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

## MVP limitation
Node, Playwright Chromium and FFmpeg are development dependencies. Production packaging should convert renderer + FFmpeg into bundled Tauri sidecars. Asset manager, save/open project, cancel/progress events, alpha ProRes and post-render ffprobe validation are next milestones.
