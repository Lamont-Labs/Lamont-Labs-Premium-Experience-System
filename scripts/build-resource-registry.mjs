import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const catalogPath = new URL("catalog/resources.json", root);
const seedsPath = new URL("catalog/candidate-seeds.json", root);
const allowlistPath = new URL("catalog/app-use-allowlist.json", root);
const archivePath = new URL("catalog/research-archive.json", root);

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
const allowlist = JSON.parse(await readFile(allowlistPath, "utf8"));
const originalCatalogText = await readFile(catalogPath, "utf8");
let originalArchiveText = null;
let previousArchive = null;
try {
  originalArchiveText = await readFile(archivePath, "utf8");
  previousArchive = JSON.parse(originalArchiveText);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (seedDocument.seed_schema_version !== 1 || !Array.isArray(seedDocument.groups)) {
  throw new Error("Unsupported candidate seed format");
}
if (allowlist.policy_version !== 1 || !Array.isArray(allowlist.resources)) {
  throw new Error("Unsupported app-use allowlist format");
}
const allowlistById = new Map(allowlist.resources.map(item => [item.id, item]));
if (allowlistById.size !== allowlist.resources.length) {
  throw new Error("App-use allowlist contains duplicate resource IDs");
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
    capabilities: [...new Set(resource.capabilities ?? group.capabilities ?? [])].sort(),
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

const sourceResources = [
  ...(previousArchive?.resources ?? []),
  ...catalog.resources
];
const uniqueSources = new Map(sourceResources.map(resource => [resource.id, resource]));
const resources = [...uniqueSources.values()].map(resource =>
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

const completeResearchSet = resources;
const allowlistedIds = new Set(allowlistById.keys());
const activeResources = completeResearchSet
  .filter(resource => allowlistById.has(resource.id))
  .map(resource => {
    const approval = allowlistById.get(resource.id);
    return {
      ...resource,
      status: "review_in_progress",
      app_use_status: "commercial_license_screened_candidate",
      license_evidence: {
        research_reported_license: null,
        classification: "permissive_verified",
        verification_status: "verified",
        verified_upstream_license: approval.license,
        evidence_url: approval.evidence_url,
        checked_at: allowlist.checked_at,
        scope: approval.scope
      },
      license_risk_classification: "permissive_verified",
      alternatives: resource.alternatives.filter(id => allowlistedIds.has(id)),
      conflicts: resource.conflicts.filter(id => allowlistedIds.has(id)),
      provenance_evidence: resource.provenance_evidence ?? { status: "unverified", evidence_url: null, checked_at: null },
      compatibility_evidence: resource.compatibility_evidence ?? { status: "unverified", checked_against: [], checked_at: null },
      auto_adoption_allowed: false
    };
  });
const activeIds = new Set(activeResources.map(resource => resource.id));
if (activeIds.size !== allowlistById.size) {
  const missing = [...allowlistById.keys()].filter(id => !activeIds.has(id));
  throw new Error(`Allowlisted resource IDs are missing from the research set: ${missing.join(", ")}`);
}
const archivedResources = completeResearchSet.filter(resource => !activeIds.has(resource.id));
const archiveDocument = {
  archive_version: 1,
  status: "research_only_not_cleared_for_app_use",
  notice: "These discovery records are not active app-use candidates. They are retained for research history and must not be treated as cleared for commercial app distribution.",
  resources: archivedResources
};
const archiveText = `${JSON.stringify(archiveDocument, null, 2)}\n`;

catalog.schema_version = 2;
catalog.status = "commercial_app_license_screened_candidates";
catalog.integration_policy = "Only entries with a verified permissive upstream source license are active app-use candidates. This is not legal clearance for a selected package version, dependencies, assets, service terms, provenance, or target compatibility.";
catalog.capability_taxonomy = capabilityTaxonomy;
catalog.selection_guidance = [
  "Search by capability tags and platform before selecting a resource; use the alternatives list to compare candidates in the same role.",
  "Treat conflicts as confirmed incompatibilities only; an empty list means no conflict has been established, not that compatibility is proven.",
  "An active entry has only passed a repository-level permissive-license screen; check the exact package/version, included assets, notices, dependencies, maintenance, security, and target compatibility before adoption.",
  "Do not use archived research leads as app-use candidates. Copyleft, mixed-license, custom-restricted, commercial, hosted-service, and unlicensed resources stay archived until separately reviewed.",
  "Record the exact upstream evidence URL, version or commit, compatibility target, asset scope, and the decision before changing a target application."
];
catalog.license_policy = {
  "research_reported_license": "Reported signals in archived records are not legal clearance or proof of current upstream terms.",
  "verified_upstream_license": "Active entries have a repository-level license file checked on the recorded date; exact package, version, assets, dependency tree, and service terms still need review.",
  "unverified_behavior": "Active entries have unverified provenance and compatibility, and are candidates only; auto_adoption_allowed remains false.",
  "restricted_resources": "Copyleft, commercial, source-available, mixed-license, custom-restricted, hosted-service, unlicensed, and unresolved leads are excluded from the active list and retained in the research archive."
};
catalog.resources = activeResources;

const { resources: outputResources, ...catalogMetadata } = catalog;
const metadataJson = JSON.stringify(catalogMetadata, null, 2);
const generatedText = `${metadataJson.slice(0, -1).trimEnd()},\n  "resources": [\n${outputResources.map(resource => `    ${JSON.stringify(resource)}`).join(",\n")}\n  ]\n}\n`;
if (process.argv.includes("--check")) {
  if (originalCatalogText !== generatedText || originalArchiveText !== archiveText) {
    throw new Error("Generated app-use catalog or research archive is stale; run npm run catalog:build and review the diff.");
  }
  console.log(`Catalog generation is current and deterministic (${activeResources.length} active, ${archivedResources.length} archived).`);
} else {
  await writeFile(catalogPath, generatedText, "utf8");
  await writeFile(archivePath, archiveText, "utf8");
  console.log(`Built ${activeResources.length} license-screened app-use candidates and archived ${archivedResources.length} research leads.`);
}
