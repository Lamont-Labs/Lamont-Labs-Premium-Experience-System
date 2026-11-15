import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("Web filterable list uses local matching, accessible native selection, and caller-owned state", () => {
  const component = read("components/web/FilterableList.tsx");
  const styles = read("components/web/filterable-list.css");
  assert.match(component, /items\.filter/);
  assert.match(component, /type="search"/);
  assert.match(component, /type="radio"/);
  assert.match(component, /onQueryChange/);
  assert.match(component, /onSelect\(item\.id\)/);
  assert.match(component, /role="status"/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /forced-colors: active/);
});

test("Android filterable list uses local matching and accessible radio selection", () => {
  const component = read("components/android/FilterableList.kt");
  assert.match(component, /items\.filter/);
  assert.match(component, /OutlinedTextField/);
  assert.match(component, /Role\.RadioButton/);
  assert.match(component, /onQueryChange: \(String\) -> Unit/);
  assert.match(component, /onSelect\(item\.id\)/);
  assert.match(component, /LiveRegionMode\.Polite/);
});
