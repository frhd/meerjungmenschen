import type { StyleOption } from '../../data/options';

export type AccessoryKey = 'crown' | 'necklace' | 'earrings';

interface AccessoryTogglesProps {
  label: string;
  options: StyleOption[];
  values: Record<AccessoryKey, boolean>;
  onToggle: (key: AccessoryKey) => void;
}

/** On/off toggle chips for accessories, reflecting the boolean flags. */
export function AccessoryToggles({ label, options, values, onToggle }: AccessoryTogglesProps) {
  return (
    <div className="wd-group" role="group" aria-label={label}>
      <span className="wd-group-label">{label}</span>
      <div className="wd-style-row">
        {options.map((option) => {
          const key = option.id as AccessoryKey;
          const on = values[key];
          return (
            <button
              key={option.id}
              type="button"
              className={`wd-toggle${on ? ' is-on' : ''}`}
              aria-pressed={on}
              onClick={() => onToggle(key)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
