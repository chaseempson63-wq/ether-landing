import { BookOpen, Lightbulb, Heart, Flame } from "lucide-react";
import {
  BrainRingsViz,
  StatCard,
  StreakCard,
} from "@/components/DashboardParts";

export function Bridge() {
  return (
    <section
      id="section-bridge"
      className="relative min-h-screen flex items-center px-6 sm:px-12 lg:px-20 py-20 sm:py-28"
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-center">
        {/* Left column — text */}
        <div className="order-2 lg:order-1">
          <p
            className="font-[Inter,system-ui,sans-serif] text-[11px] tracking-[0.18em] uppercase mb-5 font-medium"
            style={{ color: "#3DD9FF" }}
          >
            The bridge
          </p>
          <h2
            className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold leading-[1.15] mb-6 text-[28px] sm:text-[36px] lg:text-[40px]"
            style={{ color: "#F3F5FF" }}
          >
            You're not building a profile.
            <br />
            You're building a mind.
          </h2>
          <p
            className="font-[Source_Serif_4,Georgia,serif] leading-[1.7] text-[16px] sm:text-[18px] mb-5"
            style={{ color: "#B0B8C6" }}
          >
            Ether listens to how you think — your stories, your reasoning, the shape of your decisions, the things you only say out loud. Over time, it becomes a living echo of how you'd answer, weigh, remember, love.
          </p>
          <p
            className="font-[Source_Serif_4,Georgia,serif] leading-[1.7] text-[16px] sm:text-[18px]"
            style={{ color: "#B0B8C6" }}
          >
            Not a recording. Not a chatbot. A version of you the people you love can still talk to.
          </p>
        </div>

        {/* Right column — dashboard preview */}
        <div className="order-1 lg:order-2 relative">
          <div
            className="rounded-3xl border border-white/10 backdrop-blur-md p-6 sm:p-8 animate-card-pulse-violet"
            style={{
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="mb-12">
              <BrainRingsViz
                nodes={37}
                connections={62}
                coherence={0.8}
                memoriesCount={18}
                insightsCount={8}
                valuesCount={11}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <StatCard
                label="Memories"
                count={18}
                deltaWeek={3}
                spark={[2, 4, 6, 9, 12, 15, 18]}
                color="#3DD9FF"
                icon={BookOpen}
              />
              <StatCard
                label="Insights"
                count={8}
                deltaWeek={1}
                spark={[1, 2, 3, 4, 5, 7, 8]}
                color="#8A7CFF"
                icon={Lightbulb}
              />
              <StatCard
                label="Values"
                count={11}
                deltaWeek={2}
                spark={[3, 5, 7, 8, 9, 10, 11]}
                color="#FF6FD1"
                icon={Heart}
              />
              <StatCard
                label="Streak"
                count={4}
                deltaWeek={0}
                spark={[]}
                color="#FFD27A"
                icon={Flame}
              />
            </div>

            <StreakCard
              days={4}
              week={[
                { label: "M", active: true },
                { label: "T", active: true },
                { label: "W", active: true },
                { label: "T", active: true, today: true },
                { label: "F", active: false },
                { label: "S", active: false },
                { label: "S", active: false },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
