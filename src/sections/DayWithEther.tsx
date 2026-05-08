type Vignette = {
  emoji: string;
  label: string;
  body: string;
};

const VIGNETTES: Vignette[] = [
  {
    emoji: "🚗",
    label: "In the car",
    body: "Something pops into your head — a thing your kid said, an idea, a recipe someone told you. You hit the mic. It's saved.",
  },
  {
    emoji: "🚿",
    label: "The shower thought",
    body: "The good ones always come when your hands are wet. Talk to it when you get out. It'll be there forever.",
  },
  {
    emoji: "🛋️",
    label: "9pm on the couch",
    body: '"What was that thing John said about the renovation last week?" Ether reads it back. Word for word.',
  },
  {
    emoji: "☕",
    label: "Sunday morning",
    body: "Ether asks you a question only you can answer. Five minutes. Another piece of you is saved.",
  },
];

function VignetteCard({ emoji, label, body }: Vignette) {
  return (
    <div
      className="rounded-2xl border border-white/[0.06] p-7"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <div className="text-[28px] leading-none mb-4" aria-hidden>
        {emoji}
      </div>
      <p
        className="font-[Inter,system-ui,sans-serif] font-medium text-[11px] tracking-[0.18em] uppercase mb-3"
        style={{ color: "#8A7CFF" }}
      >
        {label}
      </p>
      <p
        className="font-[Source_Serif_4,Georgia,serif] text-[16px] leading-[1.55]"
        style={{ color: "#F3F5FF" }}
      >
        {body}
      </p>
    </div>
  );
}

export function DayWithEther() {
  return (
    <section
      id="section-day-with-ether"
      className="relative min-h-screen flex items-center px-6 sm:px-20 py-20 sm:py-[120px]"
    >
      <div className="max-w-[980px] mx-auto w-full">
        <div className="text-center mb-12 sm:mb-16">
          <p
            className="font-[Inter,system-ui,sans-serif] font-medium text-[11px] tracking-[0.18em] uppercase mb-6"
            style={{ color: "#8A7CFF" }}
          >
            What it's actually like
          </p>
          <h2
            className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold leading-[1.2] mx-auto max-w-[880px] text-[26px] sm:text-[34px] md:text-[40px]"
            style={{ color: "#F3F5FF" }}
          >
            Your phone has 14,000 photos and a notes app full of nothing.
            <br />
            Ether is where the actual you lives.
          </h2>
          <p
            className="font-[Source_Serif_4,Georgia,serif] italic leading-[1.5] mx-auto max-w-[600px] mt-6 text-[16px] sm:text-[18px]"
            style={{ color: "#B0B8C6" }}
          >
            You don't sit down and use it. You just talk to it. Anywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VIGNETTES.map((v) => (
            <VignetteCard key={v.label} emoji={v.emoji} label={v.label} body={v.body} />
          ))}
        </div>

        <p
          className="font-[Source_Serif_4,Georgia,serif] italic text-center leading-[1.4] mx-auto max-w-[600px] mt-16 text-[17px] sm:text-[20px]"
          style={{ color: "#B0B8C6" }}
        >
          You stop losing the small stuff.
          <br />
          And the small stuff is what you're made of.
        </p>
      </div>
    </section>
  );
}
