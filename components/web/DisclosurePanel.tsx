import type { ReactNode } from "react";
import "./disclosure-panel.css";

/** Native keyboard-accessible disclosure for secondary information. */
export function DisclosurePanel({
  title,
  children,
  defaultOpen = false,
  className = "",
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details className={["pes-disclosure", className].filter(Boolean).join(" ")} open={defaultOpen || undefined}>
      <summary className="pes-disclosure__summary">
        <span className="pes-disclosure__title">{title}</span>
        <span className="pes-disclosure__chevron" aria-hidden="true" />
      </summary>
      <div className="pes-disclosure__content">{children}</div>
    </details>
  );
}
