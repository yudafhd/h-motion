export function formatTimecode(seconds: number, fps: number): string {
  const totalFrames = Math.max(0, Math.floor(seconds * fps));
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const secs = totalSeconds % 60;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}

export function formatSeconds(seconds: number): string {
  return `${seconds.toFixed(2)}s`;
}

export function estimateFileSizeMb(width: number, height: number, fps: number, duration: number): string {
  // Approximate H.264 CRF 15 high quality stock video bitrates
  // 4K ~ 60-90 Mbps, 1080p ~ 20-30 Mbps
  const pixelCount = width * height;
  const base4kPixels = 3840 * 2160;
  const ratio = pixelCount / base4kPixels;
  const mbps = (fps >= 60 ? 110 : 70) * ratio;
  const totalMb = (mbps * duration) / 8;
  return `${Math.max(1, Math.round(totalMb))} MB`;
}

export function calculateTotalFrames(fps: number, duration: number): number {
  return Math.floor(fps * duration);
}
