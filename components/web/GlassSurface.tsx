import type { CSSProperties, PropsWithChildren } from "react";
import "./glass-surface.css";

export type GlassSurfaceTokens = {
  tint: string;
  border: string;
  foreground: string;
  solidFallback: string;
};

export function GlassSurface({
  tokens,
  children,
  className = "",
}: PropsWithChildren<{ tokens: GlassSurfaceTokens; className?: string }>) {
  const style = {
    "--pes-glass-tint": tokens.tint,
    "--pes-glass-border": tokens.border,
    "--pes-glass-foreground": tokens.foreground,
    "--pes-glass-solid": tokens.solidFallback,
  } as CSSProperties;

  return (
    <div className={["pes-glass", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
