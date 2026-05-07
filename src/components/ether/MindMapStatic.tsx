// Hand-composed static SVG mind map. Replaces the prior react-force-graph-2d
// + d3-force render — the live simulation jittered on lower-spec devices and
// the 11-node graph never needed a force engine. Positions are tuned by hand
// so the composition reads as five Halliday clusters with the cross-cluster
// edges carrying the visual weight.

const VIEW_W = 800;
const VIEW_H = 500;

const LAYER_COLORS: Record<string, string> = {
  voice_and_language: "#8b5cf6",
  memory_and_life_events: "#3b82f6",
  reasoning_and_decisions: "#10b981",
  values_and_beliefs: "#f59e0b",
  emotional_patterns: "#ef4444",
};

type StaticNode = {
  id: string;
  label?: string;
  layer: keyof typeof LAYER_COLORS;
  x: number;
  y: number;
  anchor: boolean;
};

// Only the 5 nodes the brief calls out get visible labels; the other six read
// as colored dots. Labels do real semantic work for the visitor; everything
// else is texture.
const NODES: StaticNode[] = [
  { id: "v1", layer: "voice_and_language", x: 200, y: 150, anchor: false },
  { id: "v2", layer: "voice_and_language", x: 130, y: 220, anchor: false },
  { id: "m1", label: "BROKE MY LEG AT 12", layer: "memory_and_life_events", x: 320, y: 100, anchor: true },
  { id: "m2", layer: "memory_and_life_events", x: 450, y: 80, anchor: false },
  { id: "m3", label: "MOVING ABROAD", layer: "memory_and_life_events", x: 570, y: 160, anchor: true },
  { id: "r1", label: "HOW I DECIDE", layer: "reasoning_and_decisions", x: 400, y: 250, anchor: true },
  { id: "r2", layer: "reasoning_and_decisions", x: 310, y: 330, anchor: false },
  { id: "va1", label: "FAMILY FIRST", layer: "values_and_beliefs", x: 540, y: 320, anchor: true },
  { id: "va2", layer: "values_and_beliefs", x: 650, y: 380, anchor: false },
  { id: "e1", layer: "emotional_patterns", x: 250, y: 400, anchor: false },
  { id: "e2", label: "WHAT GROUNDS ME", layer: "emotional_patterns", x: 450, y: 420, anchor: true },
];

const NODE_BY_ID: Record<string, StaticNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
);

type StaticLink = { source: string; target: string };
const LINKS: StaticLink[] = [
  { source: "v1", target: "v2" },
  { source: "m1", target: "m2" },
  { source: "m1", target: "m3" },
  { source: "m2", target: "r2" },
  { source: "r1", target: "r2" },
  { source: "r1", target: "va1" },
  { source: "va1", target: "va2" },
  { source: "va1", target: "e2" },
  { source: "e1", target: "e2" },
  { source: "r1", target: "e1" },
  { source: "v1", target: "r1" },
  { source: "m3", target: "va2" },
];

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function mixHexAtAlpha(a: string, b: string, alpha: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round((ar + br) / 2);
  const g = Math.round((ag + bg) / 2);
  const blue = Math.round((ab + bb) / 2);
  return `rgba(${r}, ${g}, ${blue}, ${alpha})`;
}

// Deterministic per-node breathe delay (0–3.6s) so glows pulse out of phase
// without depending on Math.random (which would re-seed every render).
function delayFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ((h % 36) / 10);
}

function NodeGlow({ node }: { node: StaticNode }) {
  const color = LAYER_COLORS[node.layer];
  const radius = node.anchor ? 12 : 7;
  const glowR = radius * 3.2;
  const gradId = `glow-${node.id}`;
  const delay = delayFor(node.id);
  return (
    <g>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={node.anchor ? 0.18 : 0.12} />
          <stop offset="55%" stopColor={color} stopOpacity={node.anchor ? 0.07 : 0.04} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        cx={node.x}
        cy={node.y}
        r={glowR}
        fill={`url(#${gradId})`}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: "etherBreathe 4s ease-in-out infinite alternate",
          animationDelay: `${delay}s`,
        }}
      />
      <circle
        cx={node.x}
        cy={node.y}
        r={radius}
        fill={color}
        fillOpacity={node.anchor ? 0.85 : 0.65}
      />
    </g>
  );
}

function NodeLabel({ node }: { node: StaticNode }) {
  if (!node.label) return null;
  return (
    <text
      x={node.x}
      y={node.y + (node.anchor ? 24 : 18)}
      textAnchor="middle"
      style={{
        fontFamily: "Space Grotesk, system-ui, sans-serif",
        fontSize: "11px",
        fontWeight: 500,
        fill: "#e2e8f0",
        opacity: 0.9,
      }}
    >
      {node.label}
    </text>
  );
}

type Props = {
  /** Fallback when the parent doesn't size the container. */
  height?: number;
};

export function MindMapStatic({ height }: Props = {}) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height={height ?? "100%"}
      style={{ display: "block" }}
      aria-hidden="true"
    >
      {/* Cross-cluster edges read first; same-cluster edges fade into the
          background. The brief calls those cross-cluster lines the
          "interesting" ones, so they get more weight. */}
      {LINKS.map(({ source, target }) => {
        const a = NODE_BY_ID[source];
        const b = NODE_BY_ID[target];
        if (!a || !b) return null;
        const sameLayer = a.layer === b.layer;
        const stroke = sameLayer
          ? mixHexAtAlpha(LAYER_COLORS[a.layer], LAYER_COLORS[b.layer], 0.18)
          : mixHexAtAlpha(LAYER_COLORS[a.layer], LAYER_COLORS[b.layer], 0.3);
        const width = sameLayer ? 1 : 1.2;
        return (
          <line
            key={`${source}-${target}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={stroke}
            strokeWidth={width}
            strokeLinecap="round"
          />
        );
      })}

      {NODES.map((n) => (
        <NodeGlow key={n.id} node={n} />
      ))}

      {NODES.map((n) => (
        <NodeLabel key={n.id} node={n} />
      ))}
    </svg>
  );
}

// Old typed exports retained as no-op aliases so external imports don't need
// updating mid-pass — they're not used inside this file.
export type MindMapStaticNode = StaticNode;
export type MindMapStaticLink = StaticLink;
