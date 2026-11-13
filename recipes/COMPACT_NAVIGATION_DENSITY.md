# Compact navigation without losing destination clarity

## Problem
Hiding every navigation label below a fixed viewport breakpoint saves height but forces users to memorize icons. In a premium app, density must not destroy recognition.

## Web implementation
Copy `components/web/CompactNavigation.tsx` and `components/web/compact-navigation.css` into the target app. Supply app-owned approved icons, labels, route IDs, and routing callbacks.

The reference navigation now keeps **both icons and labels visible** down to 320px. Items have a minimum 64px width and 48px height. If the destination count exceeds available width, the navigation scrolls horizontally instead of compressing targets or hiding labels. The current destination exposes `aria-current="page"`.

## Android implementation
The existing `components/android/CompactNavigation.kt` is a Material 3 reference, **not** an equivalent height-optimized implementation. Its destination labels are conditional, so applications must evaluate label visibility and navigation item count independently. Do not claim identical behavior across platforms.

## Adoption rules
- Keep 3–5 primary destinations where possible; move secondary tools to a separate More area.
- Never change an app's approved icon artwork or brand tokens when adopting this recipe.
- Preserve accessible labels even if a target app explicitly elects icon-only navigation.
- Verify at 320px, 360px, 390px, large text, keyboard focus and screen reader output.
- Prefer route changes that preserve screen state and avoid accidental duplicate actions.

## Evidence
`fixtures/web/tests/navigation-density.spec.ts` checks label visibility and route selection at 320px, plus keyboard activation. Passing CI is required before treating the change as verified.
