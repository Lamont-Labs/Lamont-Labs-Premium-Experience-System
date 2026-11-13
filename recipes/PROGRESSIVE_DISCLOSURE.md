# Progressive disclosure: reduce scrolling without hiding essential actions

Use `DisclosurePanel` for optional explanations, advanced settings, contextual evidence, and help. Keep the primary action, status, and critical warnings visible outside the disclosure.

## Web
Copy `components/web/DisclosurePanel.tsx` and `disclosure-panel.css` into the app. Import `DisclosurePanel` and render:

```tsx
<DisclosurePanel title="Additional information">
  <p>Optional evidence and advanced context.</p>
</DisclosurePanel>
```

The implementation uses native HTML `details` and `summary`, preserving browser keyboard and assistive-technology semantics. A minimum 48px summary target and reduced-motion support are included.

## Verification
- Toggle via pointer and Enter/Space; check visible content and focus outline.
- Confirm required warnings and primary actions remain outside the collapsed panel.
- Test at 320px width, 200% text zoom, and reduced motion.
- Preserve the target app's colors, typography, navigation model and data ownership.
- Never use disclosure to conceal required consent or destructive-action confirmation.
