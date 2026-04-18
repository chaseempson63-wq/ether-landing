import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./lib/supabase";
import { Brain, Network, GitBranch } from "lucide-react";

/* ─── Fonts + global styles ─── */
const injectStyles = () => {
  if (document.getElementById("ether-fonts")) return;
  const link = document.createElement("link");
  link.id = "ether-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,500;1,400;1,600&display=swap";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; scroll-padding-top: 72px; -webkit-text-size-adjust: 100%; }
    body { font-family: 'Sora', sans-serif; background: #080b14; color: #c8d0df; -webkit-font-smoothing: antialiased; line-height: 1.5; overflow-x: hidden; max-width: 100vw; }
    button, input { font-family: inherit; }
    input::placeholder { color: #4b5563; }
    a, button { -webkit-tap-highlight-color: transparent; }
    button:focus-visible, a:focus-visible, input:focus-visible {
      outline: 2px solid rgba(59,130,246,0.6); outline-offset: 2px;
    }

    @keyframes orbit1 { from { transform: translate(-50%,-50%) rotate(0deg) translateX(220px); } to { transform: translate(-50%,-50%) rotate(360deg) translateX(220px); } }
    @keyframes orbit2 { from { transform: translate(-50%,-50%) rotate(120deg) translateX(180px); } to { transform: translate(-50%,-50%) rotate(480deg) translateX(180px); } }
    @keyframes orbit3 { from { transform: translate(-50%,-50%) rotate(240deg) translateX(260px); } to { transform: translate(-50%,-50%) rotate(600deg) translateX(260px); } }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `;
  document.head.appendChild(style);
};

/* ─── Hooks ─── */
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, isInView];
};

const useMatchMedia = (query) => {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
};

const useIsMobile = () => useMatchMedia("(max-width: 767px)");
const usePrefersReducedMotion = () => useMatchMedia("(prefers-reduced-motion: reduce)");

/* ─── Reveal wrapper ─── */
const Reveal = ({ children, delay = 0, className = "", y = 14 }) => {
  const reduced = usePrefersReducedMotion();
  const [ref, isInView] = useInView();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

/* ─── Glass Card (Pillars + Steps) ─── */
const GlassCard = ({ icon: Icon, stepNumber, title, body, accent = "#3b82f6", isMobile }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        padding: isMobile ? 28 : 36,
        background: hovered ? "rgba(59,130,246,0.045)" : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: hovered ? "1px solid rgba(59,130,246,0.18)" : "1px solid rgba(255,255,255,0.06)",
        transition: "all 0.5s ease",
        height: "100%",
      }}
    >
      {stepNumber ? (
        <div
          aria-hidden="true"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: isMobile ? 56 : 76,
            color: hovered ? "rgba(59,130,246,0.55)" : "rgba(255,255,255,0.08)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: isMobile ? 24 : 32,
            transition: "color 0.5s ease",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {stepNumber}
        </div>
      ) : Icon ? (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: hovered ? "rgba(59,130,246,0.14)" : "rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            transition: "background 0.5s ease",
          }}
        >
          <Icon size={20} style={{ color: hovered ? accent : "#94a3b8", transition: "color 0.5s ease" }} />
        </div>
      ) : null}
      <h3
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          fontSize: isMobile ? 18 : 20,
          color: "#fff",
          marginBottom: 10,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: isMobile ? 14 : 15, color: "#94a3b8", fontWeight: 300, lineHeight: 1.65 }}>
        {body}
      </p>
    </div>
  );
};

/* ─── Waitlist Form (used in Hero + Final CTA) ─── */
const WaitlistForm = ({
  email, setEmail, submitted, submitting, formError, onSubmit, isMobile, count, variant = "default",
}) => {
  if (submitted) {
    return (
      <div
        style={{
          borderRadius: 16,
          padding: isMobile ? 28 : 36,
          background: "rgba(59,130,246,0.07)",
          border: "1px solid rgba(59,130,246,0.18)",
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
        }}
      >
        <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: isMobile ? 20 : 22, color: "#fff", marginBottom: 8 }}>
          You're in.
        </h3>
        <p style={{ fontSize: isMobile ? 14 : 15, color: "#94a3b8", fontWeight: 300, lineHeight: 1.6 }}>
          We'll be in touch with early access details soon.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 460 }}>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 10,
          width: "100%",
        }}
      >
        <label htmlFor={`email-${variant}`} style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }}>
          Email address
        </label>
        <input
          id={`email-${variant}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          style={{
            flex: 1,
            width: "100%",
            minHeight: 48,
            padding: "0 18px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            color: "#fff",
            fontSize: 16, /* 16px prevents iOS zoom */
            fontFamily: "'Sora', sans-serif",
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(59,130,246,0.5)";
            e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.08)";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            minHeight: 48,
            padding: "0 24px",
            background: submitting ? "#2563eb" : "#3b82f6",
            color: "#fff",
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            border: "none",
            borderRadius: 10,
            cursor: submitting ? "not-allowed" : "pointer",
            boxShadow: "0 8px 24px rgba(59,130,246,0.28)",
            transition: "background 0.2s, transform 0.2s",
            opacity: submitting ? 0.75 : 1,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!submitting) e.currentTarget.style.background = "#2563eb";
          }}
          onMouseLeave={(e) => {
            if (!submitting) e.currentTarget.style.background = "#3b82f6";
          }}
        >
          {submitting ? "Joining…" : "Join the Waitlist"}
        </button>
      </form>
      {formError && (
        <p
          role="alert"
          style={{
            fontSize: 14,
            color: formError === "Already on the list." ? "#3b82f6" : "#f87171",
            fontWeight: 500,
            marginTop: 12,
            textAlign: isMobile ? "left" : "center",
          }}
        >
          {formError}
        </p>
      )}
      {count != null && count > 0 && !formError && (
        <p style={{ fontSize: 13, color: "#64748b", fontWeight: 400, marginTop: 14, textAlign: isMobile ? "left" : "center" }}>
          Join {count.toLocaleString()} {count === 1 ? "other" : "others"} on the waitlist.
        </p>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function EtherLanding() {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(null);

  /* Inject fonts + global styles once */
  useEffect(() => {
    injectStyles();
  }, []);

  /* Scroll listener for navbar background */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Fetch waitlist count */
  const fetchCount = useCallback(async () => {
    const { count, error } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });
    if (!error && typeof count === "number") setWaitlistCount(count);
  }, []);

  useEffect(() => { fetchCount(); }, [fetchCount]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

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
      if (error.code === "23505") setFormError("Already on the list.");
      else setFormError("Something went wrong. Try again.");
      return;
    }

    setSubmitted(true);
    fetchCount();
  };

  /* ─── Layout helpers ─── */
  const sectionPadX = isMobile ? 20 : 32;
  const sectionPadY = isMobile ? 96 : 144;

  const sectionHeading = (text, extra = {}) => (
    <h2
      style={{
        fontFamily: "'Sora', sans-serif",
        fontWeight: 700,
        fontSize: isMobile ? 22 : "clamp(28px, 3.6vw, 40px)",
        color: "#fff",
        lineHeight: 1.18,
        letterSpacing: "-0.01em",
        maxWidth: 780,
        ...extra,
      }}
    >
      {text}
    </h2>
  );

  const editorialText = (text, extra = {}) => (
    <p
      style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: isMobile ? 17 : 19,
        color: "#cbd5e1",
        fontWeight: 400,
        lineHeight: 1.7,
        maxWidth: 620,
        ...extra,
      }}
    >
      {text}
    </p>
  );

  /* ─── Data ─── */
  const pillars = [
    {
      icon: Brain,
      title: "Remember Everything",
      body: "Your AI remembers what you forget.",
    },
    {
      icon: Network,
      title: "Know Yourself Deeper",
      body: "Watch your identity map grow over time.",
    },
    {
      icon: GitBranch,
      title: "Live Beyond Your Lifetime",
      body: "Pass down who you are, not just what you owned.",
    },
  ];

  const steps = [
    {
      stepNumber: "01",
      title: "Talk",
      body: "Answer questions about your life. Five minutes.",
    },
    {
      stepNumber: "02",
      title: "Grow",
      body: "Your digital mind maps who you are.",
    },
    {
      stepNumber: "03",
      title: "Become",
      body: "Your AI thinks like you, remembers like you.",
    },
  ];

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#080b14", overflow: "hidden" }}>
      {/* Background gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: "radial-gradient(circle at 50% 28%, rgba(59,130,246,0.08), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Orbital dots — desktop only to avoid overflow on mobile */}
      {!isMobile && (
        <div aria-hidden="true" style={{ position: "fixed", top: "38%", left: "50%", zIndex: 1, pointerEvents: "none" }}>
          <div style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", opacity: 0.5, animation: "orbit1 20s linear infinite" }} />
          <div style={{ position: "absolute", width: 5, height: 5, borderRadius: "50%", background: "#8b5cf6", opacity: 0.4, animation: "orbit2 25s linear infinite" }} />
          <div style={{ position: "absolute", width: 4, height: 4, borderRadius: "50%", background: "#06b6d4", opacity: 0.45, animation: "orbit3 30s linear infinite" }} />
        </div>
      )}

      {/* ───────────────── CONTENT ───────────────── */}
      <div style={{ position: "relative", zIndex: 10 }}>

        {/* ═══ NAVBAR ═══ */}
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: `0 ${isMobile ? 20 : 32}px`,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: scrolled ? "rgba(8,11,20,0.85)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
            transition: "all 0.3s ease",
          }}
        >
          <a
            href="#top"
            onClick={scrollTo("top")}
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#fff",
              textDecoration: "none",
              letterSpacing: "-0.03em",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
            }}
          >
            Ether
          </a>

          <a
            href="#waitlist"
            onClick={scrollTo("waitlist")}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              background: "#3b82f6",
              padding: "10px 18px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "background 0.2s",
              cursor: "pointer",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
          >
            Join the Waitlist
          </a>
        </nav>

        {/* ═══ 1. HERO ═══ */}
        <section
          id="top"
          style={{
            minHeight: isMobile ? "auto" : "92vh",
            padding: `${isMobile ? 140 : 200}px ${sectionPadX}px ${isMobile ? 80 : 120}px`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Reveal delay={0}>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: isMobile ? 36 : "clamp(48px, 6.6vw, 72px)",
                color: "#fff",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                maxWidth: 940,
                margin: "0 auto",
              }}
            >
              The End of Disappearing
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: isMobile ? 16 : 20,
                color: "#94a3b8",
                fontWeight: 400,
                lineHeight: 1.4,
                maxWidth: 640,
                marginTop: isMobile ? 24 : 32,
              }}
            >
              An AI that becomes you — useful today, priceless tomorrow.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div
              style={{
                marginTop: isMobile ? 44 : 56,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <WaitlistForm
                email={email}
                setEmail={setEmail}
                submitted={submitted}
                submitting={submitting}
                formError={formError}
                onSubmit={handleSubmit}
                isMobile={isMobile}
                count={waitlistCount}
                variant="hero"
              />
            </div>
          </Reveal>
        </section>

        {/* ═══ 2. PROBLEM ═══ */}
        <section
          style={{
            padding: `${sectionPadY}px ${sectionPadX}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Reveal>
            {sectionHeading("Knowledge disappears when people do")}
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ marginTop: isMobile ? 28 : 40 }}>
              {editorialText(
                "Your grandparents knew things no book could teach. When they passed, all of it vanished."
              )}
            </div>
          </Reveal>
        </section>

        {/* ═══ 3. THREE PILLARS ═══ */}
        <section
          id="pillars"
          style={{
            padding: `${sectionPadY}px ${sectionPadX}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? 16 : 24,
              maxWidth: 1040,
              width: "100%",
              textAlign: "left",
            }}
          >
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.12}>
                <GlassCard icon={p.icon} title={p.title} body={p.body} isMobile={isMobile} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ 4. HOW IT WORKS ═══ */}
        <section
          id="how"
          style={{
            padding: `${sectionPadY}px ${sectionPadX}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? 16 : 24,
              maxWidth: 1040,
              width: "100%",
              textAlign: "left",
            }}
          >
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.12}>
                <GlassCard stepNumber={s.stepNumber} title={s.title} body={s.body} isMobile={isMobile} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ 5. ALIVE-FIRST ═══ */}
        <section
          style={{
            padding: `${isMobile ? 140 : 200}px ${sectionPadX}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            minHeight: isMobile ? "auto" : "60vh",
          }}
        >
          <Reveal>
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: isMobile ? 26 : "clamp(34px, 4.6vw, 52px)",
                color: "#fff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                maxWidth: 820,
              }}
            >
              This isn't about endings. It's about living.
            </h2>
          </Reveal>
        </section>

        {/* ═══ 6. WAITLIST COUNT ═══ */}
        <section
          style={{
            padding: `${sectionPadY}px ${sectionPadX}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Reveal>
            <div
              style={{
                borderRadius: 16,
                padding: isMobile ? "32px 36px" : "40px 56px",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {waitlistCount != null && waitlistCount > 0 ? (
                <>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontWeight: 700,
                      fontSize: isMobile ? 44 : 60,
                      color: "#fff",
                      lineHeight: 1,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {waitlistCount.toLocaleString()}
                  </div>
                  <p style={{ fontSize: isMobile ? 13 : 14, color: "#94a3b8", fontWeight: 400, marginTop: 12, letterSpacing: "0.02em" }}>
                    on the waitlist
                  </p>
                </>
              ) : (
                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 600,
                    fontSize: isMobile ? 20 : 24,
                    color: "#fff",
                    lineHeight: 1.2,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Be among the first
                </div>
              )}
            </div>
          </Reveal>
        </section>

        {/* ═══ 7. FINAL CTA ═══ */}
        <section
          id="waitlist"
          style={{
            padding: `${sectionPadY}px ${sectionPadX}px ${isMobile ? 100 : 160}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? 360 : 600,
              height: isMobile ? 360 : 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.07), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Reveal>
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: isMobile ? 28 : "clamp(34px, 4.6vw, 48px)",
                color: "#fff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                maxWidth: 720,
              }}
            >
              Your story matters. Don't let it disappear.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ marginTop: isMobile ? 36 : 48, width: "100%", display: "flex", justifyContent: "center" }}>
              <WaitlistForm
                email={email}
                setEmail={setEmail}
                submitted={submitted}
                submitting={submitting}
                formError={formError}
                onSubmit={handleSubmit}
                isMobile={isMobile}
                count={waitlistCount}
                variant="cta"
              />
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <p
              style={{
                marginTop: isMobile ? 64 : 96,
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontStyle: "italic",
                fontSize: isMobile ? 13 : 14,
                color: "#475569",
                fontWeight: 400,
                letterSpacing: "0.02em",
              }}
            >
              The End of Disappearing.
            </p>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
