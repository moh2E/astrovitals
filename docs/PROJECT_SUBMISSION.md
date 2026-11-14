# NASA Space Apps 2026: Project Page Text (copy/paste, English required)

## Project Name
AstroVitals: Your personal flight surgeon, wherever you fly

## High-Level Project Summary
AstroVitals is a web app that helps astronauts monitor their own health and know what to do next, even when Earth is 22 minutes away.
In a one-minute daily check-in, the crew member logs 10 indicators (heart rate, blood pressure, blood oxygen, blood sugar, temperature, sleep, mood, exercise, water, radiation dose) and any symptoms.
AstroVitals turns them into a color-coded body map of 8 body systems, a 0-100 health score and clear actions: "measure again", "do a resistance session", "talk to the flight surgeon".
It adapts to the mission (Space Station, Moon base, Mars transit, Mars surface): gravity drives the bone-loss estimate, radiation drives the cumulative dose against NASA's 600 mSv career limit, and the communication delay decides when the crew must act on their own.
A personal-baseline early warning detects when an indicator drifts away from the astronaut's own normal before it turns red.
This matters because on missions to Mars, health becomes one of the main risks and crews need medical autonomy. The app works offline and in English, French and Arabic.

## Link to Project Demo
<slides or video link>

## Link to Final Project
<GitHub Pages link>  |  Code: <GitHub repo link>

## Detailed Project Description
**What it does**
- **Interactive body map:** brain/mood, eyes (SANS), heart, lungs, immune system, metabolism, bones and muscles, cells/radiation. Tap a system to see its status, how space affects it and the related indicators.
- **Daily check-in:** sliders for 10 indicators and 6 symptoms (blurred vision, headache, dizziness, rash, back pain, nausea). Each indicator includes a "how to measure" tip.
- **Evaluation engine:** each indicator is green / yellow / red, with an action for each status. Indicators, symptoms, bone loss and radiation combine into 8 system statuses and a health score.
- **Mission-aware risk:** estimated hip bone loss (~1-1.5% per month in microgravity, scaled by gravity) and cumulative radiation dose vs the 600 mSv career limit (NASA-STD-3001).
- **Personal-baseline early warning:** compares the last 3 days with the astronaut's own 14-day baseline and warns when a value drifts (z ≥ 2), even if it is still "in range".
- **Alerts and autonomy:** alerts with actions and a report to the flight surgeon. When the signal delay is minutes long (Mars), the app tells the crew to follow the on-board protocol first.
- **Trends:** charts for every indicator with the safe zone shaded.
- **Motivation:** daily health quests (resistance exercise, sleep, hydration), XP, levels, streaks and badges. Astronauts must exercise about 2 hours a day, and isolation makes motivation hard.
- **Learn:** NASA Human Research Program's 5 hazards of human spaceflight.
- **Data:** CSV export for the flight surgeon. Data stays on the device.

**How it works:** React + TypeScript + Vite, Recharts for charts, hand-made SVG body map, no backend (localStorage), fully offline, single HTML file build. Realistic demo data (45 days per mission) lets judges explore immediately.

**Benefits:** earlier detection, faster decisions with no ground contact, better exercise and sleep habits, and one simple view of the hazards NASA studies.
The same tool can help people far from doctors on Earth: remote villages in the Atlas mountains, ships and polar stations.

**Why it is different:** one view links daily indicators to the 5 NASA HRP hazards. The risk model adapts to the mission. Each astronaut is compared with their own baseline, not just population ranges. The app is trilingual, including full right-to-left Arabic, for international crews.

**Next steps:** connect wearables (Bluetooth heart rate, pulse oximeter), validate thresholds with physicians, add a crew/flight-surgeon dashboard, encrypt data.

## Space Agency Data
- NASA Human Research Program: Five Hazards of Human Spaceflight (https://www.nasa.gov/hrp/hazards/), the source of the hazards and their health effects.
- NASA Human Research Program: Human System Risks (https://www.nasa.gov/hrp/risks/), the source of the systems at risk (bone, cardiovascular, SANS, behavioral health, immune).
- NASA-STD-3001: 600 mSv career radiation limit.
- MSL RAD (Curiosity) measurements, the source of the Mars transit and surface dose rates. Chang'e-4 LND for the lunar surface dose.
- CSA: Monitoring Radiation for Astronaut Health (challenge resource).

## References
React, Vite, TypeScript, Recharts, vite-plugin-singlefile (MIT licenses). Zeitlin et al., Science 2013 (MSL RAD). Zhang et al., Science Advances 2020 (Chang'e-4 LND). Medical reference ranges from public clinical guidelines (blood pressure, glucose, SpO₂, temperature). All icons are Unicode emoji. No copyrighted images.

## Use of Super Intelligence (SI)
We used an AI coding assistant to speed up writing the React/TypeScript code, generating demo data and drafting translations. Our team defined the concept, selected the indicators and thresholds, designed the body-map interaction, and reviewed and tested every feature.

## Tags
#astronaut-health #human-research-program #mars #health-monitoring #react #morocco #arabic
