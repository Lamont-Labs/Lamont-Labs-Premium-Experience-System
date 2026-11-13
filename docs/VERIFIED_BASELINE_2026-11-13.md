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

## Expanded web navigation and workspace verification
- Passing run: https://github.com/Lamont-Labs/Lamont-Labs-Premium-Experience-System/actions/runs/43515171143
- Source commit: `7eecba723ac1fa172d6485944f4117724d0f81ba`
- Verified: TypeScript typecheck, Vite build, Playwright browser tests, evidence artifact upload, automatic closure of failure issue #5.
- Covered by committed fixture tests: compact navigation at 320px, overflow destination selection, keyboard activation, large-text scaling, disclosure interaction, workspace view switching, and workspace keyboard activation.
- Historical failure issue: https://github.com/Lamont-Labs/Lamont-Labs-Premium-Experience-System/issues/5 (closed after successful verification).
- Limitation: passing tests do not establish production-app integration, screen-reader certification, or exhaustive browser/device coverage.

## Expanded native Android navigation and workspace verification
- Passing run: https://github.com/Lamont-Labs/Lamont-Labs-Premium-Experience-System/actions/runs/43516370361
- Source commit: `813d9262d816078b4ab70b85779e97fe460e41c7`
- Independently inspected job conclusion: `success`.
- Passed: Android 35 SDK installation, Java/Gradle setup, compilation of the Compose fixture including `LowProfileNavigation.kt` and `CompactWorkspace.kt`, APK artifact upload, and verification receipt publication.
- Durable receipt: https://github.com/Lamont-Labs/Lamont-Labs-Premium-Experience-System/issues/6
- Limitation: no emulator interaction, screen-reader testing, or physical-device installation was performed.
