package labs.lamont.pes.fixture

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.material3.Button
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import labs.lamont.pes.samples.MetricStrip
import labs.lamont.pes.samples.PremiumMetric
import labs.lamont.pes.samples.CompactWorkspace
import labs.lamont.pes.samples.WorkspaceView
import labs.lamont.pes.samples.LowProfileNavigation
import labs.lamont.pes.samples.PremiumDestination
import labs.lamont.pes.samples.DisclosurePanel
import labs.lamont.pes.samples.PremiumAction
import labs.lamont.pes.samples.PremiumSurface
import labs.lamont.pes.samples.FeedbackKind
import labs.lamont.pes.samples.FeedbackState
import labs.lamont.pes.samples.FormField
import labs.lamont.pes.samples.FormValidationIssue
import labs.lamont.pes.samples.FormValidationSummary
import labs.lamont.pes.samples.FilterableItem
import labs.lamont.pes.samples.FilterableList
import labs.lamont.pes.samples.PremiumExperienceTheme

class FixtureActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PremiumExperienceTheme {
                val count = remember { mutableIntStateOf(0) }
                val selected = remember { androidx.compose.runtime.mutableStateOf("court") }
                val workspaceView = remember { androidx.compose.runtime.mutableStateOf("overview") }
                val feedbackKind = remember { androidx.compose.runtime.mutableStateOf(FeedbackKind.Empty) }
                val email = remember { androidx.compose.runtime.mutableStateOf("") }
                val showEmailError = remember { androidx.compose.runtime.mutableStateOf(false) }
                val emailFocusRequester = remember { FocusRequester() }
                val sessionQuery = remember { androidx.compose.runtime.mutableStateOf("") }
                val selectedSession = remember { androidx.compose.runtime.mutableStateOf("court-session") }
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
                        MetricStrip(
                            metrics = listOf(
                                PremiumMetric("attempts", "Recorded attempts", count.intValue.toString(), "Current fixture session"),
                                PremiumMetric("destination", "Selected destination", selected.value, "Navigation state")
                            ),
                            background = Color(0xFF242833),
                            foreground = Color.White
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
                        FeedbackState(
                            kind = feedbackKind.value,
                            title = if (feedbackKind.value == FeedbackKind.Success) "Session is ready" else "No sessions yet",
                            description = "Feedback is rendered locally; loading and recovery behavior belong to the caller.",
                            actionLabel = if (feedbackKind.value == FeedbackKind.Empty) "Show success" else null,
                            onAction = { feedbackKind.value = FeedbackKind.Success }
                        )
                        FormField(
                            value = email.value,
                            onValueChange = { email.value = it },
                            label = "Email",
                            hint = "Validation is supplied by the calling app.",
                            required = true,
                            error = if (showEmailError.value) "Enter an email address." else null,
                            modifier = Modifier.focusRequester(emailFocusRequester)
                        )
                        FormValidationSummary(
                            errors = if (showEmailError.value) {
                                listOf(FormValidationIssue("email", "Email", "Enter an email address."))
                            } else {
                                emptyList()
                            },
                            onErrorClick = { emailFocusRequester.requestFocus() }
                        )
                        Button(onClick = { showEmailError.value = email.value.isBlank() }) {
                            Text("Validate form")
                        }
                        FilterableList(
                            items = listOf(
                                FilterableItem("court-session", "Court session", "Recent practice", listOf("training")),
                                FilterableItem("review-session", "Review session", "Needs review", listOf("video")),
                                FilterableItem("planning-session", "Planning session", "Draft plan", listOf("schedule"))
                            ),
                            query = sessionQuery.value,
                            onQueryChange = { sessionQuery.value = it },
                            selectedId = selectedSession.value,
                            onSelect = { selectedSession.value = it },
                            label = "Saved sessions"
                        )
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
