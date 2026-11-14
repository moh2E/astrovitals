import type { Status, SystemId } from './data';

const spots: { id: SystemId; x: number; y: number; icon: string }[] = [
  { id: 'brain', x: 100, y: 30, icon: '🧠' },
  { id: 'eyes', x: 140, y: 52, icon: '👁️' },
  { id: 'radiation', x: 172, y: 105, icon: '☢️' },
  { id: 'lungs', x: 78, y: 128, icon: '🫁' },
  { id: 'heart', x: 118, y: 135, icon: '❤️' },
  { id: 'immune', x: 28, y: 175, icon: '🛡️' },
  { id: 'metabolism', x: 100, y: 190, icon: '⚡' },
  { id: 'bones', x: 78, y: 285, icon: '🦴' },
];

const color: Record<Status, string> = { green: '#22c55e', yellow: '#facc15', red: '#ef4444', none: '#64748b' };

export function BodyMap({ statuses, selected, onSelect }: {
  statuses: Record<SystemId, Status>;
  selected: SystemId | null;
  onSelect: (s: SystemId) => void;
}) {
  return (
    <svg viewBox="0 0 200 380" className="body-map" role="img" aria-label="Astronaut body map">
      <defs>
        <linearGradient id="suit" x1="0" x2="1">
          <stop offset="0" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#f8fafc" />
        </linearGradient>
        <radialGradient id="visor" cx="0.35" cy="0.3">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#0c4a6e" />
        </radialGradient>
      </defs>
      <g fill="url(#suit)" stroke="#334155" strokeWidth="1.5">
        <rect x="58" y="84" width="84" height="130" rx="26" />
        <rect x="24" y="92" width="34" height="100" rx="16" transform="rotate(8 41 92)" />
        <rect x="142" y="92" width="34" height="100" rx="16" transform="rotate(-8 159 92)" />
        <rect x="62" y="200" width="34" height="140" rx="16" />
        <rect x="104" y="200" width="34" height="140" rx="16" />
        <rect x="56" y="332" width="44" height="24" rx="10" fill="#475569" />
        <rect x="100" y="332" width="44" height="24" rx="10" fill="#475569" />
        <circle cx="100" cy="46" r="40" />
      </g>
      <ellipse cx="100" cy="50" rx="28" ry="22" fill="url(#visor)" stroke="#0f172a" strokeWidth="2" />
      <rect x="80" y="104" width="40" height="26" rx="5" fill="#1e293b" />
      <circle cx="90" cy="117" r="3" fill="#22d3ee" />
      <circle cx="100" cy="117" r="3" fill="#f43f5e" />
      <circle cx="110" cy="117" r="3" fill="#facc15" />
      {spots.map(s => {
        const st = statuses[s.id];
        const sel = selected === s.id;
        return (
          <g key={s.id} className={`spot spot-${st}`} onClick={() => onSelect(s.id)} style={{ cursor: 'pointer' }} tabIndex={0}
             onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(s.id)} role="button" aria-label={s.id}>
            {st === 'red' && <circle cx={s.x} cy={s.y} r="18" fill={color[st]} className="pulse" />}
            <circle cx={s.x} cy={s.y} r={sel ? 17 : 14} fill="#0f172a" stroke={color[st]} strokeWidth={sel ? 4 : 3} />
            <text x={s.x} y={s.y + 5} textAnchor="middle" fontSize="14">{s.icon}</text>
          </g>
        );
      })}
    </svg>
  );
}
