package labs.lamont.pes.samples

import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color

/** Small navigation reference. The target app supplies approved icons and route state. */
data class PremiumDestination(val route: String, val label: String)

@Composable
fun CompactNavigation(
    destinations: List<PremiumDestination>,
    currentRoute: String,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier,
    background: Color,
    foreground: Color,
    icon: @Composable (PremiumDestination) -> Unit
) {
    require(destinations.isNotEmpty()) { "Navigation needs at least one destination" }
    NavigationBar(modifier = modifier, containerColor = background) {
        destinations.forEach { destination ->
            NavigationBarItem(
                selected = destination.route == currentRoute,
                onClick = { if (destination.route != currentRoute) onNavigate(destination.route) },
                icon = { icon(destination) },
                label = { Text(destination.label) },
                alwaysShowLabel = false
            )
        }
    }
}
