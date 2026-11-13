package labs.lamont.pes.samples

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

/** Caller-owned, read-only values. No network, persistence, or synthetic metrics. */
data class PremiumMetric(
    val id: String,
    val label: String,
    val value: String,
    val detail: String? = null
)

@Composable
fun MetricStrip(
    metrics: List<PremiumMetric>,
    background: Color,
    foreground: Color,
    modifier: Modifier = Modifier
) {
    require(metrics.map { it.id }.distinct().size == metrics.size) {
        "Metric IDs must be unique"
    }
    Column(modifier = modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        metrics.chunked(2).forEach { pair ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                pair.forEach { metric ->
                    Surface(
                        modifier = Modifier.weight(1f),
                        shape = MaterialTheme.shapes.medium,
                        color = background,
                        contentColor = foreground
                    ) {
                        Column(
                            modifier = Modifier.padding(12.dp),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(metric.label, style = MaterialTheme.typography.labelMedium)
                            Text(metric.value, style = MaterialTheme.typography.titleMedium)
                            metric.detail?.let {
                                Text(it, style = MaterialTheme.typography.bodySmall)
                            }
                        }
                    }
                }
                if (pair.size == 1) {
                    androidx.compose.foundation.layout.Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}
