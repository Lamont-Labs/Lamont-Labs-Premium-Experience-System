import type { CSSProperties, PropsWithChildren } from "react";
import "./premium-surface.css";

export type PremiumSurfaceTokens = {
  background: string;
  foreground: string;
  border: string;
  radius?: string;
};

export function PremiumSurface({
  tokens,
  children,
  className = "",
}: PropsWithChildren<{
  tokens: PremiumSurfaceTokens;
  className?: string;
}>) {
  const styles = {
    "--pes-background": tokens.background,
    "--pes-foreground": tokens.foreground,
    "--pes-border": tokens.border,
    "--pes-radius": tokens.radius ?? "20px",
  } as CSSProperties;
  return <section className={`pes-surface ${className}`.trim()} style={styles}>{children}</section>;
}
