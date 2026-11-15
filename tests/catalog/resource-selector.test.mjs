import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseSelectorArgs, selectResources } from "../../scripts/select-resources.mjs";

const catalog = JSON.parse(await readFile(new URL("../../catalog/resources.json", import.meta.url), "utf8"));
const root = fileURLToPath(new URL("../../", import.meta.url));

test("selector intersects exact platform and capability filters", () => {
  const matches = selectResources(catalog, {
    platform: "web",
    capability: "web.forms",
    limit: 50
  });
  assert.ok(matches.length > 0);
  for (const resource of matches) {
    assert.ok(resource.platforms.includes("web"));
    assert.ok(resource.capabilities.includes("web.forms"));
  }
});

test("selector does not pair a platform-prefixed capability with another platform", () => {
  assert.deepEqual(selectResources(catalog, {
    platform: "android",
    capability: "web.forms",
    includeRestricted: true,
    limit: 200
  }), []);
});

test("restricted candidates are excluded unless explicitly requested for review", () => {
  const safeDefault = selectResources(catalog, { limit: 200 });
  assert.ok(safeDefault.every(resource =>
    resource.integration_disposition !== "excluded_from_automatic_adoption"
    && !resource.license_risk_classification.includes("commercial_reported")
    && !resource.license_risk_classification.includes("mixed_license_reported")
    && !resource.license_risk_classification.includes("source_available_reported")
    && !resource.license_risk_classification.includes("restricted_terms_reported")
  ));
  const withRestricted = selectResources(catalog, { includeRestricted: true, limit: 200 });
  assert.ok(withRestricted.length > safeDefault.length);
});

test("selector output is stable and honors the requested result limit", () => {
  const options = { platform: "android", limit: 7 };
  const first = selectResources(catalog, options);
  const second = selectResources(catalog, options);
  assert.deepEqual(first, second);
  assert.equal(first.length, 7);
});

test("CLI emits machine-readable results and reports unverified evidence plainly", () => {
  const output = execFileSync(process.execPath, [
    "scripts/select-resources.mjs", "--platform", "android", "--limit", "1", "--format", "json"
  ], { cwd: root, encoding: "utf8" });
  const [resource] = JSON.parse(output);
  assert.equal(resource.license_evidence.verification_status, "unverified");
  assert.equal(resource.auto_adoption_allowed, false);
});

test("selector rejects malformed options instead of silently broadening results", () => {
  assert.throws(() => parseSelectorArgs(["--platform"]), /requires a value/);
  assert.throws(() => parseSelectorArgs(["--limit", "0"]), /positive whole number/);
  assert.throws(() => parseSelectorArgs(["--format", "yaml"]), /text or json/);
  const result = spawnSync(process.execPath, ["scripts/select-resources.mjs", "--unknown"], {
    cwd: root,
    encoding: "utf8"
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Unknown option/);
});
