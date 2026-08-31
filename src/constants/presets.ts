import { StockPreset } from '../types';

export const STOCK_PRESETS: StockPreset[] = [
  {
    id: 'adobe-4k-landscape',
    name: 'Adobe Stock 4K Landscape',
    category: 'Landscape',
    width: 3840,
    height: 2160,
    aspectRatio: '16/9',
    description: 'Standard 4K UHD for broadcast, stock footage, and YouTube (3840 × 2160)',
    recommendedFps: [24, 25, 30, 60]
  },
  {
    id: 'adobe-4k-vertical',
    name: 'Adobe Stock 4K Vertical',
    category: 'Vertical',
    width: 2160,
    height: 3840,
    aspectRatio: '9/16',
    description: 'High-res vertical 9:16 for Reels, TikTok, and Shorts (2160 × 3840)',
    recommendedFps: [30, 60]
  },
  {
    id: 'adobe-4k-square',
    name: 'Adobe Stock 4K Square',
    category: 'Square',
    width: 2160,
    height: 2160,
    aspectRatio: '1/1',
    description: '1:1 ratio for social feeds, ads, and square displays (2160 × 2160)',
    recommendedFps: [24, 30, 60]
  },
  {
    id: 'cinema-4k-dci',
    name: 'Cinema 4K DCI',
    category: 'Cinema',
    width: 4096,
    height: 2160,
    aspectRatio: '256/135',
    description: 'Theatrical 4K DCI master format (4096 × 2160)',
    recommendedFps: [24, 25]
  },
  {
    id: 'fhd-landscape',
    name: 'Full HD 1080p Landscape',
    category: 'Landscape',
    width: 1920,
    height: 1080,
    aspectRatio: '16/9',
    description: 'Standard 1080p Full HD video (1920 × 1080)',
    recommendedFps: [24, 25, 30, 60]
  },
  {
    id: 'fhd-vertical',
    name: 'Full HD 1080p Vertical',
    category: 'Vertical',
    width: 1080,
    height: 1920,
    aspectRatio: '9/16',
    description: 'Standard 1080p Vertical video (1080 × 1920)',
    recommendedFps: [30, 60]
  }
];

export const DEFAULT_PRESET = STOCK_PRESETS[0];
export const ALLOWED_FPS = [24, 25, 30, 60];
export const MIN_DURATION = 5;
export const MAX_DURATION = 60;
