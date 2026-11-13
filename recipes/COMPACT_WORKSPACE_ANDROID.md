# Compact Workspace — native Android

Use `components/android/CompactWorkspace.kt` to present one primary task and a small number of mutually exclusive supporting views without a long vertical stack.

This is a copyable Jetpack Compose component. It is not a runtime, navigation platform, or app shell. Copy the source into the target application's package and adapt its visual tokens to that application's approved design.

## API

- `title`: persistent workspace heading.
- `views`: unique `WorkspaceView(id, label)` entries.
- `selectedId`: caller-owned selection; unknown IDs fall back to the first view.
- `onSelect`: caller-owned state update; no implicit navigation or persistence.
- `background`, `foreground`, `selectedBackground`: caller-owned visual tokens.
- `summary`: optional persistent overview content.
- `content`: renders **only** the active view.

## Adoption rules

1. Keep urgent status, consent, and primary actions outside secondary views.
2. Do not use view selectors for sequential onboarding steps.
3. Preserve a minimum 48dp selectable target; horizontal overflow is scrollable.
4. Verify the layout with 200% font scale, TalkBack, keyboard/switch access, and narrow devices.
5. Ensure selected state is communicated to accessibility services.
6. Restore the caller-owned selected view after process recreation if that is required by the adopting application.
7. Do not claim a device-level accessibility pass from compilation alone.

## Current proof

The source is included in `fixtures/android` for compilation by GitHub Actions. Device-level interaction and accessibility checks are **not yet established**. The web counterpart is `components/web/WorkspaceShell.tsx`, with Playwright tests in `fixtures/web/tests/workspace-shell.spec.ts`.
