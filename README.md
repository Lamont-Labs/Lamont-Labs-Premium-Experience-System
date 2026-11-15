# Lamont Labs Premium Experience System (LL-PES)

Shared excellence. Distinct product identities. Locally implemented.

LL-PES is a single repository of original, reusable Web and Android components, design patterns, fixtures, and quality checks for Lamont Labs products. Public projects in the resource catalog are references for research and comparison, not services that components must call or dependencies that must be installed.

## Project rules

- Build platform-specific implementations in `components/android/` and `components/web/`, with local fixtures exercising the same component contracts.
- Components use local state and caller-provided data by default. No application is required to call LL-PES or an upstream resource at runtime.
- Implement capability areas in phases; do not bulk-copy or clone upstream projects.
- Preserve application IDs, signing identities, approved artwork, persistent data, and existing journeys.
- Compilation is not functional verification. Record tests executed and failures or unverified checks.

## Initial reference

CourtQuest Pro is a reference for validated patterns, not a dependency or source of automatically approved components. Spark is the second brand profile used to prove identity separation.

## Status

The current source is an early component set. The local implementation roadmap is in `docs/LOCAL_COMPONENT_ROADMAP.md`; build and device/browser verification status is recorded in the fixture documentation.
