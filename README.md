# Lamont Labs Premium Experience System (LL-PES)

Shared excellence. Distinct product identities. Verified implementation.

LL-PES is a versioned, optional design and experience engineering foundation for Lamont Labs products. It provides platform-specific components, semantic design tokens, navigation and onboarding patterns, and evidence-backed quality gates without changing the identity or persistent state of adopting applications.

## Project rules

- Android / Jetpack Compose is the initial platform; React is a separate future adapter.
- No application is required to connect to a central LL-PES service at runtime.
- Each app pins an explicit compatible release; updates require application-level verification.
- Preserve application IDs, signing identities, approved artwork, persistent data, and existing journeys.
- Compilation is not functional verification. Record tests executed and failures or unverified checks.

## Initial reference

CourtQuest Pro is a reference for validated patterns, not a dependency or source of automatically approved components. Spark is the second brand profile used to prove identity separation.

## Status

Phase 0 discovery is partial. The first Android showcase is not yet build-verified. See upcoming architecture, source, and CI commits for implementation status.
