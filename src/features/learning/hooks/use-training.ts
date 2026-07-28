"use client";

import { useCallback, useRef } from "react";
import type { TourStep } from "@/features/learning/types";
import { useTrainingStore } from "@/features/learning/stores/training-store";
import { useCheckpointStore } from "@/shared/stores/checkpoint-store";
import { applyValue, hasAnyValue, openModal } from "@/shared/lib/tour-utils";
import { useProgressStore } from "@/shared/stores/progress-store";
import type { TourConfig } from "@/features/learning/types";

let ShepherdModule: any = null;
/** Shared across all useTraining() callers (provider + panel + keyboard). */
let sharedTour: any = null;
let suppressCancelHandler = false;

export function getSharedTour() {
  return sharedTour;
}

function destroyTourQuietly() {
  if (!sharedTour) return;
  suppressCancelHandler = true;
  try {
    sharedTour.cancel();
  } catch {}
  sharedTour = null;
  suppressCancelHandler = false;
}

/** Prep DOM for a step: open only the modal that step needs; close others. */
export function prepareDomForStep(config: TourConfig, stepIndex: number): HTMLElement | null {
  const steps = config.steps || [];
  const step = steps[stepIndex] as any;
  if (!step) return null;

  for (let i = 0; i < stepIndex; i++) {
    const s = steps[i] as any;
    if (s?.switchTabOnNext) {
      const tabEl = document.querySelector(s.switchTabOnNext) as HTMLElement | null;
      if (tabEl) tabEl.click();
    }
  }

  const el = document.querySelector(step.element) as HTMLElement | null;
  const neededOverlay = (el?.closest(".modal-overlay") as HTMLElement | null) || null;

  // Always close product modals the current step does not live in
  document.querySelectorAll(".modal-overlay.open").forEach((node) => {
    if (neededOverlay && node === neededOverlay) return;
    node.classList.remove("open");
  });
  // Hard-close known tour modal when leaving it (belt + suspenders)
  if (!neededOverlay || neededOverlay.id !== "modal-select-orders") {
    const orders = document.getElementById("modal-select-orders");
    if (orders) orders.classList.remove("open");
  }

  if (neededOverlay?.id) {
    openModal(neededOverlay.id);
  }

  if (typeof step.onEnter === "function") {
    try {
      step.onEnter(useTrainingStore.getState().mode);
    } catch {}
  }

  return neededOverlay;
}

