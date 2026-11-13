package labs.lamont.pes.samples

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.selection.selectable
import androidx.compose.ui.semantics.Role

/** Reusable compact view selector. This is not a navigation or routing framework. */
data class WorkspaceView(val id: String, val label: String)

@Composable
fun CompactWorkspace(
    title: String,
    views: List<WorkspaceView>,
    selectedId: String,
    onSelect: (String) -> Unit,
    background: Color,
    foreground: Color,
    selectedBackground: Color,
    modifier: Modifier = Modifier,
    summary: @Composable (() -> Unit)? = null,
    content: @Composable (WorkspaceView) -> Unit
) {
    require(views.isNotEmpty()) { "Workspace requires at least one view" }
    require(views.map { it.id }.distinct().size == views.size) { "Workspace view IDs must be unique" }
    val active = views.firstOrNull { it.id == selectedId } ?: views.first()
    Surface(
        modifier = modifier,
        shape = MaterialTheme.shapes.large,
        color = background,
        contentColor = foreground
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(title, style = MaterialTheme.typography.titleMedium)
            summary?.invoke()
            Row(
                modifier = Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                views.forEach { view ->
                    val isSelected = active.id == view.id
                    Surface(
                        shape = MaterialTheme.shapes.medium,
                        color = if (isSelected) selectedBackground else Color.Transparent
                    ) {
                        Text(
                            text = view.label,
                            modifier = Modifier
                                .widthIn(min = 64.dp)
                                .heightIn(min = 48.dp)
                                .selectable(
                                    selected = isSelected,
                                    role = Role.Tab,
                                    onClick = { if (!isSelected) onSelect(view.id) }
                                )
                                .padding(horizontal = 12.dp, vertical = 14.dp),
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                }
            }
            content(active)
        }
    }
}
