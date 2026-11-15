# Resource registry and integration policy

This repository is a **local-first Web and Android component library**, not a platform. Build original implementations in this repository; do not require components to call or install the projects listed as references.

`catalog/resources.json` and `catalog/research-archive.json` are research references. Search by `platforms` and `capabilities` to compare patterns and implementation approaches; do not treat either file as a runtime dependency manifest. Alternatives indicate a similar role, not endorsement. Conflicts are recorded only when known; an empty list does not establish compatibility.

## Evidence and licensing

- The active 35-entry shortlist has checked repository-level permissive licenses; the archive retains excluded or unresolved leads. Both can inform independently authored local implementations without importing their source.
- If code or assets are copied or adapted, exact package/version, provenance, compatibility, asset scope, dependencies, and service terms still require review.
- A GitHub URL or repository-level license badge is not sufficient evidence for copied assets, generated code, subpackages, bundled dependencies, or redistribution rights.
- All entries have `auto_adoption_allowed: false`. The catalog does not approve dependency installation, copied code, or Google Play distribution.
- Copyleft, mixed-license, commercial, source-available, custom-restricted, hosted-service, unlicensed, and unresolved resources are excluded from the active app-use registry until separately reviewed. Copyleft remains excluded until legal review.
- Hosted APIs, map/tile/data services, paid tiers, trademarks, and authoring tools can have terms separate from repository code. Review those terms independently.
- Do not bulk-copy third-party repositories. For any proposed import, check the exact source revision, notices, maintenance, security, target toolchain, and commercial redistribution terms. Record evidence and a decision before importing.

Use `catalog/candidate-seeds.json` for new research leads. Add an entry to `catalog/app-use-allowlist.json` only after confirming a permissive commercial-use license at its upstream source and documenting the exact scope. Rebuild with `npm run catalog:build`, then run `npm run catalog:validate` and `npm run test:contracts`.

Never force a central LL-PES runtime into a target app. No target app should depend on the availability of this repository to launch or render.

## Adoption evidence
Before adoption, record target app, branch/commit, selected resource and exact pinned version/revision, upstream license evidence URL and review date, provenance and compatibility findings, affected user journeys, test commands/results, screenshots where applicable, and rollback steps. Use a separate review for every package or copied asset when licensing is mixed.
