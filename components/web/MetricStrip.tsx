import type { ReactNode } from "react";
import "./metric-strip.css";

export type Metric = {
  id: string;
  label: string;
  value: ReactNode;
  detail?: ReactNode;
};

/** Compact, responsive, read-only metrics; no charts or fabricated data. */
export function MetricStrip({ metrics, label = "Key metrics" }: { metrics: Metric[]; label?: string }) {
  if (new Set(metrics.map(metric => metric.id)).size !== metrics.length) {
    throw new Error("MetricStrip requires unique metric IDs");
  }
  return (
    <section className="pes-metrics" aria-label={label}>
      {metrics.map(metric => (
        <div className="pes-metrics__item" key={metric.id}>
          <div className="pes-metrics__label">{metric.label}</div>
          <div className="pes-metrics__value">{metric.value}</div>
          {metric.detail != null && <div className="pes-metrics__detail">{metric.detail}</div>}
        </div>
      ))}
    </section>
  );
}
