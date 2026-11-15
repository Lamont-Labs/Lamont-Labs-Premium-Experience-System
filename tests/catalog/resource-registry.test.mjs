import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validateCatalog } from "../../scripts/validate-resource-registry.mjs";

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const [catalog, schema, seeds, archive, allowlist] = await Promise.all([
  readJson("../../catalog/resources.json"),
  readJson("../../catalog/resource-registry.schema.json"),
  readJson("../../catalog/candidate-seeds.json"),
  readJson("../../catalog/research-archive.json"),
  readJson("../../catalog/app-use-allowlist.json")
]);
const archivedIds = new Set(archive.resources.map(resource => resource.id));

const legacyIds = [
  "ui-ux-pro-max", "impeccable", "now-in-android", "compose-samples", "compose-unstyled",
  "haze", "coil", "roborazzi", "paparazzi", "maestro", "shadcn-ui", "radix",
  "react-aria", "storybook", "playwright", "axe-core", "style-dictionary", "lucide",
  "motion", "renovate", "osv-scanner", "syft"
];

test("resource registry conforms to its JSON schema and semantic checks", () => {
  assert.deepEqual(validateCatalog(catalog, schema), []);
});

test("aggregated registry is deterministic and current with its candidate seeds", () => {
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const output = execFileSync(process.execPath, ["scripts/build-resource-registry.mjs", "--check"], {
    cwd: root,
    encoding: "utf8"
  });
  assert.match(output, /current and deterministic/);
});

test("resource-specific capability tags do not inherit unrelated group defaults", () => {
  const apollo = archive.resources.find(resource => resource.id === "apollo-client");
  const chart = archive.resources.find(resource => resource.id === "echarts");
  assert.ok(!apollo.capabilities.includes("web.forms"));
  assert.ok(!apollo.capabilities.includes("web.navigation"));
  assert.ok(!chart.capabilities.includes("web.maps"));
});

test("active registry contains only allowlisted app-use candidates and archives the rest", () => {
  const ids = new Set(catalog.resources.map(resource => resource.id));
  const archivedIds = new Set(archive.resources.map(resource => resource.id));
  for (const { id } of allowlist.resources) {
    assert.ok(ids.has(id), `allowlisted resource missing from active registry: ${id}`);
  }
  for (const id of legacyIds) assert.ok(ids.has(id) || archivedIds.has(id), `research history lost ${id}`);
  assert.equal(legacyIds.length, 22);
  assert.equal(catalog.resources.length, allowlist.resources.length);
  assert.equal(catalog.resources.length, 35);
  assert.equal(archive.resources.length, 137);
  assert.equal(new Set([...ids, ...archivedIds]).size, ids.size + archivedIds.size);
  assert.equal(ids.size + archivedIds.size, 172);
  assert.ok(catalog.resources.every(resource => resource.app_use_status === "commercial_license_screened_candidate"));
  assert.ok(archive.resources.every(resource => resource.auto_adoption_allowed === false));
  const seedCount = seeds.groups.reduce((sum, group) => sum + group.resources.length, 0);
  assert.equal(seedCount, 150);
  assert.equal(archive.resources.filter(resource => resource.status === "new_candidate_unverified").length, 135);
});

test("Style Dictionary uses the canonical upstream repository URL", () => {
  const resource = catalog.resources.find(candidate => candidate.id === "style-dictionary");
  assert.equal(resource.url, "https://github.com/style-dictionary/style-dictionary");
});

test("active candidates have verified permissive license evidence but remain unapproved", () => {
  for (const resource of catalog.resources) {
    assert.equal(resource.status, "review_in_progress", resource.id);
    assert.equal(resource.license_evidence.verification_status, "verified", resource.id);
    assert.equal(resource.license_evidence.classification, "permissive_verified", resource.id);
    assert.ok(resource.license_evidence.verified_upstream_license, resource.id);
    assert.ok(resource.license_evidence.evidence_url, resource.id);
    assert.ok(resource.license_evidence.checked_at, resource.id);
    assert.ok(resource.license_evidence.scope, resource.id);
    assert.equal(resource.provenance_evidence.status, "unverified", resource.id);
    assert.equal(resource.compatibility_evidence.status, "unverified", resource.id);
    assert.equal(resource.auto_adoption_allowed, false, resource.id);
  }
});

