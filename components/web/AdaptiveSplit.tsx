import type { ReactNode } from "react";
import "./adaptive-split.css";

/** Responsive master/detail container. The caller controls routing and focus management. */
export function AdaptiveSplit({
  primary,
  secondary,
  secondaryLabel = "Details",
}: {
  primary: ReactNode;
  secondary: ReactNode;
  secondaryLabel?: string;
}) {
  return (
    <div className="pes-split">
      <main className="pes-split__primary">{primary}</main>
      <aside className="pes-split__secondary" aria-label={secondaryLabel}>{secondary}</aside>
    </div>
  );
}
