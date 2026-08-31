import { CodeSnippet } from '../types';

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'easing-pack',
    title: 'Easing Functions Collection',
    description: 'Cubic, Quad, and Elastic easing functions for smooth progress curves',
    category: 'Easing',
    code: `// Collection of easing functions (input t: 0.0 -> 1.0)
const clamp = (t) => Math.min(Math.max(t, 0), 1);
const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t), 3);
const easeInOutCubic = (t) => {
  const c = clamp(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const p = clamp(t) - 1;
  return 1 + c3 * Math.pow(p, 3) + c1 * Math.pow(p, 2);
};`
  },
  {
    id: 'sine-oscillator',
    title: 'Harmonic Sine Oscillator',
    description: 'Create smooth periodic floating, pulsing, or breathing motions',
    category: 'Math',
    code: `// Harmonic oscillator: frequency (Hz), amplitude (pixels or scale)
const freq = 1.5; // cycles per second
const amplitude = 24; // px
const floatY = Math.sin(time * freq * Math.PI * 2) * amplitude;
const breathe = 1 + Math.sin(time * freq * Math.PI) * 0.06;`
  },
  {
    id: 'stagger-animation',
    title: 'Staggered List Animator',
    description: 'Animate multiple child elements sequentially with configurable delay',
    category: 'Animation',
    code: `const items = document.querySelectorAll('.item');
const staggerDelay = 0.12; // 120ms between items
const itemDuration = 0.6; // duration per item

items.forEach((item, index) => {
  const startTime = index * staggerDelay;
  const progress = Math.min(Math.max((time - startTime) / itemDuration, 0), 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  
  item.style.opacity = String(eased);
  item.style.transform = \`translateY(\${(1 - eased) * 40}px)\`;
});`
  },
  {
    id: 'color-cycle',
    title: 'Dynamic Hue Shift',
    category: 'Utility',
    description: 'Cycle element color / background smoothly over time',
    code: `// Cycle hue continuously: 360 degrees every 6 seconds
const hue = (time * 60) % 360;
const el = document.querySelector('.accent');
if (el) {
  el.style.filter = \`hue-rotate(\${hue}deg)\`;
}`
  }
];
