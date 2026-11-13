import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import "./premium-action.css";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  loading?: boolean;
  icon?: ReactNode;
  accent: string;
  onAccent: string;
};

export function PremiumAction({ label, loading = false, icon, accent, onAccent, disabled, style, ...rest }: Props) {
  const tokens = {
    "--pes-accent": accent,
    "--pes-on-accent": onAccent,
    ...style,
  } as CSSProperties;
  return (
    <button
      {...rest}
      type={rest.type ?? "button"}
      className={["pes-action", rest.className].filter(Boolean).join(" ")}
      style={tokens}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <span className="pes-action__spinner" aria-hidden="true" /> : icon}
      <span>{label}</span>
    </button>
  );
}
