import type { T } from './i18n';

export type Status = 'green' | 'yellow' | 'red' | 'none';
export type IndicatorId =
  | 'heartRate' | 'systolic' | 'diastolic' | 'spo2' | 'glucose' | 'temperature'
  | 'sleep' | 'mood' | 'exercise' | 'water' | 'radiation';
export type SymptomId = 'blurredVision' | 'headache' | 'dizziness' | 'rash' | 'backPain' | 'nausea';
export type SystemId = 'brain' | 'eyes' | 'heart' | 'lungs' | 'immune' | 'metabolism' | 'bones' | 'radiation';

export interface Mission {
  id: string;
  name: T;
  gravity: number;
  radPerDay: number;
  commsDelayMin: number;
  commsLabel: T;
}

export const missions: Mission[] = [
  { id: 'iss', name: { en: 'Space Station (low Earth orbit)', fr: 'Station spatiale (orbite basse)', ar: 'محطة الفضاء الدولية (مدار أرضي منخفض)' }, gravity: 0, radPerDay: 0.5, commsDelayMin: 0, commsLabel: { en: '< 1 second', fr: '< 1 seconde', ar: 'أقل من ثانية' } },
  { id: 'moon', name: { en: 'Artemis lunar base', fr: 'Base lunaire Artemis', ar: 'قاعدة أرتميس على القمر' }, gravity: 0.166, radPerDay: 1.37, commsDelayMin: 0.02, commsLabel: { en: '1.3 seconds', fr: '1,3 seconde', ar: '1.3 ثانية' } },
  { id: 'transit', name: { en: 'Deep-space transit to Mars', fr: 'Transit vers Mars', ar: 'الرحلة نحو المريخ' }, gravity: 0, radPerDay: 1.8, commsDelayMin: 12, commsLabel: { en: '3 to 22 minutes', fr: '3 à 22 minutes', ar: 'من 3 إلى 22 دقيقة' } },
  { id: 'mars', name: { en: 'Mars surface outpost', fr: 'Avant-poste sur Mars', ar: 'قاعدة على سطح المريخ' }, gravity: 0.38, radPerDay: 0.64, commsDelayMin: 12, commsLabel: { en: '3 to 22 minutes', fr: '3 à 22 minutes', ar: 'من 3 إلى 22 دقيقة' } },
];

export interface Indicator {
  id: IndicatorId;
  name: T;
  unit: string;
  min: number;
  max: number;
  step: number;
  greenBand: [number, number];
  evaluate: (v: number) => Status;
  howTo: T;
  advice: Record<'green' | 'yellow' | 'red', T>;
}

const band = (v: number, g: [number, number], y: [number, number]): Status =>
  v >= g[0] && v <= g[1] ? 'green' : v >= y[0] && v <= y[1] ? 'yellow' : 'red';

