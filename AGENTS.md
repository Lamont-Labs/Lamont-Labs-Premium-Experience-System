# LL-PES agent instructions

LL-PES is a reusable **repository of app-building resources**, not a platform, hosted service, or mandatory runtime dependency.

## When improving another app
1. Inspect that app's current source, instructions, approved brand assets, tests and active branch.
2. Select only relevant resources from `catalog/resources.json`; verify their current upstream licenses, versions and compatibility before installing or copying code.
3. Keep each app's visual identity distinct. Never overwrite approved assets, signing credentials, application IDs or user data.
4. Work on an isolated branch with reversible changes.
5. Run applicable compilation, functional, accessibility and screenshot checks. Report unverified work honestly.
6. Cite source commits and licenses when adapting third-party code.

## Integration classes
- **reference**: link to upstream examples, do not copy entire repositories.
- **dependency**: install from the original maintainer using pinned versions and a lockfile.
- **candidate-vendor**: copy only after reviewing license, provenance and maintenance; preserve notices.

No unverified tests or claims of release readiness. No unnecessary dependencies.
