# AstroVitals

Your personal flight surgeon, wherever you fly

AstroVitals is a prototype for the [NASA Space Apps 2026 challenge](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/), created by team **Beni Mellal, Morocco**.

## Features

- Interactive body map and daily check-in for 10 indicators plus symptoms
- Color-coded health status and overall health score
- Radiation dose tracking against the 600 mSv career limit and bone-loss estimate
- Personal-baseline early warning, alerts, and flight-surgeon report
- Mars communication-delay autonomy guidance
- Health trends, quests, XP, and badges
- NASA HRP's five hazards
- English, French, and Arabic with right-to-left support
- CSV export and offline use

## Run locally

```sh
npm ci
npm run dev
npm run build
npx vite build -c vite.single.config.ts
```

## Project structure

- `src/App.tsx` — application layout, tabs, dashboards, and charts
- `src/BodyMap.tsx` — interactive body map
- `src/data.ts` — indicators, systems, missions, hazards, and quests
- `src/engine.ts` — health scoring, alerts, drift detection, and demo data
- `src/i18n.ts` — English, French, and Arabic interface strings
- `src/index.css` — application styles
- `src/main.tsx` — React entry point

## Sources

- [NASA HRP hazards](https://www.nasa.gov/hrp/hazards/)
- [NASA HRP risks](https://www.nasa.gov/hrp/risks/)
- NASA-STD-3001
- Mars Science Laboratory Radiation Assessment Detector (MSL RAD)

## Use of Super Intelligence (AI)

We used an AI coding assistant to speed up writing code, generating demo data and drafting translations. The team defined the concept, selected the indicators and thresholds, reviewed and tested every feature.

Live demo: https://moh2e.github.io/astrovitals/

Prototype for NASA Space Apps 2026. Not a medical device.
