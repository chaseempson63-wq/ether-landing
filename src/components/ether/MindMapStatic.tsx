// Hand-composed constellation. 5 labeled anchor nodes + 6 unlabeled dots,
// connected by 10 gently curved edges. No simulation, no library — every
// position is hand-tuned so the composition reads like a night sky.

const VIEW_W = 1200;
const VIEW_H = 420;

const LAYER_COLORS = {
  voice: "#8b5cf6",
  memory: "#3b82f6",
  reasoning: "#10b981",
  values: "#f59e0b",
  emotional: "#ef4444",
} as const;

type Layer = keyof typeof LAYER_COLORS;

type Anchor = {
  id: string;
  label: string;
  layer: Layer;
  x: number;
  y: number;
  delay: number;
  primary?: boolean;
};

type Dot = {
  id: string;
  layer: Layer;
  x: number;
  y: number;
  r: number;
  delay: number;
};

type Edge = { a: string; b: string; bow: 1 | -1 };

// Universal labels — visitors should be able to project themselves onto these,
// not read someone else's biography.
const ANCHORS: Anchor[] = [
  { id: "voice",   label: "MY VOICE",        layer: "voice",     x: 195, y: 130, delay: 0   },
  { id: "love",    label: "FIRST LOVE",      layer: "memory",    x: 485, y: 105, delay: 0.8 },
  { id: "decide",  label: "HOW I DECIDE",    layer: "reasoning", x: 640, y: 215, delay: 1.6, primary: true },
  { id: "family",  label: "FAMILY",          layer: "values",    x: 955, y: 135, delay: 2.4 },
  { id: "grounds", label: "WHAT GROUNDS ME", layer: "emotional", x: 540, y: 320, delay: 3.2 },
];

// Unlabeled dots scattered into the gaps. One of each layer-color (plus an
// extra blue) so the full palette reads even where no label exists.
const DOTS: Dot[] = [
  { id: "v_dot",  layer: "voice",     x: 92,   y: 248, r: 5.5, delay: 0   },
  { id: "m_dot1", layer: "memory",    x: 770,  y: 70,  r: 5,   delay: 1   },
  { id: "m_dot2", layer: "memory",    x: 290,  y: 285, r: 6,   delay: 2   },
  { id: "r_dot",  layer: "reasoning", x: 855,  y: 305, r: 5.5, delay: 3   },
  { id: "va_dot", layer: "values",    x: 1115, y: 268, r: 5,   delay: 4   },
  { id: "e_dot",  layer: "emotional", x: 380,  y: 355, r: 6,   delay: 0.5 },
];

const EDGES: Edge[] = [
  { a: "voice",   b: "v_dot",   bow:  1 },
  { a: "voice",   b: "love",    bow: -1 },
  { a: "love",    b: "m_dot1",  bow:  1 },
  { a: "love",    b: "decide",  bow: -1 },
  { a: "decide",  b: "m_dot2",  bow:  1 },
  { a: "decide",  b: "grounds", bow: -1 },
  { a: "decide",  b: "r_dot",   bow:  1 },
  { a: "family",  b: "m_dot1",  bow: -1 },
  { a: "family",  b: "va_dot",  bow:  1 },
  { a: "grounds", b: "e_dot",   bow: -1 },
];

const NODE_BY_ID: Record<string, { x: number; y: number; layer: Layer }> = {
  ...Object.fromEntries(ANCHORS.map((n) => [n.id, { x: n.x, y: n.y, layer: n.layer }])),
  ...Object.fromEntries(DOTS.map((n) => [n.id, { x: n.x, y: n.y, layer: n.layer }])),
};

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function avgRgba(a: string, b: string, alpha: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round((ar + br) / 2);
  const g = Math.round((ag + bg) / 2);
  const blue = Math.round((ab + bb) / 2);
  return `rgba(${r}, ${g}, ${blue}, ${alpha})`;
}

