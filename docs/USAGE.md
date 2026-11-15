# How to build with LL-PES

LL-PES components are implemented and exercised inside this repository. Use the public resource catalog for research and comparison; it is not a list of services to call or libraries to install.

Example:

> Inspect this repository's existing local components, fixtures and design rules. Use the catalog only as reference material, then build the feature locally for Web and Android. Do not introduce an upstream runtime call or dependency unless I explicitly approve it.

## Workflow
1. Read `AGENTS.md`, `docs/LOCAL_COMPONENT_ROADMAP.md`, and the relevant design playbook.
2. Inspect both platform implementations and fixtures before changing a component.
3. Use catalog entries as references. Independently implement the behavior inside `components/web/` and `components/android/`.
4. Keep data inputs and service adapters explicit; components must work without upstream network calls.
5. Extend the browser and Android fixtures, run applicable checks, and record what remains unverified.

If copying source code, assets, or substantial implementation details from an upstream project, check the exact license and notices first. A repository-level license screen is not legal clearance for copied assets, package releases, or an app distribution.
