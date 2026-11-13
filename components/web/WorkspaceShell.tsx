import type { ReactNode } from "react";
import "./workspace-shell.css";

export type WorkspaceTab = {
  id: string;
  label: string;
  content: ReactNode;
};

/**
 * A dense, accessible workspace that replaces long stacked secondary sections
 * with one selected panel. Caller owns all app state and content.
 */
export function WorkspaceShell({
  title,
  summary,
  actions,
  tabs,
  activeTab,
  onTabChange,
}: {
  title: string;
  summary?: ReactNode;
  actions?: ReactNode;
  tabs: WorkspaceTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  if (tabs.length === 0) throw new Error("WorkspaceShell requires at least one tab");
  if (new Set(tabs.map(tab => tab.id)).size !== tabs.length) {
    throw new Error("WorkspaceShell requires unique tab IDs");
  }
  const selected = tabs.find(tab => tab.id === activeTab) ?? tabs[0];
  return (
    <section className="pes-workspace" aria-label={title}>
      <header className="pes-workspace__header">
        <div className="pes-workspace__intro">
          <h2 className="pes-workspace__title">{title}</h2>
          {summary && <div className="pes-workspace__summary">{summary}</div>}
        </div>
        {actions && <div className="pes-workspace__actions">{actions}</div>}
      </header>
      <div className="pes-workspace__tabs" role="group" aria-label={title + " views"}>
        {tabs.map(tab => (
          <button
            type="button"
            key={tab.id}
            className="pes-workspace__tab"
            aria-pressed={selected.id === tab.id}
            onClick={() => { if (selected.id !== tab.id) onTabChange(tab.id); }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pes-workspace__panel" aria-label={selected.label + " content"}>
        {selected.content}
      </div>
    </section>
  );
}
