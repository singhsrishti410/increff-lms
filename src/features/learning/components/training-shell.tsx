"use client";

import React from "react";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import { useTraining } from "@/features/learning/hooks/use-training";
import { DemoBanner } from "@/features/learning/components/demo-banner";
import { TrainingPanel } from "@/features/learning/components/training-panel";
import { ModePicker } from "@/features/learning/components/mode-picker";
import { ScenarioPicker } from "@/features/learning/components/scenario-picker";
import { SummaryOverlay } from "@/features/learning/components/summary-overlay";
import { Quiz } from "@/features/learning/components/quiz";
import { TourFloatActions } from "@/features/learning/components/tour-float-actions";
import { GlossaryDrawer } from "@/features/learning/components/glossary-drawer";
import { TrainingProvider } from "@/providers/training-provider";

export function TrainingShell({ children }: { children: React.ReactNode }) {
  return (
    <TrainingProvider>
      <TrainingShellInner>{children}</TrainingShellInner>
    </TrainingProvider>
  );
}

function TrainingShellInner({ children }: { children: React.ReactNode }) {
  const { phase, config, mode, skipQuiz, completeQuiz, beginTour } = useTraining();
  const store = useTrainingStore();

  const handleModeContinue = (selectedMode: "watch" | "practice") => {
    store.setMode(selectedMode);
    store.selectScenario(config!.scenarios[0]);
    store.beginTour();
    setTimeout(() => beginTour(0), 100);
  };

  const handleScenarioSelect = (scenario: any) => {
    store.selectScenario(scenario);
    store.beginTour();
    setTimeout(() => beginTour(0), 100);
  };

  return (
    <>
      <DemoBanner />
      {children}
      <TrainingPanel />
      {phase === "mode-picker" && config && (
        <ModePicker
          config={config}
          onContinue={handleModeContinue}
          onCancel={() => store.reset()}
        />
      )}
      {phase === "scenario-picker" && config && (
        <ScenarioPicker
          scenarios={config.scenarios}
          onSelect={handleScenarioSelect}
          onCancel={() => store.reset()}
        />
      )}
      {phase === "summary" && config && (
        <SummaryOverlay
          config={config}
          onStartOver={() => {
            store.openModePicker(config);
          }}
          onContinueLearning={() => {
            skipQuiz();
            window.location.href = config.homeHref || "/";
          }}
          onTakeQuiz={() => store.showQuiz()}
        />
      )}
      {phase === "quiz" && config && (
        <Quiz quiz={config.quiz} onComplete={completeQuiz} />
      )}
      <TourFloatActions />
      <GlossaryDrawer />
    </>
  );
}
