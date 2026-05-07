export type BreathingCoreTone = "violet" | "cyan" | "magenta" | "gold";

const TONE_STOPS: Record<BreathingCoreTone, { inner: string; outer: string }> = {
  violet: { inner: "#C9BFFF", outer: "#8A7CFF" },
  cyan: { inner: "#BFEFFF", outer: "#3DD9FF" },
  magenta: { inner: "#FFBFE3", outer: "#FF6FD1" },
  gold: { inner: "#FFE8B3", outer: "#FFD27A" },
};

export type BreathingCoreProps = {
  size?: number;
  tone?: BreathingCoreTone;
  speed?: number;
  delaySeconds?: number;
  className?: string;
};

export function BreathingCore({
  size = 40,
  tone = "violet",
  speed = 4,
  delaySeconds = 0,
  className,
}: BreathingCoreProps) {
  const { inner, outer } = TONE_STOPS[tone];
  const gradId = `breathing-core-${tone}-${Math.round(size)}-${Math.round(delaySeconds * 100)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="-20 -20 40 40"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={inner} stopOpacity="1" />
          <stop offset="60%" stopColor={outer} stopOpacity="0.55" />
          <stop offset="100%" stopColor={outer} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        cx="0"
        cy="0"
        r="18"
        fill={`url(#${gradId})`}
        style={{
          transformOrigin: "0 0",
          animation: `etherBreathe ${speed}s ease-in-out infinite alternate`,
          animationDelay: `${delaySeconds}s`,
        }}
      />
    </svg>
  );
}
