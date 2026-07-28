# Increff LMS (Training Sandbox)

Interactive **Watch / Practice** training for Increff **WMS** and **OMS** screens. Learners walk through real warehouse flows with guided tours, scenarios, quizzes, and progress tracking — using demo data only.

**Repo:** [singhsrishti410/increff-lms](https://github.com/singhsrishti410/increff-lms)

## What it does

- Product-like WMS / OMS UI (Gate Entry → Handover, plus Fulfillment Locations)
- **Watch** mode: highlights and auto-fills fields
- **Practice** mode: learner enters values (required fields enforced)
- Scenario picker where a module has branches (e.g. GRN **QC Pass** / **QC Fail**)
- Path pickers for B2C Picking and B2C Packing sub-modules
- Shepherd.js coachmarks, Enter = Next, glossary, quiz + summary
- Learning path from the dashboard with continue chain across modules

## Learning modules

| # | Module | Track |
|---|--------|--------|
| 1 | Gate Entry | WMS |
| 2 | Receive Inward Boxes | WMS |
| 3 | GRN | WMS |
| 4 | Put Away | WMS |
| 5 | Piece Pick Pending | WMS |
| 6 | Piece Pick Item | WMS |
| 7 | Piece Packing | WMS |
| 8 | Manifest | WMS |
| 9 | Handover | WMS |
| 10 | Fulfillment Locations | OMS |

Landing page: `/` · each module opens Watch/Practice on entry.

## Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS**
- **Zustand** (training / progress / checkpoint)
- **Shepherd.js** (tour overlays)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve production build
npm run lint
```

## Project layout (high level)

```
src/
  app/                  # routes (dashboard, WMS/OMS pages)
  features/
    learning/           # tour engine, pickers, panel, quiz
    wms/                # WMS tour configs (inward, B2C)
    oms/                # OMS tour configs
  providers/            # TrainingProvider (auto mode picker on module entry)
  shared/               # curriculum, learning path, side nav, stores
```

Tour configs live under `src/features/wms/**/tour-config.ts` and `src/features/oms/**/tour-config.ts`.

## Training UX notes

- Entering a module (sidebar, Next links, or dashboard) opens **How do you want to learn?**
- Modules with multiple scenarios show **Pick a scenario** next
- **Enter** advances the current tour step (same as Next)
- Progress and checkpoints are stored in the browser (local/session storage)

## License

Private training sandbox — demo data only.
