import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validateCatalog } from "../../scripts/validate-resource-registry.mjs";

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const [catalog, schema, seeds] = await Promise.all([
  readJson("../../catalog/resources.json"),
  readJson("../../catalog/resource-registry.schema.json"),
  readJson("../../catalog/candidate-seeds.json")
]);

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

test("registry v2 retains the original 22 resources and adds over 100 candidates", () => {
  const ids = new Set(catalog.resources.map(resource => resource.id));
  for (const id of legacyIds) {
    assert.ok(ids.has(id), `missing retained resource ${id}`);
    const resource = catalog.resources.find(candidate => candidate.id === id);
    assert.ok(resource.category && resource.mode && resource.priority, `${id} lost its legacy fields`);
  }
  assert.equal(legacyIds.length, 22);
  assert.ok(catalog.resources.length >= 100);
  const additions = catalog.resources.filter(resource => resource.status === "new_candidate_unverified");
  const seedCount = seeds.groups.reduce((sum, group) => sum + group.resources.length, 0);
  assert.ok(additions.length >= 100);
  assert.equal(additions.length, seedCount);
  assert.equal(catalog.resources.length, legacyIds.length + seedCount);
  assert.equal(catalog.resources.filter(resource => resource.status === "new_candidate_unverified").length, 150);
});

test("Style Dictionary uses the canonical upstream repository URL", () => {
  const resource = catalog.resources.find(candidate => candidate.id === "style-dictionary");
  assert.equal(resource.url, "https://github.com/style-dictionary/style-dictionary");
});

test("all new candidates separate reported license signals from verified evidence", () => {
  const additions = catalog.resources.filter(resource => resource.status === "new_candidate_unverified");
  assert.equal(additions.length, seeds.groups.reduce((sum, group) => sum + group.resources.length, 0));
  for (const resource of additions) {
    assert.equal(resource.license_evidence.verification_status, "unverified", resource.id);
    assert.equal(resource.license_evidence.verified_upstream_license, null, resource.id);
    assert.equal(resource.provenance_evidence.status, "unverified", resource.id);
    assert.equal(resource.compatibility_evidence.status, "unverified", resource.id);
    assert.equal(resource.auto_adoption_allowed, false, resource.id);
  }
});

test("commercial, source-available, mixed-license, and restricted signals are distinct and excluded", () => {
  const restricted = catalog.resources.filter(resource =>
    [
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
});

test("capability tags cover the requested development domains", () => {
  const tags = new Set(catalog.resources.flatMap(resource => resource.capabilities));
  for (const tag of [
    "android.compose.design_system", "web.react.components", "design.tokens", "web.motion",
    "web.forms", "web.data_viz", "web.maps", "accessibility.testing", "testing.web",
    "testing.android", "security.supply_chain", "agent.skills"
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

test("candidate seeds have unique stable IDs and canonical public GitHub links", () => {
  const rows = seeds.groups.flatMap(group => group.resources);
  const ids = rows.map(resource => resource.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const resource of rows) {
    assert.match(resource.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(resource.url, /^https:\/\/github\.com\/[^/]+\/[^/?#]+$/);
  }
});
