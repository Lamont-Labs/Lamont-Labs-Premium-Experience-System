package labs.lamont.pes.samples

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

/**
 * Dependency-free example of a branded premium surface.
 * Copy into a Compose application and adapt its package and tokens.
 * Does not require LL-PES at runtime.
 */
data class PremiumSurfaceColors(
    val background: Color,
    val border: Color,
    val foreground: Color
)

@Composable
fun PremiumSurface(
    colors: PremiumSurfaceColors,
    modifier: Modifier = Modifier,
    contentPadding: PaddingValues = PaddingValues(16.dp),
    content: @Composable () -> Unit
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(20.dp),
        color = colors.background,
        contentColor = colors.foreground,
        border = BorderStroke(1.dp, colors.border)
    ) {
        Box(modifier = Modifier.padding(contentPadding)) { content() }
    }
}
