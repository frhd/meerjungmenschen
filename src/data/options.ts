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
// ids: 'wavy' | 'long' | 'bun' | 'short' | 'ponytail' | 'braids' | 'pixie'

export const HAIR_STYLES: StyleOption[] = [
  { id: 'wavy',     label: 'Wellig'    },
  { id: 'long',     label: 'Lang'      },
  { id: 'bun',      label: 'Dutt'      },
  { id: 'short',    label: 'Kurz'      },
  { id: 'ponytail', label: 'Zopf'      },
  { id: 'braids',   label: 'Zöpfe'     },
  { id: 'pixie',    label: 'Pixie'     },
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
// ids: 'classic' | 'fluke' | 'fin' | 'double'

export const TAIL_SHAPES: StyleOption[] = [
  { id: 'classic', label: 'Klassisch'    },
  { id: 'fluke',   label: 'Flossen'      },
  { id: 'fin',     label: 'Fächer'       },
  { id: 'double',  label: 'Doppelflosse' },
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
// ids: 'shell' | 'strap' | 'wrap' | 'crisscross' | 'pearl' | 'none'

export const TOPS: StyleOption[] = [
  { id: 'shell',      label: 'Muschel'  },
  { id: 'strap',      label: 'Träger'   },
  { id: 'wrap',       label: 'Wickel'   },
  { id: 'crisscross', label: 'Kreuz'    },
  { id: 'pearl',      label: 'Perlen'   },
  { id: 'none',       label: 'Ohne'     },
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

// ── 13. Makeup ───────────────────────────────────────────────
// ids handled by character/parts/Makeup.tsx. 'none' = off (the
// safe fallback). lips/eyeshadow/blush share MAKEUP_COLORS.

export const LIP_STYLES: StyleOption[] = [
  { id: 'none',    label: 'Keine'    },
  { id: 'klassik', label: 'Klassik'  },
  { id: 'voll',    label: 'Voll'     },
  { id: 'herz',    label: 'Herzchen' },
];

export const EYESHADOW_STYLES: StyleOption[] = [
  { id: 'none',    label: 'Keiner'  },
  { id: 'sanft',   label: 'Sanft'   },
  { id: 'smokey',  label: 'Smokey'  },
  { id: 'glitzer', label: 'Glitzer' },
];

export const EYELINER_STYLES: StyleOption[] = [
  { id: 'none',        label: 'Keiner'      },
  { id: 'klassik',     label: 'Klassik'     },
  { id: 'katzenaugen', label: 'Katzenaugen' },
  { id: 'wimpern',     label: 'Wimpern'     },
];

export const BLUSH_STYLES: StyleOption[] = [
  { id: 'none',     label: 'Aus'     },
  { id: 'sanft',    label: 'Sanft'   },
  { id: 'kraeftig', label: 'Kräftig' },
];

export const FRECKLE_STYLES: StyleOption[] = [
  { id: 'none',  label: 'Keine' },
  { id: 'wenig', label: 'Wenig' },
  { id: 'viele', label: 'Viele' },
];

// Shared cosmetic palette for lips, eyeshadow and blush.
export const MAKEUP_COLORS: ColorOption[] = [
  { color: '#d6486a', label: 'Rosa'    },
  { color: '#e8623c', label: 'Koralle' },
  { color: '#c0203a', label: 'Kirsche' },
  { color: '#9c2150', label: 'Beere'   },
  { color: '#7a3a6a', label: 'Pflaume' },
  { color: '#8050d0', label: 'Violett' },
  { color: '#2f6fc8', label: 'Blau'    },
  { color: '#2aa9c4', label: 'Türkis'  },
  { color: '#c79a3e', label: 'Gold'    },
];

// ── 12. Companions ───────────────────────────────────────────
// A little sea creature swimming beside the merperson. 'none' hides
// it; Companion.tsx switches on these ids (unknown → 'clownfish').

export const COMPANIONS: StyleOption[] = [
  { id: 'none',      label: 'Keiner'       },
  { id: 'clownfish', label: 'Clownfisch'   },
  { id: 'seahorse',  label: 'Seepferdchen' },
  { id: 'jelly',     label: 'Qualle'       },
];
