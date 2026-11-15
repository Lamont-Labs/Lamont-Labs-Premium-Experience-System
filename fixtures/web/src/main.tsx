import React from "react";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { PremiumSurface } from "./components/PremiumSurface";
import { PremiumAction } from "./components/PremiumAction";
import { CompactNavigation } from "./components/CompactNavigation";
import { GlassSurface } from "./components/GlassSurface";
import { AdaptiveSplit } from "./components/AdaptiveSplit";
import { DisclosurePanel } from "./components/DisclosurePanel";
import { WorkspaceShell } from "./components/WorkspaceShell";
import { MetricStrip } from "./components/MetricStrip";
import { FeedbackState, type FeedbackKind } from "./components/FeedbackState";
import { FormField } from "./components/FormField";
import { FormValidationSummary } from "./components/FormValidationSummary";
import "./style.css";

const feedbackContent: Record<FeedbackKind, { title: string; description: string }> = {
  loading: { title: "Loading saved sessions", description: "Your local workspace is being prepared." },
  empty: { title: "No sessions yet", description: "Create a session to see it in this workspace." },
  success: { title: "Session is ready", description: "Your local session can now be reviewed." },
  error: { title: "Session could not be opened", description: "Try again or keep working with your saved copy." },
  offline: { title: "You are offline", description: "Previously saved information remains available." },
};

function Fixture() {
  const [current, setCurrent] = useState("court");
  const [count, setCount] = useState(0);
  const [workspaceView, setWorkspaceView] = useState("overview");
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>("empty");
  const [email, setEmail] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const emailError = formSubmitted && !email.includes("@") ? "Enter a valid email address." : undefined;
  return <div className="app" data-pes-theme="dark">
    <header><h1>LL-PES component fixture</h1><p>Brand-independent interaction and layout verification</p></header>
    <CompactNavigation
      items={[
        { id: "court", label: "Court", icon: <span>◉</span> },
        { id: "training", label: "Training", icon: <span>◆</span> },
        { id: "profile", label: "Profile", icon: <span>●</span> },
        { id: "library", label: "Library", icon: <span>▣</span> },
        { id: "stats", label: "Stats", icon: <span>▥</span> },
        { id: "settings", label: "Settings", icon: <span>⚙</span> }
      ]}
      current={current}
      onSelect={setCurrent}
    />
    <MetricStrip label="Fixture metrics" metrics={[
      { id: "attempts", label: "Recorded attempts", value: <output data-testid="metric-attempts">{count}</output>, detail: "Current fixture session" },
      { id: "destination", label: "Selected destination", value: current, detail: "Navigation state" }
    ]} />
    <section className="feedback-demo" aria-labelledby="feedback-demo-title">
      <h2 id="feedback-demo-title">Feedback states</h2>
      <div className="feedback-demo__choices" role="group" aria-label="Choose a feedback state">
        {(["loading", "empty", "success", "error", "offline"] as const).map(kind => (
          <button
            key={kind}
            type="button"
            aria-pressed={feedbackKind === kind}
            onClick={() => setFeedbackKind(kind)}
          >
            {kind[0].toUpperCase() + kind.slice(1)}
          </button>
        ))}
      </div>
      <FeedbackState
        kind={feedbackKind}
        title={feedbackContent[feedbackKind].title}
        description={feedbackContent[feedbackKind].description}
        actionLabel={["empty", "error", "offline"].includes(feedbackKind) ? "Show recovery" : undefined}
        onAction={() => setFeedbackKind("success")}
      />
    </section>
    <section className="form-demo" aria-labelledby="form-demo-title">
      <h2 id="form-demo-title">Local form patterns</h2>
      <form noValidate onSubmit={event => { event.preventDefault(); setFormSubmitted(true); }}>
        <FormValidationSummary
          errors={emailError ? [{ fieldId: "fixture-email", label: "Email", message: emailError }] : []}
        />
        <FormField
          id="fixture-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          required
          hint="Validation and saved state belong to the calling app."
          error={emailError}
        />
        <button className="form-demo__submit" type="submit">Save locally</button>
        {formSubmitted && !emailError && <p role="status">Saved locally.</p>}
      </form>
    </section>
    <WorkspaceShell
      title="Workspace preview"
      summary="Focused content without a long stack of sections"
      tabs={[
        { id: "overview", label: "Overview", content: <p>Session overview content</p> },
        { id: "history", label: "History", content: <p>History content</p> },
        { id: "details", label: "Details", content: <p>Details content</p> }
      ]}
      activeTab={workspaceView}
      onTabChange={setWorkspaceView}
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
        <DisclosurePanel title="Additional information"><p>Optional evidence and advanced context.</p></DisclosurePanel>
      </GlassSurface>}
    />
  </div>;
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><Fixture /></React.StrictMode>);
