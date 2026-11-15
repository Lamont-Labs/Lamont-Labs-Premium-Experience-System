import { useId } from "react";
import "./filterable-list.css";

export type FilterableItem = {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
};

/** Filters caller-provided items locally; query and selection state stay with the caller. */
export function FilterableList({
  items,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  label,
  emptyMessage = "No matching items.",
}: {
  items: FilterableItem[];
  query: string;
  onQueryChange: (query: string) => void;
  selectedId?: string;
  onSelect: (id: string) => void;
  label: string;
  emptyMessage?: string;
}) {
  const groupId = useId();
  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems = items.filter((item) => {
    const searchableText = [item.label, item.description, ...(item.keywords ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchableText.includes(normalizedQuery);
  });

  return (
    <section className="pes-filterable-list">
      <label className="pes-filterable-list__search-label" htmlFor={`${groupId}-search`}>
        Search {label}
      </label>
      <input
        id={`${groupId}-search`}
        className="pes-filterable-list__search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <fieldset className="pes-filterable-list__group">
        <legend>{label}</legend>
        {visibleItems.length > 0 ? (
          <ul className="pes-filterable-list__items">
            {visibleItems.map((item, index) => {
              const inputId = `${groupId}-item-${index}`;
              const descriptionId = item.description ? `${inputId}-description` : undefined;
              return (
                <li key={item.id}>
                  <label className="pes-filterable-list__item" htmlFor={inputId}>
                    <input
                      id={inputId}
                      type="radio"
                      name={`${groupId}-selection`}
                      value={item.id}
                      checked={selectedId === item.id}
                      onChange={() => onSelect(item.id)}
                      aria-describedby={descriptionId}
                    />
                    <span className="pes-filterable-list__item-copy">
                      <span className="pes-filterable-list__item-label">{item.label}</span>
                      {item.description && (
                        <span className="pes-filterable-list__item-description" id={descriptionId}>
                          {item.description}
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="pes-filterable-list__empty" role="status">{emptyMessage}</p>
        )}
      </fieldset>
      <p className="pes-filterable-list__count" role="status">
        {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}
      </p>
    </section>
  );
}
