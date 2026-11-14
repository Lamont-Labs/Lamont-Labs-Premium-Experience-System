# Resource registry and integration policy

This repository is an **app-development resource library**, not a platform.

`catalog/resources.json` is a discovery and triage registry, not an approved dependency list. Search it by `platforms` and `capabilities`, then use `alternatives`, `conflicts`, `selection_guidance`, `status`, and `integration_disposition` to choose what to investigate. Alternatives indicate a similar role, not endorsement. Conflicts are recorded only when known; an empty list does not establish compatibility.

## Evidence and licensing

- Every entry currently has unverified upstream license, provenance, and compatibility evidence. `research_reported_license` is a research lead only; `verified_upstream_license` is populated only after checking the exact upstream license files and package scope.
- A GitHub URL or repository-level license badge is not sufficient evidence for copied assets, generated code, subpackages, bundled dependencies, or redistribution rights.
- All entries have `auto_adoption_allowed: false`. `reference_only`, `dependency_review_required`, and `vendor_review_required` describe investigation paths, not approval or installation.
- `commercial_or_mixed_reported_unverified`, `source_available_reported_unverified`, and `restricted_terms_reported_unverified` are warning signals, not final legal classifications. Those resources are excluded from automatic adoption and require manual package-, feature-, asset-, service-, and use-case review.
- Hosted APIs, map/tile/data services, paid tiers, trademarks, and authoring tools can have terms separate from repository code. Review those terms independently.
- Do not bulk-copy third-party repositories. For any proposed import, check the exact source revision, notices, maintenance, security, target toolchain, and commercial redistribution terms. Record evidence and a decision before importing.

Use `catalog/candidate-seeds.json` for new research leads. Rebuild the aggregate registry with `npm run catalog:build`, then run `npm run catalog:validate` and `npm run test:contracts`. Keep candidate status unverified until evidence is actually reviewed.

Never force a central LL-PES runtime into a target app. No target app should depend on the availability of this repository to launch or render.

## Adoption evidence
Before adoption, record target app, branch/commit, selected resource and exact pinned version/revision, upstream license evidence URL and review date, provenance and compatibility findings, affected user journeys, test commands/results, screenshots where applicable, and rollback steps. Use a separate review for every package or copied asset when licensing is mixed.
