import { indicators, indicatorById, symptoms, systems, missions, quests } from './data';
import type { IndicatorId, Status, SymptomId, SystemId, Mission } from './data';

export interface Reading {
  day: number;
  values: Record<IndicatorId, number>;
  symptoms: SymptomId[];
}

export interface Drift { id: IndicatorId; direction: 'up' | 'down'; recent: number; baseline: number; z: number }

const rank: Record<Status, number> = { none: -1, green: 0, yellow: 1, red: 2 };
export const worst = (list: Status[]): Status =>
  list.reduce<Status>((a, b) => (rank[b] > rank[a] ? b : a), 'none');

export function driftWarnings(history: Reading[]): Drift[] {
  if (history.length < 17) return [];
  const baselineReadings = history.slice(-17, -3);
  const recentReadings = history.slice(-3);
  const out: Drift[] = [];
  for (const ind of indicators) {
    if (ind.id === 'radiation') continue;
    const baselineValues = baselineReadings.map(r => r.values[ind.id]);
    const baselineMean = baselineValues.reduce((sum, value) => sum + value, 0) / baselineValues.length;
    const variance = baselineValues.reduce((sum, value) => sum + (value - baselineMean) ** 2, 0) / (baselineValues.length - 1);
    const sd = Math.max(Math.sqrt(variance), indicatorById[ind.id].step);
    const recent = recentReadings.reduce((sum, r) => sum + r.values[ind.id], 0) / recentReadings.length;
    const z = (recent - baselineMean) / sd;
    if (Math.abs(z) >= 2) {
      out.push({
        id: ind.id,
        direction: z > 0 ? 'up' : 'down',
        recent: +recent.toFixed(1),
        baseline: +baselineMean.toFixed(1),
        z: +z.toFixed(1),
      });
    }
  }
  return out.sort((a, b) => Math.abs(b.z) - Math.abs(a.z));
}

export const indicatorStatus = (r: Reading | undefined, id: IndicatorId): Status =>
  r ? indicatorById[id].evaluate(r.values[id]) : 'none';

export function systemStatus(r: Reading | undefined, sys: SystemId, missionDays: number, mission: Mission): Status {
  if (!r) return 'none';
  const s = systems.find(x => x.id === sys)!;
  const list: Status[] = s.indicators.map(i => indicatorStatus(r, i));
  for (const sym of symptoms) if (sym.system === sys && r.symptoms.includes(sym.id)) list.push(sym.id === 'blurredVision' ? 'red' : 'yellow');
  if (sys === 'eyes' && list.length === 0) list.push('green');
  if (sys === 'bones') {
    const loss = boneLoss(missionDays, mission);
    list.push(loss >= 5 ? 'red' : loss >= 2 ? 'yellow' : 'green');
  }
  return worst(list);
}

export const boneLoss = (days: number, m: Mission) => +(days / 30 * 1.25 * (1 - m.gravity / 1)).toFixed(1);

export const cumulativeDose = (history: Reading[]) => +history.reduce((a, r) => a + r.values.radiation, 0).toFixed(1);

export function healthScore(r: Reading | undefined, days: number, m: Mission): number {
  if (!r) return 0;
  const pts: Record<Status, number> = { green: 100, yellow: 60, red: 15, none: 0 };
  const sts = systems.map(s => systemStatus(r, s.id, days, m));
  return Math.round(sts.reduce((a, s) => a + pts[s], 0) / sts.length);
}

export interface Alert { kind: 'indicator' | 'symptom' | 'bone' | 'dose'; id: string; status: Status }

export function alerts(r: Reading | undefined, days: number, m: Mission, history: Reading[]): Alert[] {
  if (!r) return [];
  const out: Alert[] = [];
  for (const ind of indicators) {
    const s = ind.evaluate(r.values[ind.id]);
    if (s !== 'green') out.push({ kind: 'indicator', id: ind.id, status: s });
  }
  for (const sym of r.symptoms) out.push({ kind: 'symptom', id: sym, status: sym === 'blurredVision' ? 'red' : 'yellow' });
  const bl = boneLoss(days, m);
  if (bl >= 2) out.push({ kind: 'bone', id: 'bone', status: bl >= 5 ? 'red' : 'yellow' });
  const pct = cumulativeDose(history) / 600 * 100;
  if (pct >= 25) out.push({ kind: 'dose', id: 'dose', status: pct >= 75 ? 'red' : 'yellow' });
  return out.sort((a, b) => rank[b.status] - rank[a.status]);
}

function rng(seed: number) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
}

export function demoHistory(missionId: string, days = 45): Reading[] {
  const m = missions.find(x => x.id === missionId)!;
  const rand = rng(missionId.length * 7919 + 17);
  const n = (mean: number, sd: number) => mean + (rand() + rand() + rand() - 1.5) * sd * 1.4;
  const out: Reading[] = [];
  for (let d = 1; d <= days; d++) {
    const t = d / days;
    const flare = missionId !== 'iss' && (d === 31 || d === 32);
    const values: Record<IndicatorId, number> = {
      heartRate: Math.round(n(64 + 6 * t, 4)),
      systolic: Math.round(n(114 + 12 * t, 5)),
      diastolic: Math.round(n(74 + 6 * t, 4)),
      spo2: Math.round(Math.min(100, n(97.5 - 1 * t, 0.8))),
      glucose: Math.round(n(88 + 10 * t, 6)),
      temperature: +n(36.7 + (d === 22 ? 1.0 : 0), 0.15).toFixed(1),
      sleep: Math.max(3, Math.round(n(7.4 - 1.2 * t, 0.6) * 2) / 2),
      mood: Math.max(1, Math.min(5, Math.round(n(4.4 - 1.4 * t, 0.5)))),
      exercise: Math.max(0, Math.round(n(130 - 40 * t, 15) / 5) * 5),
      water: +Math.max(0.8, n(2.4 - 0.5 * t, 0.25)).toFixed(1),
      radiation: +(flare ? m.radPerDay * 9 : n(m.radPerDay, m.radPerDay * 0.08)).toFixed(2),
    };
    if (missionId === 'transit') {
      if (d > days - 17 && d <= days - 3) values.systolic = Math.max(117, Math.min(124, values.systolic));
      if (d === days - 2) values.systolic = 125;
      if (d === days - 1) values.systolic = 127;
      if (d === days) values.systolic = 129;
    }
    const sym: SymptomId[] = [];
    if (d <= 3) sym.push('dizziness');
    if (d === 22) sym.push('rash');
    if (d > 38 && m.gravity < 0.2 && rand() > 0.5) sym.push('blurredVision');
    if (rand() > 0.85) sym.push('headache');
    out.push({ day: d, values, symptoms: sym });
  }
  return out;
}

export function xpFor(history: Reading[]) {
  let xp = 0, streak = 0;
  for (const r of history) for (const q of quests) if (q.check(r)) xp += q.xp;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].day !== history[history.length - 1].day - (history.length - 1 - i)) break;
    if (!(history[i].values.exercise >= 60 && history[i].values.sleep >= 6)) break;
    streak++;
  }
  return { xp, level: Math.floor(xp / 500) + 1, toNext: 500 - (xp % 500), streak };
}

export function toCsv(history: Reading[]) {
  const cols = indicators.map(i => i.id);
  const head = ['day', ...cols.map(c => `${c} (${indicatorById[c].unit})`), 'symptoms'].join(',');
  return [head, ...history.map(r => [r.day, ...cols.map(c => r.values[c]), r.symptoms.join(' ')].join(','))].join('\n');
}