export const indicators: Indicator[] = [
  {
    id: 'heartRate', name: { en: 'Resting heart rate', fr: 'Fréquence cardiaque au repos', ar: 'نبض القلب أثناء الراحة' }, unit: 'bpm', min: 30, max: 160, step: 1, greenBand: [50, 90],
    evaluate: v => band(v, [50, 90], [42, 105]),
    howTo: { en: 'Sit still 5 min, then count your pulse for 60 s or read the chest strap.', fr: 'Restez assis 5 min, puis comptez le pouls pendant 60 s ou lisez la ceinture cardio.', ar: 'اجلس هادئًا 5 دقائق ثم احسب النبض لمدة 60 ثانية أو اقرأ حزام الصدر.' },
    advice: {
      green: { en: 'Heart rhythm nominal.', fr: 'Rythme cardiaque normal.', ar: 'نبض القلب طبيعي.' },
      yellow: { en: 'Re-measure in 15 min after resting. Hydrate and limit caffeine.', fr: 'Remesurez après 15 min de repos. Hydratez-vous, limitez la caféine.', ar: 'أعد القياس بعد 15 دقيقة من الراحة. اشرب الماء وقلّل الكافيين.' },
      red: { en: 'Stop strenuous work, lie down, record an ECG and contact the flight surgeon.', fr: "Arrêtez l'effort, allongez-vous, faites un ECG et contactez le médecin de vol.", ar: 'أوقف أي مجهود، استلقِ، سجّل تخطيط القلب وتواصل مع طبيب الطيران.' },
    },
  },
  {
    id: 'systolic', name: { en: 'Blood pressure (systolic)', fr: 'Tension (systolique)', ar: 'ضغط الدم (الانقباضي)' }, unit: 'mmHg', min: 70, max: 200, step: 1, greenBand: [90, 129],
    evaluate: v => band(v, [90, 129], [85, 139]),
    howTo: { en: 'Arm cuff at heart level, seated, after 5 min of rest. Take 2 readings.', fr: 'Brassard au niveau du cœur, assis, après 5 min de repos. 2 mesures.', ar: 'ضع جهاز الضغط على الذراع بمستوى القلب، وأنت جالس بعد 5 دقائق راحة. خذ قراءتين.' },
    advice: {
      green: { en: 'Blood pressure nominal.', fr: 'Tension normale.', ar: 'ضغط الدم طبيعي.' },
      yellow: { en: 'Reduce salt, keep cardio exercise, re-check tomorrow.', fr: 'Réduisez le sel, gardez le cardio, recontrôlez demain.', ar: 'قلّل الملح، حافظ على تمارين القلب، وأعد القياس غدًا.' },
      red: { en: 'Re-measure now. If confirmed, rest and send report to the flight surgeon.', fr: 'Remesurez. Si confirmé, reposez-vous et envoyez le rapport au médecin.', ar: 'أعد القياس الآن. إذا تأكد، استرح وأرسل التقرير لطبيب الطيران.' },
    },
  },
  {
    id: 'diastolic', name: { en: 'Blood pressure (diastolic)', fr: 'Tension (diastolique)', ar: 'ضغط الدم (الانبساطي)' }, unit: 'mmHg', min: 40, max: 130, step: 1, greenBand: [60, 84],
    evaluate: v => band(v, [60, 84], [55, 89]),
    howTo: { en: 'Same cuff reading as systolic (the lower number).', fr: 'Même mesure que la systolique (le chiffre bas).', ar: 'نفس قراءة الجهاز (الرقم الأصغر).' },
    advice: {
      green: { en: 'Diastolic pressure nominal.', fr: 'Diastolique normale.', ar: 'الضغط الانبساطي طبيعي.' },
      yellow: { en: 'Hydrate, reduce sodium, re-check tomorrow.', fr: 'Hydratez-vous, moins de sodium, recontrôlez demain.', ar: 'اشرب الماء، قلّل الصوديوم، وأعد القياس غدًا.' },
      red: { en: 'Confirm with a second reading and notify the flight surgeon.', fr: 'Confirmez par une 2e mesure et prévenez le médecin.', ar: 'أكّد بقراءة ثانية وأبلغ طبيب الطيران.' },
    },
  },
  {
    id: 'spo2', name: { en: 'Blood oxygen (SpO₂)', fr: 'Oxygène sanguin (SpO₂)', ar: 'أكسجين الدم (SpO₂)' }, unit: '%', min: 80, max: 100, step: 1, greenBand: [95, 100],
    evaluate: v => (v >= 95 ? 'green' : v >= 92 ? 'yellow' : 'red'),
    howTo: { en: 'Finger pulse oximeter, warm hand, 30 s reading.', fr: 'Oxymètre au doigt, main chaude, lecture de 30 s.', ar: 'جهاز قياس الأكسجين على الإصبع، يد دافئة، قراءة لمدة 30 ثانية.' },
    advice: {
      green: { en: 'Oxygenation nominal.', fr: 'Oxygénation normale.', ar: 'نسبة الأكسجين طبيعية.' },
      yellow: { en: 'Check cabin CO₂/O₂ levels, breathe slowly, re-measure. Common after spacewalk prep.', fr: 'Vérifiez CO₂/O₂ de la cabine, respirez lentement, remesurez.', ar: 'تحقّق من مستوى CO₂ و O₂ في المقصورة، تنفّس ببطء وأعد القياس.' },
      red: { en: 'Possible hypoxia: put on oxygen mask, alert crew and flight surgeon immediately.', fr: "Hypoxie possible : masque à oxygène, alertez l'équipage et le médecin.", ar: 'احتمال نقص الأكسجين: ضع قناع الأكسجين ونبّه الطاقم وطبيب الطيران فورًا.' },
    },
  },
  {
    id: 'glucose', name: { en: 'Blood sugar (fasting)', fr: 'Glycémie (à jeun)', ar: 'سكر الدم (صائم)' }, unit: 'mg/dL', min: 40, max: 300, step: 1, greenBand: [70, 99],
    evaluate: v => band(v, [70, 99], [60, 125]),
    howTo: { en: 'Finger-prick glucometer before breakfast.', fr: 'Glucomètre au doigt avant le petit-déjeuner.', ar: 'جهاز قياس السكر بوخز الإصبع قبل الفطور.' },
    advice: {
      green: { en: 'Blood sugar nominal.', fr: 'Glycémie normale.', ar: 'سكر الدم طبيعي.' },
      yellow: { en: 'Balance meals (fiber + protein), keep daily exercise, re-test tomorrow.', fr: 'Repas équilibrés (fibres + protéines), exercice quotidien, retest demain.', ar: 'وازن وجباتك (ألياف + بروتين)، حافظ على الرياضة، وأعد الفحص غدًا.' },
      red: { en: 'If low (<60): take 15 g fast sugar now. If high: re-test and contact the flight surgeon.', fr: 'Si bas (<60) : 15 g de sucre rapide. Si haut : retest et contactez le médecin.', ar: 'إذا كان منخفضًا (أقل من 60): تناول 15 غ سكر سريع الآن. إذا كان مرتفعًا: أعد الفحص وتواصل مع الطبيب.' },
    },
  },
  {
    id: 'temperature', name: { en: 'Body temperature', fr: 'Température corporelle', ar: 'حرارة الجسم' }, unit: '°C', min: 34, max: 41, step: 0.1, greenBand: [36.1, 37.4],
    evaluate: v => band(v, [36.1, 37.4], [35.5, 38.0]),
    howTo: { en: 'Oral or ear thermometer, not right after exercise.', fr: "Thermomètre buccal ou auriculaire, pas juste après l'effort.", ar: 'ميزان حرارة فموي أو للأذن، وليس مباشرة بعد الرياضة.' },
    advice: {
      green: { en: 'Temperature nominal.', fr: 'Température normale.', ar: 'الحرارة طبيعية.' },
      yellow: { en: 'Mild fever can signal latent virus reactivation in space. Rest, hydrate, re-check in 4 h.', fr: 'Une légère fièvre peut signaler une réactivation virale. Repos, hydratation, recontrôle dans 4 h.', ar: 'ارتفاع خفيف قد يدل على تنشّط فيروس كامن في الفضاء. استرح، اشرب الماء، وأعد القياس بعد 4 ساعات.' },
      red: { en: 'Fever/hypothermia: isolate if possible, use medical kit protocol, notify flight surgeon.', fr: 'Fièvre/hypothermie : isolez-vous si possible, protocole du kit médical, prévenez le médecin.', ar: 'حمى أو انخفاض حرارة: اعزل نفسك إن أمكن، طبّق بروتوكول حقيبة الإسعاف، وأبلغ الطبيب.' },
    },
  },
  {
    id: 'sleep', name: { en: 'Sleep last night', fr: 'Sommeil la nuit dernière', ar: 'النوم ليلة أمس' }, unit: 'h', min: 0, max: 12, step: 0.5, greenBand: [7, 9],
    evaluate: v => (v >= 7 ? 'green' : v >= 6 ? 'yellow' : 'red'),
    howTo: { en: 'Hours from wrist actigraph, or your own estimate.', fr: 'Heures selon le bracelet actimètre ou votre estimation.', ar: 'عدد الساعات من سوار النوم أو تقديرك الشخصي.' },
    advice: {
      green: { en: 'Well rested.', fr: 'Bien reposé.', ar: 'نوم كافٍ.' },
      yellow: { en: 'Use blue-enriched light in the morning, dim light 2 h before sleep, eye mask and earplugs.', fr: 'Lumière bleue le matin, lumière tamisée 2 h avant le coucher, masque et bouchons.', ar: 'استعمل الضوء الأزرق صباحًا، خفّف الإضاءة قبل النوم بساعتين، واستعمل قناع العين وسدادات الأذن.' },
      red: { en: 'Sleep debt raises error risk. Avoid critical tasks (EVA, docking) and plan a recovery nap.', fr: 'La dette de sommeil augmente le risque d’erreur. Évitez les tâches critiques et faites une sieste.', ar: 'قلة النوم تزيد خطر الأخطاء. تجنّب المهام الحساسة (الخروج للفضاء، الالتحام) وخطّط لقيلولة.' },
    },
  },
  {
    id: 'mood', name: { en: 'Mood', fr: 'Humeur', ar: 'المزاج' }, unit: '/5', min: 1, max: 5, step: 1, greenBand: [4, 5],
    evaluate: v => (v >= 4 ? 'green' : v >= 3 ? 'yellow' : 'red'),
    howTo: { en: '1 = very low, 5 = excellent. Be honest, this stays private.', fr: '1 = très bas, 5 = excellent. Soyez honnête, cela reste privé.', ar: '1 = سيئ جدًا، 5 = ممتاز. كن صادقًا، هذه المعلومة خاصة.' },
    advice: {
      green: { en: 'Good mood. Share it with the crew!', fr: "Bonne humeur. Partagez-la avec l'équipage !", ar: 'مزاج جيد. شاركه مع الطاقم!' },
      yellow: { en: 'Isolation effect. Schedule a call with family, look at Earth, do something creative.', fr: "Effet d'isolement. Appelez la famille, regardez la Terre, faites une activité créative.", ar: 'تأثير العزلة. حدّد مكالمة مع العائلة، انظر إلى الأرض، ومارس نشاطًا إبداعيًا.' },
      red: { en: 'Talk to a crewmate today and book a private session with the ground psychologist.', fr: "Parlez à un coéquipier aujourd'hui et réservez une séance avec le psychologue au sol.", ar: 'تحدّث مع زميل في الطاقم اليوم واحجز جلسة خاصة مع الأخصائي النفسي في الأرض.' },
    },
  },
  {
    id: 'exercise', name: { en: 'Exercise today', fr: "Exercice aujourd'hui", ar: 'الرياضة اليوم' }, unit: 'min', min: 0, max: 240, step: 5, greenBand: [120, 240],
    evaluate: v => (v >= 120 ? 'green' : v >= 60 ? 'yellow' : 'red'),
    howTo: { en: 'Treadmill + resistance device + cycle minutes. ISS crews target about 2 h/day.', fr: "Minutes de tapis + appareil de résistance + vélo. Objectif ISS : environ 2 h/jour.", ar: 'دقائق جهاز المشي + جهاز المقاومة + الدراجة. هدف طاقم المحطة حوالي ساعتين يوميًا.' },
    advice: {
      green: { en: 'Great: bones, muscles and heart are protected.', fr: 'Parfait : os, muscles et cœur protégés.', ar: 'ممتاز: العظام والعضلات والقلب محمية.' },
      yellow: { en: 'Add a resistance session (squats, deadlifts) to protect hip and spine bones.', fr: 'Ajoutez une séance de résistance (squats, soulevés) pour protéger hanches et colonne.', ar: 'أضف حصة تمارين مقاومة (القرفصاء، رفع الأثقال) لحماية عظام الورك والعمود الفقري.' },
      red: { en: 'Without load, bones lose 1 to 1.5% density per month. Do at least 60 min now.', fr: 'Sans charge, les os perdent 1 à 1,5 % de densité par mois. Faites au moins 60 min.', ar: 'بدون حمل، تفقد العظام 1 إلى 1.5% من كثافتها شهريًا. مارس 60 دقيقة على الأقل الآن.' },
    },
  },
  {
    id: 'water', name: { en: 'Water intake', fr: "Apport en eau", ar: 'كمية الماء' }, unit: 'L', min: 0, max: 5, step: 0.1, greenBand: [2, 3.5],
    evaluate: v => (v >= 2 ? 'green' : v >= 1.5 ? 'yellow' : 'red'),
    howTo: { en: 'Count drink bags / water dispenser volume today.', fr: 'Comptez les sachets / le volume du distributeur.', ar: 'احسب أكياس الشرب أو كمية موزّع الماء اليوم.' },
    advice: {
      green: { en: 'Well hydrated: lowers kidney stone risk.', fr: 'Bien hydraté : moins de risque de calculs rénaux.', ar: 'ترطيب جيد: يقلّل خطر حصى الكلى.' },
      yellow: { en: 'Thirst is weaker in microgravity. Drink a bag every 2 h.', fr: 'La soif est réduite en microgravité. Buvez un sachet toutes les 2 h.', ar: 'الإحساس بالعطش أضعف في انعدام الجاذبية. اشرب كيسًا كل ساعتين.' },
      red: { en: 'Dehydration + bone calcium loss = kidney stones. Drink 0.5 L now.', fr: 'Déshydratation + perte de calcium = calculs rénaux. Buvez 0,5 L maintenant.', ar: 'الجفاف + فقدان كالسيوم العظام = حصى الكلى. اشرب نصف لتر الآن.' },
    },
  },
  {
    id: 'radiation', name: { en: 'Radiation dose today', fr: "Dose de radiation aujourd'hui", ar: 'جرعة الإشعاع اليوم' }, unit: 'mSv', min: 0, max: 20, step: 0.01, greenBand: [0, 2],
    evaluate: v => (v <= 2 ? 'green' : v <= 10 ? 'yellow' : 'red'),
    howTo: { en: 'Read your personal dosimeter (crew badge) at the end of the day.', fr: 'Lisez votre dosimètre personnel en fin de journée.', ar: 'اقرأ مقياس الجرعة الشخصي (شارة الطاقم) في نهاية اليوم.' },
    advice: {
      green: { en: 'Normal background dose for this mission.', fr: 'Dose de fond normale pour cette mission.', ar: 'جرعة خلفية طبيعية لهذه المهمة.' },
      yellow: { en: 'Elevated: possible solar activity. Limit time in low-shielding modules.', fr: 'Élevée : activité solaire possible. Limitez le temps dans les modules peu blindés.', ar: 'مرتفعة: ربما نشاط شمسي. قلّل وقتك في الوحدات ضعيفة التدريع.' },
      red: { en: 'Solar particle event: go to the storm shelter (water-walled area) now.', fr: "Éruption solaire : rejoignez l'abri anti-tempête (zone entourée d'eau).", ar: 'عاصفة شمسية: توجّه فورًا إلى ملجأ العواصف (المنطقة المحاطة بالماء).' },
    },
  },
];

