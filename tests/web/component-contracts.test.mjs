import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = (name) => readFileSync(new URL(`../../components/web/${name}`, import.meta.url), "utf8");

test("all React component source files have matching local CSS", () => {
  for (const [tsx, css] of [
    ["PremiumSurface.tsx", "premium-surface.css"],
    ["PremiumAction.tsx", "premium-action.css"],
    ["CompactNavigation.tsx", "compact-navigation.css"],
    ["GlassSurface.tsx", "glass-surface.css"],
    ["AdaptiveSplit.tsx", "adaptive-split.css"],
  ]) {
    assert.ok(source(tsx).includes(`"./${css}"`), `${tsx} must import ${css}`);
    assert.ok(source(css).length > 50, `${css} must not be empty`);
  }
});

test("buttons declare type and accessible loading state", () => {
  assert.match(source("PremiumAction.tsx"), /type=\{rest\.type \?\? "button"\}/);
  assert.match(source("PremiumAction.tsx"), /aria-busy/);
  assert.match(source("PremiumAction.tsx"), /disabled=\{disabled \|\| loading\}/);
  assert.match(source("premium-action.css"), /:focus-visible/);
});

test("navigation has accessible name, current page and keyboard focus treatment", () => {
  assert.match(source("CompactNavigation.tsx"), /aria-label=\{ariaLabel\}/);
  assert.match(source("CompactNavigation.tsx"), /aria-current/);
  assert.match(source("compact-navigation.css"), /:focus-visible/);
});

test("glass has fallback and high-contrast support", () => {
  assert.match(source("glass-surface.css"), /var\(--pes-glass-solid\)/);
  assert.match(source("glass-surface.css"), /prefers-reduced-transparency/);
  assert.match(source("glass-surface.css"), /forced-colors: active/);
});

test("adaptive layout includes narrow and wide arrangements", () => {
  assert.match(source("adaptive-split.css"), /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(source("adaptive-split.css"), /@media \(min-width: 880px\)/);
});
