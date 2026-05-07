import { useEffect, useCallback, useRef } from "react";
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import { forceX, forceY } from "d3-force";

const LAYER_COLORS: Record<string, string> = {
  voice_and_language: "#8b5cf6",
  memory_and_life_events: "#3b82f6",
  reasoning_and_decisions: "#10b981",
  values_and_beliefs: "#f59e0b",
  emotional_patterns: "#ef4444",
};

const ANCHOR_NODE_TYPES = new Set(["memory", "event"]);

function computeNodeRadius(edgeCount: number, nodeType: string): number {
  const base = 4 + Math.sqrt(Math.max(edgeCount, 0)) * 4;
  const anchorBoost = ANCHOR_NODE_TYPES.has(nodeType) ? 1.15 : 1;
  return Math.max(4, Math.min(22, base * anchorBoost));
}

export type MindMapStaticNode = {
  id: string;
  label: string;
  hallidayLayer: string;
  nodeType: string;
  edgeCount: number;
  depth: number;
  x?: number;
  y?: number;
};

export type MindMapStaticLink = {
  source: string | MindMapStaticNode;
  target: string | MindMapStaticNode;
  strength: number;
};

type Props = {
  nodes: MindMapStaticNode[];
  links: MindMapStaticLink[];
  width?: number;
  height?: number;
};

export function MindMapStatic({ nodes, links, width, height = 520 }: Props) {
  const graphRef = useRef<ForceGraphMethods<MindMapStaticNode, MindMapStaticLink>>(undefined);

  useEffect(() => {
    const fg = graphRef.current;
    if (!fg) return;
    fg.d3Force("charge")?.strength(-180);
    fg.d3Force("link")?.distance(100).strength(0.4);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fg.d3Force("x", forceX(0).strength(0.08) as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fg.d3Force("y", forceY(0).strength(0.08) as any);
  }, []);

  const handleEngineStop = useCallback(() => {
    graphRef.current?.zoomToFit(0, 80);
  }, []);

  const drawNode = useCallback(
    (node: MindMapStaticNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const color = LAYER_COLORS[node.hallidayLayer] ?? "#64748b";
      const isAnchor = ANCHOR_NODE_TYPES.has(node.nodeType);
      const baseRadius = computeNodeRadius(node.edgeCount, node.nodeType);
      const rScreen = isAnchor ? Math.max(9, baseRadius) : baseRadius;
      const radius = rScreen / globalScale;
      const x = node.x ?? 0;
      const y = node.y ?? 0;

      const centerAlpha = isAnchor ? 0.22 : 0.14;
      const glowR = radius * 2.6;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
      const toHex = (a: number) =>
        Math.round(Math.max(0, Math.min(1, a)) * 255)
          .toString(16)
          .padStart(2, "0");
      grad.addColorStop(0, color + toHex(centerAlpha));
      grad.addColorStop(0.5, color + toHex(centerAlpha * 0.35));
      grad.addColorStop(1, color + "00");
      ctx.beginPath();
      ctx.arc(x, y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color + (isAnchor ? "d9" : "a6");
      ctx.fill();

      const baseFontSize = isAnchor ? 11 : 9.5;
      const fontSize = Math.max(baseFontSize / globalScale, 2.5);
      const fontWeight = isAnchor ? 500 : 400;
      ctx.font = `${fontWeight} ${fontSize}px "Space Grotesk", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const labelY = y + radius + 3;
      ctx.fillStyle = isAnchor ? "#e2e8f0e6" : "#e2e8f0bf";
      ctx.fillText(node.label, x, labelY);
    },
    [],
  );

  const drawLink = useCallback(
    (edge: MindMapStaticLink, ctx: CanvasRenderingContext2D) => {
      const src = typeof edge.source === "string" ? null : edge.source;
      const tgt = typeof edge.target === "string" ? null : edge.target;
      if (!src || !tgt) return;

      const srcColor = LAYER_COLORS[src.hallidayLayer] ?? "#64748b";
      const alpha = 0.2 + edge.strength * 0.15;
      const width = 0.4 + edge.strength * 0.8;

      ctx.beginPath();
      ctx.moveTo(src.x ?? 0, src.y ?? 0);
      ctx.lineTo(tgt.x ?? 0, tgt.y ?? 0);
      ctx.strokeStyle =
        srcColor +
        Math.round(alpha * 255)
          .toString(16)
          .padStart(2, "0");
      ctx.lineWidth = width;
      ctx.stroke();
    },
    [],
  );

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={{ nodes, links }}
      cooldownTicks={300}
      warmupTicks={120}
      enableNodeDrag={false}
      enableZoomPanInteraction={false}
      enablePointerInteraction={false}
      onEngineStop={handleEngineStop}
      nodeCanvasObject={drawNode}
      linkCanvasObject={drawLink}
      backgroundColor="rgba(0,0,0,0)"
      width={width}
      height={height}
      nodeId="id"
      linkSource="source"
      linkTarget="target"
    />
  );
}