// Quadratic bezier with control point offset perpendicular to the line by
// ~10% of the line's length — gives a soft constellation arc.
function curvedPath(x1: number, y1: number, x2: number, y2: number, bow: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * 0.1 * bow;
  const cy = my + dx * 0.1 * bow;
  return `M ${x1} ${y1} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x2} ${y2}`;
}

// Deterministic faint star field — pure decoration, no animation.
function buildStars(count: number) {
  const out: Array<{ x: number; y: number; o: number }> = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    out.push({
      x: rand() * VIEW_W,
      y: rand() * VIEW_H,
      o: 0.05 + rand() * 0.05,
    });
  }
  return out;
}
const STARS = buildStars(36);

export function MindMapStatic() {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes mmAnchorBreathe {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 0.72; }
        }
        @keyframes mmDotBreathe {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.58; }
        }
      `}</style>

      <defs>
        {ANCHORS.map((n) => {
          const c = LAYER_COLORS[n.layer];
          const inner = n.primary ? 0.7 : 0.6;
          const mid = n.primary ? 0.22 : 0.18;
          return (
            <radialGradient key={`g-${n.id}`} id={`mm-glow-${n.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={c} stopOpacity={inner} />
              <stop offset="55%"  stopColor={c} stopOpacity={mid} />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </radialGradient>
          );
        })}
        {DOTS.map((n) => {
          const c = LAYER_COLORS[n.layer];
          return (
            <radialGradient key={`g-${n.id}`} id={`mm-glow-${n.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={c} stopOpacity="0.55" />
              <stop offset="55%"  stopColor={c} stopOpacity="0.16" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </radialGradient>
          );
        })}
      </defs>

      {/* Faint star field — pure mind-sky decoration. */}
      {STARS.map((s, i) => (
        <circle key={`star-${i}`} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={1} fill="#FFFFFF" opacity={s.o} />
      ))}

      {/* Curved edges. No glow, no animation — keep them quiet under the nodes. */}
      {EDGES.map((e) => {
        const a = NODE_BY_ID[e.a];
        const b = NODE_BY_ID[e.b];
        if (!a || !b) return null;
        return (
          <path
            key={`${e.a}-${e.b}`}
            d={curvedPath(a.x, a.y, b.x, b.y, e.bow)}
            fill="none"
            stroke={avgRgba(LAYER_COLORS[a.layer], LAYER_COLORS[b.layer], 0.2)}
            strokeWidth={1}
            strokeLinecap="round"
          />
        );
      })}

      {/* Unlabeled dots */}
      {DOTS.map((n) => {
        const c = LAYER_COLORS[n.layer];
        const glowR = n.r * 3.4;
        return (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={glowR}
              fill={`url(#mm-glow-${n.id})`}
              style={{
                animation: "mmDotBreathe 5s ease-in-out infinite",
                animationDelay: `${n.delay}s`,
              }}
            />
            <circle cx={n.x} cy={n.y} r={n.r} fill={c} fillOpacity={0.85} />
          </g>
        );
      })}

      {/* Labeled anchors */}
      {ANCHORS.map((n) => {
        const c = LAYER_COLORS[n.layer];
        const r = n.primary ? 16 : 14;
        const glowR = r * 3.0;
        return (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={glowR}
              fill={`url(#mm-glow-${n.id})`}
              style={{
                animation: "mmAnchorBreathe 4s ease-in-out infinite",
                animationDelay: `${n.delay}s`,
              }}
            />
            <circle cx={n.x} cy={n.y} r={r} fill={c} fillOpacity={0.92} />
            <text
              x={n.x}
              y={n.y + r + 12}
              textAnchor="middle"
              dominantBaseline="hanging"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.18em",
                fill: "#B0B8C6",
                textTransform: "uppercase",
              }}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Kept as no-op type aliases so external imports compile without churn.
export type MindMapStaticNode = Anchor;
export type MindMapStaticLink = Edge;
