import type { StyleOption } from '../../data/options';

interface StylePickerProps {
  label: string;
  options: StyleOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** A labeled group of style buttons. The selected one is visibly active. */
export function StylePicker({ label, options, selectedId, onSelect }: StylePickerProps) {
  return (
    <div className="wd-group" role="group" aria-label={label}>
      <span className="wd-group-label">{label}</span>
      <div className="wd-style-row">
        {options.map((option) => {
          const active = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              className={`wd-style-btn${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => onSelect(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
