import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";
import {
  Mic, Fingerprint, Brain, Shield, Users, Lock,
  Sparkles, Heart, BookOpen, Zap, Lightbulb,
  MessageCircle, ChevronRight, Menu, X
} from "lucide-react";

/* ─── Google Fonts + Global Reset ─── */
const injectStyles = () => {
  if (document.getElementById("ether-fonts")) return;
  const link = document.createElement("link");
  link.id = "ether-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Source+Serif+4:ital,wght@0,400;1,400;1,600&display=swap";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; scroll-padding-top: 80px; }
    body { font-family: 'Sora', sans-serif; background: #080b14; color: #f4f1ea; -webkit-font-smoothing: antialiased; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }

    /* Cards render in their "lit" state on every device; hover adds a small desktop-only lift. */
    .card-lit {
      transition: transform 0.35s cubic-bezier(.16,1,.3,1), border-color 0.35s ease, box-shadow 0.35s ease;
    }
    @media (hover: hover) and (pointer: fine) {
      .card-lit:hover {
        transform: translateY(-2px) !important;
        border-color: rgba(59,130,246,0.3) !important;
        box-shadow: 0 10px 32px rgba(59,130,246,0.12);
      }
    }
  `;
  document.head.appendChild(style);
};

/* ─── useInView hook ─── */
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); obs.unobserve(el); } },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, isInView];
};

/* ─── Reveal wrapper ─── */
const Reveal = ({ children, delay = 0, className = "", y = 30 }) => {
  const [ref, isInView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

/* ─── Stat Block ─── */
const StatBlock = ({ number, label, delay = 0 }) => {
  const [ref, isInView] = useInView();
  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "scale(1)" : "scale(0.85)",
        transition: `all 0.6s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 48, color: "#f4f1ea", lineHeight: 1 }}>
        {number}
      </div>
      <div style={{ fontSize: 13, color: "#64748b", fontWeight: 300, marginTop: 8, letterSpacing: "0.04em" }}>
        {label}
      </div>
    </div>
  );
};

