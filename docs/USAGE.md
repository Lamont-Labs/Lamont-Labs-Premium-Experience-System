# How to use LL-PES

In a development session, ask the agent to inspect this repository and the target app before proposing changes.

Example:

> Inspect Lamont-Labs/Lamont-Labs-Premium-Experience-System and my target app's current branch. Use relevant design intelligence, native UI patterns and testing resources to improve the app's experience. Preserve the existing brand, functionality, persistent data, signing identity and application ID. Make reversible commits and report executed tests separately from unverified checks.

## Workflow
1. Read `AGENTS.md`.
2. Search `catalog/resources.json` by platform/capability and compare alternatives and conflicts.
3. Treat every record as a candidate. Verify the exact upstream source, package license/notices, provenance, release/version, compatibility, and any commercial or service terms.
4. Make a target-app-specific design and test plan.
5. Implement in the target app, not in a shared runtime service.
6. Capture evidence and document remaining limitations.

The registry is a research starting point, not a blanket commercial-use clearance. Its `research_reported_license` field is not verified upstream evidence. All current candidates have automatic adoption disabled.