export const indicatorById = Object.fromEntries(indicators.map(i => [i.id, i])) as Record<IndicatorId, Indicator>;

export const symptoms: { id: SymptomId; name: T; system: SystemId }[] = [
  { id: 'blurredVision', name: { en: 'Blurred near vision', fr: 'Vision de près floue', ar: 'رؤية ضبابية عن قرب' }, system: 'eyes' },
  { id: 'headache', name: { en: 'Headache / head fullness', fr: 'Maux de tête / tête lourde', ar: 'صداع / ثقل في الرأس' }, system: 'brain' },
  { id: 'dizziness', name: { en: 'Dizziness / motion sickness', fr: 'Vertiges / mal des transports', ar: 'دوخة / دوار الحركة' }, system: 'brain' },
  { id: 'rash', name: { en: 'Skin rash / cold sore', fr: 'Éruption cutanée / bouton de fièvre', ar: 'طفح جلدي / قرحة برد' }, system: 'immune' },
  { id: 'backPain', name: { en: 'Back pain', fr: 'Mal de dos', ar: 'ألم في الظهر' }, system: 'bones' },
  { id: 'nausea', name: { en: 'Nausea / poor appetite', fr: "Nausées / perte d'appétit", ar: 'غثيان / قلة الشهية' }, system: 'metabolism' },
];

