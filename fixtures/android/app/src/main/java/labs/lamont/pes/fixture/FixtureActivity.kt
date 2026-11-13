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
import labs.lamont.pes.samples.PremiumAction
import labs.lamont.pes.samples.PremiumSurface

class FixtureActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                val count = remember { mutableIntStateOf(0) }
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
                        Text("Attempts: ${count.intValue}")
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
