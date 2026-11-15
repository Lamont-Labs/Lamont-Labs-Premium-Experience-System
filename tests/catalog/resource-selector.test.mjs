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

test("selector exposes only license-screened app-use candidates", () => {
  const safeDefault = selectResources(catalog, { limit: 200 });
  assert.equal(safeDefault.length, catalog.resources.length);
  assert.ok(safeDefault.every(resource =>
    resource.app_use_status === "commercial_license_screened_candidate"
    && resource.license_evidence.verification_status === "verified"
    && resource.license_evidence.classification === "permissive_verified"
  ));
});

test("selector output is stable and honors the requested result limit", () => {
  const options = { platform: "android", limit: 7 };
  const first = selectResources(catalog, options);
  const second = selectResources(catalog, options);
  assert.deepEqual(first, second);
  assert.equal(first.length, 7);
});

test("CLI emits machine-readable results and distinguishes license review from adoption", () => {
  const output = execFileSync(process.execPath, [
    "scripts/select-resources.mjs", "--platform", "android", "--limit", "1", "--format", "json"
  ], { cwd: root, encoding: "utf8" });
  const [resource] = JSON.parse(output);
  assert.equal(resource.license_evidence.verification_status, "verified");
  assert.equal(resource.app_use_status, "commercial_license_screened_candidate");
  assert.equal(resource.auto_adoption_allowed, false);
});

test("selector rejects malformed options instead of silently broadening results", () => {
  assert.throws(() => parseSelectorArgs(["--platform"]), /requires a value/);
  assert.throws(() => parseSelectorArgs(["--limit", "0"]), /positive whole number/);
  assert.throws(() => parseSelectorArgs(["--format", "yaml"]), /text or json/);
  assert.throws(() => parseSelectorArgs(["--include-restricted"]), /Unknown option/);
  const result = spawnSync(process.execPath, ["scripts/select-resources.mjs", "--unknown"], {
    cwd: root,
    encoding: "utf8"
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Unknown option/);
});
