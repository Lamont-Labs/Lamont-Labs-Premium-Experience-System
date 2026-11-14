import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const catalogPath = new URL("catalog/resources.json", root);
const seedsPath = new URL("catalog/candidate-seeds.json", root);

const capabilityTaxonomy = {
  "accessibility.guidance": "Accessibility standards and implementation guidance",
  "accessibility.testing": "Automated or manual accessibility evaluation",
  "agent.evaluation": "Evaluation and testing of coding agents or model behavior",
  "agent.protocols": "Agent tool protocols and server implementations",
  "agent.security": "Security controls for agent workflows",
  "agent.skills": "Reusable agent instructions and skill collections",
  "agent.tooling": "Coding-agent SDKs, CLIs, and workflow tools",
  "agent.ux_guidance": "Guidance for designing and evaluating agent-enabled experiences",
  "android.architecture": "Android application architecture and sample patterns",
  "android.compose.animation": "Compose or Android motion and animation",
  "android.compose.charts": "Charts rendered with Compose",
  "android.compose.design_system": "Compose components and Android design systems",
  "android.compose.maps": "Maps integrated with Android or Compose",
  "android.compose.navigation": "Android or Compose navigation patterns",
  "android.compose.samples": "Official or community Compose implementation examples",
  "android.data": "Android persistence, networking, and data access",
  "android.images": "Android image loading and image presentation",
  "android.static_analysis": "Kotlin and Android static analysis",
  "api.graphql": "GraphQL client or API tooling",
  "assets.animation": "Animation runtimes and authored animation assets",
  "cross_platform.data": "Data tooling shared across platforms",
  "design.icons": "Icon systems and icon assets",
  "design.prototyping": "Design, prototyping, and visual authoring tools",
  "design.systems": "Reusable design-system patterns and components",
  "design.tokens": "Design token formats, authoring, and transformations",
  "design.ux_guidance": "UX, design research, and experience guidance",
  "security.mobile": "Mobile application security guidance or tools",
  "security.supply_chain": "Dependency, source, artifact, and supply-chain security",
  "security.web": "Web application security guidance or tools",
  "testing.android": "Android and Compose test tooling",
  "testing.mobile": "Cross-platform mobile test tooling",
  "testing.web": "Web unit, component, browser, and integration testing",
  "web.accessible_primitives": "Accessible headless or base UI primitives",
  "web.charts": "Web charting and visualization libraries",
  "web.data": "Web data access, upload, and API utilities",
  "web.data_viz": "Interactive data visualization",
  "web.design_system": "Web styling and design-system foundations",
  "web.forms": "Web form construction and state",
  "web.maps": "Web maps and geospatial visualization",
  "web.motion": "Web animation and motion libraries",
  "web.navigation": "Web routing and navigation",
  "web.positioning": "Floating element and overlay positioning",
  "web.react.components": "React components and component systems",
  "web.server_state": "Remote data fetching and cache state",
  "web.state": "Client-side application state",
  "web.tables": "Data grids and table primitives",
  "web.validation": "Schema and form-data validation",
  "web.virtualization": "Virtualized lists and data views"
};

const oldNames = {
  "ui-ux-pro-max": "UI/UX Pro Max",
  impeccable: "Impeccable",
  "now-in-android": "Now in Android",
  "compose-samples": "Compose Samples",
  "compose-unstyled": "Compose Unstyled",
  haze: "Haze",
  coil: "Coil",
  roborazzi: "Roborazzi",
  paparazzi: "Paparazzi",
  maestro: "Maestro",
  "shadcn-ui": "shadcn/ui",
  radix: "Radix Primitives",
  "react-aria": "React Aria",
  storybook: "Storybook",
  playwright: "Playwright",
  "axe-core": "axe-core",
  "style-dictionary": "Style Dictionary",
  lucide: "Lucide",
  motion: "Motion",
  renovate: "Renovate",
  "osv-scanner": "OSV-Scanner",
  syft: "Syft"
};

