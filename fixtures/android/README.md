# Android Compose compilation fixture

Minimal Android application that compiles LL-PES Compose examples as **source**, without installing an LL-PES runtime.

Toolchain configured: AGP 8.7.3, Kotlin 2.0.21, Compose BOM 2024.12.01, Java 17, Gradle 8.9, Android compile SDK 35.

## Build
From `fixtures/android`, with Android SDK and Gradle 8.9 installed:
```bash
gradle :app:assembleDebug
```

The build file links to the shared original Kotlin source in `../../components/android` via the app source set configuration (see app/build.gradle.kts).

This fixture is only for compilation and a manual UI smoke test. It is not a production app, does not share any real app package ID, and does not prove the full components are accessible or production ready.

**Status:** source committed, build result not yet verified.
