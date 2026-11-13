# Android Compose recipe — brand-independent surfaces

Source: `components/android/PremiumSurface.kt` (original LL-PES sample, not third-party code).

## Integration
1. Confirm the target app uses Jetpack Compose and Material 3.
2. Copy the sample into the target app's source tree and change the package name.
3. Supply `PremiumSurfaceColors` from the target app's existing semantic theme tokens.
4. Keep typography and interactive controls in the target app; this sample is a container, not a button.
5. Verify compilation and screenshot appearance in both normal and large font settings.
6. Check actual contrast, focus order, TalkBack semantics and performance on target devices.

## Example
```kotlin
PremiumSurface(
    colors = PremiumSurfaceColors(
        background = Color(0xFF101113),
        border = Color(0xFF34363B),
        foreground = Color(0xFFF8F5F0)
    )
) {
    Text("Training summary")
}
```

The example uses CourtQuest-like colors for demonstration only. Do not apply them to other brands automatically. Blur and glass effects are intentionally omitted: choose a compatible library only if the design needs them.

**Verification:** Source example committed; compilation and emulator tests not executed.
