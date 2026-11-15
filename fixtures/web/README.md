# Browser verification fixture

This is a **test fixture**, not an LL-PES platform or product. Its staging script copies local React components and semantic tokens from the repository before typecheck/build; it does not call upstream projects.

Run from this directory with Node 22:
```bash
npm install
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

GitHub Actions runs the same sequence on Ubuntu and uploads screenshots/traces as evidence. Package versions are exact in package.json, but no lockfile has yet been generated or audited; npm install is therefore not a fully reproducible installation. CI success must be checked on GitHub before claiming verification.

Playwright covers desktop Chromium and a mobile Chromium device profile. Browser tests are not a substitute for manual accessibility assessment, cross-browser testing, or native Android verification.
