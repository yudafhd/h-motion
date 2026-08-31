export type GeminiTier = 'all' | 'free' | 'paid';

export interface GeminiModelInfo {
  id: string;
  label: string;
  group: string;
  tier: 'free' | 'paid' | 'both';
  tierBadge: string;
  subLabel: string;
  description: string;
  quotaInfo: string;
  recommended?: boolean;
}

export const GEMINI_MODELS: GeminiModelInfo[] = [
  {
    id: 'gemini-3.6-flash',
    label: 'Gemini 3.6 Flash',
    group: 'Tier Gratis & Berbayar (Flash)',
    tier: 'both',
    tierBadge: 'Recommended',
    subLabel: 'Rekomendasi Utama — Cepat & Stabil',
    description: 'Model resmi standar dari Google AI Studio untuk pembuatan template gerak deterministik dengan output terstruktur yang cepat dan akurat.',
    quotaInfo: 'Tier Gratis: 15 RPM • Tier Berbayar: Pay-as-you-go',
    recommended: true
  },
  {
    id: 'gemini-3.7-flash',
    label: 'Gemini 3.7 Flash',
    group: 'Tier Gratis & Berbayar (Flash)',
    tier: 'both',
    tierBadge: 'Next-Gen',
    subLabel: 'Hybrid Reasoning & Respon Instan',
    description: 'Model generasi termutakhir dengan kemampuan reasoning adaptif serta kecepatan rendering tinggi.',
    quotaInfo: 'Tier Gratis & Berbayar',
    recommended: false
  },
  {
    id: 'gemini-3.5-flash-lite',
    label: 'Gemini 3.5 Flash Lite',
    group: 'Tier Gratis & Berbayar (Flash)',
    tier: 'both',
    tierBadge: 'Lightweight',
    subLabel: 'Ultra Ringan & Hemat Kuota',
    description: 'Varian flash lite resmi Google terbaru, hemat kuota dan latensi sangat cepat.',
    quotaInfo: 'Tier Gratis: 15 RPM • Tier Berbayar: Pay-as-you-go',
    recommended: false
  },
  {
    id: 'gemini-3.1-pro-preview',
    label: 'Gemini 3.1 Pro Preview',
    group: 'Tier Berbayar (Pro Reasoning)',
    tier: 'paid',
    tierBadge: 'Pro Reasoning',
    subLabel: 'Penalaran Mutakhir untuk Animasi Rumit',
    description: 'Model penalaran tingkat tinggi untuk kalkulasi matematika rumit, geometri SVG presisi, dan arsitektur motion template bertingkat.',
    quotaInfo: 'Tier Gratis: 2 RPM • Disarankan untuk Tier Berbayar (Pay-as-you-go)',
    recommended: false
  }
];

export const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash';
