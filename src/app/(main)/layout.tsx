"use client";

import { Suspense } from "react";
import { TrainingProvider } from "@/providers/training-provider";
import { DemoBanner } from "@/features/learning/components/demo-banner";
import { TrainingPanel } from "@/features/learning/components/training-panel";
import { TourFloatActions } from "@/features/learning/components/tour-float-actions";
import { GlossaryDrawer } from "@/features/learning/components/glossary-drawer";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import { useCheckpointStore } from "@/shared/stores/checkpoint-store";
import { useTraining } from "@/features/learning/hooks/use-training";
import { ModePicker } from "@/features/learning/components/mode-picker";
import { ScenarioPicker } from "@/features/learning/components/scenario-picker";
import { SummaryOverlay } from "@/features/learning/components/summary-overlay";
import { Quiz } from "@/features/learning/components/quiz";

/** Product shell — same structure as original wms/*.html (no custom sidebar). */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <TrainingProvider>
        <MainLayoutInner>{children}</MainLayoutInner>
      </TrainingProvider>
    </Suspense>
  );
}

function MainLayoutInner({ children }: { children: React.ReactNode }) {
  const store = useTrainingStore();
  const training = useTraining();
  const { phase, config } = store;

  return (
    <div className="product-app min-h-screen bg-[var(--bg)]" style={{ paddingTop: 48 }}>
      <DemoBanner />

      {children}

      <TrainingPanel />

      {phase === "mode-picker" && config && (
        <ModePicker
          config={config}
          onContinue={(mode) => {
            store.setMode(mode);
            store.selectScenario(config.scenarios[0]);
            store.beginTour();
            setTimeout(() => training.beginTour(0), 100);
          }}
          onCancel={() => store.reset()}
        />
      )}
      {phase === "scenario-picker" && config && (
        <ScenarioPicker
          scenarios={config.scenarios}
          onSelect={(scenario) => {
            store.selectScenario(scenario);
            store.beginTour();
            setTimeout(() => training.beginTour(0), 100);
          }}
          onCancel={() => store.reset()}
        />
      )}
      {phase === "summary" && config && (
        <SummaryOverlay
          config={config}
          onStartOver={() => {
            useCheckpointStore.getState().clear();
            const pageKey = config.learningPageKey || config.pageKey;
            const href = config.learningModuleHref || config.pageHref || "/";
            // Prefer restarting from the module's first page (e.g. gate-entry list)
            if (typeof window !== "undefined" && window.location.pathname !== href && config.learningModuleHref) {
              sessionStorage.setItem("increff-tour-auto-continue", "start-over");
              sessionStorage.setItem(
                "increff-start-over-boot",
                JSON.stringify({ pageKey, mode: store.mode || "practice" })
              );
              window.location.href = href;
              return;
            }
            store.openModePicker(config);
          }}
          onContinueLearning={() => {
            training.skipQuiz(); // marks complete, then go learning path
            window.location.href = config.homeHref || "/";
          }}
          onTakeQuiz={() => store.showQuiz()}
        />
      )}
      {phase === "quiz" && config && (
        <Quiz quiz={config.quiz} onComplete={training.completeQuiz} />
      )}

      <TourFloatActions />
      <GlossaryDrawer />
    </div>
  );
}
