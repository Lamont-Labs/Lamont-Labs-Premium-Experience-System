package labs.lamont.pes.samples

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

/** Color roles without direct Material ColorScheme equivalents. */
object PremiumSemanticColors {
    val lightWarning = Color(0xFF674B00)
    val lightFocus = Color(0xFF005FCC)
    val darkWarning = Color(0xFFF4C875)
    val darkFocus = Color(0xFFFFD0A8)
}

private val lightColors = lightColorScheme(
    primary = Color(0xFF8B470F),
    onPrimary = Color(0xFFFFFFFF),
    background = Color(0xFFF6F7F9),
    onBackground = Color(0xFF171A20),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF171A20),
    surfaceVariant = Color(0xFFEEF1F5),
    onSurfaceVariant = Color(0xFF535B67),
    outline = Color(0xFF66707D),
    outlineVariant = Color(0xFF66707D),
    tertiary = Color(0xFF17613F),
    tertiaryContainer = Color(0xFFD3F5DE),
    onTertiaryContainer = Color(0xFF062E19),
    error = Color(0xFFA4231A),
    errorContainer = Color(0xFFFFDAD4),
    onErrorContainer = Color(0xFF410002)
)

private val darkColors = darkColorScheme(
    primary = Color(0xFFFFB77D),
    onPrimary = Color(0xFF2D1607),
    background = Color(0xFF111318),
    onBackground = Color(0xFFF3F5F9),
    surface = Color(0xFF191C22),
    onSurface = Color(0xFFF3F5F9),
    surfaceVariant = Color(0xFF242833),
    onSurfaceVariant = Color(0xFFC2C7D0),
    outline = Color(0xFF858C98),
    outlineVariant = Color(0xFF858C98),
    tertiary = Color(0xFF82D9A9),
    tertiaryContainer = Color(0xFF135232),
    onTertiaryContainer = Color(0xFFB6F1C5),
    error = Color(0xFFFFB4AB),
    errorContainer = Color(0xFF5C1712),
    onErrorContainer = Color(0xFFFFDAD4)
)

/** Optional brand-neutral semantic palette; apps may provide their own Material color scheme. */
@Composable
fun PremiumExperienceTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) darkColors else lightColors,
        content = content
    )
}