/* ─── Feature Card ─── */
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const [ref, isInView] = useInView();
  const IconComp = icon;
  return (
    <div
      ref={ref}
      className="card-lit"
      style={{
        borderRadius: 16,
        padding: 32,
        background: "rgba(59,130,246,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(59,130,246,0.15)",
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s, border-color 0.35s ease, box-shadow 0.35s ease`,
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 48, height: 48, borderRadius: 12,
          background: "rgba(59,130,246,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <IconComp size={22} style={{ color: "#3b82f6" }} />
      </div>
      <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: "#f4f1ea", marginBottom: 10 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 300, lineHeight: 1.7 }}>{description}</p>
    </div>
  );
};

/* ─── FAQ Item ─── */
const FAQItem = ({ question, answer, isLast }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 0", background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, color: "#f4f1ea", textAlign: "left",
        }}
      >
        <span>{question}</span>
        <ChevronRight
          size={18}
          style={{
            color: "#3b82f6", flexShrink: 0, marginLeft: 16,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? 500 : 0, overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 300, lineHeight: 1.8, paddingBottom: 20 }}>
          {answer}
        </p>
      </div>
    </div>
  );
};

/* ─── Roadmap ─── */
const Roadmap = () => {
  const phases = [
    {
      label: "Phase One",
      trigger: "At 1,000 Founding Members",
      name: "The Foundation",
      description: "Ether launches. Founding Members get lifetime access at the founding price, unlimited sessions across all five Halliday layers, and three beneficiary seats. The vault opens.",
      milestones: [
        "Full Halliday interview flow — all five layers",
        "Graph memory architecture — your mind, preserved",
        "Founding Member access — lifetime pricing locked",
      ],
    },
    {
      label: "Phase Two",
      trigger: "At 60% Halliday Completeness",
      name: "The Mind Alive",
      description: "Once a mind is deep enough to hold its own, it becomes a mind you can talk to. Voice, presence, and conversation unlock — your Ether stops being an archive and starts being alive.",
      milestones: [
        "Voice cloning — your Ether speaks in your voice",
        "Conversational avatar — real-time dialogue with your preserved mind",
        "Mobile app — your Ether in your pocket",
      ],
    },
    {
      label: "Phase Three",
      trigger: "At 10,000 users",
      name: "The Legacy Network",
      description: "Ether becomes more than a personal vault. Beneficiaries inherit your mind. Public Ethers join the marketplace. Intelligence compounds across generations — and revenue flows back to the minds that built it.",
      milestones: [
        "Beneficiary system — designate who inherits your Ether",
        "Marketplace launch — public Ethers become queryable",
        "Generational royalty inheritance — your mind keeps earning",
      ],
    },
  ];

  const [activePhase, setActivePhase] = useState(0);
  const phaseRefs = useRef([null, null, null]);
  const phasesContainerRef = useRef(null);
  const [rail, setRail] = useState({ top: 0, height: 0, fill: 0 });
  const NODE_TOP_OFFSET = 10; // node center y within each phase block

  // Active phase tracking — IntersectionObserver scroll-spy at viewport center
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = phaseRefs.current.findIndex((r) => r === entry.target);
            if (idx !== -1) setActivePhase(idx);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    phaseRefs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  // Measure rail position + fill height (re-measure on activePhase, resize, font load)
  useEffect(() => {
    const measure = () => {
      const first = phaseRefs.current[0];
      const last = phaseRefs.current[2];
      const active = phaseRefs.current[activePhase];
      if (!first || !last || !active) return;
      const top = first.offsetTop + NODE_TOP_OFFSET;
      const bottom = last.offsetTop + NODE_TOP_OFFSET;
      const fill = active.offsetTop + NODE_TOP_OFFSET - top;
      setRail({ top, height: bottom - top, fill });
    };
    measure();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activePhase]);

  const nodeStyle = (i) => {
    const isActive = i === activePhase;
    const isCompleted = i < activePhase;
    if (isActive) {
      return { width: 14, height: 14, background: "#3b82f6", opacity: 1, border: "0px solid transparent" };
    }
    if (isCompleted) {
      return { width: 14, height: 14, background: "#3b82f6", opacity: 0.6, border: "0px solid transparent" };
    }
    return { width: 10, height: 10, background: "transparent", opacity: 1, border: "1.5px solid rgba(59,130,246,0.3)" };
  };

  return (
    <section style={{ padding: "96px 32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        .roadmap-container { max-width: 720px; width: 100%; }
        .roadmap-phase     { padding-left: 64px; }
        .roadmap-phase + .roadmap-phase { margin-top: 96px; }
        .roadmap-rail      { left: 32px; }
        .roadmap-node      { left: 33px; }
        .roadmap-name      { font-size: 32px; }
        .roadmap-desc      { font-size: 18px; }
        @media (max-width: 767px) {
          .roadmap-phase   { padding-left: 44px; }
          .roadmap-phase + .roadmap-phase { margin-top: 64px; }
          .roadmap-rail    { left: 20px; }
          .roadmap-node    { left: 21px; }
          .roadmap-name    { font-size: 24px; }
          .roadmap-desc    { font-size: 16px; }
        }
      `}</style>

      {/* Section header */}
      <Reveal>
        <div style={{
          fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em",
          color: "#64748b", fontWeight: 600, marginBottom: 16, textAlign: "center",
        }}>
          The Roadmap
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontWeight: 500,
          fontSize: "clamp(26px, 3.6vw, 38px)", color: "#f4f1ea",
          lineHeight: 1.2, letterSpacing: "-0.01em", maxWidth: 720,
          textAlign: "center",
        }}>
          Built in phases. Designed to last generations.
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p style={{
          fontSize: 17, color: "#94a3b8", fontWeight: 300, lineHeight: 1.7,
          maxWidth: 600, marginTop: 24, textAlign: "center",
        }}>
          Ether doesn't ship everything at once. Each phase unlocks when we reach the milestone that earns it — patient by design.
        </p>
      </Reveal>

      {/* Phases */}
      <div ref={phasesContainerRef} className="roadmap-container" style={{ position: "relative", marginTop: 80, textAlign: "left" }}>
        {/* Rail background */}
        <div className="roadmap-rail" aria-hidden="true" style={{
          position: "absolute",
          top: rail.top, width: 2, height: rail.height,
          background: "rgba(255,255,255,0.08)",
          transform: "translateX(-50%)",
        }} />
        {/* Rail fill */}
        <div className="roadmap-rail" aria-hidden="true" style={{
          position: "absolute",
          top: rail.top, width: 2, height: rail.fill,
          background: "#3b82f6", opacity: 0.6,
          transform: "translateX(-50%)",
          transition: "height 400ms ease",
        }} />

        {phases.map((p, i) => {
          const isActive = i === activePhase;
          return (
            <div
              key={i}
              ref={(el) => (phaseRefs.current[i] = el)}
              className="roadmap-phase"
              style={{ position: "relative" }}
            >
              {/* Node */}
              <div className="roadmap-node" aria-hidden="true" style={{
                position: "absolute",
                top: NODE_TOP_OFFSET,
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                transition: "all 400ms ease",
                ...nodeStyle(i),
              }} />

              {/* Phase label + Unlock trigger */}
              <div style={{ display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap", marginBottom: 12 }}>
                <span style={{
                  fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 500,
                  color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  {p.label}
                </span>
                <span style={{
                  fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 400, color: "#3b82f6",
                }}>
                  {p.trigger}
                </span>
              </div>

              {/* Milestone name */}
              <h3 className="roadmap-name" style={{
                fontFamily: "'Sora', sans-serif", fontWeight: 500,
                color: "#f4f1ea", lineHeight: 1.2, letterSpacing: "-0.01em",
                opacity: isActive ? 1 : 0.35,
                transition: "opacity 400ms ease",
                marginBottom: 16,
              }}>
                {p.name}
              </h3>

              {/* Description */}
              <p className="roadmap-desc" style={{
                fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400,
                color: "#94a3b8", lineHeight: 1.7,
                opacity: isActive ? 1 : 0.35,
                transition: "opacity 400ms ease",
                marginBottom: 24,
              }}>
                {p.description}
              </p>

              {/* Milestones list */}
              <ul style={{
                listStyle: "none", padding: 0, margin: 0,
                opacity: isActive ? 1 : 0.35,
                transition: "opacity 400ms ease",
              }}>
                {p.milestones.map((m, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <span aria-hidden="true" style={{
                      width: 4, height: 4, background: "#3b82f6",
                      flexShrink: 0, marginTop: 11,
                    }} />
                    <span style={{
                      fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 400,
                      color: "#f4f1ea", lineHeight: 1.8,
                    }}>
                      {m}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function EtherLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenu(false);
  };

  useEffect(() => {
    injectStyles();
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    setFormError("");

    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase() });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        setFormError("Already on the list.");
      } else {
        setFormError("Something went wrong. Try again.");
      }
      return;
    }

    setSubmitted(true);
  };

  const sectionLabel = (text) => (
    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "#3b82f6", fontWeight: 600, marginBottom: 16 }}>
      {text}
    </div>
  );

  const heading = (text, extra = {}) => (
    <h2
      style={{
        fontFamily: "'Sora', sans-serif", fontWeight: 700, textTransform: "uppercase",
        fontSize: "clamp(24px, 4vw, 40px)", color: "#f4f1ea", lineHeight: 1.15,
        letterSpacing: "-0.01em", maxWidth: 780, ...extra,
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  /* ─── Data ─── */
  const problemCards = [
    { icon: Sparkles, text: "40 years of hard-earned wisdom", color: "#ef4444" },
    { icon: Brain, text: "Irreplaceable reasoning patterns", color: "#ef4444" },
    { icon: Heart, text: "Values that shaped a family", color: "#ef4444" },
    { icon: BookOpen, text: "Lessons that took decades to learn", color: "#ef4444" },
  ];

  const features = [
    { icon: Mic, title: "Daily Reflection", desc: "15 minutes a day. Journal, voice notes, and guided prompts that capture how you actually think." },
    { icon: Fingerprint, title: "Five Identity Layers", desc: "Voice, memory, reasoning, values, emotional patterns. Each layer makes your AI more accurate, more you." },
    { icon: Brain, title: "AI That Thinks Like You", desc: "A persona engine that retrieves your real memories and reasoning to generate responses in your voice." },
    { icon: Shield, title: "Truthfulness Tags", desc: "Every response labelled: Known Memory, Likely Inference, or Speculation. Your family always knows the source." },
    { icon: Users, title: "Legacy Access", desc: "Choose who inherits your Digital Mind. Full, restricted, or legacy-only — enforced at the platform level." },
    { icon: Lock, title: "Your Data. Period.", desc: "Encrypted, private, never used for training. Accessible only to you and whoever you explicitly grant access to." },
  ];

  const stories = [
    { color: "#10b981", icon: Sparkles, title: "The Farmer", text: "42 years of knowledge — soil, seasons, suppliers, hard decisions. He died on a Tuesday. By Wednesday, it was all memories of memories. With Ether, his family can still ask what he would have done." },
    { color: "#3b82f6", icon: Heart, title: "The Parent", text: "Sarah spends 15 minutes a day reflecting on what she'd tell her daughter at 18, at 25, at 40. She's not building a memorial. She's building a presence that will still be there." },
    { color: "#8b5cf6", icon: Lightbulb, title: "The Founder", text: "23 years of pattern recognition, hard decisions, and lessons that cost real money. When Marcus steps back, his intelligence doesn't step back with him. It stays. Searchable. Alive." },
  ];

  const testimonials = [
    { quote: "The AI is a mirror before it becomes a legacy. I understood myself better after one session.", attr: "Early Access Member" },
    { quote: "My dad passed two years ago. He was a builder for thirty years. Ether is what I wish had existed.", attr: "Waitlist Member" },
    { quote: "I'm not doing this for when I die. The process of building it is making me sharper every day.", attr: "Beta User" },
  ];

  const faqs = [
    { q: "Will it actually sound like me?", a: "Yes — and it gets more accurate over time. Ether doesn't generate a generic personality. It builds across five distinct identity layers: your voice, your memories, your reasoning patterns, your values, and your emotional responses. Early access members report that people who know them well start recognising the accuracy within the first few weeks. Every response is also tagged with a truthfulness label — Known Memory, Likely Inference, or Speculation — so your family never has to wonder whether something came from you or was filled in by AI." },
    { q: "What happens when I die?", a: "Your profile enters legacy mode — permanently accessible to whoever you've nominated as beneficiaries. Nothing shuts off. Nothing decays. Nothing gets deleted. You control the access levels before anything happens: full access, restricted access, or legacy-only. These permissions are enforced at the platform level, not by a family member's honour system. Your Digital Mind remains exactly as you built it, available to the people you chose, for as long as Ether exists. We're also building legal and structural safeguards to ensure long-term continuity beyond any single company decision." },
    { q: "Is my data safe?", a: "Your data belongs to you. Full stop. It is encrypted at rest and in transit, never used to train any AI model, never shared with third parties, and never sold. You are the only person who can access your data unless you explicitly grant permission to someone else. There is no advertising layer. There is no data marketplace. Ether's business model is subscription-based — we make money when you pay us, not when we monetise your information. If you ever want to delete your data, you can. It's gone. Permanently." },
    { q: "What does it cost?", a: "We haven't publicly announced pricing yet — waitlist members will be the first to see exact numbers. What we can say is that founding members will lock in pricing significantly below public launch rates, and that pricing will stay locked for as long as you remain a member. There are no hidden fees, no upsells, and no bait-and-switch. The waitlist is completely free to join and requires no credit card." },
    { q: "What if my input is shallow?", a: "That's completely normal at the start — and the platform is designed for it. Ether uses a guided framework across five identity layers that helps you go deeper naturally, without pressure. You might start with surface-level reflections, but the prompts are designed to draw out reasoning, values, and decision-making patterns you don't usually articulate. Most members say the depth surprises them within the first couple of weeks. You move at your own pace. There's no minimum. Fifteen minutes a day is enough — and even that isn't mandatory. The AI reflects what you give it, and it gets sharper as you do." },
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#080b14", overflow: "hidden" }}>
      {/* ─── Background ─── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.05), transparent 65%)", pointerEvents: "none" }} />

      {/* ─── Content wrapper ─── */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* ═══ NAVBAR ═══ */}
        <nav
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
            background: scrolled ? "rgba(8,11,20,0.82)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "1px solid transparent",
            transition: "all 0.4s ease",
          }}
        >
          <a href="#top" onClick={scrollTo("top")} style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 20, color: "#f4f1ea", textDecoration: "none", letterSpacing: "-0.03em" }}>
            Ether
          </a>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="nav-links">
            {["Features", "Stories", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={scrollTo(l.toLowerCase())} style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", fontWeight: 400, transition: "color 0.2s", display: "var(--nav-link-display, none)", cursor: "pointer" }}
                onMouseEnter={(e) => (e.target.style.color = "#f4f1ea")} onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}>
                {l}
              </a>
            ))}
            <a href="#waitlist" onClick={scrollTo("waitlist")} style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: "#3b82f6", padding: "8px 18px", borderRadius: 8, textDecoration: "none", transition: "background 0.2s", cursor: "pointer" }}
              onMouseEnter={(e) => (e.target.style.background = "#2563eb")} onMouseLeave={(e) => (e.target.style.background = "#3b82f6")}>
              Get Early Access
            </a>
            <button onClick={() => setMobileMenu(!mobileMenu)} style={{ display: "var(--menu-btn-display, block)", background: "none", border: "none", color: "#f4f1ea", cursor: "pointer", padding: 4 }}>
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          <style>{`
            @media (min-width: 768px) {
              .nav-links a { --nav-link-display: inline !important; }
              .nav-links button { --menu-btn-display: none !important; }
            }
          `}</style>
        </nav>

        {/* Mobile menu */}
        {mobileMenu && (
          <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 49, background: "rgba(8,11,20,0.95)", backdropFilter: "blur(20px)", padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: 20 }}>
            {["Features", "Stories", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={scrollTo(l.toLowerCase())} style={{ fontSize: 15, color: "#f4f1ea", textDecoration: "none", fontWeight: 400, cursor: "pointer" }}>{l}</a>
            ))}
          </div>
        )}

        {/* ═══ HERO ═══ */}
        <section id="top" style={{ padding: "160px 32px 80px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal delay={0}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: 999, padding: "8px 18px", fontSize: 13, color: "#3b82f6", fontWeight: 500, marginBottom: 28,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", animation: "pulse 2s ease infinite" }} />
              Founding Member access — limited to 1,000
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: "italic", fontWeight: 400, color: "#94a3b8",
              fontSize: "clamp(16px, 1.7vw, 20px)", lineHeight: 1.5,
              marginBottom: 24,
            }}>
              The vault for the most valuable thing you've ever built.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 700, textTransform: "uppercase",
              fontSize: "clamp(32px, 5.6vw, 58px)", color: "#f4f1ea", lineHeight: 1.05,
              letterSpacing: "-0.02em", maxWidth: 900,
            }}>
              Your mind is the most valuable thing you'll ever build
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p style={{ fontSize: 17, color: "#94a3b8", fontWeight: 300, lineHeight: 1.7, maxWidth: 500, marginTop: 24 }}>
              Ether preserves how you think, decide, and reason — so your intelligence is never lost.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div style={{ display: "flex", gap: 14, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="#waitlist" onClick={scrollTo("waitlist")} style={{
                fontSize: 15, fontWeight: 600, color: "#fff", background: "#3b82f6",
                padding: "14px 28px", borderRadius: 10, textDecoration: "none",
                boxShadow: "0 0 24px rgba(59,130,246,0.25)", transition: "all 0.2s", cursor: "pointer",
              }}>
                Build My Ether →
              </a>
              <a href="#features" onClick={scrollTo("features")} style={{
                fontSize: 15, fontWeight: 500, color: "#f4f1ea",
                padding: "14px 28px", borderRadius: 10, textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.2s", cursor: "pointer",
              }}>
                See The Framework
              </a>
            </div>
          </Reveal>
        </section>

        {/* ═══ STATS BAR ═══ */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "48px 32px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <StatBlock number="5" label="Identity Layers" delay={0} />
            <StatBlock number="15m" label="Per Day" delay={0.15} />
          </div>
        </section>

        {/* ═══ THE PROBLEM ═══ */}
        <section style={{ padding: "96px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal>{sectionLabel("The Problem")}</Reveal>
          <Reveal delay={0.1}>
            {heading("WHEN SOMEONE DIES, EVERYTHING THEY KNEW DIES WITH THEM")}
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, maxWidth: 860, width: "100%", marginTop: 48 }}>
            {problemCards.map((card, i) => {
              const IconComp = card.icon;
              return (
                <Reveal key={i} delay={0.15 + i * 0.08}>
                  <div style={{
                    borderRadius: 16, padding: 28,
                    background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.05)", textAlign: "center",
                    display: "flex", flexDirection: "column", alignItems: "center",
                  }}>
                    <IconComp size={24} style={{ color: "#ef4444", opacity: 0.7, marginBottom: 14, display: "block" }} />
                    <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 300, lineHeight: 1.6, marginBottom: 10 }}>{card.text}</p>
                    <span style={{ color: "#ef4444", fontWeight: 600, fontSize: 14 }}>Gone.</span>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.5}>
            <p style={{
              fontFamily: "'Source Serif 4', serif", fontStyle: "italic",
              fontSize: 17, color: "#94a3b8", maxWidth: 600, marginTop: 48, lineHeight: 1.7,
            }}>
              The largest, most consistent loss of intelligence in human history. Until now.
            </p>
          </Reveal>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section id="features" style={{ padding: "96px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal>{sectionLabel("How Ether Works")}</Reveal>
          <Reveal delay={0.1}>
            <h2 style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 700, textTransform: "uppercase",
              fontSize: "clamp(24px, 4vw, 40px)", color: "#f4f1ea", lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}>
              NOT A SCRAPBOOK. NOT A CHATBOT.<br />
              <span style={{ color: "#3b82f6" }}>A LIVING INTELLIGENCE.</span>
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, maxWidth: 960, width: "100%", marginTop: 48, textAlign: "left" }}>
            {features.map((f, i) => (
              <FeatureCard key={i} icon={f.icon} title={f.title} description={f.desc} delay={0.1 + i * 0.07} />
            ))}
          </div>
        </section>

        {/* ═══ ALIVE-FIRST STRIP ═══ */}
        <section style={{
          padding: "96px 32px", textAlign: "center",
          display: "flex", flexDirection: "column", alignItems: "center",
          background: "linear-gradient(to bottom, rgba(59,130,246,0.04), transparent)",
          borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}>
          <Reveal>
            <Zap size={28} style={{ color: "#3b82f6", marginBottom: 20 }} />
          </Reveal>
          <Reveal delay={0.1}>
            {heading("THIS ISN'T ABOUT DYING. IT'S ABOUT BUILDING SOMETHING EXTRAORDINARY WHILE YOU'RE ALIVE.")}
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: 15, color: "#94a3b8", fontWeight: 300, lineHeight: 1.8, maxWidth: 540, marginTop: 24 }}>
              The daily reflection makes you sharper. Clearer on who you are, what you believe, and how you think. The legacy is what it becomes after. The value is what it gives you now.
            </p>
          </Reveal>
        </section>

        {/* ═══ STORIES ═══ */}
        <section id="stories" style={{ padding: "96px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal>{sectionLabel("Built for Real People")}</Reveal>
          <Reveal delay={0.1}>
            {heading("EVERY LIFE CONTAINS A MIND WORTH PRESERVING")}
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, maxWidth: 960, width: "100%", marginTop: 48, textAlign: "left" }}>
            {stories.map((s, i) => {
              const IconComp = s.icon;
              return (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <div className="card-lit" style={{
                    borderRadius: 16, padding: 32,
                    background: "rgba(59,130,246,0.04)", backdropFilter: "blur(20px)",
                    border: "1px solid rgba(59,130,246,0.14)",
                    borderTop: `3px solid ${s.color}`,
                  }}>
                    <IconComp size={22} style={{ color: s.color, marginBottom: 16 }} />
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 17, color: "#f4f1ea", marginBottom: 12 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 300, lineHeight: 1.8 }}>{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ═══ SOCIAL PROOF ═══ */}
        <section style={{ padding: "96px 32px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, maxWidth: 960, margin: "0 auto" }}>
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <div className="card-lit" style={{
                  borderRadius: 16, padding: 32,
                  background: "rgba(59,130,246,0.04)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(59,130,246,0.14)",
                }}>
                  <MessageCircle size={20} style={{ color: "#3b82f6", marginBottom: 18 }} />
                  <p style={{
                    fontFamily: "'Source Serif 4', serif", fontStyle: "italic",
                    fontSize: 15, color: "#f4f1ea", lineHeight: 1.75, marginBottom: 18,
                  }}>
                    "{t.quote}"
                  </p>
                  <span style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500 }}>— {t.attr}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ ROADMAP ═══ */}
        <Roadmap />

        {/* ═══ FAQ ═══ */}
        <section id="faq" style={{ padding: "96px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal>{sectionLabel("FAQ")}</Reveal>
          <Reveal delay={0.1}>
            {heading("QUESTIONS YOU PROBABLY HAVE")}
          </Reveal>

          <div style={{ maxWidth: 700, width: "100%", marginTop: 48, textAlign: "left" }}>
            {faqs.map((f, i) => (
              <FAQItem key={i} question={f.q} answer={f.a} isLast={i === faqs.length - 1} />
            ))}
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section id="waitlist" style={{
          padding: "96px 32px", textAlign: "center",
          display: "flex", flexDirection: "column", alignItems: "center",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.06), transparent 70%)",
            pointerEvents: "none",
          }} />

          <Reveal>
            <Brain size={40} style={{ color: "#3b82f6", marginBottom: 24 }} />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 700, textTransform: "uppercase",
              fontSize: "clamp(28px, 5vw, 42px)", color: "#f4f1ea", lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}>
              Your intelligence is worth preserving
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: 15, color: "#64748b", fontWeight: 300, marginTop: 16, marginBottom: 36 }}>
              Free waitlist. Founding member pricing. Priority access. No credit card required.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            {submitted ? (
              <div style={{
                borderRadius: 16, padding: 40,
                background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
                maxWidth: 420,
              }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22, color: "#f4f1ea", marginBottom: 8 }}>
                  You're in.
                </h3>
                <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 300 }}>
                  We'll reach out with early access details.
                </p>
              </div>
            ) : (
              <div style={{ maxWidth: 440, width: "100%" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      flex: "1 1 240px", padding: "14px 18px",
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10, color: "#f4f1ea", fontSize: 14,
                      fontFamily: "'Sora', sans-serif", outline: "none",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(59,130,246,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: "14px 24px", background: submitting ? "#2563eb" : "#3b82f6", color: "#fff",
                      fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14,
                      border: "none", borderRadius: 10, cursor: submitting ? "not-allowed" : "pointer",
                      boxShadow: "0 0 24px rgba(59,130,246,0.25)", transition: "all 0.2s",
                      opacity: submitting ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => { if (!submitting) { e.target.style.background = "#2563eb"; e.target.style.transform = "translateY(-1px)"; } }}
                    onMouseLeave={(e) => { if (!submitting) { e.target.style.background = "#3b82f6"; e.target.style.transform = "translateY(0)"; } }}
                  >
                    {submitting ? "Joining..." : "Get Early Access"}
                  </button>
                </form>
                {formError && (
                  <p style={{
                    fontSize: 14, color: formError === "Already on the list." ? "#3b82f6" : "#ef4444",
                    fontWeight: 500, marginTop: 14, textAlign: "center",
                  }}>
                    {formError}
                  </p>
                )}
              </div>
            )}
          </Reveal>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{
          padding: "48px 32px", textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: "#f4f1ea", letterSpacing: "-0.03em" }}>
            Ether
          </div>
          <p style={{ fontSize: 13, color: "#64748b", fontWeight: 300, marginTop: 8 }}>
            Your Digital Mind. Living Forever.
          </p>
          <p style={{ fontSize: 12, color: "#3b4559", marginTop: 12 }}>
            © 2026 Ether. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