const oldPlatformAndCapabilities = {
  "design-intelligence": [["web", "design_tooling", "agent_tooling"], ["design.ux_guidance", "agent.skills"]],
  android: [["android"], ["android.compose.samples"]],
  "android-effects": [["android"], ["android.compose.animation"]],
  "android-images": [["android"], ["android.images"]],
  "android-testing": [["android"], ["testing.android"]],
  "mobile-testing": [["android", "ios"], ["testing.mobile"]],
  "web-components": [["web"], ["web.react.components"]],
  "web-testing": [["web"], ["testing.web"]],
  accessibility: [["web", "android"], ["accessibility.testing"]],
  "design-tokens": [["web", "android", "design_tooling"], ["design.tokens"]],
  icons: [["web", "android"], ["design.icons"]],
  "web-motion": [["web"], ["web.motion"]],
  maintenance: [["web", "android", "cli"], ["security.supply_chain"]],
  security: [["web", "android", "cli"], ["security.web", "security.mobile"]],
  provenance: [["web", "android", "cli"], ["security.supply_chain"]]
};

const oldSelectionGuidance = {
  reference: "Start with the repository's examples and guidance; do not copy a whole app or assume its patterns fit the target.",
  dependency: "Consider only after exact license, version, provenance, platform compatibility, security, and target-app fit are checked; pin versions and use a lockfile.",
  "candidate-vendor": "Do not copy yet. Review exact source files, notices, provenance, maintenance, and redistribution rights before any isolated vendoring."
};

const seedDocument = JSON.parse(await readFile(seedsPath, "utf8"));
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const originalCatalogText = await readFile(catalogPath, "utf8");
if (seedDocument.seed_schema_version !== 1 || !Array.isArray(seedDocument.groups)) {
  throw new Error("Unsupported candidate seed format");
}

function makeEvidence(reported, classification = "unknown") {
  return {
    research_reported_license: reported ?? null,
    classification,
    verification_status: "unverified",
    verified_upstream_license: null,
    evidence_url: null,
    checked_at: null
  };
}

function normalizeExisting(resource) {
  const [platforms, capabilities] = oldPlatformAndCapabilities[resource.category] ?? [
    ["web", "android"],
    ["design.ux_guidance"]
  ];
  return {
    ...resource,
    name: oldNames[resource.id] ?? resource.id,
    url: resource.id === "style-dictionary"
      ? "https://github.com/style-dictionary/style-dictionary"
      : resource.url,
    platforms: resource.platforms ?? platforms,
    capabilities: resource.capabilities ?? capabilities,
    integration_disposition: resource.integration_disposition ?? ({
      reference: "reference_only",
      dependency: "dependency_review_required",
      "candidate-vendor": "vendor_review_required"
    }[resource.mode] ?? "reference_only"),
    status: "existing_candidate_unverified",
    source_origin: "existing_catalog",
    license_evidence: resource.license_evidence ?? makeEvidence(null),
    provenance_evidence: resource.provenance_evidence ?? { status: "unverified", evidence_url: null, checked_at: null },
    compatibility_evidence: resource.compatibility_evidence ?? { status: "unverified", checked_against: [], checked_at: null },
    auto_adoption_allowed: false,
    license_risk_classification: resource.license_risk_classification ?? "unknown",
    alternatives: resource.alternatives ?? [],
    conflicts: resource.conflicts ?? [],
    selection_guidance: resource.selection_guidance ?? oldSelectionGuidance[resource.mode] ?? oldSelectionGuidance.reference
  };
}

