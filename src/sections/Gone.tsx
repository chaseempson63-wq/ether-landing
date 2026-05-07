import { Sparkles, Brain, Heart, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const RED = "#ef4444";

type Card = {
  icon: LucideIcon;
  description: string;
};

const CARDS: Card[] = [
  { icon: Sparkles, description: "40 years of hard-earned wisdom" },
  { icon: Brain, description: "Irreplaceable reasoning patterns" },
  { icon: Heart, description: "Values that shaped a family" },
  { icon: BookOpen, description: "Lessons that took decades to learn" },
];

function GoneCard({ icon: Icon, description }: Card) {
  return (
    <div
      className="aspect-square rounded-2xl border border-white/[0.06] p-4 sm:p-5 flex flex-col items-center text-center"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <Icon className="h-7 w-7 sm:h-8 sm:w-8 mb-3 sm:mb-4" style={{ color: RED }} aria-hidden />
      <p
        className="font-[Source_Serif_4,Georgia,serif] leading-[1.4] text-[13px] sm:text-[15px] flex-1 flex items-center"
        style={{ color: "#B0B8C6" }}
      >
        {description}
      </p>
      <p
        className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold text-[16px] sm:text-[18px] mt-3 sm:mt-4"
        style={{ color: RED }}
      >
        Gone.
      </p>
    </div>
  );
}

export function Gone() {
  return (
    <section
      id="section-gone"
      className="relative min-h-screen flex items-center px-6 sm:px-12 lg:px-20 py-20 sm:py-28"
    >
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-14 sm:mb-20">
          <p
            className="font-[Inter,system-ui,sans-serif] text-[11px] tracking-[0.18em] uppercase mb-6 font-medium"
            style={{ color: "#B0B8C6" }}
          >
            The problem
          </p>
          <h2
            className="font-[Space_Grotesk,system-ui,sans-serif] font-bold leading-[1.1] mx-auto max-w-[1100px] text-[28px] sm:text-[44px] md:text-[56px]"
            style={{ color: "#F3F5FF" }}
          >
            When someone dies, everything they knew dies with them.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CARDS.map((c) => (
            <GoneCard key={c.description} icon={c.icon} description={c.description} />
          ))}
        </div>

        <p
          className="font-[Source_Serif_4,Georgia,serif] italic text-center leading-[1.5] mx-auto max-w-[680px] mt-12 sm:mt-16 text-[16px] sm:text-[18px]"
          style={{ color: "#8A93A6" }}
        >
          The largest, most consistent loss of intelligence in human history. Until now.
        </p>
      </div>
    </section>
  );
}