export interface BodySystem {
  id: SystemId;
  name: T;
  indicators: IndicatorId[];
  effect: T;
}

export const systems: BodySystem[] = [
  { id: 'brain', name: { en: 'Brain & mind', fr: 'Cerveau & mental', ar: 'الدماغ والحالة النفسية' }, indicators: ['sleep', 'mood'],
    effect: { en: 'Isolation, confinement and disrupted day/night cycles affect sleep, mood and team performance.', fr: "L'isolement, le confinement et les cycles jour/nuit perturbés affectent sommeil et humeur.", ar: 'العزلة والحبس واضطراب دورة الليل والنهار تؤثر على النوم والمزاج وأداء الفريق.' } },
  { id: 'eyes', name: { en: 'Eyes (SANS)', fr: 'Yeux (SANS)', ar: 'العيون (متلازمة SANS)' }, indicators: [],
    effect: { en: 'Fluids shift toward the head in microgravity and can reshape the eye and optic nerve (Spaceflight Associated Neuro-ocular Syndrome).', fr: "Les fluides remontent vers la tête et peuvent déformer l'œil et le nerf optique (SANS).", ar: 'تنتقل السوائل نحو الرأس في انعدام الجاذبية وقد تغيّر شكل العين والعصب البصري (متلازمة SANS).' } },
  { id: 'heart', name: { en: 'Heart & blood vessels', fr: 'Cœur & vaisseaux', ar: 'القلب والأوعية الدموية' }, indicators: ['heartRate', 'systolic', 'diastolic'],
    effect: { en: 'Weightlessness changes blood circulation; the heart works less and can shrink, raising cardiovascular risk.', fr: "L'apesanteur modifie la circulation ; le cœur travaille moins et peut s'atrophier.", ar: 'انعدام الوزن يغيّر الدورة الدموية؛ القلب يعمل أقل وقد يصغر، مما يرفع خطر أمراض القلب.' } },
  { id: 'lungs', name: { en: 'Lungs & oxygen', fr: 'Poumons & oxygène', ar: 'الرئتان والأكسجين' }, indicators: ['spo2'],
    effect: { en: 'Closed cabins can build up CO₂; spacewalk pre-breathing can cause mild hypoxia.', fr: 'Les cabines fermées accumulent du CO₂ ; la préparation aux sorties peut causer une hypoxie légère.', ar: 'المقصورات المغلقة قد يتراكم فيها CO₂؛ والتحضير للخروج للفضاء قد يسبب نقصًا خفيفًا في الأكسجين.' } },
  { id: 'immune', name: { en: 'Immune system', fr: 'Système immunitaire', ar: 'جهاز المناعة' }, indicators: ['temperature'],
    effect: { en: 'Stress and microgravity weaken immunity and can wake up dormant viruses (rashes, cold sores).', fr: 'Le stress et la microgravité affaiblissent l’immunité et réveillent des virus dormants.', ar: 'الضغط النفسي وانعدام الجاذبية يضعفان المناعة وقد يوقظان فيروسات كامنة (طفح، قرح).' } },
  { id: 'metabolism', name: { en: 'Metabolism & nutrition', fr: 'Métabolisme & nutrition', ar: 'الأيض والتغذية' }, indicators: ['glucose', 'water'],
    effect: { en: 'Inactivity and space food change insulin sensitivity; low thirst leads to dehydration.', fr: "L'inactivité et la nourriture spatiale modifient l'insuline ; la soif réduite déshydrate.", ar: 'قلة الحركة وطعام الفضاء يغيّران حساسية الأنسولين؛ وضعف العطش يؤدي إلى الجفاف.' } },
  { id: 'bones', name: { en: 'Bones & muscles', fr: 'Os & muscles', ar: 'العظام والعضلات' }, indicators: ['exercise'],
    effect: { en: 'Without gravity, weight-bearing bones lose 1 to 1.5% density per month and muscles weaken.', fr: 'Sans gravité, les os porteurs perdent 1 à 1,5 % de densité par mois et les muscles s’affaiblissent.', ar: 'بدون جاذبية، تفقد العظام الحاملة للوزن 1 إلى 1.5% من كثافتها شهريًا وتضعف العضلات.' } },
  { id: 'radiation', name: { en: 'Cells & DNA (radiation)', fr: 'Cellules & ADN (radiation)', ar: 'الخلايا والحمض النووي (الإشعاع)' }, indicators: ['radiation'],
    effect: { en: 'Galactic cosmic rays and solar particles damage DNA, raising long-term cancer and nervous system risks.', fr: 'Les rayons cosmiques et particules solaires endommagent l’ADN et augmentent les risques de cancer.', ar: 'الأشعة الكونية والجسيمات الشمسية تتلف الحمض النووي وترفع خطر السرطان على المدى البعيد.' } },
];

