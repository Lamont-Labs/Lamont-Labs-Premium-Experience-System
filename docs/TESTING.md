# Testing LL-PES resources

Run `npm run test:contracts` with Node 22+ to execute dependency-free web component contracts and deterministic resource-registry tests. Run `npm run catalog:validate` to validate `catalog/resources.json` against `catalog/resource-registry.schema.json` and the registry's semantic rules.

Web source checks verify that referenced CSS files exist, button and navigation accessibility attributes are present, feedback states and form validation summaries announce errors, error-summary links return focus to their fields, filterable lists use native single-selection controls with caller-owned state, reduced-motion and high-contrast fallbacks exist, glass fallback rules exist, and responsive layout rules are defined. Registry checks validate schema shape, stable/unique IDs, capability taxonomy, cross-references, license evidence, and automatic-adoption restrictions.

**Limitations:** These are static source and catalog checks, not TypeScript compilation, React rendering, browser accessibility testing, screenshot comparisons, Android compilation, or legal license clearance. A passing result must never be reported as proof of visual or functional correctness or as approval to adopt a registry candidate.

GitHub Actions workflow: `.github/workflows/resource-contracts.yml`. It validates the registry and runs the static contracts when catalog, registry tests, or web components change. Check the workflow run status before asserting that CI passed.

The fixtures also include React/TypeScript/Playwright and an Android Gradle compilation target. Run those separately when their toolchains and dependencies are available.
