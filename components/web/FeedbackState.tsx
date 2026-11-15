import type { ButtonHTMLAttributes } from "react";
import "./feedback-state.css";

export type FeedbackKind = "loading" | "empty" | "success" | "error" | "offline";

const stateLabels: Record<FeedbackKind, string> = {
  loading: "Loading",
  empty: "No results",
  success: "Complete",
  error: "Something went wrong",
  offline: "Offline",
};

type Props = {
  kind: FeedbackKind;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  className?: string;
};

/** Local, brand-tokenized feedback for async and empty states. */
export function FeedbackState({
  kind,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: Props) {
  const isError = kind === "error";
  return (
    <section
      className={["pes-feedback-state", className].filter(Boolean).join(" ")}
      data-state={kind}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-busy={kind === "loading" || undefined}
    >
      <span className="pes-feedback-state__mark" aria-hidden="true">
        {kind === "loading" ? <span className="pes-feedback-state__spinner" /> : "•"}
      </span>
      <div className="pes-feedback-state__content">
        <p className="pes-feedback-state__label">{stateLabels[kind]}</p>
        <h3 className="pes-feedback-state__title">{title}</h3>
        {description && <p className="pes-feedback-state__description">{description}</p>}
        {actionLabel && onAction && (
          <button className="pes-feedback-state__action" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  );
}
