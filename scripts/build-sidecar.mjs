import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tauriDir = path.join(root, 'src-tauri');
const binariesDir = path.join(tauriDir, 'binaries');
const browserSource = path.join(root, 'node_modules', 'playwright-core', '.local-browsers');
const browserDestination = path.join(tauriDir, 'resources', 'chromium');

const targets = {
  'darwin-arm64': { triple: 'aarch64-apple-darwin', pkg: 'node22-macos-arm64' },
  'darwin-x64': { triple: 'x86_64-apple-darwin', pkg: 'node22-macos-x64' },
  'linux-arm64': { triple: 'aarch64-unknown-linux-gnu', pkg: 'node22-linux-arm64' },
  'linux-x64': { triple: 'x86_64-unknown-linux-gnu', pkg: 'node22-linux-x64' },
  'win32-arm64': { triple: 'aarch64-pc-windows-msvc', pkg: 'node22-win-arm64' },
  'win32-x64': { triple: 'x86_64-pc-windows-msvc', pkg: 'node22-win-x64' }
};
const target = targets[`${process.platform}-${process.arch}`];
if (!target) throw new Error(`Unsupported sidecar build platform: ${process.platform}-${process.arch}`);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', ...options });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
}

async function hasBrowser() {
  if (!existsSync(browserSource)) return false;
  return (await readdir(browserSource)).some((entry) => entry.startsWith('chromium-'));
}

if (!await hasBrowser()) {
  console.log('[sidecar] Downloading the Playwright Chromium runtime for bundling...');
  run(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['playwright', 'install', 'chromium'], {
    env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: '0' }
  });
}

await mkdir(binariesDir, { recursive: true });
await mkdir(path.dirname(browserDestination), { recursive: true });
const extension = process.platform === 'win32' ? '.exe' : '';
const rendererBinary = path.join(binariesDir, `motion-renderer-${target.triple}${extension}`);
const ffmpegBinary = path.join(binariesDir, `ffmpeg-${target.triple}${extension}`);
const playwrightCoreBundle = path.join(root, 'node_modules', 'playwright-core', 'lib', 'coreBundle.js');

console.log(`[sidecar] Compiling renderer for ${target.triple}...`);
// pkg executables deliberately omit Node's inspector module. Playwright loads
// it eagerly only for page.pause(), which the frame renderer never uses. Patch
// that optional debug import while packaging, then restore node_modules.
const coreBundleSource = await readFile(playwrightCoreBundle, 'utf8');
const inspectorImport = 'inspector = __toESM(require("inspector"));';
if (!coreBundleSource.includes(inspectorImport)) {
  throw new Error('Unsupported Playwright version: could not locate the optional inspector import.');
}
await writeFile(
  playwrightCoreBundle,
  coreBundleSource.replace(inspectorImport, 'inspector = { url: () => undefined };')
);

try {
  run(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
    'pkg',
    'renderer/render.mjs',
    '--config', 'package.json',
    '--targets', target.pkg,
    '--output', rendererBinary,
    '--no-signature',
    '--public-packages', 'playwright,playwright-core',
    '--fallback-to-source'
  ]);
} finally {
  await writeFile(playwrightCoreBundle, coreBundleSource);
}

if (!ffmpegPath || !existsSync(ffmpegPath)) throw new Error('ffmpeg-static binary is unavailable. Run npm install first.');
await cp(ffmpegPath, ffmpegBinary, { force: true });
await rm(browserDestination, { recursive: true, force: true });
await cp(browserSource, browserDestination, { recursive: true });

if (process.platform !== 'win32') {
  const { chmod } = await import('node:fs/promises');
  await chmod(rendererBinary, 0o755);
  await chmod(ffmpegBinary, 0o755);
}

const chromiumCount = (await readdir(browserDestination)).length;
if (chromiumCount === 0 || !(await stat(rendererBinary)).isFile()) {
  throw new Error('Sidecar build did not produce all required runtime files.');
}
console.log('[sidecar] Renderer, FFmpeg, and Chromium runtime are ready for Tauri bundling.');
