package labs.lamont.pes.samples

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.foundation.selection.selectable
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/**
 * Brand-neutral, low-profile horizontal navigation.
 * All destinations retain visible text; excess items scroll rather than shrink.
 * Caller owns route state, icon artwork, persistence, and navigation.
 */
@Composable
fun LowProfileNavigation(
    destinations: List<PremiumDestination>,
    currentRoute: String,
    onNavigate: (String) -> Unit,
    background: Color,
    foreground: Color,
    selectedBackground: Color,
    modifier: Modifier = Modifier,
    icon: @Composable (PremiumDestination) -> Unit
) {
    require(destinations.isNotEmpty()) { "Navigation needs at least one destination" }
    require(destinations.map { it.route }.distinct().size == destinations.size) {
        "Navigation routes must be unique"
    }
    Surface(
        modifier = modifier,
        shape = MaterialTheme.shapes.large,
        color = background,
        contentColor = foreground,
        border = BorderStroke(1.dp, foreground.copy(alpha = 0.18f))
    ) {
        Row(
            modifier = Modifier.horizontalScroll(rememberScrollState()).padding(4.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            destinations.forEach { destination ->
                val active = destination.route == currentRoute
                Surface(
                    color = if (active) selectedBackground else Color.Transparent,
                    shape = MaterialTheme.shapes.medium
                ) {
                    Column(
                        modifier = Modifier
                            .defaultMinSize(minWidth = 64.dp)
                            .heightIn(min = 48.dp)
                            .selectable(
                                selected = active,
                                role = Role.Tab,
                                onClick = { if (!active) onNavigate(destination.route) }
                            )
                            .padding(horizontal = 8.dp, vertical = 4.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        icon(destination)
                        Text(destination.label, style = MaterialTheme.typography.labelSmall, maxLines = 1)
                    }
                }
            }
        }
    }
}
