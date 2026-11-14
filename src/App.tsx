import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine, CartesianGrid } from 'recharts';
import { ui, type Lang, type UIKey } from './i18n';
import { missions, indicators, indicatorById, systems, symptoms, hazards, quests, reminders } from './data';
import type { IndicatorId, Status, SystemId, SymptomId } from './data';
import { BodyMap } from './BodyMap';
import {
  type Reading, type Drift, demoHistory, driftWarnings, systemStatus, indicatorStatus, healthScore, alerts, boneLoss, cumulativeDose, xpFor, toCsv,
} from './engine';

type Tab = 'dashboard' | 'checkin' | 'trends' | 'tasks' | 'learn';
const STORE = 'astrovitals-v1';

interface Saved { lang: Lang; missionId: string; crew: string; histories: Record<string, Reading[]> }

function load(): Saved {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || '');
    if (s && s.histories) return s;
  } catch { /* first visit */ }
  return { lang: 'en', missionId: 'transit', crew: 'Cmdr. Amina', histories: {} };
}

const statusIcon: Record<Status, string> = { green: '●', yellow: '▲', red: '■', none: '○' };

function interpolate(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));
}

function driftTitle(drift: Drift, lang: Lang) {
  const indicator = indicatorById[drift.id];
  return interpolate(ui.driftTitle[lang], {
    indicator: indicator.name[lang],
    direction: ui[drift.direction === 'up' ? 'driftUp' : 'driftDown'][lang],
  });
}

function driftMessage(drift: Drift, lang: Lang) {
  return interpolate(ui.driftMessage[lang], {
    recent: drift.recent,
    baseline: drift.baseline,
    z: drift.z,
    unit: indicatorById[drift.id].unit,
  });
}

