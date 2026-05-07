export type BreathingDotProps = {
  color?: string;
  size?: number;
  className?: string;
};

export function BreathingDot({
  color = "rgb(100 116 139)",
  size = 6,
  className,
}: BreathingDotProps) {
  const delays = [0, 0.2, 0.4];
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className ?? ""}`}
      aria-label="Loading"
      role="status"
    >
      {delays.map((delay) => (
        <span
          key={delay}
          className="block rounded-full"
          style={{
            width: size,
            height: size,
            background: color,
            transformOrigin: "center",
            animation: "etherBreathe 1.2s ease-in-out infinite alternate",
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </span>
  );
}
