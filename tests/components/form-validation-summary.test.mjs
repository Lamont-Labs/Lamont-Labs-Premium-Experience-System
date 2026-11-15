import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("Web validation summary announces errors and returns focus to the matching field", () => {
  const component = read("components/web/FormValidationSummary.tsx");
  const styles = read("components/web/form-validation-summary.css");
  assert.match(component, /role="alert"/);
  assert.match(component, /aria-labelledby=\{headingId\}/);
  assert.match(component, /field\.focus\(\)/);
  assert.match(component, /field\.scrollIntoView/);
  assert.match(component, /if \(errors\.length === 0\) return null/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /forced-colors: active/);
});

test("Android validation summary announces errors and delegates field focus", () => {
  const component = read("components/android/FormValidationSummary.kt");
  assert.match(component, /LiveRegionMode\.Assertive/);
  assert.match(component, /Role\.Button/);
  assert.match(component, /onErrorClick: \(FormValidationIssue\) -> Unit/);
  assert.match(component, /if \(errors\.isEmpty\(\)\) return/);
  assert.match(component, /error\.label.*error\.message/);
});
