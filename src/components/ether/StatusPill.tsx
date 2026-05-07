import type { ReactNode } from "react";

export type StatusPillTone =
  | "memory"
  | "insight"
  | "value"
  | "earned"
  | "neutral";

const TONE_COLOR: Record<StatusPillTone, string> = {
  memory: "var(--ether-cyan)",
  insight: "var(--ether-violet)",
  value: "var(--ether-magenta)",
  earned: "var(--ether-gold)",
  neutral: "rgb(148 163 184)",
};

export type StatusPillProps = {
  tone?: StatusPillTone;
  children: ReactNode;
  uppercase?: boolean;
  className?: string;
};

export function StatusPill({
  tone = "neutral",
  children,
  uppercase = true,
  className,
}: StatusPillProps) {
  const color = TONE_COLOR[tone];
  return (
    <span
      className={`inline-flex items-center font-ui font-medium text-[11px] px-2 py-0.5 rounded whitespace-nowrap ${uppercase ? "uppercase tracking-wider" : ""} ${className ?? ""}`}
      style={{
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}
