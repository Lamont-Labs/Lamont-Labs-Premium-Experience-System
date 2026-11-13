import type { ReactNode } from "react";
import "./compact-navigation.css";

export type NavigationDestination = {
  id: string;
  label: string;
  icon: ReactNode;
};

export function CompactNavigation({
  items,
  current,
  onSelect,
  ariaLabel = "Primary navigation",
}: {
  items: NavigationDestination[];
  current: string;
  onSelect: (id: string) => void;
  ariaLabel?: string;
}) {
  return (
    <nav className="pes-nav" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className="pes-nav__item"
          aria-current={item.id === current ? "page" : undefined}
          aria-label={item.label}
          onClick={() => { if (item.id !== current) onSelect(item.id); }}
        >
          <span className="pes-nav__icon" aria-hidden="true">{item.icon}</span>
          <span className="pes-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
