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
      const p = (vh / 2 - r.top) / r.height;
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

  // Track spans dot 1 → dot 3.
  const trackTopPct = dotPositions[0] * 100;
  const trackHeightPct = (dotPositions[2] - dotPositions[0]) * 100;
  const trackProgressRange = dotPositions[2] - dotPositions[0];
  // Bright fill grows from the top of the track to a clip-path bottom that
  // tracks the user's scroll position within the track.
  const fillProgress =
    trackProgressRange > 0
      ? Math.max(0, Math.min(1, (progress - dotPositions[0]) / trackProgressRange))
      : 0;

  // Dot 2's position within the track in percent — used as the cyan→violet
  // hard-stop in the fill gradient so each segment carries its phase's color.
  const dot2InTrackPct =
    trackProgressRange > 0
      ? ((dotPositions[1] - dotPositions[0]) / trackProgressRange) * 100
      : 50;

  // Glow color follows scroll position through the segments. Past dot 3 the
  // glow takes on phase 3's gold even though the fill itself ends at dot 3.
  const glowColor =
    progress < dotPositions[1]
      ? "#3DD9FF"
      : progress < dotPositions[2]
        ? "#8A7CFF"
        : "#FFD27A";

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
          {/* Dim track from dot 1 to dot 3 — drawn at all times. */}
          <div
            aria-hidden
            className="absolute left-[7px] w-px"
            style={{
              top: `${trackTopPct}%`,
              height: `${trackHeightPct}%`,
              background: "rgb(148,163,184)",
              opacity: 0.15,
            }}
          />

          {/* Bright fill — same span, color-stopped (cyan above dot 2,
              violet below), clipped from below by scroll progress. The fill
              moves continuously with scroll, not in discrete steps. */}
          <div
            aria-hidden
            className="absolute left-[7px] w-px"
            style={{
              top: `${trackTopPct}%`,
              height: `${trackHeightPct}%`,
              background: `linear-gradient(to bottom, #3DD9FF 0%, #3DD9FF ${dot2InTrackPct}%, #8A7CFF ${dot2InTrackPct}%, #8A7CFF 100%)`,
              opacity: 0.85,
              clipPath: `inset(0 0 ${(1 - fillProgress) * 100}% 0)`,
            }}
          />

          {/* Phase 3 gold overlay — when phase 3 lights up, the dot 2 → dot 3
              segment of the fill transitions from violet to gold to match the
              dot's color. Layered on top of the cyan/violet fill at the same
              0.85 opacity, with the same 600ms ease-out fade as the dots. By
              the time phase 3 lights, scroll progress has already pushed the
              fill all the way to dot 3, so this overlay sits exactly over the
              violet section it replaces. */}
          <div
            aria-hidden
            className="absolute left-[7px] w-px transition-opacity duration-[600ms] ease-out"
            style={{
              top: `${dotPositions[1] * 100}%`,
              height: `${(dotPositions[2] - dotPositions[1]) * 100}%`,
              background: "#FFD27A",
              opacity: lit[2] ? 0.85 : 0,
            }}
          />

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
