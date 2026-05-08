import { useEffect, useState, useRef } from "react";
import { Wound } from "./sections/Wound";
import { Gone } from "./sections/Gone";
import { DayWithEther } from "./sections/DayWithEther";
import { Bridge } from "./sections/Bridge";
import { Future } from "./sections/Future";
import { Build } from "./sections/Build";
import { Ask } from "./sections/Ask";
import { Footer } from "./sections/Footer";
import { EtherAvatar } from "./companion/EtherAvatar";

const SECTION_ORDER = ["wound", "gone", "day-with-ether", "bridge", "future", "build", "ask"];

const SECTION_MESSAGES = {
  wound: "One day they'll ask what you were really like. Make sure they have an answer.",
  gone: "This is what disappears. Every time. Until something changes that.",
  "day-with-ether": "Five seconds to capture. Forever to keep. That's the deal.",
  bridge: "This is your mind, visualized. The bigger the node, the deeper I know it.",
  future: "The more I know, the more I sound like you.",
  build: "You're early. Everything you add now becomes part of how this is built.",
  ask: "This is the legacy part. They'll be able to talk to your mind someday. Help us build it right.",
};

function scrollToSection(id) {
  const el = document.getElementById(`section-${id}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState("wound");
  const [autoOpenFM, setAutoOpenFM] = useState(false);
  const initializedRef = useRef(false);

  // Detect ?ref=fm on initial mount and trigger FM modal once we scroll to Ask.
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("ref") === "fm") {
        setAutoOpenFM(true);
        // Small delay so the section is rendered before we scroll.
        setTimeout(() => scrollToSection("ask"), 250);
      }
    } catch {
      // ignore
    }
  }, []);

  // IntersectionObserver — track which section is centered in the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.replace("section-", ""));
          }
        });
      },
      { threshold: 0, rootMargin: "-50% 0px -50% 0px" },
    );
    SECTION_ORDER.forEach((s) => {
      const el = document.getElementById(`section-${s}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleReserve = () => {
    scrollToSection("ask");
  };

  const handleFoundingMember = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("ref", "fm");
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
    setAutoOpenFM(true);
    scrollToSection("ask");
  };

  const handleAutoOpenHandled = () => setAutoOpenFM(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white" style={{ backgroundColor: "var(--ether-bg0)" }}>
      {/* Three-corner aurora wash — full-bleed, fixed, behind everything */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(900px 600px at 10% -10%, color-mix(in srgb, var(--ether-violet) 18%, transparent), transparent 60%), radial-gradient(800px 500px at 100% 10%, color-mix(in srgb, var(--ether-cyan) 12%, transparent), transparent 60%), radial-gradient(700px 400px at 50% 110%, color-mix(in srgb, var(--ether-magenta) 10%, transparent), transparent 60%)",
        }}
      />

      <main className="relative z-10">
        <Wound onPrimaryCTA={handleReserve} onFoundingMemberCTA={handleFoundingMember} />
        <Gone />
        <DayWithEther />
        <Bridge />
        <Future />
        <Build />
        <Ask autoOpenFM={autoOpenFM} onAutoOpenHandled={handleAutoOpenHandled} />
        <Footer />
      </main>

      <EtherAvatar
        message={SECTION_MESSAGES[activeSection]}
        sectionKey={activeSection}
      />
    </div>
  );
}
