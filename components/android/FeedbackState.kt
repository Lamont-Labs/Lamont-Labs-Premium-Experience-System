package labs.lamont.pes.samples

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp

enum class FeedbackKind(val label: String) {
    Loading("Loading"),
    Empty("No results"),
    Success("Complete"),
    Error("Something went wrong"),
    Offline("Offline")
}

/** Local feedback state. Data loading and retry behavior remain caller-owned. */
@Composable
fun FeedbackState(
    kind: FeedbackKind,
    title: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    actionLabel: String? = null,
    onAction: (() -> Unit)? = null
) {
    val colors = MaterialTheme.colorScheme
    val containerColor = when (kind) {
        FeedbackKind.Error -> colors.errorContainer
        FeedbackKind.Success -> colors.tertiaryContainer
        else -> colors.surfaceVariant
    }
    val contentColor = when (kind) {
        FeedbackKind.Error -> colors.onErrorContainer
        FeedbackKind.Success -> colors.onTertiaryContainer
        else -> colors.onSurfaceVariant
    }
    val liveRegion = if (kind == FeedbackKind.Error) LiveRegionMode.Assertive else LiveRegionMode.Polite

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .semantics {
                this.liveRegion = liveRegion
                stateDescription = kind.label
            },
        color = containerColor,
        contentColor = contentColor,
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(1.dp, colors.outlineVariant)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (kind == FeedbackKind.Loading) {
                    CircularProgressIndicator(
                        modifier = Modifier
                            .padding(end = 10.dp)
                            .size(18.dp)
                            .semantics { stateDescription = "Loading" },
                        color = contentColor,
                        strokeWidth = 2.dp
                    )
                }
                Text(kind.label, style = MaterialTheme.typography.labelMedium)
            }
            Text(title, style = MaterialTheme.typography.titleMedium)
            if (!description.isNullOrBlank()) {
                Text(description, style = MaterialTheme.typography.bodyMedium)
            }
            if (!actionLabel.isNullOrBlank() && onAction != null) {
                Button(onClick = onAction) {
                    Text(actionLabel)
                }
            }
        }
    }
}
