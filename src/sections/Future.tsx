import { MindMapStatic } from "@/components/ether";

export function Future() {
  return (
    <section
      id="section-future"
      className="relative py-20 sm:py-28"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Mind Map header */}
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
          constellation has room to breathe horizontally. The aspect ratio
          is locked to the SVG viewBox so the container hugs the
          constellation without letterbox bands above or below. */}
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-6">
        <div
          className="relative w-full overflow-hidden rounded-2xl aspect-[1200/420]"
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
