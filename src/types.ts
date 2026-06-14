export type BodyType = 'mermaid' | 'merman' | 'neutral';

export interface Character {
  bodyType: BodyType;
  skinTone: string;        // hex color
  scene: string;           // backdrop scene id, e.g. 'reef'
  face: string;            // expression id, e.g. 'smile'
  hair: { style: string; color: string };
  tail: { shape: string; color: string; pattern: string };
  top: { style: string; color: string };
  nails: string;           // hex color
  accessories: { crown: boolean; necklace: boolean; earrings: boolean };
}

export const DEFAULT_CHARACTER: Character = {
  bodyType: 'mermaid',
  skinTone: '#e8b98f',
  scene: 'reef',
  face: 'smile',
  hair: { style: 'wavy', color: '#3a2a1a' },
  tail: { shape: 'classic', color: '#2aa9c4', pattern: 'scales' },
  top: { style: 'shell', color: '#d65a86' },
  nails: '#d65a86',
  accessories: { crown: false, necklace: false, earrings: false },
}
