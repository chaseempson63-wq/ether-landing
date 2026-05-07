import { useEffect, useRef, useState } from "react";
import { BreathingCore, StatusPill } from "@/components/ether";
import type { StatusPillTone, BreathingCoreTone } from "@/components/ether";

type Phase = {
  status: string;
  pillTone: StatusPillTone;
  coreTone: BreathingCoreTone;
  bulletColor: string;
  litColor: string;
  title: string;
  body: string;
  bullets: string[];
};

const PHASES: Phase[] = [
  {
    status: "Phase one · Now",
    pillTone: "memory",
    coreTone: "cyan",
    bulletColor: "#3DD9FF",
    litColor: "#3DD9FF",
    title: "Build Your Mind",
    body: "Sign up, start talking, and watch your digital mind take shape. Ether learns how you think through natural conversations that get deeper over time. Save memories, see your mind map grow, and build something that lasts.",
    bullets: [
      "Natural conversations that capture how you think",
      "Quick memory capture — save moments anytime",
      "Your mind map — a living picture of your intelligence",
    ],
  },
  {
    status: "Phase two · Next",
    pillTone: "insight",
    coreTone: "violet",
    bulletColor: "#8A7CFF",
    litColor: "#8A7CFF",
    title: "Bring It Alive",
    body: "Your Ether stops being data and starts being you. See yourself, hear yourself — a digital version that looks and sounds like the real thing.",
    bullets: [
      "AI avatar — a visual version of your Ether",
      "Voice cloning — your Ether speaks in your voice",
      "Real-time conversation with your digital mind",
    ],
  },
  {
    status: "Phase three · Future",
    pillTone: "neutral",
    coreTone: "gold",
    bulletColor: "rgba(148,163,184,0.6)",
    litColor: "#FFD27A",
    title: "Leave It Behind",
    body: "The people you love get access to everything you've built. Your intelligence stays in the family — and if you choose, the world.",
    bullets: [
      "Beneficiary access — your family can talk to your Ether",
      "Legacy controls — you decide who gets access and when",
      "Marketplace — share your mind publicly and earn from it",
    ],
  },
];

// Cross-fade between a flat 25%-opacity dim circle and the breathing core.
function TimelineDot({ phase, isLit }: { phase: Phase; isLit: boolean }) {
  return (
    <span className="relative block w-4 h-4">
      <span
        aria-hidden
        className="absolute inset-0 rounded-full transition-opacity duration-[600ms] ease-out"
        style={{ background: phase.litColor, opacity: isLit ? 0 : 0.25 }}
      />
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-[600ms] ease-out"
        style={{ opacity: isLit ? 1 : 0 }}
      >
        <BreathingCore tone={phase.coreTone} size={16} />
      </span>
    </span>
  );
}

type PhaseEntryProps = {
  phase: Phase;
  isLit: boolean;
  phaseRef: React.RefObject<HTMLLIElement | null>;
  dotRef: React.RefObject<HTMLDivElement | null>;
};

