import { BreathingCore, StatusPill } from "@/components/ether";
import type { StatusPillTone, BreathingCoreTone } from "@/components/ether";

type Phase = {
  status: string;
  pillTone: StatusPillTone;
  coreTone: BreathingCoreTone | "neutral";
  bulletColor: string;
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
    coreTone: "neutral",
    bulletColor: "rgba(148,163,184,0.6)",
    title: "Leave It Behind",
    body: "The people you love get access to everything you've built. Your intelligence stays in the family — and if you choose, the world.",
    bullets: [
      "Beneficiary access — your family can talk to your Ether",
      "Legacy controls — you decide who gets access and when",
      "Marketplace — share your mind publicly and earn from it",
    ],
  },
];

function TimelineDot({ tone }: { tone: BreathingCoreTone | "neutral" }) {
  if (tone === "neutral") {
    return (
      <span
        className="block w-4 h-4 rounded-full"
        style={{ background: "rgba(148,163,184,0.25)", opacity: 0.5 }}
      />
    );
  }
  return <BreathingCore tone={tone} size={16} />;
}

function PhaseEntry({ phase }: { phase: Phase }) {
  return (
    <li className="relative pl-8 sm:pl-10">
      <div className="absolute left-0 top-0 flex items-center justify-center w-4 h-4">
        <TimelineDot tone={phase.coreTone} />
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
  return (
    <section
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

        <div className="relative">
          <div
            aria-hidden
            className="absolute left-[7px] sm:left-[7px] top-2 bottom-2 w-px"
            style={{
              background:
                "linear-gradient(180deg, rgba(138,124,255,0.18), rgba(255,255,255,0.05))",
            }}
          />
          <ol className="space-y-12 sm:space-y-14">
            {PHASES.map((p) => (
              <PhaseEntry key={p.title} phase={p} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
