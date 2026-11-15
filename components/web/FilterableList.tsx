import { useId } from "react";
import "./filterable-list.css";

export type FilterableItem = {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  filterValue?: string;
};

export type FilterableListOption = { value: string; label: string };
export type FilterableListSortDirection = "ascending" | "descending";

/** Searches, filters, sorts, and pages caller-provided items without a data service. */
export function FilterableList({
  items,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  label,
  emptyMessage = "No matching items.",
  filterOptions = [],
  activeFilter = "all",
  onFilterChange,
  sortDirection,
  onSortDirectionChange,
  page = 1,
  pageSize,
  onPageChange,
}: {
  items: FilterableItem[];
  query: string;
  onQueryChange: (query: string) => void;
  selectedId?: string;
  onSelect: (id: string) => void;
  label: string;
  emptyMessage?: string;
  filterOptions?: FilterableListOption[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  sortDirection?: FilterableListSortDirection;
  onSortDirectionChange?: (direction: FilterableListSortDirection) => void;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}) {
  const groupId = useId();
  const normalizedQuery = query.trim().toLowerCase();
  const matchingItems = items.filter((item) => {
    if (activeFilter !== "all" && item.filterValue !== activeFilter) return false;
    const searchableText = [item.label, item.description, ...(item.keywords ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchableText.includes(normalizedQuery);
  });
  if (sortDirection) {
    matchingItems.sort((a, b) => {
      const left = a.label.toLowerCase();
      const right = b.label.toLowerCase();
      const labelOrder = left < right ? -1 : left > right ? 1 : 0;
      if (labelOrder === 0) return a.id.localeCompare(b.id);
      return sortDirection === "ascending" ? labelOrder : -labelOrder;
    });
  }
  const paginationEnabled = Number.isInteger(pageSize) && (pageSize ?? 0) > 0 && Boolean(onPageChange);
  const pageCount = paginationEnabled ? Math.ceil(matchingItems.length / pageSize!) : 1;
  const currentPage = Math.min(Math.max(1, page), Math.max(1, pageCount));
  const visibleItems = paginationEnabled
    ? matchingItems.slice((currentPage - 1) * pageSize!, currentPage * pageSize!)
    : matchingItems;
  const resetPage = () => onPageChange?.(1);

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
        onChange={(event) => {
          onQueryChange(event.target.value);
          resetPage();
        }}
      />
      {(filterOptions.length > 0 && onFilterChange) || (sortDirection && onSortDirectionChange) ? (
        <div className="pes-filterable-list__controls">
          {filterOptions.length > 0 && onFilterChange && (
            <label className="pes-filterable-list__control">
              <span>Filter {label}</span>
              <select
                value={activeFilter}
                onChange={(event) => {
                  onFilterChange(event.target.value);
                  resetPage();
                }}
              >
                <option value="all">All</option>
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          )}
          {sortDirection && onSortDirectionChange && (
            <button
              className="pes-filterable-list__sort"
              type="button"
              aria-label={`Sort ${label} ${sortDirection === "descending" ? "A to Z" : "Z to A"}`}
              onClick={() => {
                onSortDirectionChange(sortDirection === "descending" ? "ascending" : "descending");
                resetPage();
              }}
            >
              Sort: {sortDirection === "descending" ? "Z–A" : "A–Z"}
            </button>
          )}
        </div>
      ) : null}
      <fieldset className="pes-filterable-list__group">
        <legend>{label}</legend>
        {visibleItems.length > 0 ? (
          <ul className="pes-filterable-list__items">
            {visibleItems.map((item) => {
              const inputId = `${groupId}-item-${encodeURIComponent(item.id)}`;
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
        {matchingItems.length} {matchingItems.length === 1 ? "item" : "items"}
      </p>
      {paginationEnabled && pageCount > 1 && (
        <nav className="pes-filterable-list__pagination" aria-label={`${label} pages`}>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            Previous
          </button>
          <span aria-live="polite">Page {currentPage} of {pageCount}</span>
          <button
            type="button"
            disabled={currentPage >= pageCount}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}
