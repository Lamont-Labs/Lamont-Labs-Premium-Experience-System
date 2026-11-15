# LL-PES agent instructions

LL-PES is a single-repository, local-first component and experience library for Web and Android. It is not a platform, hosted service, or mandatory runtime dependency.

## Local-first build strategy
- Build original LL-PES implementations under `components/web/` and `components/android/`; use upstream projects as research references, not runtime calls or default dependencies.
- Implement the capability domains in `catalog/resources.json` in phases. Do not clone or bulk-copy upstream repositories.
- Keep components functional with local inputs and caller-provided data. Any network/service integration must be an explicit adapter, never a hidden requirement of a component.
- Copy or adapt upstream code or assets only after checking the exact source, license scope, notices, and provenance. Prefer independently authored implementations from documented behavior and visual references.

## When improving another app
1. Inspect that app's current source, instructions, approved brand assets, tests and active branch.
2. Search `catalog/resources.json` by platform and capability tags; compare alternatives and read each resource's selection guidance.
3. Keep each app's visual identity distinct. Never overwrite approved assets, signing credentials, application IDs or user data.
4. Work on an isolated branch with reversible changes.
5. Run applicable compilation, functional, accessibility and screenshot checks. Report unverified work honestly.
6. Cite source commits and licenses when adapting third-party code.

## Integration classes
- **reference**: link to upstream examples, do not copy entire repositories.
- **dependency**: exceptional and explicitly approved; pin versions and audit transitive licenses before adding.
- **candidate-vendor**: only after reviewing exact license scope, provenance, maintenance, and notices.

The default for this repository is **reference and implement locally**, not dependency or vendor.

No unverified tests or claims of release readiness. No unnecessary dependencies.

## Resource registry
- `catalog/resources.json` is the active app-use registry; `catalog/research-archive.json` and `catalog/candidate-seeds.json` are not active candidate lists.
- Active records have a verified repository-level permissive license, but exact release, package, asset, dependency, provenance and compatibility checks remain. `auto_adoption_allowed` must remain `false`.
- Review `catalog/README.md` and `docs/INTEGRATION_POLICY.md` before selecting a resource. Copyleft, commercial, source-available, mixed-license, custom-restricted, hosted-service, unlicensed and unresolved resources stay out of the active list.
- Add a lead to `catalog/app-use-allowlist.json` only after recording its primary license URL, scope, and review date. Update research leads in `catalog/candidate-seeds.json`; rebuild with `npm run catalog:build`, then run `npm run catalog:validate` and `npm run test:contracts`.
