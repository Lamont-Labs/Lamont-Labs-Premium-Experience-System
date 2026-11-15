# Resource registry and integration policy

This repository is an **app-development resource library**, not a platform.

`catalog/resources.json` contains the active app-use candidates. Search it by `platforms` and `capabilities`, then read the verified license evidence, scope, `alternatives`, `conflicts`, `selection_guidance`, and `integration_disposition`. Alternatives indicate a similar role, not endorsement. Conflicts are recorded only when known; an empty list does not establish compatibility. Non-cleared leads remain in `catalog/research-archive.json` and are not app-use candidates.

## Evidence and licensing

- Active entries have a checked repository-level permissive license, but exact package/version, provenance, compatibility, assets, dependencies, and service terms remain unverified.
- A GitHub URL or repository-level license badge is not sufficient evidence for copied assets, generated code, subpackages, bundled dependencies, or redistribution rights.
- All entries have `auto_adoption_allowed: false`. `commercial_license_screened_candidate` is not legal approval, installation permission, or Google Play clearance.
- Copyleft, mixed-license, commercial, source-available, custom-restricted, hosted-service, unlicensed, and unresolved resources are excluded from the active app-use registry until separately reviewed. Copyleft remains excluded until legal review.
- Hosted APIs, map/tile/data services, paid tiers, trademarks, and authoring tools can have terms separate from repository code. Review those terms independently.
- Do not bulk-copy third-party repositories. For any proposed import, check the exact source revision, notices, maintenance, security, target toolchain, and commercial redistribution terms. Record evidence and a decision before importing.

Use `catalog/candidate-seeds.json` for research leads. Add a resource to `catalog/app-use-allowlist.json` only after confirming a permissive commercial-use license at its upstream source and documenting the exact scope. Rebuild with `npm run catalog:build`, then run `npm run catalog:validate` and `npm run test:contracts`.

Never force a central LL-PES runtime into a target app. No target app should depend on the availability of this repository to launch or render.

## Adoption evidence
Before adoption, record target app, branch/commit, selected resource and exact pinned version/revision, upstream license evidence URL and review date, provenance and compatibility findings, affected user journeys, test commands/results, screenshots where applicable, and rollback steps. Use a separate review for every package or copied asset when licensing is mixed.
