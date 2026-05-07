import { BreathingCore, StatusPill } from "@/components/ether";
import type { StatusPillTone, BreathingCoreTone } from "@/components/ether";

type TimelineEntry = {
  status: string;
  pillTone: StatusPillTone;
  coreTone: BreathingCoreTone | "neutral";
  title: string;
  body: string;
};

const ENTRIES: TimelineEntry[] = [
  {
    status: "Shipped — April 2026",
    pillTone: "memory",
    coreTone: "cyan",
    title: "Halliday Interview Engine",
    body: "The four-phase conversational state machine that asks the questions only you can answer.",
  },
  {
    status: "Shipped — May 2026",
    pillTone: "insight",
    coreTone: "violet",
    title: "Mind Map + Persona Chat",
    body: "Watch your thinking take shape. Talk to the version of you Ether has learned so far.",
  },
  {
    status: "Shipping now",
    pillTone: "value",
    coreTone: "magenta",
    title: "Voice cloning (ElevenLabs)",
    body: "So when they ask, they hear you — not a transcript.",
  },
  {
    status: "On the roadmap",
    pillTone: "neutral",
    coreTone: "neutral",
    title: "Beneficiary Access",
    body: "The legacy layer. The people you choose, talking with your mind, long after.",
  },
];

function TimelineDot({ tone }: { tone: BreathingCoreTone | "neutral" }) {
  if (tone === "neutral") {
    return (
      <span
        className="block w-4 h-4 rounded-full"
        style={{ background: "rgba(148,163,184,0.25)" }}
      />
    );
  }
  return <BreathingCore tone={tone} size={16} />;
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
          {/* Vertical connector line */}
          <div
            aria-hidden
            className="absolute left-[7px] sm:left-[7px] top-2 bottom-2 w-px"
            style={{
              background:
                "linear-gradient(180deg, rgba(138,124,255,0.18), rgba(255,255,255,0.05))",
            }}
          />
          <ol className="space-y-8 sm:space-y-10">
            {ENTRIES.map((e) => (
              <li key={e.title} className="relative pl-8 sm:pl-10">
                <div className="absolute left-0 top-0 flex items-center justify-center w-4 h-4">
                  <TimelineDot tone={e.coreTone} />
                </div>
                <div className="mb-2">
                  <StatusPill tone={e.pillTone}>{e.status}</StatusPill>
                </div>
                <h3
                  className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold text-[19px] sm:text-[20px] mb-1.5"
                  style={{ color: "#F3F5FF" }}
                >
                  {e.title}
                </h3>
                <p
                  className="font-[Source_Serif_4,Georgia,serif] leading-[1.6] text-[15px] sm:text-[16px]"
                  style={{ color: "#B0B8C6" }}
                >
                  {e.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
