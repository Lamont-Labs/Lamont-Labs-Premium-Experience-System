# LL-PES agent instructions

LL-PES is a reusable **repository of app-building resources**, not a platform, hosted service, or mandatory runtime dependency.

## When improving another app
1. Inspect that app's current source, instructions, approved brand assets, tests and active branch.
2. Search `catalog/resources.json` by platform and capability tags; compare alternatives and read each resource's selection guidance.
3. Keep each app's visual identity distinct. Never overwrite approved assets, signing credentials, application IDs or user data.
4. Work on an isolated branch with reversible changes.
5. Run applicable compilation, functional, accessibility and screenshot checks. Report unverified work honestly.
6. Cite source commits and licenses when adapting third-party code.

## Integration classes
- **reference**: link to upstream examples, do not copy entire repositories.
- **dependency**: install from the original maintainer using pinned versions and a lockfile.
- **candidate-vendor**: copy only after reviewing license, provenance and maintenance; preserve notices.

No unverified tests or claims of release readiness. No unnecessary dependencies.

## Resource registry
- `catalog/resources.json` is the machine-readable v2 registry; `catalog/resource-registry.schema.json` defines its contract.
- Every current record has unverified license, provenance and compatibility evidence. `auto_adoption_allowed` must remain `false`.
- Review `catalog/README.md` and `docs/INTEGRATION_POLICY.md` before selecting a resource. Commercial, source-available, mixed-license, hosted-service and restricted signals require manual review and must not be adopted automatically.
- Update candidate leads in `catalog/candidate-seeds.json`, rebuild with `npm run catalog:build`, then run `npm run catalog:validate` and `npm run test:contracts`.
