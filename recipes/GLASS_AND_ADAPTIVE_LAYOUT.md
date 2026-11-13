# Glass and adaptive layout recipes

These are original, copyable React snippets, not third-party dependencies.

## GlassSurface
Copy `components/web/GlassSurface.tsx` and `glass-surface.css`. Supply four product-specific tokens: translucent tint, border, foreground and **opaque solid fallback**. The component uses feature detection for blur and honors supported reduced-transparency and forced-colors settings. Verify contrast with the actual background image or content behind the surface. Never rely on blur alone to separate interactive elements.

## AdaptiveSplit
Copy `components/web/AdaptiveSplit.tsx` and `adaptive-split.css`. The layout stacks on narrow viewports and switches to a two-column master/detail layout at 880px. This is a layout primitive, not a router. The caller is responsible for mobile detail navigation, scroll position, screen-reader focus, and back behavior.

## Example
```tsx
<AdaptiveSplit
  primary={<GlassSurface tokens={{
    tint: "rgba(24, 26, 31, .82)",
    border: "rgba(255,255,255,.16)",
    foreground: "#FFFFFF",
    solidFallback: "#191B20"
  }}>Primary task</GlassSurface>}
  secondary={<div>Details</div>}
/>
```

## Acceptance tests
- Narrow and wide screenshots with realistic content.
- Zoom and text scaling to 200%.
- Keyboard focus, screen reader landmarks, contrast and forced-colors mode.
- Reduced transparency and unsupported-backdrop-filter fallback.
- Browser performance on low-power devices.

**Status:** source committed; no browser build, runtime, or screenshot verification has been executed.