function PhaseEntry({ phase, isLit, phaseRef, dotRef }: PhaseEntryProps) {
  return (
    <li ref={phaseRef} className="relative pl-8 sm:pl-10">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 flex items-center justify-center w-4 h-4"
      >
        <TimelineDot phase={phase} isLit={isLit} />
      </div>
      <div className="mb-3">
        <StatusPill tone={phase.pillTone}>{phase.status}</StatusPill>
      </div>
      <h3
        className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold text-[19px] sm:text-[20px] mb-2"
        style={{ color: "#F3F5FF" }}
      >
        {phase.title}
      </h3>
      <p
        className="font-[Source_Serif_4,Georgia,serif] leading-[1.6] text-[15px] sm:text-[16px] mb-3"
        style={{ color: "#B0B8C6" }}
      >
        {phase.body}
      </p>
      <ul className="space-y-1.5 mt-3">
        {phase.bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2.5 font-[Inter,system-ui,sans-serif] text-[14px] leading-[1.6]"
            style={{ color: "#8A93A6" }}
          >
            <span
              aria-hidden
              className="inline-block flex-shrink-0 mt-[7px] w-[6px] h-[6px]"
              style={{ background: phase.bulletColor }}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Build() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const phase1Ref = useRef<HTMLLIElement | null>(null);
  const phase2Ref = useRef<HTMLLIElement | null>(null);
  const phase3Ref = useRef<HTMLLIElement | null>(null);
  const dot1Ref = useRef<HTMLDivElement | null>(null);
  const dot2Ref = useRef<HTMLDivElement | null>(null);
  const dot3Ref = useRef<HTMLDivElement | null>(null);
  const phaseRefs = [phase1Ref, phase2Ref, phase3Ref];
  const dotRefs = [dot1Ref, dot2Ref, dot3Ref];

  // Scroll progress through the timeline area: 0 when the viewport center is
  // at or above the timeline top, 1 when at or below the timeline bottom. With
  // this mapping a dot's fractional position within the timeline is exactly
  // the progress value at which it sits at the viewport center — so dots can
  // be lit by simply comparing `progress >= dotPositions[i]`.
  const [progress, setProgress] = useState(0);
  // Each dot's vertical position as a fraction of the timeline div's height.
  const [dotPositions, setDotPositions] = useState<number[]>([0.15, 0.5, 0.85]);
  // Lit state is monotonic — once a dot has been reached, it stays lit even
  // when the user scrolls back up.
  const monotonicLitRef = useRef<boolean[]>([false, false, false]);

  // Measure dot positions on layout and on resize.
  useEffect(() => {
    function compute() {
      const tl = timelineRef.current;
      if (!tl) return;
      const tlRect = tl.getBoundingClientRect();
      if (tlRect.height <= 0) return;
      const positions = dotRefs.map((ref) => {
        if (!ref.current) return 0;
        const dr = ref.current.getBoundingClientRect();
        return (dr.top + dr.height / 2 - tlRect.top) / tlRect.height;
      });
      setDotPositions(positions);
    }
    compute();
    const ro = new ResizeObserver(compute);
    if (timelineRef.current) ro.observe(timelineRef.current);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Vanilla scroll listener (framer-motion isn't in the project) coalesced
  // through requestAnimationFrame so we update at most once per frame.
  useEffect(() => {
    let raf = 0;
    function tick() {
      const tl = timelineRef.current;
      if (!tl) return;
      const r = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.height <= 0) return;
      // Trigger when a dot is at the viewport BOTTOM — i.e. it's just
      // entered the viewport. With this mapping, dot at fraction d in the
      // timeline lights at progress = d, so each phase fires "as soon as it
      // enters the viewport" rather than only when it reaches the center.
      const p = (vh - r.top) / r.height;
      setProgress(Math.max(0, Math.min(1, p)));
    }
    function onScroll() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Mutate the monotonic ref during render — refs don't trigger renders, so
  // this is safe; we read it the same render and pass primitive booleans to
  // children.
  dotPositions.forEach((pos, i) => {
    if (progress >= pos) monotonicLitRef.current[i] = true;
  });
  const lit = monotonicLitRef.current;

  // Each segment leads down to its phase's dot and carries that dot's color
  // when the phase is lit. Segment 1 (top of timeline → dot 1) → cyan.
  // Segment 2 (dot 1 → dot 2) → violet. Segment 3 (dot 2 → dot 3) → gold.
  const SEGMENT_COLORS = ["#3DD9FF", "#8A7CFF", "#FFD27A"] as const;
  const segmentRanges: Array<{ top: number; height: number; color: string; lit: boolean }> = [
    {
      top: 0,
      height: dotPositions[0],
      color: SEGMENT_COLORS[0],
      lit: lit[0],
    },
    {
      top: dotPositions[0],
      height: dotPositions[1] - dotPositions[0],
      color: SEGMENT_COLORS[1],
      lit: lit[1],
    },
    {
      top: dotPositions[1],
      height: dotPositions[2] - dotPositions[1],
      color: SEGMENT_COLORS[2],
      lit: lit[2],
    },
  ];

  // Glow color matches whichever segment the leading edge currently sits in.
  const glowColor =
    progress < dotPositions[0]
      ? SEGMENT_COLORS[0]
      : progress < dotPositions[1]
        ? SEGMENT_COLORS[1]
        : SEGMENT_COLORS[2];

  return (
    <section
      ref={sectionRef}
      id="section-build"
      className="relative min-h-screen flex items-center px-6 sm:px-8 py-20 sm:py-28"
    >
      <div className="max-w-[720px] mx-auto w-full">
        <div className="text-center mb-12 sm:mb-16">
          <p
            className="font-[Inter,system-ui,sans-serif] text-[11px] tracking-[0.18em] uppercase mb-5 font-medium"
            style={{ color: "var(--ether-gold)" }}
          >
            Where we are
          </p>
          <h2
            className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold leading-[1.15] mb-5 text-[26px] sm:text-[32px] md:text-[36px]"
            style={{ color: "#F3F5FF" }}
          >
            You're early. That's the point.
          </h2>
          <p
            className="font-[Source_Serif_4,Georgia,serif] leading-[1.6] mx-auto max-w-[580px] text-[16px] sm:text-[17px]"
            style={{ color: "#B0B8C6" }}
          >
            Ether is a build, not a launch. Every memory captured today shapes a product still being built. Founding Members aren't buying access. They're shaping how a 10/10 vault gets made.
          </p>
        </div>

        <div ref={timelineRef} className="relative">
          {/* Three discrete colored segments. Each segment starts dim slate
              gray at 15% opacity and transitions (background + opacity) to
              its phase's color at 85% opacity over 600ms when that phase
              lights up. Once lit, stays lit (monotonic ref). */}
          {segmentRanges.map((seg, i) => (
            <div
              key={`seg-${i}`}
              aria-hidden
              className="absolute left-[7px] w-px transition-all duration-[600ms] ease-out"
              style={{
                top: `${seg.top * 100}%`,
                height: `${seg.height * 100}%`,
                background: seg.lit ? seg.color : "rgb(148,163,184)",
                opacity: seg.lit ? 0.85 : 0.15,
              }}
            />
          ))}

          {/* Leading-edge glow — soft circle that always sits at the live
              scroll position inside the timeline, even before the fill has
              started. This is the part that makes the timeline feel alive. */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: "7px",
              top: `${progress * 100}%`,
              transform: "translate(-50%, -50%)",
              width: "32px",
              height: "32px",
              borderRadius: "9999px",
              background: `radial-gradient(circle, ${glowColor}99 0%, ${glowColor}44 40%, transparent 70%)`,
              opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
              transition: "background 250ms linear, opacity 250ms ease-out",
            }}
          />

          <ol className="space-y-12 sm:space-y-14">
            {PHASES.map((p, i) => (
              <PhaseEntry
                key={p.title}
                phase={p}
                isLit={lit[i]}
                phaseRef={phaseRefs[i]}
                dotRef={dotRefs[i]}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
