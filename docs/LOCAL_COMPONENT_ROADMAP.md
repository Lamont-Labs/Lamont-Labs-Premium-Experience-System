# Local component roadmap

## Goal and boundaries

Build original LL-PES components and implementation guidance in this repository, with platform-specific source under `components/web/` and `components/android/`. The resource catalog is for research and comparison; components must not depend on upstream repositories, remote services, or a central LL-PES runtime.

“All capabilities” means local implementations of the useful capability areas represented by the references, not one-to-one copies of the upstream projects or their developer tools. Components should accept local or caller-provided data. Network access belongs in an explicitly supplied application adapter, not inside a reusable visual component.

Review exact licenses and preserve notices before copying any upstream code, assets, or substantial implementation. Independent implementations may use public behavior and design references without requiring runtime integration.

## Phases

### Phase 1 — Core interaction and feedback

Standardize local tokens, buttons, navigation, disclosures, form fields, validation, loading/empty/error/offline/success states, responsive surfaces, and accessibility semantics. Expand both fixtures and test keyboard, screen-reader semantics, reduced motion, and narrow layouts.

**Implemented first:** shared semantic color tokens, local feedback states, form fields, and validation summaries for Web and Android. Validation and recovery behavior remains caller-owned; fixtures cover field-level errors and returning focus from the error summary. Broader field patterns remain in this phase.

### Phase 2 — Data and task workflows

Add reusable local patterns for lists, search, sorting, filtering, selection, pagination, forms, validation summaries, and caller-owned state. Cover loading, empty, stale/offline, error, recovery, and interrupted states without requiring a remote data provider.

**Implemented first:** a searchable single-selection list for Web and Android. Search operates only on supplied labels, descriptions, and keywords; query and selected item remain caller-owned.

### Phase 3 — Visualization and location

Implement charts and map-oriented views that render supplied datasets and geometry. Keep map tiles, geocoding, and live data providers outside the components; do not add hidden API calls or credentials.

### Phase 4 — Motion, media, and polish

Add responsive motion and media patterns with reduced-motion support, local asset handling, explicit loading/failure behavior, and performance-conscious fallbacks.

### Phase 5 — Quality and developer guidance

Expand deterministic component contracts, browser and Android fixture verification, accessibility checks, security/supply-chain guidance, and agent instructions. Keep the implementation self-contained and document any remaining platform or device verification gaps.

## Completion standard

Each phase adds original local components for both platforms where the platform supports the behavior, updates the fixtures, records platform-specific exceptions, and runs applicable checks. A component is not complete merely because its visual shell exists; interactions, accessibility, responsive behavior, and failure states must be covered.
