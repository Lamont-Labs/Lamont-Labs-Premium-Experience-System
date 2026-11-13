# Workspace Shell — less scrolling, clearer hierarchy

Copy `components/web/WorkspaceShell.tsx` and `workspace-shell.css` into an existing React application. This is an opt-in view component, not a routing framework or application shell.

Keep the primary task and urgent status visible. Put mutually exclusive secondary views into labeled, keyboard-operable buttons. The caller supplies tabs, activeTab, onTabChange, content, and any primary actions.

The implementation uses `role="group"` with `aria-pressed` buttons, **not** an ARIA tablist. This avoids claiming arrow-key tablist behavior that has not been implemented.

## Verification and adoption
- Preserve app-specific branding and approved navigation.
- Confirm selected content changes without duplicating hidden panels.
- Confirm keyboard focus and Enter activation.
- Verify 320px width, large text, screen reader labels, and contrast in the adopting app.
- Do not put critical alerts or consent behind secondary views.
- Avoid tabs for sequential steps; use a stepper for ordered workflows.

See `fixtures/web/tests/workspace-shell.spec.ts` for automated behavior checks.
