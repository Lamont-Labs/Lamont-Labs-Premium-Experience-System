# Resource Registry v2

`resources.json` is the agent-discoverable aggregate registry. It keeps the original 22 resource IDs and adds 150 research candidates across Android Compose, React/web UI, design systems and tokens, motion, forms/data, charts/maps, accessibility, testing, security, and agent tooling.

## Find a candidate

1. Filter `resources` by `platforms` and one or more `capabilities`.
2. Compare `alternatives`; treat `conflicts` as verified incompatibilities only when evidence supports that claim.
3. Read `selection_guidance`, `status`, `integration_disposition`, and `license_risk_classification`.
4. Inspect the exact upstream repository, package, version, license, notices, provenance, compatibility, and any service or commercial terms before proposing adoption.

The registry is a research index, not a software bill of materials or approval list. All entries currently have unverified license, provenance, and compatibility evidence. Research-reported license signals are explicitly separate from verified upstream evidence. Automatic adoption is disabled for every entry.

## Updating

- Add discovery leads to `candidate-seeds.json`; do not copy upstream source into this repository.
- Run `npm run catalog:build` to deterministically aggregate seeds with the existing catalog.
- Run `npm run catalog:validate` and `npm run test:contracts`.
- Only change evidence statuses after recording the exact source URL, package/version scope, and review date. Do not mark a license verified from a search snippet, badge, or secondary list.
- Commercial, source-available, mixed-license, hosted-service, and restricted signals must remain excluded from automatic adoption until reviewed for the specific package, use, and target app.

The JSON Schema is `resource-registry.schema.json`. The validator uses Node's built-in libraries; no project installation is needed.
