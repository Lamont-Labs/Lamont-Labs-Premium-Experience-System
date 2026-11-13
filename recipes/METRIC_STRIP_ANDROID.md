# Metric Strip — Android Compose

Copy `components/android/MetricStrip.kt` into an adopting Android application and adapt the package name.

Pass caller-owned `PremiumMetric(id, label, value, detail)` objects and app-specific colors. The component never fetches data, infers values, or stores state. The caller is responsible for metric freshness, units, formatting, and source provenance.

The current implementation displays two metrics per row, with remaining items on subsequent rows. It is intentionally a simple compact reference rather than a complete responsive grid. Validate narrow widths, large font scaling, TalkBack, contrast, and long localized labels in the adopting app. Avoid relying on color alone to convey status.

The component is included in the Compose fixture for CI compilation; compilation is not a device accessibility test.
