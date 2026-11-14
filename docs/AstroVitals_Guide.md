# AstroVitals: دليل الفريق (Prompt + أجوبة لجنة التحكيم)

## 0) قاعدة مهمة قبل كل شيء

قوانين Space Apps 2026 (صفحة Participant FAQs) **كتسمح** باستعمال الذكاء الاصطناعي، اللي كيسميوه "Super Intelligence (SI)":

> "Participants may use SI tools to accelerate innovation... Each team's project submission must include a description of how SI tools were used."

يعني **ضروري** تكتبو فصفحة المشروع كيفاش استعملتو الـ AI. وملي كتسلمو المشروع كتأكدو بعلامة (checkbox) أن المشروع ديالكم وأن جميع المصادر مذكورة.
=> إخفاء استعمال الـ AI **مخالف للقوانين** وممكن يقصيكم. ولكن التصريح به **ما كينقصش النقط**، حيت بزاف ديال الفرق كيستعملوه.

اللي كيربّح ماشي "واش استعملتي AI"، بل:
1. **واش كتفهم المشروع مزيان** وكتجاوب بثقة.
2. **القرارات ديالكم**: علاش اخترتو هاد المؤشرات، علاش هاد الألوان، علاش ثلاث لغات.
3. **معايير التحكيم**: Impact، Creativity، Validity، Presentation (كل معيار من 1 إلى 5).

---

## 1) Prompt احترافي (بالإنجليزية، حطّوه فأي أداة AI)

```
You are a senior full-stack engineer and UX designer helping a student team
from Beni Mellal, Morocco, compete in the NASA Space Apps Challenge 2026.

CHALLENGE: "Create Health Monitoring Software for Astronauts on Space Missions"
https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/
Goal: software that gathers astronaut health indicators and helps astronauts
evaluate and act on their health status, with interactive visualizations,
color coding, dynamic charts, reminders and instructions.

BUILD: "AstroVitals - your personal flight surgeon, wherever you fly"
Stack: React 18 + TypeScript + Vite, Recharts, no backend, localStorage.

FEATURES (must all work):
1. Mission selector: ISS (LEO), Artemis Moon base, Mars transit, Mars surface.
   Each mission has gravity (g), radiation dose per day (mSv), and one-way
   communication delay to Earth.
2. Interactive SVG astronaut body map with clickable systems: brain/mood,
   eyes (SANS), heart, lungs, immune, metabolism, bones & muscles,
   cells/radiation. Each hotspot is green / yellow / red / grey.
3. Daily check-in (sliders + numeric input): resting heart rate, systolic and
   diastolic blood pressure, SpO2, fasting blood sugar, body temperature,
   sleep hours, mood 1-5, exercise minutes, water intake, radiation dose,
   plus symptoms (blurred vision, headache, dizziness, rash, back pain, nausea).
4. Rules engine: each indicator has a green band and yellow/red thresholds,
   a "how to measure" tip and an action for each status. Combine indicators
   into system status, a 0-100 health score, cumulative radiation vs a
   600 mSv career limit, and estimated bone loss (~1-1.5%/month in 0 g,
   scaled by mission gravity).
5. Alerts panel with actions + "send report to flight surgeon". When comms
   delay is large (Mars), tell the crew to follow the on-board protocol first.
6. Trend charts per indicator with the safe zone shaded.
7. Motivation: daily quests (resistance exercise, sleep, hydration), XP,
   levels, streaks, badges, reminders.
8. Learn tab: NASA Human Research Program's 5 hazards (radiation, isolation,
   distance from Earth, gravity fields, hostile/closed environments).
9. Languages: English, French, Arabic (full RTL).
10. Export CSV, reset demo data, 45 days of realistic demo data per mission.
11. Footer: "Prototype, not a medical device" + sources (NASA HRP, NASA-STD-3001).

QUALITY: dark space theme, responsive, accessible (keyboard, contrast),
no console errors, clean typed code split into data / engine / UI files.
Explain every file you create so the team understands it.
```

**باش يبان المشروع ديالكم وتكون عندكم بصمة حقيقية**، زيدو حاجة من عندكم (اختارو 1 أو 2):
- سولو طبيب أو طالب طب فبني ملال على الحدود ديال المؤشرات، وكتبو "Validated with Dr. X".
- زيدو مؤشر خاص بكم، مثلا "Hydration in Mars dust" أو "Ramadan / fasting mode" ديال رائد فضاء صائم (فكرة جديدة ومغربية).
- بدلو اسم الرائد والقصة: "Cmdr. Amina from Beni Mellal on the way to Mars".
- صورو بأنفسكم الفيديو والصوت ديالكم (الدارجة مسموحة مع ترجمة إنجليزية).
- كل عضو فالفريق كيكون مسؤول على جزء ويقدر يشرحو (انظر القسم 3).

---

## 2) نص التصريح باستعمال AI (حطّوه فصفحة المشروع)

> **Use of Super Intelligence (SI):** We used an AI coding assistant to speed up
> writing the React/TypeScript code, generating demo data and drafting translations.
> Our team defined the concept, chose the health indicators and thresholds from
> NASA HRP and NASA-STD-3001, designed the body-map interaction and the Moroccan
> trilingual angle, reviewed and tested every feature, and corrected the Arabic
> and French texts. All design decisions and the final content were made by our team.

(كتبو غير الحاجات اللي درتوها فعلا.)

---

## 3) شكون كيشرح شنو (توزيع الأدوار)