export interface Hazard { id: string; icon: string; name: T; desc: T; systems: SystemId[] }

export const hazards: Hazard[] = [
  { id: 'radiation', icon: '☢️', name: { en: 'Space radiation', fr: 'Radiation spatiale', ar: 'الإشعاع الفضائي' }, systems: ['radiation', 'immune'],
    desc: { en: 'Invisible and considered one of the most hazardous aspects of spaceflight.', fr: "Invisible, c'est l'un des aspects les plus dangereux du vol spatial.", ar: 'غير مرئي ويُعتبر من أخطر جوانب الرحلات الفضائية.' } },
  { id: 'isolation', icon: '🧠', name: { en: 'Isolation & confinement', fr: 'Isolement & confinement', ar: 'العزلة والحبس' }, systems: ['brain'],
    desc: { en: 'Small crews, far from Earth, in a small space for months or years.', fr: 'Petits équipages, loin de la Terre, dans un espace réduit pendant des mois.', ar: 'طاقم صغير، بعيد عن الأرض، في مكان ضيق لشهور أو سنوات.' } },
  { id: 'distance', icon: '📡', name: { en: 'Distance from Earth', fr: 'Distance de la Terre', ar: 'البعد عن الأرض' }, systems: ['heart', 'lungs'],
    desc: { en: 'Mars is on average 225 million km away: medical help from Earth can take up to 22 minutes one way.', fr: "Mars est en moyenne à 225 millions de km : l'aide médicale peut prendre 22 minutes.", ar: 'المريخ على بعد 225 مليون كم في المتوسط: المساعدة الطبية من الأرض قد تتأخر 22 دقيقة.' } },
  { id: 'gravity', icon: '🦴', name: { en: 'Gravity fields', fr: 'Champs de gravité', ar: 'مجالات الجاذبية' }, systems: ['bones', 'heart', 'eyes'],
    desc: { en: 'Muscles, bones, inner ear and organs must adapt to 0 g, 1/6 g (Moon), 3/8 g (Mars) and back to 1 g.', fr: 'Muscles, os, oreille interne et organes s’adaptent à 0 g, 1/6 g, 3/8 g puis 1 g.', ar: 'العضلات والعظام والأذن الداخلية والأعضاء تتكيف مع 0 g و 1/6 g (القمر) و 3/8 g (المريخ) ثم 1 g.' } },
  { id: 'closed', icon: '🦠', name: { en: 'Hostile/closed environment', fr: 'Environnement hostile/fermé', ar: 'بيئة مغلقة وعدائية' }, systems: ['immune', 'lungs', 'metabolism'],
    desc: { en: 'Temperature, pressure, CO₂, noise and microbes inside the spacecraft all affect health.', fr: 'Température, pression, CO₂, bruit et microbes dans le vaisseau affectent la santé.', ar: 'الحرارة والضغط وثاني أكسيد الكربون والضجيج والميكروبات داخل المركبة كلها تؤثر على الصحة.' } },
];