function waitForStepDom(overlay: HTMLElement | null, ms = 400): Promise<void> {
  if (overlay?.id) openModal(overlay.id);
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      if (!overlay) {
        requestAnimationFrame(() => setTimeout(resolve, 30));
        return;
      }
      if (overlay.classList.contains("open") || Date.now() - start > ms) {
        requestAnimationFrame(() => setTimeout(resolve, 30));
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

export function advanceTour() {
  const state = useTrainingStore.getState();
  const { config, currentStepIndex, mode } = state;
  if (!config || !sharedTour) return;
  const step = config.steps[currentStepIndex];
  if (!step) return;

  if (mode === "practice" && step.required && step.expected && step.expected.type !== "action") {
    if (!hasAnyValue(step.expected)) {
      const note = document.querySelector(".shepherd-text .train-practice-note") as HTMLElement | null;
      if (note) {
        note.style.outline = "2px solid #d03238";
        setTimeout(() => {
          note.style.outline = "";
        }, 600);
      }
      return;
    }
  }

  if (step.navigateTo) {
    if (step.navigateStorageKey) {
      sessionStorage.setItem(
        step.navigateStorageKey,
        JSON.stringify({
          resume: true,
          mode,
          scenario: state.selectedScenario,
          moduleId: config.moduleId,
        })
      );
    }
    useCheckpointStore.getState().clear();
    state.finish();
    destroyTourQuietly();
    window.location.href = step.navigateTo;
    return;
  }

  if (currentStepIndex >= config.steps.length - 1) {
    useCheckpointStore.getState().clear();
    destroyTourQuietly();
    state.showSummary();
    return;
  }

  if ((step as any).openModalOnNext) {
    openModal((step as any).openModalOnNext);
    setTimeout(() => {
      if (sharedTour) sharedTour.next();
    }, 120);
    return;
  }

  if ((step as any).switchTabOnNext) {
    const tabEl = document.querySelector((step as any).switchTabOnNext) as HTMLElement;
    if (tabEl) tabEl.click();
    setTimeout(() => {
      if (sharedTour) sharedTour.next();
    }, 80);
    return;
  }

  sharedTour.next();
}

export function useTraining() {
  const store = useTrainingStore();
  const checkpoint = useCheckpointStore();
  const progress = useProgressStore();
  const panelUpdaterRef = useRef<((index: number) => void) | null>(null);

  const setPanelUpdater = useCallback((fn: (index: number) => void) => {
    panelUpdaterRef.current = fn;
  }, []);

  const getShepherd = useCallback(async () => {
    if (!ShepherdModule) {
      const mod = await import("shepherd.js");
      await import("shepherd.js/dist/css/shepherd.css");
      ShepherdModule = mod.default;
    }
    return ShepherdModule;
  }, []);

  const tryAdvance = useCallback(() => {
    advanceTour();
  }, []);

  const showHint = useCallback(() => {
    const state = useTrainingStore.getState();
    const step = state.config?.steps[state.currentStepIndex];
    if (!step) return;
    const msg = (step as any).practicePrompt || (step as any).hint || "Check the coach tip on the highlighted field.";
    const el = document.getElementById("tp-feedback");
    if (el) {
      el.textContent = msg;
      el.className = "feedback-msg hint";
    }
  }, []);

  const showMe = useCallback(() => {
    const state = useTrainingStore.getState();
    const step = state.config?.steps[state.currentStepIndex];
    if (!step) return;
    applyValue(step.expected);
    if (typeof step.onWatchFill === "function") step.onWatchFill();
    const el = document.getElementById("tp-feedback");
    if (el) {
      el.textContent = "Filled for you. Review it, then Next or Enter.";
      el.className = "feedback-msg ok";
    }
  }, []);

  const closeTour = useCallback(() => {
    const state = useTrainingStore.getState();
    if (state.config && state.phase === "active" && state.selectedScenario) {
      checkpoint.save({
        pageKey: state.config.pageKey,
        moduleId: state.config.moduleId,
        stepIndex: state.currentStepIndex,
        mode: state.mode,
        scenario: state.selectedScenario,
        path: window.location.pathname,
        href: window.location.pathname + window.location.search,
        title: state.config.title,
      });
      store.pauseTour();
    }
    // Quiet destroy — avoid cancel handler fighting pause state / leftover overlay
    destroyTourQuietly();
  }, [checkpoint, store]);

  const beginTour = useCallback(
    async (startIndex = 0) => {
      const state = useTrainingStore.getState();
      const { config, mode, selectedScenario } = state;
      if (!config || !selectedScenario) return;

      const Shepherd = await getShepherd();
      destroyTourQuietly();

      const safeIndex = Math.max(0, Math.min(startIndex, config.steps.length - 1));

      const needed = prepareDomForStep(config, safeIndex);
      await waitForStepDom(needed);

      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        modalOverlayOpeningPadding: 6,
        modalOverlayOpeningRadius: 4,
        confirmCancel: false,
        exitOnEsc: true,
        keyboardNavigation: false,
        defaultStepOptions: {
          cancelIcon: { enabled: true },
          scrollTo: { behavior: "smooth", block: "center" },
          canClickTarget: true,
        },
      });

      tour.on("show", (event: any) => {
        const stepInstance = event?.step || tour.getCurrentStep?.();
        const id = stepInstance?.id || "";
        const match = String(id).match(/^step-(\d+)$/);
        const stepIdx = match ? parseInt(match[1], 10) : -1;
        if (stepIdx < 0) return;

        store.setStepIndex(stepIdx);
        const step = config.steps[stepIdx];
        if (!step) return;

        // Sync product modal with this step (open if needed, close otherwise)
        prepareDomForStep(config, stepIdx);

        checkpoint.save({
          pageKey: config.pageKey,
          moduleId: config.moduleId,
          stepIndex: stepIdx,
          mode: useTrainingStore.getState().mode,
          scenario: selectedScenario,
          path: window.location.pathname,
          href: window.location.pathname + window.location.search,
          title: config.title,
        });
        panelUpdaterRef.current?.(stepIdx);

        const feedback = document.getElementById("tp-feedback");
        if (feedback) {
          feedback.textContent = "";
          feedback.className = "feedback-msg";
        }

        setTimeout(() => {
          const el = document.querySelector(step.element) as HTMLElement | null;
          if (el && typeof el.focus === "function") el.focus();
        }, 50);

        if (mode === "watch") {
          applyValue(step.expected);
          if (typeof step.onWatchFill === "function") step.onWatchFill();
        }
      });

      tour.on("cancel", () => {
        if (suppressCancelHandler) {
          sharedTour = null;
          return;
        }
        const s = useTrainingStore.getState();
        if (s.phase === "active" && s.config && s.selectedScenario) {
          checkpoint.save({
            pageKey: s.config.pageKey,
            moduleId: s.config.moduleId,
            stepIndex: s.currentStepIndex,
            mode: s.mode,
            scenario: s.selectedScenario,
            path: window.location.pathname,
            href: window.location.pathname + window.location.search,
            title: s.config.title,
          });
          store.pauseTour();
        }
        sharedTour = null;
      });

      tour.on("complete", () => {
        checkpoint.clear();
        store.showSummary();
        sharedTour = null;
      });

      config.steps.forEach((step: TourStep, idx: number) => {
        const isLast = idx === config.steps.length - 1;
        tour.addStep({
          id: `step-${idx}`,
          text: buildStepDescription(step, mode, idx, config.steps.length),
          title: step.title,
          attachTo: {
            element: step.element,
            on: step.side || "bottom",
          },
          beforeShowPromise: () => {
            const overlay = prepareDomForStep(config, idx);
            return waitForStepDom(overlay);
          },
          buttons: [
            ...(idx > 0
              ? [
                  {
                    action: () => tour.back(),
                    classes: "shepherd-button-secondary",
                    text: "Back",
                  },
                ]
              : []),
            {
              action: () => advanceTour(),
              classes: "shepherd-button-primary",
              text: isLast ? "Finish" : "Next",
            },
          ],
        });
      });

      sharedTour = tour;
      store.setStepIndex(safeIndex);

      if (safeIndex > 0) {
        // Shepherd only calls setupModal() inside start(). start() also jumps to step 0.
        // For Continue demo we must set up the overlay, then show the checkpoint step.
        tour.setupModal();
        tour.show(`step-${safeIndex}`);
      } else {
        tour.start();
      }
    },
    [getShepherd, checkpoint, store]
  );

  const skipQuiz = useCallback(() => {
    if (!store.config) return;
    progress.markComplete(store.config.moduleId, { quizSkipped: true });
    store.finish();
  }, [store.config, progress, store.finish]);

  const completeQuiz = useCallback(
    (score: number, total: number) => {
      if (!store.config) return;
      progress.markComplete(store.config.moduleId, { quizScore: score, quizTotal: total });
      store.finish();
    },
    [store.config, progress, store.finish]
  );

  return {
    ...store,
    tryAdvance,
    beginTour,
    setPanelUpdater,
    tourRef: { current: sharedTour },
    skipQuiz,
    completeQuiz,
    showHint,
    showMe,
    closeTour,
  };
}

function buildStepDescription(step: TourStep, mode: "watch" | "practice", idx: number, total: number) {
  let html = `<span class="train-step-progress">Step ${idx + 1} of ${total}</span>`;
  html += `<div>${step.description}</div>`;
  if (step.commonMistakes) {
    html += `<div class="train-mistakes"><strong>Avoid:</strong> ${step.commonMistakes}</div>`;
  }
  if (mode === "practice" && step.required && step.expected?.type !== "action") {
    html += `<div class="train-practice-note">Required — enter any value, then <strong>Next</strong> or <strong>Enter</strong>.</div>`;
  } else if (mode === "practice" && step.expected?.type !== "action" && !step.required) {
    html += `<div class="train-practice-note">Optional — fill or skip with <strong>Next</strong> or <strong>Enter</strong>.</div>`;
  }
  return html;
}
