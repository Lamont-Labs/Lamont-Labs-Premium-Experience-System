# LL-PES verified cross-platform baseline — 2026-11-13

## Scope
This repository is a reusable design and implementation resource collection, not an application or hosted service.

## Android fixture
- Workflow: `.github/workflows/android-fixture.yml`
- Passing run: https://github.com/Lamont-Labs/Lamont-Labs-Premium-Experience-System/actions/runs/43501471840
- Source commit: `21b30e1ba5b296265b194c0941aef974de6f071b`
- Verified job: `android` — conclusion `success`
- Passed steps: Android SDK installation, Gradle Compose fixture compilation, artifact upload.
- Limitation: build success does not establish emulator interaction, accessibility, visual quality, or install-on-device verification.

## Web fixture
- Workflow: `.github/workflows/web-fixture.yml`
- Passing run: https://github.com/Lamont-Labs/Lamont-Labs-Premium-Experience-System/actions/runs/43501466523
- Source commit: `6d4304f2c3378e74d66c499bb67ed59467ed6796`
- Verified job: `web` — conclusion `success`
- Passed steps: TypeScript typecheck, Vite build, Playwright browser installation, `npm test`, artifact upload.
- Limitation: a passing fixture does not prove that all adopting applications or screen sizes have been verified.

## Failure and recovery trace
- Android: https://github.com/Lamont-Labs/Lamont-Labs-Premium-Experience-System/issues/1 (closed by passing workflow)
- Web: https://github.com/Lamont-Labs/Lamont-Labs-Premium-Experience-System/issues/2 (closed by passing workflow)

## Adoption gate
1. Copy only relevant components into the target app; preserve its existing brand, package identity, data and signing.
2. Run the target app's own unit, compilation, accessibility, visual and device verification.
3. Treat these fixture runs as library smoke evidence, not release certification.
4. Never mark an application release verified solely from this repository's green checks.
