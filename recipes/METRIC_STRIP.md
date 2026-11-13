# Metric Strip — high information density without clutter

Copy `components/web/MetricStrip.tsx` and `metric-strip.css` into a React app.

This is a read-only, responsive component. It renders **only caller-provided metrics**, without fetching, inferring, or fabricating values. The caller owns measurement definitions, freshness, units, formatting, and update cadence.

Use it near the top of a task-focused workspace for 2–5 relevant metrics. At narrow widths it reflows into a single column instead of creating clipped horizontal content. Use explicit labels and details; do not communicate critical status through color alone.

Verification: `fixtures/web/tests/metric-strip.spec.ts` covers live caller-owned updates, 320px viewport and large text. This is fixture evidence, not certification for adopting apps.
