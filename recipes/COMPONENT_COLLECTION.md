# Premium component collection — implementation notes

All components in `components/android/` and `components/web/` are original LL-PES reference snippets. They are **not** a packaged library and have not been compiled in this repository.

## Android
- `PremiumSurface.kt`: tokenized container.
- `PremiumAction.kt`: Material 3 button with loading state. Caller owns idempotency and server-side save-once semantics.
- `CompactNavigation.kt`: navigation with caller-supplied approved icons and route state. It does **not** impose a bottom-bar layout on every product.

Requires a target project with Compose Material 3. Copy selected files and adjust the package.

## React
- `PremiumSurface.tsx` + CSS: tokenized container.
- `PremiumAction.tsx` + CSS: accessible button with disabled/loading state and focus indicator.
- `CompactNavigation.tsx` + CSS: compact icon navigation with an accessible name and active page state.

Requires React, TSX compilation, and local CSS imports. These snippets are not substitutes for a router or a complete navigation system.

## Required verification in the target app
- Typecheck / compile and automated unit tests.
- Keyboard navigation, screen-reader labels, focus order, contrast and large text.
- Compact and expanded viewport screenshots.
- Persistence, back behavior, loading state and rapid repeat-click tests.
- Performance and reduced-motion behavior where relevant.

**Status:** committed source only; no device, browser, or CI validation has been performed.
