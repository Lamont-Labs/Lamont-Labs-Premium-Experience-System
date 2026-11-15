package labs.lamont.pes.samples

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

data class FormValidationIssue(
    val fieldId: String,
    val label: String,
    val message: String
)

/**
 * Announces submitted form errors and lets the caller move focus to an invalid field.
 * The caller owns validation rules, field identity, and focus behavior.
 */
@Composable
fun FormValidationSummary(
    errors: List<FormValidationIssue>,
    onErrorClick: (FormValidationIssue) -> Unit,
    modifier: Modifier = Modifier,
    title: String = "Please review these fields"
) {
    if (errors.isEmpty()) return

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .semantics { liveRegion = LiveRegionMode.Assertive },
        shape = MaterialTheme.shapes.medium,
        color = MaterialTheme.colorScheme.errorContainer,
        contentColor = MaterialTheme.colorScheme.onErrorContainer,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            MaterialTheme.colorScheme.error
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(title, style = MaterialTheme.typography.titleSmall)
            errors.forEach { error ->
                Text(
                    text = "${error.label}: ${error.message}",
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(role = Role.Button) { onErrorClick(error) }
                        .padding(vertical = 4.dp),
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }
    }
}