export interface Quest { id: string; icon: string; name: T; xp: number; check: (r: import('./engine').Reading | undefined) => boolean }

export const quests: Quest[] = [
  { id: 'log', icon: '📝', name: { en: 'Complete your daily check-in', fr: 'Faire le bilan quotidien', ar: 'أكمل الفحص اليومي' }, xp: 50, check: r => !!r },
  { id: 'exercise', icon: '🏋️', name: { en: 'Exercise 2 hours (bone shield)', fr: "2 h d'exercice (bouclier osseux)", ar: 'تمرّن ساعتين (درع العظام)' }, xp: 40, check: r => !!r && r.values.exercise >= 120 },
  { id: 'sleep', icon: '😴', name: { en: 'Sleep at least 7 hours', fr: 'Dormir au moins 7 h', ar: 'نم 7 ساعات على الأقل' }, xp: 30, check: r => !!r && r.values.sleep >= 7 },
  { id: 'water', icon: '💧', name: { en: 'Drink 2 L of water', fr: "Boire 2 L d'eau", ar: 'اشرب 2 لتر من الماء' }, xp: 20, check: r => !!r && r.values.water >= 2 },
  { id: 'mood', icon: '🌍', name: { en: 'Mood 4+: call home or look at Earth', fr: 'Humeur 4+ : appeler la famille ou regarder la Terre', ar: 'مزاج 4+: اتصل بالعائلة أو انظر إلى الأرض' }, xp: 20, check: r => !!r && r.values.mood >= 4 },
  { id: 'eyes', icon: '👁️', name: { en: 'Do the weekly vision check (no blur)', fr: 'Test de vision hebdo (pas de flou)', ar: 'افحص نظرك الأسبوعي (بدون ضبابية)' }, xp: 30, check: r => !!r && !r.symptoms.includes('blurredVision') },
];

