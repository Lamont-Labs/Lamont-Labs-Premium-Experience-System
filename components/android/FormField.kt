package labs.lamont.pes.samples

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardOptions
import androidx.compose.ui.text.input.KeyboardType

/** Material text field with visible required, hint, and caller-owned validation states. */
@Composable
fun FormField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    hint: String? = null,
    error: String? = null,
    required: Boolean = false,
    enabled: Boolean = true,
    singleLine: Boolean = true,
    keyboardType: KeyboardType = KeyboardType.Text
) {
    val supportingMessage = error?.takeIf(String::isNotBlank)
        ?: hint?.takeIf(String::isNotBlank)
    val supportingContent: (@Composable () -> Unit)? = if (supportingMessage == null) {
        null
    } else {
        { Text(supportingMessage) }
    }

    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier.fillMaxWidth(),
        enabled = enabled,
        singleLine = singleLine,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        isError = !error.isNullOrBlank(),
        label = { Text(if (required) "$label (required)" else label) },
        supportingText = supportingContent
    )
}
