import { BreathingCore } from "@/components/ether";
import { EtherButton } from "@/components/ether";

type Props = {
  onPrimaryCTA: () => void;
  onFoundingMemberCTA: () => void;
};

export function Wound({ onPrimaryCTA, onFoundingMemberCTA }: Props) {
  return (
    <section
      id="section-wound"
      className="relative min-h-screen flex flex-col px-6 sm:px-8"
    >
      {/* ETHER wordmark — plain styled text, no SVG asset. */}
      <header className="pt-6 sm:pt-8">
        <span
          className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold text-[14px] tracking-[0.3em]"
          style={{ color: "#5a6573" }}
        >
          ETHER
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-[720px] mx-auto w-full">
        <div
          className="animate-float-in mb-8 sm:mb-10"
          style={{ animationDelay: "0ms" }}
        >
          <span className="inline-block sm:hidden">
            <BreathingCore tone="violet" size={88} />
          </span>
          <span className="hidden sm:inline-block">
            <BreathingCore tone="violet" size={120} />
          </span>
        </div>

        <p
          className="animate-float-in font-[Inter,system-ui,sans-serif] text-[11px] tracking-[0.18em] uppercase mb-5"
          style={{ color: "#B0B8C6", animationDelay: "100ms" }}
        >
          A quiet project for the people who matter most
        </p>

        <h1
          className="animate-float-in font-[Space_Grotesk,system-ui,sans-serif] font-semibold leading-[1.1] mb-6 text-[36px] sm:text-[48px] md:text-[56px]"
          style={{ color: "#F3F5FF", animationDelay: "200ms" }}
        >
          One day they'll ask what you were really like.
          <br />
          Make sure they have an answer.
        </h1>

        <p
          className="animate-float-in font-[Source_Serif_4,Georgia,serif] italic font-normal leading-[1.5] mb-10 sm:mb-12 text-[18px] sm:text-[22px] max-w-[540px]"
          style={{ color: "#B0B8C6", animationDelay: "300ms" }}
        >
          Photos remember faces. Voicemails keep voices. Ether keeps the way you think — so the people you love can still ask, and still get you.
        </p>

        <div
          className="animate-float-in flex flex-col items-center gap-4"
          style={{ animationDelay: "400ms" }}
        >
          <EtherButton
            variant="primary"
            onClick={onPrimaryCTA}
            className="px-7 py-3 text-[15px]"
          >
            Reserve my place →
          </EtherButton>
          <button
            onClick={onFoundingMemberCTA}
            className="font-[Inter,system-ui,sans-serif] text-[14px] hover:underline"
            style={{ color: "var(--ether-violet)" }}
          >
            Or become a Founding Member
          </button>
        </div>
      </div>
    </section>
  );
}
