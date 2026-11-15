# Premium component collection — implementation notes

Components in `components/android/` and `components/web/` are original LL-PES implementations maintained in this single repository. Fixtures import the local source directly; components do not call upstream projects. This is a growing library, not a hosted runtime service.

## Android
- `PremiumSurface.kt`: tokenized container.
- `PremiumAction.kt`: Material 3 button with loading state. Caller owns idempotency and server-side save-once semantics.
- `CompactNavigation.kt`: navigation with caller-supplied approved icons and route state. It does **not** impose a bottom-bar layout on every product.
- `FeedbackState.kt`: local loading, empty, success, error, and offline states; the caller owns data and retry behavior.
- `FormField.kt`: labeled Material field with required, hint, and caller-provided validation states.

Uses Compose Material 3 in the local Android fixture. A consuming app may copy selected source, but must verify compatibility in its own build.

## React
- `PremiumSurface.tsx` + CSS: tokenized container.
- `PremiumAction.tsx` + CSS: accessible button with disabled/loading state and focus indicator.
- `CompactNavigation.tsx` + CSS: compact icon navigation with an accessible name and active page state.
- `FeedbackState.tsx` + CSS: live status/error announcements, recovery action, and reduced-motion-aware loading state.
- `FormField.tsx` + CSS: labeled input with linked descriptions, required state, and caller-owned validation.

Uses React, TSX, and local CSS in the browser fixture. These components do not replace an application's router or data layer.

## Required verification in the target app
- Typecheck / compile and automated unit tests.
- Keyboard navigation, screen-reader labels, focus order, contrast and large text.
- Compact and expanded viewport screenshots.
- Persistence, back behavior, loading state and rapid repeat-click tests.
- Performance and reduced-motion behavior where relevant.

**Status:** dependency-free source-contract tests pass. Browser rendering and Android compilation remain unverified in this workspace.
