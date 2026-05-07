import { MindMapStatic } from "@/components/ether";

const LAYERS = [
  {
    name: "Voice & Language",
    short: "Voice",
    color: "violet" as const,
    hex: "#8b5cf6",
    blurb: "The way you sound when no one's editing you",
  },
  {
    name: "Memory & Life Events",
    short: "Memory",
    color: "cyan" as const,
    hex: "#3b82f6",
    blurb: "The moments that made you who you are",
  },
  {
    name: "Reasoning & Decisions",
    short: "Reasoning",
    color: "green" as const,
    hex: "#10b981",
    blurb: "How you weigh, choose, commit",
  },
  {
    name: "Values & Beliefs",
    short: "Values",
    color: "amber" as const,
    hex: "#f59e0b",
    blurb: "What you'll never compromise on",
  },
  {
    name: "Emotional Patterns",
    short: "Emotional",
    color: "red" as const,
    hex: "#ef4444",
    blurb: "What moves you, breaks you, holds you together",
  },
];

function LayerChip({
  name,
  short,
  hex,
  blurb,
  delaySeconds,
}: {
  name: string;
  short: string;
  hex: string;
  blurb: string;
  delaySeconds: number;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-[80px] h-[80px] flex items-center justify-center">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${hex} 70%, transparent) 0%, color-mix(in srgb, ${hex} 30%, transparent) 60%, transparent 100%)`,
            transformOrigin: "center",
            animation: "etherBreathe 4s ease-in-out infinite alternate",
            animationDelay: `${delaySeconds}s`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-3 rounded-full"
          style={{
            background: hex,
            opacity: 0.4,
            filter: "blur(4px)",
          }}
        />
      </div>
      <div
        className="font-[Space_Grotesk,system-ui,sans-serif] font-medium text-[14px] uppercase tracking-[0.18em] mt-4"
        style={{ color: "#F3F5FF" }}
      >
        <span className="hidden sm:inline">{name}</span>
        <span className="inline sm:hidden">{short}</span>
      </div>
      <div
        className="font-[Source_Serif_4,Georgia,serif] italic text-[13px] mt-1.5 leading-[1.4] max-w-[180px]"
        style={{ color: "#8A93A6" }}
      >
        {blurb}
      </div>
    </div>
  );
}

export function Future() {
  return (
    <section
      id="section-future"
      className="relative py-20 sm:py-28"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* 3A — Layer chips */}
        <div className="text-center mb-16 sm:mb-20">
          <p
            className="font-[Inter,system-ui,sans-serif] text-[11px] tracking-[0.18em] uppercase mb-5 font-medium"
            style={{ color: "#B0B8C6" }}
          >
            The layers that make you
          </p>
          <h2
            className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold leading-[1.15] mb-5 text-[26px] sm:text-[32px] md:text-[36px]"
            style={{ color: "#F3F5FF" }}
          >
            Five layers of who you are.
          </h2>
          <p
            className="font-[Source_Serif_4,Georgia,serif] italic leading-[1.5] mx-auto max-w-[600px] text-[16px] sm:text-[18px]"
            style={{ color: "#B0B8C6" }}
          >
            Most products capture what you said. Ether captures the way you think — across five layers your mind is already built on.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-6 sm:gap-x-4 lg:gap-x-2 mb-24 sm:mb-32 max-w-[1100px] mx-auto place-items-center">
          {LAYERS.map((l, i) => (
            <div
              key={l.name}
              className={
                i === 4
                  ? "col-span-2 sm:col-span-1"
                  : ""
              }
            >
              <LayerChip
                name={l.name}
                short={l.short}
                hex={l.hex}
                blurb={l.blurb}
                delaySeconds={i * 0.4}
              />
            </div>
          ))}
        </div>

        {/* 3B — Mind Map */}
        <div className="text-center mb-10">
          <p
            className="font-[Inter,system-ui,sans-serif] text-[11px] tracking-[0.18em] uppercase mb-5 font-medium"
            style={{ color: "var(--ether-violet)" }}
          >
            The shape your thinking makes
          </p>
          <p
            className="font-[Source_Serif_4,Georgia,serif] italic leading-[1.5] mx-auto max-w-[580px] text-[16px] sm:text-[18px]"
            style={{ color: "#B0B8C6" }}
          >
            Every memory, decision, and value becomes a node. Every connection makes the next answer sharper.
          </p>
        </div>

      </div>

      {/* Mind Map — pulled wider than the rest of the section so the
          constellation has room to breathe horizontally. */}
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-6">
        <div
          className="relative w-full overflow-hidden rounded-2xl h-[320px] sm:h-[420px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(138,124,255,0.04) 0%, transparent 100%)",
          }}
        >
          <MindMapStatic />
        </div>
      </div>
    </section>
  );
}
