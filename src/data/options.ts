// ============================================================
// Meerjungmenschen — Content Catalog
// Single source of truth for all customization options.
// The Wardrobe UI renders pickers from these arrays;
// SVG components switch on the exact `id` values defined here.
// ============================================================

// ── Shared option types ─────────────────────────────────────

export interface StyleOption {
  id: string;
  label: string;
}

export interface ColorOption {
  color: string; // 6-digit hex, e.g. '#ff0099'
  label: string;
}

// ── 1. Body types ────────────────────────────────────────────

export const BODY_TYPES: StyleOption[] = [
  { id: 'mermaid', label: 'Meerjungfrau' },
  { id: 'merman',  label: 'Wassermann'   },
  { id: 'neutral', label: 'Neutral'      },
];

// ── 2. Skin tones ────────────────────────────────────────────

export const SKIN_TONES: ColorOption[] = [
  { color: '#fddcb5', label: 'Porzellan'   },
  { color: '#e8b98f', label: 'Hell'        },
  { color: '#c8855a', label: 'Mittel'      },
  { color: '#a05c2c', label: 'Warm'        },
  { color: '#6b3a1f', label: 'Tief'        },
  { color: '#3b1d0e', label: 'Dunkel'      },
];

// ── 3. Face expressions ──────────────────────────────────────
// ids handled by character/parts/Face.tsx. 'smile' is the default
// look; unknown ids fall back to 'smile' in the part component.

export const FACE_EXPRESSIONS: StyleOption[] = [
  { id: 'smile',    label: 'Lächeln'  },
  { id: 'froh',     label: 'Froh'     },
  { id: 'staunend', label: 'Staunend' },
  { id: 'zwinkern', label: 'Zwinkern' },
  { id: 'ruhig',    label: 'Ruhig'    },
  { id: 'lachen',   label: 'Lachen'   },
];

// ── 4. Hair styles ───────────────────────────────────────────
// ids: 'wavy' | 'long' | 'bun' | 'short' | 'ponytail'

export const HAIR_STYLES: StyleOption[] = [
  { id: 'wavy',     label: 'Wellig'    },
  { id: 'long',     label: 'Lang'      },
  { id: 'bun',      label: 'Dutt'      },
  { id: 'short',    label: 'Kurz'      },
  { id: 'ponytail', label: 'Zopf'      },
];

// ── 4. Hair colors ───────────────────────────────────────────

export const HAIR_COLORS: ColorOption[] = [
  { color: '#3a2a1a', label: 'Braun-Schwarz' },
  { color: '#6b3a2a', label: 'Dunkelbraun'   },
  { color: '#a0622a', label: 'Kastanie'      },
  { color: '#d4a04a', label: 'Blond'         },
  { color: '#c8c0b0', label: 'Grau'          },
  { color: '#f0f0f0', label: 'Weiß'          },
  { color: '#2ab5b5', label: 'Türkis'        },
  { color: '#e060a0', label: 'Pink'          },
];

// ── 5. Tail shapes ───────────────────────────────────────────
// ids: 'classic' | 'fluke' | 'fin'

export const TAIL_SHAPES: StyleOption[] = [
  { id: 'classic', label: 'Klassisch' },
  { id: 'fluke',   label: 'Flossen'   },
  { id: 'fin',     label: 'Fächer'    },
];

// ── 6. Tail colors ───────────────────────────────────────────

export const TAIL_COLORS: ColorOption[] = [
  { color: '#2aa9c4', label: 'Ozean'       },
  { color: '#1a7a8a', label: 'Tiefsee'     },
  { color: '#40c080', label: 'Seegrün'     },
  { color: '#8050d0', label: 'Violett'     },
  { color: '#e06040', label: 'Koralle'     },
  { color: '#f0b020', label: 'Gold'        },
  { color: '#e040a0', label: 'Pink'        },
  { color: '#507090', label: 'Stahl'       },
];

// ── 7. Tail patterns ─────────────────────────────────────────
// ids: 'none' | 'scales' | 'spots'

export const TAIL_PATTERNS: StyleOption[] = [
  { id: 'none',   label: 'Glatt'    },
  { id: 'scales', label: 'Schuppen' },
  { id: 'spots',  label: 'Tupfen'   },
];

// ── 8. Tops ──────────────────────────────────────────────────
// ids: 'shell' | 'strap' | 'wrap' | 'none'

export const TOPS: StyleOption[] = [
  { id: 'shell', label: 'Muschel'  },
  { id: 'strap', label: 'Träger'   },
  { id: 'wrap',  label: 'Wickel'   },
  { id: 'none',  label: 'Ohne'     },
];

// ── 9. Nail colors ───────────────────────────────────────────

export const NAIL_COLORS: ColorOption[] = [
  { color: '#f5e6d8', label: 'Natur'       },
  { color: '#d65a86', label: 'Pink'        },
  { color: '#c02040', label: 'Rot'         },
  { color: '#e08020', label: 'Orange'      },
  { color: '#8050d0', label: 'Violett'     },
  { color: '#2060c0', label: 'Blau'        },
  { color: '#2aa9c4', label: 'Türkis'      },
  { color: '#101010', label: 'Schwarz'     },
];

// ── 10. Accessories ──────────────────────────────────────────
// These ids map directly to the boolean keys in Character.accessories.

export const ACCESSORIES: StyleOption[] = [
  { id: 'crown',    label: 'Krone'    },
  { id: 'necklace', label: 'Halskette' },
  { id: 'earrings', label: 'Ohrringe' },
];

// ── 11. Scenes ───────────────────────────────────────────────
// Underwater backdrops rendered as the BACKMOST layer of the
// single <svg>. Scene.tsx switches on these ids (default → 'reef').

export const SCENES: StyleOption[] = [
  { id: 'reef',    label: 'Korallenriff' },
  { id: 'deep',    label: 'Tiefsee'      },
  { id: 'shallow', label: 'Sonnenlicht'  },
  { id: 'wreck',   label: 'Schiffswrack' },
];