| العضو | الجزء | الملف |
|---|---|---|
| 1 | الفكرة والمشكل + معطيات ناسا (المخاطر الخمسة) | `src/data.ts` (hazards) |
| 2 | المؤشرات والحدود (أخضر/أصفر/أحمر) | `src/data.ts` (indicators) |
| 3 | محرك التقييم: score، الإشعاع، فقدان العظام | `src/engine.ts` |
| 4 | الواجهة: الجسم التفاعلي، الرسوم، اللغات | `src/BodyMap.tsx`, `src/App.tsx`, `src/i18n.ts` |

---

## 4) العرض أمام اللجنة (3 دقائق)

1. **المشكل (30 ث):** "فالمريخ، الرسالة كتوصل للأرض فـ 3 حتى 22 دقيقة. يلا وقع مشكل صحي، الرائد خاصو يقرر بوحدو."
2. **الحل (20 ث):** "AstroVitals هو طبيب الطيران الشخصي ديال الرائد: فحص يومي فدقيقة واحدة، وتقييم بالألوان، وشنو يدير دابا."
3. **Demo (90 ث):** اختار Mars transit ← اضغط على العظام (أصفر) ← Daily check-in: دخّل ضغط 150 ← كيولي أحمر وكيظهر التنبيه ← Trends ← بدّل للعربية.
4. **العلم (20 ث):** "مبني على المخاطر الخمسة ديال NASA HRP، وفقدان العظام 1 حتى 1.5% فالشهر، وحد الإشعاع 600 mSv."
5. **الأثر (20 ث):** "نفس التطبيق ينفع على الأرض: مناطق معزولة فالأطلس، والبحارة، والقواعد فالقطب."

---

## 5) الأسئلة المتوقعة والأجوبة

**Q1. Why did you choose this challenge? / علاش اخترتو هاد التحدي؟**
"Because health is the #1 limit for long missions to Mars. With 20-minute delays, astronauts need autonomy. And the same tool helps remote areas in Morocco."

**Q2. Where does your data come from? / منين جات المعطيات؟**
"The thresholds come from public medical ranges and NASA-STD-3001. The hazards come from NASA HRP. The demo uses simulated data because real astronaut medical data is private. In a real mission it would connect to wearables (smartwatch, pulse oximeter)."

**Q3. How do you calculate the health score?**
"Each indicator is green, yellow or red. Green gives full points, yellow loses some, red loses more. We also subtract for symptoms, high radiation dose and bone loss. The result is a score from 0 to 100." (الكود: `healthScore` فـ `engine.ts`)

**Q4. How do you estimate bone loss?**
"In microgravity astronauts lose about 1 to 1.5% of hip bone density per month. We multiply by the mission days and by (1 − gravity). On the Moon (0.16 g) it's less, on Mars (0.38 g) less again."

**Q5. Radiation?**
"We add the daily dose. Mars transit is about 1.8 mSv/day (measured by MSL RAD on Curiosity). We compare it to NASA's 600 mSv career limit."

**Q6. Is it a medical device? / واش هادا جهاز طبي؟**
"No. It's a prototype. It gives first guidance and sends a report to the flight surgeon, who makes the final decision."

**Q7. What happens if there's no internet / signal from Earth?**
"Everything runs locally in the browser, offline. For Mars, the app tells the crew to follow the on-board protocol first and not wait for Earth."

**Q8. What's original in your project? / شنو الجديد؟**
"Three things: (1) the body map linked to the 5 NASA hazards, (2) it adapts to the mission (ISS, Moon, Mars), (3) Arabic/French/English, so it's useful for crews from many countries."

**Q9. Did you use AI? / واش استعملتو الذكاء الاصطناعي؟**
"Yes, as the rules allow. We used an AI assistant to write code faster. The idea, the choice of indicators, the testing and the translations review are ours. We can explain every part." (جاوب بثقة، ماشي عيب.)

**Q10. What would you add with more time?**
"Real wearable connection (Bluetooth), AI anomaly detection on trends, crew view for the commander, and validation with doctors."

**Q11. Privacy of health data?**
"Data stays on the device (localStorage). No server. In a real version: encryption and access only for the crew member and the flight surgeon."

**Q12. Why gamification (XP, quests)?**
"Astronauts must exercise about 2 hours a day to protect bones and muscles. Quests and streaks keep them motivated during months of isolation."

**Q13. Tech stack?**
"React + TypeScript + Vite, Recharts for charts, an SVG body map, no backend. It works as a single HTML file."

**Q14. Who is the user?**
"The astronaut first (daily check-in, actions), then the flight surgeon on Earth (reports and CSV export)."

**قاعدة ذهبية:** يلا ما عرفتيش الجواب، قول: *"Good question, we haven't tested that yet. Our next step would be…"*. هاد الجواب أحسن من جواب غالط.

---

## 6) Checklist قبل 15 نونبر 23:59

- [ ] صفحة المشروع **بالإنجليزية**.
- [ ] Demo: فيديو ≤ 30 ثانية (بترجمة إنجليزية يلا هضرتو بالدارجة) **أو** عرض ≤ 7 شرائح.
- [ ] رابط عام للمشروع (GitHub / GitHub Pages) بلا تسجيل دخول.
- [ ] فقرة "Use of SI".
- [ ] References: NASA HRP، NASA-STD-3001، React، Recharts، Vite.
- [ ] جميع الأعضاء مسجلين فـ Beni Mellal وظاهرين فـ Members.
