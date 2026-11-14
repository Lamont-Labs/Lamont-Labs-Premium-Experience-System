# Metric Strip — Android Compose

Copy `components/android/MetricStrip.kt` into an adopting Android application and adapt the package name.

Pass caller-owned `PremiumMetric(id, label, value, detail)` objects and app-specific colors. The component never fetches data, infers values, or stores state. The caller is responsible for metric freshness, units, formatting, and source provenance.

The implementation displays two metrics per row when available width is at least 360dp and font scale is below 1.5. It switches to one metric per row below 360dp or when the system font scale reaches 1.5, allowing labels and values to wrap naturally. The thresholds are documented defaults, not universal guarantees against overflow for arbitrary content. Validate narrow widths, large font scaling, TalkBack, contrast, and long localized labels in the adopting app. Avoid relying on color alone to convey status.

The component is included in the Compose fixture for CI compilation; compilation is not a device accessibility test.
