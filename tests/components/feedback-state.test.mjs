import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("Web feedback states expose live semantics and caller-owned recovery", () => {
  const component = read("components/web/FeedbackState.tsx");
  const styles = read("components/web/feedback-state.css");
  assert.match(component, /role=\{isError \? "alert" : "status"\}/);
  assert.match(component, /aria-live=\{isError \? "assertive" : "polite"\}/);
  assert.match(component, /aria-busy=\{kind === "loading" \|\| undefined\}/);
  assert.match(component, /onClick=\{onAction\}/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
  assert.match(styles, /:focus-visible/);
});

test("Android feedback states use live-region semantics and caller-owned actions", () => {
  const component = read("components/android/FeedbackState.kt");
  assert.match(component, /enum class FeedbackKind/);
  assert.match(component, /LiveRegionMode\.Assertive/);
  assert.match(component, /stateDescription = kind\.label/);
  assert.match(component, /if \(!actionLabel\.isNullOrBlank\(\) && onAction != null\)/);
  assert.match(component, /Button\(onClick = onAction\)/);
});

test("Web and Android form fields keep labels and validation local", () => {
  const web = read("components/web/FormField.tsx");
  const webStyles = read("components/web/form-field.css");
  const android = read("components/android/FormField.kt");
  assert.match(web, /htmlFor=\{inputId\}/);
  assert.match(web, /aria-describedby=\{describedBy\}/);
  assert.match(web, /aria-invalid=\{error \? true : undefined\}/);
  assert.match(web, /role="alert"/);
  assert.match(webStyles, /:focus-visible/);
  assert.match(webStyles, /forced-colors: active/);
  assert.match(android, /OutlinedTextField/);
  assert.match(android, /isError = !error\.isNullOrBlank\(\)/);
  assert.match(android, /supportingText =/);
});

test("semantic color tokens are shared by Web and Android adapters", () => {
  const tokens = JSON.parse(read("design/tokens.json"));
  const css = read("design/tokens.css");
  const android = read("components/android/PremiumExperienceTheme.kt");
  for (const mode of ["light", "dark"]) {
    for (const [role, value] of Object.entries(tokens.colors[mode])) {
      const cssRole = role.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      assert.ok(css.includes(`--pes-color-${cssRole}: ${value};`), `missing CSS ${mode} ${role}`);
      assert.ok(android.includes(`Color(0xFF${value.slice(1)})`), `missing Android ${mode} ${role}`);
    }
  }
});
