package labs.lamont.pes.samples

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.selectable
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

data class FilterableItem(
    val id: String,
    val label: String,
    val description: String? = null,
    val keywords: List<String> = emptyList()
)

/** Locally filters caller-provided items; query and selection state remain caller-owned. */
@Composable
fun FilterableList(
    items: List<FilterableItem>,
    query: String,
    onQueryChange: (String) -> Unit,
    selectedId: String?,
    onSelect: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    emptyMessage: String = "No matching items."
) {
    val normalizedQuery = query.trim().lowercase(java.util.Locale.ROOT)
    val visibleItems = items.filter { item ->
        listOf(item.label, item.description.orEmpty(), *item.keywords.toTypedArray())
            .joinToString(" ")
            .lowercase(java.util.Locale.ROOT)
            .contains(normalizedQuery)
    }

    Column(modifier = modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedTextField(
            value = query,
            onValueChange = onQueryChange,
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Search $label") },
            singleLine = true
        )
        Text(label, style = MaterialTheme.typography.titleSmall)
        if (visibleItems.isEmpty()) {
            Text(emptyMessage, color = MaterialTheme.colorScheme.onSurfaceVariant)
        } else {
            visibleItems.forEach { item ->
                val selected = selectedId == item.id
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .selectable(
                            selected = selected,
                            role = Role.RadioButton,
                            onClick = { if (!selected) onSelect(item.id) }
                        )
                        .padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(selected = selected, onClick = null)
                    Column(modifier = Modifier.padding(start = 8.dp)) {
                        Text(item.label)
                        item.description?.let {
                            Text(it, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }
        Text(
            text = "${visibleItems.size} ${if (visibleItems.size == 1) "item" else "items"}",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite }
        )
    }
}
