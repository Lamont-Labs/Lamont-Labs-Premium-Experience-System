# Resource Registry v2

`resources.json` is a 35-entry research shortlist with checked permissive repository licenses. `research-archive.json` retains 137 excluded or unresolved research leads. The original 150 discovery leads remain in `candidate-seeds.json`. These files are reference material, not a runtime dependency list; build local LL-PES implementations rather than making components call or install these projects.

## Find a candidate

1. Filter `resources` by `platforms` and one or more `capabilities`.
2. Compare `alternatives`; treat `conflicts` as verified incompatibilities only when evidence supports that claim.
3. Read `app_use_status`, verified license URL and scope, `selection_guidance`, and `integration_disposition`.
4. Before app integration, check the exact package and version, bundled assets, notices, transitive dependencies, provenance, compatibility, and any service or commercial terms.

For a deterministic shortlist, use `npm run catalog:select -- --platform android --capability android.compose.design_system`. Add `--query <text>` for a text search or `--format json` for machine-readable output. The selector reads only the active registry; it cannot show archived, copyleft, mixed, restricted, or unverified leads. Results are ordered by priority, then name and stable ID. Combine filters with AND; capability tags are exact matches. Platform-prefixed capabilities (such as `web.forms`) cannot be paired with a different platform filter.

An active record has a verified repository-level permissive license, not legal clearance for a particular app release or for copying its code and assets. Exact package versions, dependencies, assets, provenance, and compatibility still need review before copying or adapting source. `auto_adoption_allowed` remains false for every record. No third-party project was installed or copied into LL-PES.

## Updating

- Add discovery leads to `candidate-seeds.json`; they remain archived until reviewed.
- Add a candidate to `app-use-allowlist.json` only after confirming its exact upstream permissive license and scope; copyleft is excluded until separately reviewed.
- Run `npm run catalog:build` to deterministically regenerate the active registry and research archive.
- Run `npm run catalog:validate` and `npm run test:contracts`.
- Use `npm run catalog:select -- --help` for selector options.
- Record the exact license evidence URL, scope and review date. Do not mark a license verified from a search snippet, badge, or secondary list.
- A license-screened candidate is still not automatically approved for adoption or Google Play distribution.

The JSON Schema is `resource-registry.schema.json`. The validator uses Node's built-in libraries; no project installation is needed.