export default function App() {
  const [state, setState] = useState<Saved>(load);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [selected, setSelected] = useState<SystemId | null>('heart');
  const [sentAt, setSentAt] = useState<number | null>(null);
  const { lang, missionId } = state;
  const t = (k: UIKey) => ui[k][lang];
  const mission = missions.find(m => m.id === missionId)!;
  const history = useMemo(() => state.histories[missionId] ?? demoHistory(missionId), [state.histories, missionId]);
  const latest = history[history.length - 1];
  const day = latest?.day ?? 0;

  useEffect(() => { localStorage.setItem(STORE, JSON.stringify(state)); }, [state]);
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const setHistory = (h: Reading[]) => setState(s => ({ ...s, histories: { ...s.histories, [missionId]: h } }));
  const statuses = Object.fromEntries(systems.map(s => [s.id, systemStatus(latest, s.id, day, mission)])) as Record<SystemId, Status>;
  const score = healthScore(latest, day, mission);
  const al = alerts(latest, day, mission, history);
  const drifts = driftWarnings(history);
  const dose = cumulativeDose(history);
  const game = xpFor(history);

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <div className="logo">AV</div>
          <div>
            <h1>AstroVitals</h1>
            <p>{t('appTagline')}</p>
          </div>
        </div>
        <div className="controls">
          <label>{t('mission')}
            <select value={missionId} onChange={e => { setState(s => ({ ...s, missionId: e.target.value })); setSentAt(null); }}>
              {missions.map(m => <option key={m.id} value={m.id}>{m.name[lang]}</option>)}
            </select>
          </label>
          <label>{t('crew')}
            <input value={state.crew} onChange={e => setState(s => ({ ...s, crew: e.target.value }))} />
          </label>
          <div className="langs">
            {(['ar', 'fr', 'en'] as Lang[]).map(l => (
              <button key={l} className={l === lang ? 'on' : ''} onClick={() => setState(s => ({ ...s, lang: l }))}>
                {l === 'ar' ? 'العربية' : l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mission-strip">
        <span>🚀 {mission.name[lang]}</span>
        <span>📅 {t('missionDay')} {day}</span>
        <span>🌍 g = {mission.gravity}</span>
        <span>📡 {t('commsDelay')}: {mission.commsLabel[lang]}</span>
        <span>⭐ {t('level')} {game.level} · {game.xp} XP</span>
      </div>

      <nav className="tabs">
        {([['dashboard', 'tabDashboard', '🩺'], ['checkin', 'tabCheckin', '📝'], ['trends', 'tabTrends', '📈'], ['tasks', 'tabTasks', '🏆'], ['learn', 'tabLearn', '☄️']] as [Tab, UIKey, string][]).map(([id, k, ic]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{ic} {t(k)}</button>
        ))}
      </nav>

      <main>
        {tab === 'dashboard' && (
          <div className="grid dash">
            <section className="card body-card">
              <h2>{t('clickBody')}</h2>
              <BodyMap statuses={statuses} selected={selected} onSelect={setSelected} />
              <div className="legend">
                {(['green', 'yellow', 'red'] as Status[]).map(s => <span key={s} className={`pill ${s}`}>{statusIcon[s]} {t(`status_${s}` as UIKey)}</span>)}
              </div>
            </section>

            <section className="card">
              <div className="score-row">
                <ScoreRing score={score} label={t('healthScore')} />
                <div className="meters">
                  <Meter label={t('radDose')} value={`${dose} mSv`} pct={dose / 600 * 100} sub={`${(dose / 6).toFixed(1)}% ${t('careerLimit')}`} />
                  <Meter label={t('boneLoss')} value={`${boneLoss(day, mission)}%`} pct={boneLoss(day, mission) * 10} sub={`${day} ${t('days')} · g = ${mission.gravity}`} />
                </div>
              </div>
              {selected && <SystemDetail id={selected} latest={latest} status={statuses[selected]} lang={lang} t={t} />}
            </section>

            <section className="card">
              <h2>⚠️ {t('alerts')}</h2>
              {al.length === 0 && drifts.length === 0 && <p className="ok">{t('noAlerts')}</p>}
              <ul className="alerts">
                {al.map(a => <AlertItem key={a.kind + a.id} a={a} latest={latest} lang={lang} t={t} dose={dose} bone={boneLoss(day, mission)} />)}
                {drifts.map(drift => (
                  <li key={`drift-${drift.id}`} className="alert yellow">
                    <b>{drift.direction === 'up' ? '📈' : '📉'} {driftTitle(drift, lang)}</b>
                    <span>{driftMessage(drift, lang)}</span>
                  </li>
                ))}
              </ul>
              {al.some(a => a.status === 'red') && (
                <div className="surgeon">
                  {mission.commsDelayMin > 1 && <p className="autonomy">🛰️ {t('autonomyNote')}</p>}
                  <button className="primary" onClick={() => setSentAt(Date.now())}>📤 {t('notifySurgeon')}</button>
                  {sentAt && <p className="sent">✅ {t('reportSent')} {mission.commsLabel[lang]}.</p>}
                </div>
              )}
            </section>
          </div>
        )}

        {tab === 'checkin' && <CheckIn lang={lang} t={t} last={latest} onSave={r => { setHistory([...history, { ...r, day: day + 1 }]); setTab('dashboard'); }} missionDays={day + 1} />}

        {tab === 'trends' && <Trends history={history} lang={lang} t={t} />}

        {tab === 'tasks' && (
          <div className="grid two">
            <section className="card">
              <h2>🏆 {t('todayQuests')}</h2>
              <div className="xpbar"><div style={{ width: `${100 - game.toNext / 5}%` }} /></div>
              <p className="muted">{t('level')} {game.level} · {game.xp} XP · 🔥 {game.streak} {t('streak')}</p>
              <ul className="quests">
                {quests.map(q => {
                  const done = q.check(latest);
                  return <li key={q.id} className={done ? 'done' : ''}><span>{q.icon}</span><span>{q.name[lang]}</span><b>{done ? '✓' : ''} +{q.xp} XP</b></li>;
                })}
              </ul>
              <h3>{t('badges')}</h3>
              <div className="badges">
                {[
                  { ic: '🦴', n: { en: 'Bone Guardian', fr: 'Gardien des os', ar: 'حارس العظام' }, ok: history.filter(r => r.values.exercise >= 120).length >= 10 },
                  { ic: '😴', n: { en: 'Sleep Master', fr: 'Maître du sommeil', ar: 'سيد النوم' }, ok: history.filter(r => r.values.sleep >= 7).length >= 10 },
                  { ic: '💧', n: { en: 'Hydro Hero', fr: "Héros de l'eau", ar: 'بطل الترطيب' }, ok: history.filter(r => r.values.water >= 2).length >= 15 },
                  { ic: '🛰️', n: { en: '30 days in space', fr: '30 jours dans l’espace', ar: '30 يومًا في الفضاء' }, ok: day >= 30 },
                  { ic: '🌟', n: { en: 'Perfect day', fr: 'Journée parfaite', ar: 'يوم مثالي' }, ok: history.some(r => quests.every(q => q.check(r))) },
                ].map(b => <div key={b.ic} className={`badge ${b.ok ? 'got' : ''}`}><span>{b.ic}</span>{b.n[lang]}</div>)}
              </div>
            </section>
            <section className="card">
              <h2>⏰ {t('reminders')}</h2>
              <ul className="reminders">
                {reminders.map(r => <li key={r.time}><b>{r.time}</b> {r.text[lang]}</li>)}
              </ul>
            </section>
          </div>
        )}

        {tab === 'learn' && (
          <div>
            <p className="intro">{t('hazardsIntro')}</p>
            <div className="grid hazards">
              {hazards.map(h => (
                <section key={h.id} className="card hazard">
                  <div className="hz-icon">{h.icon}</div>
                  <h3>{h.name[lang]}</h3>
                  <p>{h.desc[lang]}</p>
                  <p className="muted">{t('linkedIndicators')}:</p>
                  <div className="chips">{h.systems.map(s => <button key={s} className={`pill ${statuses[s]}`} onClick={() => { setSelected(s); setTab('dashboard'); }}>{systems.find(x => x.id === s)!.name[lang]}</button>)}</div>
                </section>
              ))}
            </div>
            <p className="muted small">{t('sources')}: NASA HRP — nasa.gov/hrp/hazards, nasa.gov/hrp/risks · CSA — Monitoring Radiation for Astronaut Health · MSL RAD (Zeitlin et al., Science 2013), Chang'e-4 LND (Zhang et al., Sci. Adv. 2020) · NASA-STD-3001 (600 mSv career limit).</p>
          </div>
        )}
      </main>

      <footer>
        <button onClick={() => { const b = new Blob([toCsv(history)], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `astrovitals-${missionId}.csv`; a.click(); }}>⬇️ {t('exportCsv')}</button>
        <button onClick={() => setHistory(demoHistory(missionId))}>↺ {t('resetDemo')}</button>
        <span>{t('team')} · NASA Space Apps 2026</span>
        <span className="small">{t('disclaimer')}</span>
      </footer>
    </div>
  );
}

type TFn = (k: UIKey) => string;

function ScoreRing({ score, label }: { score: number; label: string }) {
  const c = score >= 80 ? '#22c55e' : score >= 55 ? '#facc15' : '#ef4444';
  const r = 52, len = 2 * Math.PI * r;
  return (
    <div className="ring">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} stroke="#1e293b" strokeWidth="12" fill="none" />
        <circle cx="60" cy="60" r={r} stroke={c} strokeWidth="12" fill="none" strokeLinecap="round"
          strokeDasharray={`${len * score / 100} ${len}`} transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray .8s' }} />
        <text x="60" y="68" textAnchor="middle" fontSize="28" fontWeight="700" fill="#f8fafc">{score}</text>
      </svg>
      <span>{label}</span>
    </div>
  );
}

function Meter({ label, value, pct, sub }: { label: string; value: string; pct: number; sub: string }) {
  const p = Math.min(100, pct);
  const c = p >= 50 ? '#ef4444' : p >= 20 ? '#facc15' : '#22c55e';
  return (
    <div className="meter">
      <div className="meter-head"><span>{label}</span><b>{value}</b></div>
      <div className="bar"><div style={{ width: `${Math.max(2, p)}%`, background: c }} /></div>
      <small>{sub}</small>
    </div>
  );
}

function SystemDetail({ id, latest, status, lang, t }: { id: SystemId; latest?: Reading; status: Status; lang: Lang; t: TFn }) {
  const s = systems.find(x => x.id === id)!;
  const syms = symptoms.filter(x => x.system === id && latest?.symptoms.includes(x.id));
  return (
    <div className={`detail border-${status}`}>
      <div className="detail-head">
        <h2>{s.name[lang]}</h2>
        <span className={`pill ${status}`}>{statusIcon[status]} {t(`status_${status}` as UIKey)}</span>
      </div>
      <p><b>{t('spaceEffect')}:</b> {s.effect[lang]}</p>
      {s.indicators.map(i => {
        const ind = indicatorById[i];
        const st = indicatorStatus(latest, i);
        return (
          <div key={i} className="ind-row">
            <div className="ind-top"><span>{ind.name[lang]}</span><b className={`txt-${st}`}>{latest?.values[i]} {ind.unit}</b></div>
            {st !== 'none' && <p className="advice">💡 {ind.advice[st as 'green'][lang]}</p>}
          </div>
        );
      })}
      {syms.map(x => <p key={x.id} className="advice warn">⚠️ {x.name[lang]}</p>)}
      {id === 'eyes' && <p className="advice">💡 {lang === 'ar' ? 'افحص نظرك أسبوعيًا ببطاقة أمسلر وقراءة النص القريب. أي ضبابية جديدة تستدعي فحص العين بالموجات فوق الصوتية وإبلاغ الطبيب.' : lang === 'fr' ? "Faites un test de vision hebdomadaire (grille d'Amsler, lecture de près). Tout flou nouveau = échographie oculaire et appel au médecin." : 'Do a weekly vision test (Amsler grid, near reading). Any new blur = ocular ultrasound and call the flight surgeon.'}</p>}
    </div>
  );
}

function AlertItem({ a, latest, lang, t, dose, bone }: { a: ReturnType<typeof alerts>[number]; latest?: Reading; lang: Lang; t: TFn; dose: number; bone: number }) {
  let title = '', advice = '';
  if (a.kind === 'indicator') {
    const ind = indicatorById[a.id as IndicatorId];
    title = `${ind.name[lang]}: ${latest?.values[ind.id]} ${ind.unit}`;
    advice = ind.advice[a.status as 'red'][lang];
  } else if (a.kind === 'symptom') {
    title = symptoms.find(s => s.id === a.id)!.name[lang];
    advice = systems.find(s => s.id === symptoms.find(x => x.id === a.id)!.system)!.effect[lang];
  } else if (a.kind === 'bone') {
    title = `${t('boneLoss')}: ${bone}%`;
    advice = indicatorById.exercise.advice.yellow[lang];
  } else {
    title = `${t('radDose')}: ${dose} mSv`;
    advice = indicatorById.radiation.advice.yellow[lang];
  }
  return <li className={`alert ${a.status}`}><b>{statusIcon[a.status]} {title}</b><span>{advice}</span></li>;
}

function CheckIn({ lang, t, last, onSave, missionDays }: { lang: Lang; t: TFn; last?: Reading; onSave: (r: Reading) => void; missionDays: number }) {
  const [vals, setVals] = useState<Record<IndicatorId, number>>(() => ({ ...(last?.values ?? Object.fromEntries(indicators.map(i => [i.id, i.greenBand[0]])) as Record<IndicatorId, number>) }));
  const [syms, setSyms] = useState<SymptomId[]>([]);
  const draft: Reading = { day: missionDays, values: vals, symptoms: syms };
  const st = indicators.map(i => i.evaluate(vals[i.id]));
  const counts = { green: st.filter(s => s === 'green').length, yellow: st.filter(s => s === 'yellow').length, red: st.filter(s => s === 'red').length };
  return (
    <div className="grid checkin">
      <section className="card">
        <h2>📝 {t('tabCheckin')} · {t('missionDay')} {missionDays}</h2>
        <div className="fields">
          {indicators.map(ind => {
            const s = ind.evaluate(vals[ind.id]);
            return (
              <div key={ind.id} className={`field border-${s}`}>
                <div className="field-head">
                  <label htmlFor={ind.id}>{ind.name[lang]}</label>
                  <span className={`pill ${s}`}>{statusIcon[s]}</span>
                </div>
                <div className="field-input">
                  <input type="range" min={ind.min} max={ind.max} step={ind.step} value={vals[ind.id]} onChange={e => setVals(v => ({ ...v, [ind.id]: +e.target.value }))} />
                  <input id={ind.id} type="number" min={ind.min} max={ind.max} step={ind.step} value={vals[ind.id]} onChange={e => setVals(v => ({ ...v, [ind.id]: +e.target.value }))} />
                  <span className="unit">{ind.unit}</span>
                </div>
                <small className="muted">ℹ️ {ind.howTo[lang]}</small>
              </div>
            );
          })}
        </div>
        <h3>{t('symptoms')}</h3>
        <div className="chips">
          {symptoms.map(s => (
            <button key={s.id} className={`chip ${syms.includes(s.id) ? 'on' : ''}`} onClick={() => setSyms(x => x.includes(s.id) ? x.filter(y => y !== s.id) : [...x, s.id])}>{s.name[lang]}</button>
          ))}
        </div>
      </section>
      <section className="card sticky">
        <h2>⚡ {t('preview')}</h2>
        <div className="counts">
          <span className="pill green">● {counts.green}</span>
          <span className="pill yellow">▲ {counts.yellow}</span>
          <span className="pill red">■ {counts.red}</span>
        </div>
        <ul className="alerts">
          {indicators.filter(i => i.evaluate(vals[i.id]) !== 'green').map(i => (
            <li key={i.id} className={`alert ${i.evaluate(vals[i.id])}`}><b>{i.name[lang]}</b><span>{i.advice[i.evaluate(vals[i.id]) as 'red'][lang]}</span></li>
          ))}
          {counts.yellow + counts.red === 0 && <p className="ok">{t('noAlerts')}</p>}
        </ul>
        <button className="primary big" onClick={() => onSave(draft)}>💾 {t('save')}</button>
      </section>
    </div>
  );
}

function Trends({ history, lang, t }: { history: Reading[]; lang: Lang; t: TFn }) {
  const [sel, setSel] = useState<IndicatorId[]>(['heartRate', 'systolic', 'sleep', 'mood']);
  const drifts = driftWarnings(history);
  return (
    <div>
      <div className="chips trend-picks">
        {indicators.map(i => (
          <button key={i.id} className={`chip ${sel.includes(i.id) ? 'on' : ''}`} onClick={() => setSel(s => s.includes(i.id) ? s.filter(x => x !== i.id) : [...s, i.id])}>{i.name[lang]}</button>
        ))}
      </div>
      <p className="muted">🟩 {t('safeZone')}</p>
      <div className="grid charts">
        {sel.map(id => {
          const ind = indicatorById[id];
          const drift = drifts.find(d => d.id === id);
          const data = history.map(r => ({ day: r.day, v: r.values[id] }));
          const vs = data.map(d => d.v);
          const lo = Math.min(ind.greenBand[0], ...vs), hi = Math.max(ind.greenBand[1], ...vs);
          const pad = (hi - lo) * 0.15 || 1;
          return (
            <section key={id} className="card chart">
              <h3>{ind.name[lang]} <small className="muted">({ind.unit})</small></h3>
              {drift && (
                <div className="drift-banner alert yellow">
                  <b>{drift.direction === 'up' ? '📈' : '📉'} {driftTitle(drift, lang)}</b>
                  <span>{driftMessage(drift, lang)}</span>
                </div>
              )}
              <div dir="ltr" style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                    <CartesianGrid stroke="#1e293b" />
                    <ReferenceArea y1={ind.greenBand[0]} y2={ind.greenBand[1]} fill="#22c55e" fillOpacity={0.12} />
                    {drift && <ReferenceLine y={drift.baseline} stroke="#facc15" strokeDasharray="5 5" label={{ value: t('baseline'), fill: '#fde047', fontSize: 11, position: 'insideTopRight' }} />}
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis domain={[+(lo - pad).toFixed(1), +(hi + pad).toFixed(1)]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} labelFormatter={d => `${t('missionDay')} ${d}`} formatter={(v: number) => [`${v} ${ind.unit}`, ind.name[lang]]} />
                    <Line type="monotone" dataKey="v" stroke="#38bdf8" strokeWidth={2}
                      dot={(p: { cx: number; cy: number; payload: { v: number }; index: number }) => {
                        const s = ind.evaluate(p.payload.v);
                        return <circle key={p.index} cx={p.cx} cy={p.cy} r={s === 'green' ? 2 : 4} fill={s === 'green' ? '#38bdf8' : s === 'yellow' ? '#facc15' : '#ef4444'} />;
                      }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