test("copyleft, mixed, restricted, and unclear entries stay outside active app candidates", () => {
  const restricted = archive.resources.filter(resource =>
    [
      "copyleft_reported_unverified",
      "commercial_reported_unverified",
      "mixed_license_reported_unverified",
      "source_available_reported_unverified",
      "restricted_terms_reported_unverified"
    ]
      .includes(resource.license_risk_classification)
  );
  assert.ok(restricted.length >= 8);
  for (const classification of [
    "commercial_reported_unverified",
    "mixed_license_reported_unverified",
    "source_available_reported_unverified",
    "restricted_terms_reported_unverified"
  ]) assert.ok(restricted.some(resource => resource.license_risk_classification === classification), `missing ${classification}`);
  for (const resource of restricted) {
    assert.equal(resource.integration_disposition, "excluded_from_automatic_adoption", resource.id);
    assert.equal(resource.auto_adoption_allowed, false, resource.id);
  }
  const activeIds = new Set(catalog.resources.map(resource => resource.id));
  for (const id of ["axe-core", "renovate", "mobsf", "trufflehog", "pa11y", "highcharts", "mapbox-gl-js", "awesome-claude-code", "gsap"]) {
    assert.ok(!activeIds.has(id), `${id} must not be an app-use candidate`);
    assert.ok(archivedIds.has(id), `${id} must be retained in the research archive`);
  }
});

test("active capability tags cover core app and development needs", () => {
  const tags = new Set(catalog.resources.flatMap(resource => resource.capabilities));
  for (const tag of [
    "android.compose.design_system", "web.react.components", "web.forms",
    "testing.android", "testing.web", "accessibility.testing", "security.supply_chain"
  ]) assert.ok(tags.has(tag), `missing capability ${tag}`);
});

test("validator rejects broken alternatives and unsupported adoption claims", () => {
  const brokenReference = structuredClone(catalog);
  brokenReference.resources[0].alternatives = ["missing-resource"];
  assert.ok(validateCatalog(brokenReference, schema).some(error => error.includes("unknown related resource")));

  const unsafeAdoption = structuredClone(catalog);
  unsafeAdoption.resources[0].auto_adoption_allowed = true;
  assert.ok(validateCatalog(unsafeAdoption, schema).some(error => error.includes("auto_adoption_allowed")));
});

test("validator rejects incomplete verified evidence and impossible calendar dates", () => {
  const incompleteProvenance = structuredClone(catalog);
  const provenanceCandidate = incompleteProvenance.resources[0];
  provenanceCandidate.provenance_evidence = { status: "verified", evidence_url: null, checked_at: null };
  assert.ok(validateCatalog(incompleteProvenance, schema).some(error => error.includes("verified provenance")));

  const invalidDate = structuredClone(catalog);
  const dateCandidate = invalidDate.resources[0];
  dateCandidate.license_evidence = {
    ...dateCandidate.license_evidence,
    verification_status: "verified",
    verified_upstream_license: "MIT",
    evidence_url: dateCandidate.url,
    checked_at: "2026-02-30"
  };
  assert.ok(validateCatalog(invalidDate, schema).some(error => error.includes("valid ISO calendar date")));

  const unsupportedRule = structuredClone(schema);
  unsupportedRule.properties.schema_version.unsupportedConstraint = true;
  assert.ok(validateCatalog(catalog, unsupportedRule).some(error => error.includes("unsupported schema keyword")));
});

test("candidate seeds have unique stable IDs and canonical public GitHub links", () => {
  assert.equal(seeds.status, "research_archive_only");
  const rows = seeds.groups.flatMap(group => group.resources);
  const ids = rows.map(resource => resource.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const resource of rows) {
    assert.match(resource.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(resource.url, /^https:\/\/github\.com\/[^/]+\/[^/?#]+$/);
  }
});
