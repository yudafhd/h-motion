import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';

function readArgument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const projectPath = readArgument('--project');
const outputPath = readArgument('--output');
const chromiumDir = readArgument('--chromium-dir');
if (!projectPath || !outputPath || !chromiumDir) {
  throw new Error('Usage: motion-renderer --project project.json --output output.mp4 --chromium-dir path');
}

async function findFile(root, names) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const candidate = path.join(root, entry.name);
    if (entry.isFile() && names.has(entry.name)) return candidate;
    if (entry.isDirectory()) {
      const match = await findFile(candidate, names);
      if (match) return match;
    }
  }
  return undefined;
}

async function bundledChromiumExecutable(root) {
  const names = process.platform === 'darwin'
    ? new Set(['Chromium', 'Google Chrome for Testing'])
    : process.platform === 'win32'
      ? new Set(['chrome.exe'])
      : new Set(['chrome']);
  const executable = await findFile(root, names);
  if (!executable) throw new Error(`Bundled Chromium executable was not found in: ${root}`);
  return executable;
}

async function bundledFfmpegExecutable() {
  const binaryDir = path.dirname(process.execPath);
  const names = process.platform === 'win32'
    ? new Set(['ffmpeg.exe'])
    : new Set(['ffmpeg']);
  let executable = await findFile(binaryDir, names);
  // In `tauri dev`, sidecars retain their target triple (for example
  // ffmpeg-x86_64-apple-darwin); release bundles use the plain ffmpeg name.
  if (!executable) {
    const entries = await fs.readdir(binaryDir, { withFileTypes: true });
    const prefix = process.platform === 'win32' ? 'ffmpeg-' : 'ffmpeg-';
    const sidecar = entries.find((entry) =>
      entry.isFile() && entry.name.startsWith(prefix) &&
      (process.platform !== 'win32' || entry.name.endsWith('.exe'))
    );
    if (sidecar) executable = path.join(binaryDir, sidecar.name);
  }
  if (!executable) throw new Error(`Bundled FFmpeg executable was not found beside renderer: ${binaryDir}`);
  return executable;
}

const p = JSON.parse(await fs.readFile(projectPath, 'utf8'));
const totalFrames = p.fps * p.duration;
const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'microstock-frames-'));

try {
  console.log(`[Renderer] Launching Headless Chromium (${p.width}x${p.height} @ ${p.fps}fps, ${p.duration}s = ${totalFrames} frames)...`);
  const browser = await chromium.launch({
    executablePath: await bundledChromiumExecutable(chromiumDir),
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: p.width, height: p.height },
    deviceScaleFactor: 1
  });

  const escaped = p.javascript.replace(/<\/script>/gi, '<\\/script>');
  const doc = `<!doctype html><html><head><meta charset="utf-8"><style>${p.css}</style></head><body>${p.html}<script>window.__renderCallbacks=[];window.motion={render(fn){window.__renderCallbacks.push(fn)}};${escaped};window.__renderFrame=(time,frame,fps)=>{for(const cb of window.__renderCallbacks)cb(time,frame,fps)};<\/script></body></html>`;

  await page.setContent(doc, { waitUntil: 'load' });
  // pkg serializes host callbacks as bytecode, while Playwright needs source
  // text to send them to Chromium. Use page expressions for packaged builds.
  await page.evaluate('document.fonts ? document.fonts.ready.then(() => undefined) : undefined');

  for (let frame = 0; frame < totalFrames; frame++) {
    const time = frame / p.fps;
    await page.evaluate(`window.__renderFrame(${time}, ${frame}, ${p.fps})`);
    await page.screenshot({
      path: path.join(dir, `${String(frame).padStart(6, '0')}.png`),
      type: 'png'
    });
    if (frame % 30 === 0 || frame === totalFrames - 1) {
      console.log(`[Renderer] Captured frame ${frame + 1}/${totalFrames} (${Math.round(((frame + 1) / totalFrames) * 100)}%)`);
    }
  }

  await browser.close();

  const ffmpegBin = await bundledFfmpegExecutable();
  console.log(`[Renderer] Encoding frames to H.264 MP4 using FFmpeg (${ffmpegBin})...`);

  const args = [
    '-y',
    '-framerate', String(p.fps),
    '-i', path.join(dir, '%06d.png'),
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '15',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-r', String(p.fps),
    outputPath
  ];

  const ff = spawnSync(ffmpegBin, args, { stdio: 'inherit' });
  if (ff.status !== 0) {
    throw new Error(`FFmpeg export failed with exit code ${ff.status}.`);
  }

  console.log(`[Renderer] Master video created successfully: ${outputPath}`);
} finally {
  // Clean up temporary frame screenshots
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (e) {
    // ignore cleanup errors
  }
}
