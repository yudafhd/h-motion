import { MotionTemplate } from '../types';

export const MOTION_TEMPLATES: MotionTemplate[] = [
  {
    id: 'kinetic-title',
    title: 'Kinetic 4K Typography',
    category: 'Title',
    description: 'Cinematic typography reveal with smooth cubic-bezier motion and accent bar',
    presetId: 'adobe-4k-landscape',
    fps: 30,
    duration: 8,
    html: `<div class="canvas">
  <div class="glow-bg"></div>
  <div class="grid-lines"></div>
  <div class="content">
    <div class="badge">STOCK MOTION GRAPHICS</div>
    <h1 class="title">CINEMATIC<br><span class="accent-text">4K MASTER</span></h1>
    <div class="bar"></div>
    <p class="subtitle">Deterministic Frame-Accurate Export</p>
  </div>
</div>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 100vw; height: 100vh; overflow: hidden;
  background: #08090d; font-family: 'Inter', system-ui, sans-serif;
  color: #fff;
}
.canvas {
  position: relative; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.glow-bg {
  position: absolute; width: 60vw; height: 60vw;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%);
  border-radius: 50%; filter: blur(40px); pointer-events: none;
}
.grid-lines {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 6vw 6vw;
}
.content {
  position: relative; z-index: 10;
  text-align: center; display: flex; flex-direction: column; align-items: center;
}
.badge {
  font-size: 1.4vw; font-weight: 700; letter-spacing: 0.35em;
  color: #818cf8; text-transform: uppercase; margin-bottom: 2vw;
  padding: 0.6vw 1.6vw; border-radius: 999px;
  background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.3);
}
.title {
  font-size: 7vw; font-weight: 800; line-height: 0.95;
  letter-spacing: -0.04em; text-transform: uppercase;
}
.accent-text {
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.bar {
  width: 14vw; height: 0.4vw; border-radius: 999px;
  background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc);
  margin: 2.2vw 0 1.8vw;
}
.subtitle {
  font-size: 2vw; font-weight: 400; color: #94a3b8;
  letter-spacing: 0.05em;
}`,
    js: `motion.render((time, frame, fps) => {
  const content = document.querySelector('.content');
  const title = document.querySelector('.title');
  const badge = document.querySelector('.badge');
  const bar = document.querySelector('.bar');
  const subtitle = document.querySelector('.subtitle');
  const glow = document.querySelector('.glow-bg');

  // Easing function: easeOutCubic
  const easeOut = t => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
  
  // Progress calculations
  const badgeP = easeOut(time / 0.8);
  const titleP = easeOut((time - 0.2) / 1.0);
  const barP = easeOut((time - 0.6) / 0.8);
  const subP = easeOut((time - 0.8) / 0.9);

  // Apply transforms and opacity
  badge.style.opacity = String(badgeP);
  badge.style.transform = \`translateY(\${(1 - badgeP) * 30}px) scale(\${0.9 + badgeP * 0.1})\`;

  title.style.opacity = String(titleP);
  title.style.transform = \`translateY(\${(1 - titleP) * 50}px)\`;

  bar.style.width = \`\${barP * 14}vw\`;
  bar.style.opacity = String(barP);

  subtitle.style.opacity = String(subP);
  subtitle.style.transform = \`translateY(\${(1 - subP) * 20}px)\`;

  // Ambient breathing motion
  const pulse = Math.sin(time * 1.5) * 0.08;
  glow.style.transform = \`scale(\${1 + pulse}) translate(\${Math.cos(time) * 20}px, \${Math.sin(time) * 15}px)\`;
});`
  },
  {
    id: 'gradient-orb',
    title: 'Aurora Glowing Orb',
    category: 'Abstract',
    description: 'Smooth ethereal orb with vibrant color morphing and floating ambient particles',
    presetId: 'adobe-4k-landscape',
    fps: 30,
    duration: 10,
    html: `<div class="scene">
  <div class="backdrop"></div>
  <div class="ring outer"></div>
  <div class="ring inner"></div>
  <div class="orb"></div>
  <div class="caption">
    <h2>AURORA DYNAMICS</h2>
    <p>Seamless Ambient Stock Background</p>
  </div>
</div>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 100vw; height: 100vh; overflow: hidden;
  background: #05070d; font-family: 'Inter', system-ui, sans-serif;
  color: #fff;
}
.scene {
  position: relative; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
}
.backdrop {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 50% 50%, #0d162b 0%, #05070d 80%);
}
.orb {
  position: absolute; width: 28vw; height: 28vw;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #ec4899 100%);
  box-shadow: 0 0 12vw rgba(99, 102, 241, 0.45);
  filter: blur(2px);
}
.ring {
  position: absolute; border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.15);
}
.ring.outer { width: 44vw; height: 44vw; }
.ring.inner { width: 36vw; height: 36vw; border-style: dotted; border-width: 3px; }
.caption {
  position: absolute; bottom: 6vw; text-align: center; z-index: 20;
}
.caption h2 {
  font-size: 2.2vw; letter-spacing: 0.4em; font-weight: 700; margin-bottom: 0.5vw;
}
.caption p {
  font-size: 1.2vw; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase;
}`,
    js: `motion.render((time, frame, fps) => {
  const orb = document.querySelector('.orb');
  const outerRing = document.querySelector('.ring.outer');
  const innerRing = document.querySelector('.ring.inner');
  const caption = document.querySelector('.caption');

  const rot = time * 24;
  const floatY = Math.sin(time * 1.2) * 20;
  const scale = 1 + Math.sin(time * 1.8) * 0.05;

  orb.style.transform = \`translateY(\${floatY}px) scale(\${scale}) rotate(\${rot}deg)\`;
  outerRing.style.transform = \`translateY(\${floatY * 0.5}px) rotate(\${-rot * 0.5}deg)\`;
  innerRing.style.transform = \`translateY(\${floatY * 0.8}px) rotate(\${rot * 0.8}deg)\`;

  // Caption fade in
  const intro = Math.min(time / 1.5, 1);
  caption.style.opacity = String(intro);
  caption.style.transform = \`translateY(\${(1 - intro) * 20}px)\`;
});`
  },
  {
    id: 'cyber-hud',
    title: 'Cyberpunk HUD Telemetry',
    category: 'Tech',
    description: 'High-tech sci-fi user interface overlay with telemetry metrics and scanning beams',
    presetId: 'adobe-4k-landscape',
    fps: 30,
    duration: 6,
    html: `<div class="hud-wrapper">
  <div class="scanline"></div>
  <div class="hud-corner tl">+</div>
  <div class="hud-corner tr">+</div>
  <div class="hud-corner bl">+</div>
  <div class="hud-corner br">+</div>
  
  <div class="center-crosshair">
    <div class="target-circle"></div>
    <div class="reticle-h"></div>
    <div class="reticle-v"></div>
  </div>

  <div class="telemetry">
    <div class="tele-item">SYS.STATUS // <span class="val-green">OPTIMAL</span></div>
    <div class="tele-item">FRAME SYNC // <span class="val-blue" id="sync-val">100%</span></div>
    <div class="tele-item">RENDER TIME // <span class="val-cyan" id="time-val">0.00s</span></div>
  </div>
</div>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 100vw; height: 100vh; overflow: hidden;
  background: #030712; font-family: 'JetBrains Mono', monospace;
  color: #38bdf8;
}
.hud-wrapper {
  position: relative; width: 100vw; height: 100vh;
  padding: 4vw; display: flex; flex-direction: column; justify-content: space-between;
}
.scanline {
  position: absolute; left: 0; width: 100vw; height: 4px;
  background: linear-gradient(90deg, transparent, #38bdf8, transparent);
  box-shadow: 0 0 15px #38bdf8; opacity: 0.6; pointer-events: none;
}
.hud-corner {
  position: absolute; font-size: 2vw; color: #0284c7; font-weight: 700;
}
.tl { top: 2vw; left: 2vw; }
.tr { top: 2vw; right: 2vw; }
.bl { bottom: 2vw; left: 2vw; }
.br { bottom: 2vw; right: 2vw; }

.center-crosshair {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  display: flex; align-items: center; justify-content: center;
}
.target-circle {
  width: 18vw; height: 18vw; border-radius: 50%;
  border: 2px solid rgba(56, 189, 248, 0.4);
  border-top-color: #38bdf8; border-bottom-color: #38bdf8;
}
.reticle-h { position: absolute; width: 24vw; height: 1px; background: rgba(56, 189, 248, 0.3); }
.reticle-v { position: absolute; height: 24vw; width: 1px; background: rgba(56, 189, 248, 0.3); }

.telemetry {
  position: absolute; bottom: 4vw; left: 4vw;
  font-size: 1.4vw; display: flex; flex-direction: column; gap: 0.6vw;
  background: rgba(15, 23, 42, 0.7); padding: 1.2vw 2vw;
  border-left: 4px solid #38bdf8; border-radius: 0 8px 8px 0;
}
.val-green { color: #4ade80; font-weight: 700; }
.val-blue { color: #60a5fa; font-weight: 700; }
.val-cyan { color: #22d3ee; font-weight: 700; }`,
    js: `motion.render((time, frame, fps) => {
  const scanline = document.querySelector('.scanline');
  const targetCircle = document.querySelector('.target-circle');
  const timeVal = document.getElementById('time-val');
  const syncVal = document.getElementById('sync-val');

  // Scanning laser beam
  const scanY = (time % 2) / 2;
  scanline.style.top = \`\${scanY * 100}vh\`;

  // Rotating HUD reticle
  targetCircle.style.transform = \`rotate(\${time * 90}deg) scale(\${1 + Math.sin(time * 3) * 0.04})\`;

  // Live telemetry readout
  if (timeVal) timeVal.textContent = time.toFixed(2) + 's';
  if (syncVal) syncVal.textContent = Math.floor(98 + Math.sin(time * 5) * 2) + '%';
});`
  },
  {
    id: 'lower-third',
    title: 'Clean Corporate Lower Third',
    category: 'LowerThird',
    description: 'Broadcast-ready corporate lower third with dual swipe reveal and glass container',
    presetId: 'adobe-4k-landscape',
    fps: 30,
    duration: 6,
    html: `<div class="overlay">
  <div class="lower-third">
    <div class="accent-stripe"></div>
    <div class="text-card">
      <div class="name">ALEXANDER RHOADES</div>
      <div class="role">SENIOR CREATIVE DIRECTOR · MOTION LABS</div>
    </div>
  </div>
</div>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 100vw; height: 100vh; overflow: hidden;
  background: #0e1117; font-family: 'Inter', system-ui, sans-serif;
}
.overlay {
  position: relative; width: 100vw; height: 100vh;
  display: flex; align-items: flex-end; padding: 6vw 8vw;
}
.lower-third {
  display: flex; align-items: stretch; height: 6.5vw;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  border-radius: 8px; overflow: hidden;
}
.accent-stripe {
  width: 0.8vw;
  background: linear-gradient(180deg, #6366f1 0%, #ec4899 100%);
}
.text-card {
  background: rgba(18, 24, 38, 0.92);
  backdrop-filter: blur(16px);
  padding: 1.2vw 2.5vw; display: flex; flex-direction: column; justify-content: center;
  border: 1px solid rgba(255,255,255,0.08); border-left: none;
}
.name {
  font-size: 2.2vw; font-weight: 800; color: #ffffff;
  letter-spacing: -0.02em; line-height: 1; margin-bottom: 0.5vw;
}
.role {
  font-size: 1.1vw; font-weight: 600; color: #94a3b8;
  letter-spacing: 0.1em; text-transform: uppercase;
}`,
    js: `motion.render((time, frame, fps) => {
  const container = document.querySelector('.lower-third');
  const stripe = document.querySelector('.accent-stripe');
  const text = document.querySelector('.text-card');

  // Reveal animation
  const easeOut = t => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 4);
  const p = easeOut(time / 0.8);

  container.style.opacity = String(p);
  container.style.transform = \`translateX(\${(1 - p) * -80}px)\`;
  stripe.style.transform = \`scaleY(\${p})\`;
});`
  },
  {
    id: 'promo-badge',
    title: 'Flash Sale 9:16 Vertical Reel',
    category: 'Promo',
    description: 'High-energy vertical 9:16 sale promo badge with rotating neon dashed ring and scale bounce',
    presetId: 'adobe-4k-vertical',
    fps: 30,
    duration: 8,
    html: `<div class="story-container">
  <div class="radial-glow"></div>
  <div class="badge-wrapper">
    <div class="dashed-ring"></div>
    <div class="badge-circle">
      <div class="tag">LIMITED OFFER</div>
      <div class="percent">50%<span class="off">OFF</span></div>
      <div class="cta">SHOP NOW</div>
    </div>
  </div>
  <div class="bottom-caption">SPECIAL WEEKEND DROP</div>
</div>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 100vw; height: 100vh; overflow: hidden;
  background: #09090b; font-family: 'Inter', system-ui, sans-serif;
  color: #fff;
}
.story-container {
  position: relative; width: 100vw; height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.radial-glow {
  position: absolute; width: 80vw; height: 80vw;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 75%);
  border-radius: 50%; filter: blur(50px);
}
.badge-wrapper {
  position: relative; display: flex; align-items: center; justify-content: center;
}
.dashed-ring {
  position: absolute; width: 64vw; height: 64vw; border-radius: 50%;
  border: 4px dashed #f43f5e;
}
.badge-circle {
  width: 54vw; height: 54vw; border-radius: 50%;
  background: linear-gradient(145deg, #18181b, #09090b);
  border: 3px solid rgba(244, 63, 94, 0.4);
  box-shadow: 0 0 60px rgba(244, 63, 94, 0.35);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center;
}
.tag {
  font-size: 3vw; font-weight: 800; letter-spacing: 0.25em;
  color: #fb7185; margin-bottom: 1vw;
}
.percent {
  font-size: 14vw; font-weight: 900; line-height: 0.85;
  background: linear-gradient(180deg, #ffffff 0%, #fda4af 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.off { font-size: 5vw; margin-left: 1vw; }
.cta {
  margin-top: 2vw; font-size: 3.2vw; font-weight: 700;
  padding: 1.2vw 4vw; border-radius: 999px;
  background: linear-gradient(90deg, #f43f5e, #e11d48);
  color: white; letter-spacing: 0.1em;
}
.bottom-caption {
  position: absolute; bottom: 12vw; font-size: 3.5vw;
  font-weight: 700; letter-spacing: 0.2em; color: #a1a1aa;
}`,
    js: `motion.render((time, frame, fps) => {
  const badgeWrapper = document.querySelector('.badge-wrapper');
  const dashedRing = document.querySelector('.dashed-ring');
  const caption = document.querySelector('.bottom-caption');

  // Spring entrance
  const bounce = t => {
    const p = Math.min(Math.max(t, 0), 1);
    return 1 - Math.cos(p * Math.PI * 2.5) * Math.exp(-p * 4);
  };

  const scale = Math.min(time / 0.7, 1);
  const ringRot = time * 30;
  const pulse = Math.sin(time * 3) * 0.03;

  badgeWrapper.style.transform = \`scale(\${scale + pulse})\`;
  dashedRing.style.transform = \`rotate(\${ringRot}deg)\`;

  caption.style.opacity = String(Math.min(time / 1.2, 1));
});`
  }
];
