# React recipe — tokenized surface

Sources: `components/web/PremiumSurface.tsx` and `premium-surface.css` (original LL-PES examples).

## Integration
1. Copy both files into the target React application.
2. Ensure the app has React and a TypeScript/JSX toolchain.
3. Pass product-specific tokens; avoid hardcoded brand assumptions.
4. Use semantic HTML inside the surface; a visual container does not replace accessible interactive primitives.
5. Run the target project's typecheck, tests, Storybook review (if installed), and Playwright screenshot checks (if configured).

## Example
```tsx
<PremiumSurface tokens={{
  background: "#17191E",
  foreground: "#FFFFFF",
  border: "#393D46",
  radius: "16px"
}}>
  <h2>Overview</h2>
  <p>Current activity</p>
</PremiumSurface>
```

No LL-PES runtime or network service is required. No browser or TypeScript verification has yet been executed on these examples.
