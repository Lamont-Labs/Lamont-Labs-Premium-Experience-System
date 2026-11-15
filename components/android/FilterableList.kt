package labs.lamont.pes.samples

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
    val keywords: List<String> = emptyList(),
    val filterValue: String? = null
)

data class FilterableListOption(val value: String, val label: String)
enum class FilterableListSortDirection { Ascending, Descending }

/** Searches, filters, sorts, and pages caller-provided items without a data service. */
@Composable
fun FilterableList(
    items: List<FilterableItem>,
    query: String,
    onQueryChange: (String) -> Unit,
    selectedId: String?,
    onSelect: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    emptyMessage: String = "No matching items.",
    filterOptions: List<FilterableListOption> = emptyList(),
    activeFilter: String = "all",
    onFilterChange: ((String) -> Unit)? = null,
    sortDirection: FilterableListSortDirection? = null,
    onSortDirectionChange: ((FilterableListSortDirection) -> Unit)? = null,
    page: Int = 1,
    pageSize: Int = 0,
    onPageChange: ((Int) -> Unit)? = null
) {
    val normalizedQuery = query.trim().lowercase(java.util.Locale.ROOT)
    val matchingItems = items.filter { item ->
        (activeFilter == "all" || item.filterValue == activeFilter) &&
        listOf(item.label, item.description.orEmpty(), *item.keywords.toTypedArray())
            .joinToString(" ")
            .lowercase(java.util.Locale.ROOT)
            .contains(normalizedQuery)
    }.let { filtered ->
        when (sortDirection) {
            FilterableListSortDirection.Ascending ->
                filtered.sortedWith(compareBy<FilterableItem> { it.label.lowercase(java.util.Locale.ROOT) }.thenBy { it.id })
            FilterableListSortDirection.Descending ->
                filtered.sortedWith(compareByDescending<FilterableItem> { it.label.lowercase(java.util.Locale.ROOT) }.thenBy { it.id })
            null -> filtered
        }
    }
    val paginationEnabled = pageSize > 0 && onPageChange != null
    val pageCount = if (paginationEnabled) (matchingItems.size + pageSize - 1) / pageSize else 1
    val currentPage = page.coerceIn(1, pageCount.coerceAtLeast(1))
    val visibleItems = if (paginationEnabled) {
        matchingItems.drop((currentPage - 1) * pageSize).take(pageSize)
    } else {
        matchingItems
    }
    Column(modifier = modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedTextField(
            value = query,
            onValueChange = {
                onQueryChange(it)
                onPageChange?.invoke(1)
            },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Search $label") },
            singleLine = true
        )
        if (filterOptions.isNotEmpty() && onFilterChange != null) {
            Row(
                modifier = Modifier.horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = activeFilter == "all",
                    onClick = { onFilterChange("all"); onPageChange?.invoke(1) },
                    label = { Text("All") }
                )
                filterOptions.forEach { option ->
                    FilterChip(
                        selected = activeFilter == option.value,
                        onClick = { onFilterChange(option.value); onPageChange?.invoke(1) },
                        label = { Text(option.label) }
                    )
                }
            }
        }
        if (sortDirection != null && onSortDirectionChange != null) {
            TextButton(
                onClick = {
                    onSortDirectionChange(
                        if (sortDirection == FilterableListSortDirection.Descending) {
                            FilterableListSortDirection.Ascending
                        } else {
                            FilterableListSortDirection.Descending
                        }
                    )
                    onPageChange?.invoke(1)
                }
            ) {
                Text(if (sortDirection == FilterableListSortDirection.Descending) "Sort: Z–A" else "Sort: A–Z")
            }
        }
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
            text = "${matchingItems.size} ${if (matchingItems.size == 1) "item" else "items"}",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite }
        )
        if (paginationEnabled && pageCount > 1) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                TextButton(
                    enabled = currentPage > 1,
                    onClick = { onPageChange?.invoke(currentPage - 1) }
                ) { Text("Previous") }
                Text(
                    text = "Page $currentPage of $pageCount",
                    modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite }
                )
                TextButton(
                    enabled = currentPage < pageCount,
                    onClick = { onPageChange?.invoke(currentPage + 1) }
                ) { Text("Next") }
            }
        }
    }
}
