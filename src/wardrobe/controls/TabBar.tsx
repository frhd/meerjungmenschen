export interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
}

/** Presentational tab strip. Highlights the active tab; holds no state. */
export function TabBar({ tabs, activeId, onSelect }: TabBarProps) {
  return (
    <div className="wd-tabbar" role="tablist" aria-label="Garderobe">
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`wd-tab${selected ? ' is-active' : ''}`}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
