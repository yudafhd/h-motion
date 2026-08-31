export interface ColorThemePreset {
  id: string;
  name: string;
  hex: string;
  accent?: string;
  description: string;
}

export const BACKGROUND_COLOR_PRESETS: ColorThemePreset[] = [
  {
    id: 'green-screen',
    name: 'Green Screen',
    hex: '#00FF00',
    description: 'Latar belakang green screen chroma key solid (#00FF00) untuk isolasi dan compositing video'
  },
  {
    id: 'blue-screen',
    name: 'Blue Screen',
    hex: '#0000FF',
    description: 'Latar belakang blue screen chroma key solid (#0000FF) untuk isolasi dan compositing video'
  },
  {
    id: 'white',
    name: 'Putih (White)',
    hex: '#FFFFFF',
    description: 'Latar belakang putih solid bersih (#FFFFFF) untuk tampilan terang dan minimalis'
  },
  {
    id: 'black',
    name: 'Hitam (Black)',
    hex: '#000000',
    description: 'Latar belakang hitam pekat murni (#000000) untuk blending screen dan kontras tajam'
  }
];
