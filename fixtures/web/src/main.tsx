import React from "react";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { PremiumSurface } from "./components/PremiumSurface";
import { PremiumAction } from "./components/PremiumAction";
import { CompactNavigation } from "./components/CompactNavigation";
import { GlassSurface } from "./components/GlassSurface";
import { AdaptiveSplit } from "./components/AdaptiveSplit";
import "./style.css";

function Fixture() {
  const [current, setCurrent] = useState("court");
  const [count, setCount] = useState(0);
  return <div className="app">
    <header><h1>LL-PES component fixture</h1><p>Brand-independent interaction and layout verification</p></header>
    <CompactNavigation
      items={[
        { id: "court", label: "Court", icon: <span>◉</span> },
        { id: "training", label: "Training", icon: <span>◆</span> },
        { id: "profile", label: "Profile", icon: <span>●</span> }
      ]}
      current={current}
      onSelect={setCurrent}
    />
    <AdaptiveSplit
      primary={<PremiumSurface tokens={{
        background: "#191c22", foreground: "#f9f9fb", border: "#40454d"
      }}>
        <h2>Action</h2>
        <p>Selected: <output data-testid="destination">{current}</output></p>
        <PremiumAction
          label="Record attempt"
          accent="#ff8a3d"
          onAccent="#121212"
          onClick={() => setCount(value => value + 1)}
        />
        <p>Attempts: <output data-testid="attempts">{count}</output></p>
      </PremiumSurface>}
      secondary={<GlassSurface tokens={{
        tint: "rgba(32,37,47,.78)", border: "rgba(255,255,255,.22)",
        foreground: "#fff", solidFallback: "#242936"
      }}>
        <h2>Details</h2><p>Visual glass fallback and adaptive detail panel.</p>
      </GlassSurface>}
    />
  </div>;
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><Fixture /></React.StrictMode>);
