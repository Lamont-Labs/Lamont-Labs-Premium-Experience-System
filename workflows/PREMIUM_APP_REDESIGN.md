# Premium app redesign — agent runbook

## Inputs
Target repository and branch; product goal; approved artwork and navigation; known defects; existing test/release workflow.

## Execution
1. Read target `AGENTS.md`, design rules, recent changes, dependency versions and current tests. Never infer that a default branch is the active development branch.
2. Capture baseline screenshots of primary flows at normal/large text, compact/expanded screens, light/dark if supported. If capture is unavailable, mark visual review UNVERIFIED.
3. Identify three high-impact friction points; rank by user impact, implementation risk and confidence. Do not assume more cards or scrolling improves quality.
4. Select resources from `catalog/resources.json` and check upstream revision, license and API compatibility.
5. Create a reversible target-app branch. Preserve application ID, signing identity, approved branding, persistent state and feature coverage.
6. Implement one coherent journey end-to-end, including loading, empty, success, error and interrupted states.
7. Run compilation, tests, device journeys, accessibility and screenshot checks independently.
8. Report commit SHA, commands, outcomes, missing evidence and rollback procedure.

## Acceptance
No unverified claim of premium quality or release readiness. Functional and visual regression failures block promotion.
