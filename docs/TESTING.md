# Testing LL-PES resources

Run `npm run test:contracts` with Node 22+ to execute dependency-free source contract checks for web snippets.

These checks verify that referenced CSS files exist, button and navigation accessibility attributes are present, glass fallback rules exist, and responsive layout rules are defined.

**Limitations:** These are static source checks, not TypeScript compilation, React rendering, browser accessibility testing, screenshot comparisons, or Android compilation. A passing result must never be reported as proof of visual or functional correctness.

GitHub Actions workflow: `.github/workflows/resource-contracts.yml`. Check the workflow run status before asserting that CI passed.

Next verification expansion: React + TypeScript build fixture with pinned dependencies and Playwright, then an independent Android Gradle fixture.
