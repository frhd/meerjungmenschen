import { useState } from 'react';
import type { Character } from '../types';
import {
  BODY_TYPES,
  SKIN_TONES,
  HAIR_STYLES,
  HAIR_COLORS,
  TAIL_SHAPES,
  TAIL_COLORS,
  TAIL_PATTERNS,
  TOPS,
  NAIL_COLORS,
  ACCESSORIES,
} from '../data/options';
import { TabBar, type Tab } from './controls/TabBar';
import { StylePicker } from './controls/StylePicker';
import { ColorPicker } from './controls/ColorPicker';
import { AccessoryToggles, type AccessoryKey } from './controls/AccessoryToggles';
import './wardrobe.css';

interface WardrobeProps {
  character: Character;
  onChange: (patch: Partial<Character>) => void;
}

type TabId = 'body' | 'hair' | 'tail' | 'outfit';

const TABS: Tab[] = [
  { id: 'body', label: 'Körper' },
  { id: 'hair', label: 'Haare' },
  { id: 'tail', label: 'Schwanz' },
  { id: 'outfit', label: 'Outfit' },
];

export function Wardrobe({ character, onChange }: WardrobeProps) {
  const [activeTab, setActiveTab] = useState<TabId>('body');

  return (
    <div className="wardrobe">
      <TabBar tabs={TABS} activeId={activeTab} onSelect={(id) => setActiveTab(id as TabId)} />

      <div className="wd-panel" role="tabpanel">
        {activeTab === 'body' && (
          <>
            <StylePicker
              label="Körperform"
              options={BODY_TYPES}
              selectedId={character.bodyType}
              onSelect={(id) => onChange({ bodyType: id as Character['bodyType'] })}
            />
            <ColorPicker
              label="Hautton"
              options={SKIN_TONES}
              selectedColor={character.skinTone}
              onSelect={(color) => onChange({ skinTone: color })}
            />
          </>
        )}

        {activeTab === 'hair' && (
          <>
            <StylePicker
              label="Frisur"
              options={HAIR_STYLES}
              selectedId={character.hair.style}
              onSelect={(id) => onChange({ hair: { ...character.hair, style: id } })}
            />
            <ColorPicker
              label="Haarfarbe"
              options={HAIR_COLORS}
              selectedColor={character.hair.color}
              onSelect={(color) => onChange({ hair: { ...character.hair, color } })}
            />
          </>
        )}

        {activeTab === 'tail' && (
          <>
            <StylePicker
              label="Flossenform"
              options={TAIL_SHAPES}
              selectedId={character.tail.shape}
              onSelect={(id) => onChange({ tail: { ...character.tail, shape: id } })}
            />
            <ColorPicker
              label="Flossenfarbe"
              options={TAIL_COLORS}
              selectedColor={character.tail.color}
              onSelect={(color) => onChange({ tail: { ...character.tail, color } })}
            />
            <StylePicker
              label="Muster"
              options={TAIL_PATTERNS}
              selectedId={character.tail.pattern}
              onSelect={(id) => onChange({ tail: { ...character.tail, pattern: id } })}
            />
          </>
        )}

        {activeTab === 'outfit' && (
          <>
            <StylePicker
              label="Oberteil"
              options={TOPS}
              selectedId={character.top.style}
              onSelect={(id) => onChange({ top: { ...character.top, style: id } })}
            />
            <ColorPicker
              label="Oberteilfarbe"
              options={NAIL_COLORS}
              selectedColor={character.top.color}
              onSelect={(color) => onChange({ top: { ...character.top, color } })}
            />
            <ColorPicker
              label="Nägel"
              options={NAIL_COLORS}
              selectedColor={character.nails}
              onSelect={(color) => onChange({ nails: color })}
            />
            <AccessoryToggles
              label="Accessoires"
              options={ACCESSORIES}
              values={character.accessories}
              onToggle={(key: AccessoryKey) =>
                onChange({
                  accessories: {
                    ...character.accessories,
                    [key]: !character.accessories[key],
                  },
                })
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