function fromSeed(resource, group) {
  const disposition = resource.integration_disposition ?? group.integration_disposition;
  return {
    id: resource.id,
    name: resource.name,
    url: resource.url,
    category: group.category,
    mode: disposition === "reference_only" ? "reference" : disposition === "vendor_review_required" ? "candidate-vendor" : "dependency",
    priority: "P2",
    platforms: resource.platforms ?? group.platforms,
    capabilities: [...new Set([...(group.capabilities ?? []), ...(resource.capabilities ?? [])])].sort(),
    integration_disposition: disposition,
    status: "new_candidate_unverified",
    source_origin: resource.source_origin ?? "public_github_discovery",
    license_evidence: makeEvidence(resource.research_reported_license, resource.license_risk_classification ?? "unknown"),
    provenance_evidence: { status: "unverified", evidence_url: null, checked_at: null },
    compatibility_evidence: { status: "unverified", checked_against: [], checked_at: null },
    auto_adoption_allowed: false,
    license_risk_classification: resource.license_risk_classification ?? "unknown",
    alternatives: resource.alternatives ?? [],
    conflicts: resource.conflicts ?? [],
    selection_guidance: resource.selection_guidance ?? group.selection_guidance
  };
}

const resources = catalog.resources.map(resource =>
  resource.status && resource.source_origin !== "existing_catalog"
    ? resource
    : normalizeExisting(resource)
);
const indexes = new Map(resources.map((resource, index) => [resource.id, index]));
for (const group of seedDocument.groups) {
  for (const seed of group.resources ?? []) {
    const existingIndex = indexes.get(seed.id);
    if (existingIndex === undefined) {
      indexes.set(seed.id, resources.length);
      resources.push(fromSeed(seed, group));
    } else if (resources[existingIndex].status === "new_candidate_unverified") {
      resources[existingIndex] = fromSeed(seed, group);
    }
  }
}

catalog.schema_version = 2;
catalog.status = "research_candidates_not_license_audited";
catalog.integration_policy = "All catalog entries are research candidates. No candidate is cleared for adoption until its exact upstream license, provenance, and target compatibility are independently evidenced.";
catalog.capability_taxonomy = capabilityTaxonomy;
catalog.selection_guidance = [
  "Search by capability tags and platform before selecting a resource; use the alternatives list to compare candidates in the same role.",
  "Treat conflicts as confirmed incompatibilities only; an empty list means no conflict has been established, not that compatibility is proven.",
  "Start with reference-only candidates. Consider dependencies only after checking the exact upstream revision, package and file-level licenses, maintenance, security, compatibility, and commercial terms.",
  "Treat source-visible, mixed-license, commercial, hosted-service, and asset-heavy resources as manual legal and product review; never auto-install or bulk-copy them.",
  "Record upstream evidence URLs, checked date, version or commit, compatibility target, and the decision before changing a target application."
];
catalog.license_policy = {
  "research_reported_license": "A research lead or commonly reported license signal; not legal clearance and not proof of current upstream terms.",
  "verified_upstream_license": "Only populated after inspecting the exact upstream license files/notices and relevant package or asset scope.",
  "unverified_behavior": "All current entries remain unverified for license, provenance, and compatibility. auto_adoption_allowed is false.",
  "restricted_resources": "Commercial, source-available, mixed-license, hosted-service, or otherwise restricted signals require manual review and are excluded from automatic adoption."
};
catalog.resources = resources;

const { resources: outputResources, ...catalogMetadata } = catalog;
const metadataJson = JSON.stringify(catalogMetadata, null, 2);
const generatedText = `${metadataJson.slice(0, -1).trimEnd()},\n  "resources": [\n${outputResources.map(resource => `    ${JSON.stringify(resource)}`).join(",\n")}\n  ]\n}\n`;
const candidateCount = seedDocument.groups.reduce((n, group) => n + group.resources.length, 0);
if (process.argv.includes("--check")) {
  if (originalCatalogText !== generatedText) {
    throw new Error("Generated catalog is stale; run npm run catalog:build and review the diff.");
  }
  console.log(`Catalog generation is current and deterministic (${resources.length} records, ${candidateCount} additions).`);
} else {
  await writeFile(catalogPath, generatedText, "utf8");
  console.log(`Built ${resources.length} catalog records (${candidateCount} new candidates).`);
}
