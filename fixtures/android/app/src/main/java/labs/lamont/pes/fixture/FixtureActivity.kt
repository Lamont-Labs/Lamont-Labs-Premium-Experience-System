package labs.lamont.pes.fixture

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import labs.lamont.pes.samples.CompactWorkspace
import labs.lamont.pes.samples.WorkspaceView
import labs.lamont.pes.samples.LowProfileNavigation
import labs.lamont.pes.samples.PremiumDestination
import labs.lamont.pes.samples.DisclosurePanel
import labs.lamont.pes.samples.PremiumAction
import labs.lamont.pes.samples.PremiumSurface

class FixtureActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                val count = remember { mutableIntStateOf(0) }
                val selected = remember { androidx.compose.runtime.mutableStateOf("court") }
                val workspaceView = remember { androidx.compose.runtime.mutableStateOf("overview") }
                PremiumSurface(
                    colors = labs.lamont.pes.samples.PremiumSurfaceColors(
                        background = Color(0xFF181A20),
                        border = Color(0xFF454951),
                        foreground = Color.White
                    ),
                    modifier = Modifier.padding(16.dp)
                ) {
                    Column {
                        Text("LL-PES Android component fixture")
                        LowProfileNavigation(
                            destinations = listOf(
                                PremiumDestination("court", "Court"),
                                PremiumDestination("training", "Training"),
                                PremiumDestination("profile", "Profile")
                            ),
                            currentRoute = selected.value,
                            onNavigate = { selected.value = it },
                            background = Color(0xFF181A20),
                            foreground = Color.White,
                            selectedBackground = Color(0xFF343943),
                            icon = { Text("•") }
                        )
                        CompactWorkspace(
                            title = "Workspace preview",
                            views = listOf(
                                WorkspaceView("overview", "Overview"),
                                WorkspaceView("history", "History"),
                                WorkspaceView("details", "Details")
                            ),
                            selectedId = workspaceView.value,
                            onSelect = { workspaceView.value = it },
                            background = Color(0xFF181A20),
                            foreground = Color.White,
                            selectedBackground = Color(0xFF343943),
                            summary = { Text("Focused content without stacked sections") }
                        ) { view -> Text("Selected view: ${view.label}") }
                        Text("Attempts: ${count.intValue}")
                        DisclosurePanel(title = "Additional information") {
                            Text("Optional evidence and advanced context.")
                        }
                        PremiumAction(
                            label = "Record attempt",
                            onClick = { count.intValue += 1 },
                            containerColor = Color(0xFFFF8A3D),
                            contentColor = Color.Black
                        )
                    }
                }
            }
        }
    }
}