export const reminders: { time: string; text: T }[] = [
  { time: '06:30', text: { en: 'Wake-up vitals: heart rate, blood pressure, temperature', fr: 'Constantes du réveil : pouls, tension, température', ar: 'قياسات الاستيقاظ: النبض، الضغط، الحرارة' } },
  { time: '07:00', text: { en: 'Fasting blood sugar before breakfast', fr: 'Glycémie à jeun avant le petit-déjeuner', ar: 'سكر الدم صائمًا قبل الفطور' } },
  { time: '10:00', text: { en: 'Exercise block 1: treadmill + resistance', fr: 'Exercice 1 : tapis + résistance', ar: 'حصة الرياضة 1: جهاز المشي + المقاومة' } },
  { time: '16:00', text: { en: 'Exercise block 2: cycle ergometer', fr: 'Exercice 2 : vélo ergomètre', ar: 'حصة الرياضة 2: الدراجة الثابتة' } },
  { time: '20:00', text: { en: 'Read dosimeter, log water and mood', fr: 'Lire le dosimètre, noter eau et humeur', ar: 'اقرأ مقياس الإشعاع، سجّل الماء والمزاج' } },
  { time: '21:00', text: { en: 'Dim lights: sleep preparation', fr: 'Lumière tamisée : préparation au sommeil', ar: 'خفّف الإضاءة: استعداد للنوم' } },
];
