# Resource Registry v2

`resources.json` is the agent-discoverable aggregate registry. It keeps the original 22 resource IDs and adds 150 research candidates across Android Compose, React/web UI, design systems and tokens, motion, forms/data, charts/maps, accessibility, testing, security, and agent tooling.

## Find a candidate

1. Filter `resources` by `platforms` and one or more `capabilities`.
2. Compare `alternatives`; treat `conflicts` as verified incompatibilities only when evidence supports that claim.
3. Read `selection_guidance`, `status`, `integration_disposition`, and `license_risk_classification`.
4. Inspect the exact upstream repository, package, version, license, notices, provenance, compatibility, and any service or commercial terms before proposing adoption.

For a deterministic command-line shortlist, use `npm run catalog:select -- --platform android --capability android.compose.design_system`. Add `--query <text>` for a text search or `--format json` for machine-readable output. Restricted and mixed/commercial/source-available candidates are excluded by default; `--include-restricted` reveals them for manual review only and never approves adoption. Results are ordered by priority, then name and stable ID. Combine several filters with AND; capability tags are exact matches. Platform-prefixed capabilities (such as `web.forms`) cannot be paired with a different platform filter. Group defaults are not added to resources that already have resource-specific capability tags.

The registry is a research index, not a software bill of materials or approval list. All entries currently have unverified license, provenance, and compatibility evidence. Research-reported license signals are explicitly separate from verified upstream evidence. Automatic adoption is disabled for every entry.

## Updating

- Add discovery leads to `candidate-seeds.json`; do not copy upstream source into this repository.
- Run `npm run catalog:build` to deterministically aggregate seeds with the existing catalog.
- Run `npm run catalog:validate` and `npm run test:contracts`.
- Use `npm run catalog:select -- --help` for selector options.
- Only change evidence statuses after recording the exact source URL, package/version scope, and review date. Do not mark a license verified from a search snippet, badge, or secondary list.
- Commercial, source-available, mixed-license, hosted-service, and restricted signals must remain excluded from automatic adoption until reviewed for the specific package, use, and target app.

The JSON Schema is `resource-registry.schema.json`. The validator uses Node's built-in libraries; no project installation is needed.
