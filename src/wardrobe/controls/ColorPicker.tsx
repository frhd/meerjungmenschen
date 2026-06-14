import type { ColorOption } from '../../data/options';

interface ColorPickerProps {
  label: string;
  options: ColorOption[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

/** A labeled group of circular color swatches. The selected one is ringed. */
export function ColorPicker({ label, options, selectedColor, onSelect }: ColorPickerProps) {
  return (
    <div className="wd-group" role="group" aria-label={label}>
      <span className="wd-group-label">{label}</span>
      <div className="wd-color-row">
        {options.map((option) => {
          const active = option.color.toLowerCase() === selectedColor.toLowerCase();
          return (
            <button
              key={option.color}
              type="button"
              className={`wd-swatch${active ? ' is-active' : ''}`}
              style={{ background: option.color }}
              aria-pressed={active}
              aria-label={option.label}
              title={option.label}
              onClick={() => onSelect(option.color)}
            />
          );
        })}
      </div>
    </div>
  );
}
