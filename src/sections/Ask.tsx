import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Zap,
  MessageCircle,
  Wrench,
  PiggyBank,
  Stars,
  type LucideIcon,
} from "lucide-react";
import { EtherButton } from "@/components/ether";
import { supabase } from "../lib/supabase";

const STRIPE_URL = "https://buy.stripe.com/28E28k1mAdFf5zy7VV0co00";

type FMBenefit = {
  icon: LucideIcon;
  color: string;
  heading: string;
  description: string;
};

const FM_BENEFITS: FMBenefit[] = [
  {
    icon: ShieldCheck,
    color: "#FFD27A",
    heading: "Lifetime Founding Member status.",
    description: "Once-ever badge. After 100, it's closed forever.",
  },
  {
    icon: Zap,
    color: "#8A7CFF",
    heading: "Front of the line, day one.",
    description: "While the waitlist waits, you're in the app the moment you check out.",
  },
  {
    icon: MessageCircle,
    color: "#3DD9FF",
    heading: "A direct line to the founder.",
    description: "Private channel. Not a Discord with 12,000 strangers — a small room with the team.",
  },
  {
    icon: Wrench,
    color: "#FF6FD1",
    heading: "Real input on what gets built.",
    description: "See roadmap drafts before anyone. Your feedback ships.",
  },
  {
    icon: PiggyBank,
    color: "#FFD27A",
    heading: "Your $29 credits against your first paid year.",
    description: "When subscriptions launch, the gesture comes off the top. Real risk: zero.",
  },
  {
    icon: Stars,
    color: "#8A7CFF",
    heading: "Your name in the founding ledger.",
    description: "The first 100 are permanent. Your kids will point at it.",
  },
];

function FMBenefitRow({ benefit }: { benefit: FMBenefit }) {
  const Icon = benefit.icon;
  return (
    <li className="flex items-start gap-3.5">
      <Icon
        className="flex-shrink-0 mt-[2px]"
        size={18}
        style={{ color: benefit.color }}
        aria-hidden
      />
      <div className="min-w-0">
        <span
          className="font-[Inter,system-ui,sans-serif] font-semibold text-[14px] leading-[1.4]"
          style={{ color: "#F3F5FF" }}
        >
          {benefit.heading}
        </span>{" "}
        <span
          className="font-[Source_Serif_4,Georgia,serif] text-[14px] leading-[1.5]"
          style={{ color: "#B0B8C6" }}
        >
          {benefit.description}
        </span>
      </div>
    </li>
  );
}

type Props = {
  /** When the parent navigates here with ?ref=fm we should auto-open the modal. */
  autoOpenFM?: boolean;
  onAutoOpenHandled?: () => void;
};

export function Ask({ autoOpenFM, onAutoOpenHandled }: Props) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const fmCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoOpenFM) {
      setModalOpen(true);
      onAutoOpenHandled?.();
    }
  }, [autoOpenFM, onAutoOpenHandled]);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase() });
    setSubmitting(false);
    if (error) {
      setError(error.message.includes("duplicate") ? "You're already on the list." : "Something went wrong. Try again?");
      return;
    }
    setSubmitted(true);
  };

  const goToFM = () => {
    setModalOpen(true);
    fmCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCheckout = () => {
    window.location.href = STRIPE_URL;
  };

  return (
    <section
      id="section-ask"
      className="relative px-6 sm:px-8 py-20 sm:py-28"
    >
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p
            className="font-[Inter,system-ui,sans-serif] text-[11px] tracking-[0.18em] uppercase mb-5 font-medium"
            style={{ color: "var(--ether-violet)" }}
          >
            Two ways in
          </p>
          <h2
            className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold leading-[1.15] mb-5 text-[28px] sm:text-[36px] md:text-[40px]"
            style={{ color: "#F3F5FF" }}
          >
            Help us build the vault.
          </h2>
          <p
            className="font-[Source_Serif_4,Georgia,serif] leading-[1.6] mx-auto max-w-[580px] text-[16px] sm:text-[18px]"
            style={{ color: "#B0B8C6" }}
          >
            The first 100 people who believe in this don't just get early access. They fund the build itself — the careful, expensive work of making something worth holding the most important thing you've ever made.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-12 lg:gap-y-6 mb-8 sm:mb-10">
          {/* Card 1 — Waitlist */}
          <div
            className="rounded-2xl border border-white/10 p-7 sm:p-8 flex flex-col"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <p
              className="font-[Inter,system-ui,sans-serif] font-medium text-[12px] uppercase tracking-[0.18em] mb-3"
              style={{ color: "#B0B8C6" }}
            >
              The waitlist
            </p>
            <h3
              className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold text-[24px] mb-3"
              style={{ color: "#F3F5FF" }}
            >
              Be there when it opens.
            </h3>
            <p
              className="font-[Source_Serif_4,Georgia,serif] leading-[1.6] text-[15px] mb-6 flex-1"
              style={{ color: "#B0B8C6" }}
            >
              We'll let you know the moment Ether is ready for you. No spam. No pressure. Just the door, when it's open.
            </p>

            {!submitted ? (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your email"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] font-[Inter,system-ui,sans-serif] text-white placeholder:text-slate-500 focus:outline-none focus:border-white/20"
                />
                <EtherButton
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  className="w-full py-3"
                >
                  Join the waitlist
                </EtherButton>
                {error && (
                  <p className="text-[12px] text-rose-300 mt-1">{error}</p>
                )}
              </form>
            ) : (
              <div>
                <p
                  className="font-[Inter,system-ui,sans-serif] font-medium text-[12px] uppercase tracking-[0.18em] mb-2"
                  style={{ color: "var(--ether-cyan)" }}
                >
                  ✓ You're in
                </p>
                <p
                  className="font-[Source_Serif_4,Georgia,serif] leading-[1.6] text-[15px] mb-3"
                  style={{ color: "#B0B8C6" }}
                >
                  We'll be in touch. While you wait — there's another way to help.
                </p>
                <button
                  onClick={goToFM}
                  className="font-[Inter,system-ui,sans-serif] text-[14px] hover:underline"
                  style={{ color: "var(--ether-violet)" }}
                >
                  → Become a Founding Member
                </button>
              </div>
            )}
          </div>

          {/* Inter-card heading — sits between the two cards on mobile only;
              on lg the cards are side-by-side and don't need the marker. */}
          <div className="lg:hidden text-center">
            <p
              className="font-[Inter,system-ui,sans-serif] font-medium text-[11px] tracking-[0.18em] uppercase mb-2"
              style={{ color: "var(--ether-gold)" }}
            >
              The Next Tier
            </p>
            <h3
              className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold text-[24px] leading-[1.15]"
              style={{ color: "#F3F5FF" }}
            >
              Founding Members Club
            </h3>
          </div>

          {/* Card 2 — Founding Member */}
          <div
            ref={fmCardRef}
            className="rounded-2xl border p-7 sm:p-8 flex flex-col animate-card-pulse-violet"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(138,124,255,0.30)",
            }}
          >
            <p
              className="font-[Inter,system-ui,sans-serif] font-medium text-[12px] uppercase tracking-[0.18em] mb-3"
              style={{ color: "var(--ether-gold)" }}
            >
              Limited to 100
            </p>
            <h3
              className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold text-[24px] mb-3"
              style={{ color: "#F3F5FF" }}
            >
              Help build it. Forever on the wall.
            </h3>
            <p
              className="font-[Source_Serif_4,Georgia,serif] leading-[1.5] text-[16px] mb-5"
              style={{ color: "#B0B8C6" }}
            >
              Not a customer. A co-builder. Here's what comes with it:
            </p>
            <ul className="space-y-3.5 mb-6 flex-1">
              {FM_BENEFITS.map((b) => (
                <FMBenefitRow key={b.heading} benefit={b} />
              ))}
            </ul>
            <p
              className="font-[Inter,system-ui,sans-serif] font-medium text-[11px] tracking-[0.18em] mb-4"
              style={{ color: "var(--ether-gold)" }}
            >
              $29 TODAY · DOUBLES AT 25 MEMBERS · CLOSES AT 100
            </p>
            <EtherButton
              variant="earned"
              onClick={() => setModalOpen(true)}
              className="w-full py-3"
            >
              Become a Founding Member →
            </EtherButton>
          </div>
        </div>

        <div className="text-center space-y-1">
          <p
            className="font-[Inter,system-ui,sans-serif] font-medium text-[14px]"
            style={{ color: "#F3F5FF" }}
          >
            17 / 100 founding members.
          </p>
          <p
            className="font-[Inter,system-ui,sans-serif] text-[13px]"
            style={{ color: "var(--ether-gold)" }}
          >
            Price doubles at 25 members.
          </p>
        </div>
      </div>

      {/* FM Confirmation Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-float-in"
          style={{ background: "rgba(6,9,19,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-[480px] w-full rounded-2xl border p-7 sm:p-8"
            style={{
              background: "rgba(8,11,20,0.95)",
              borderColor: "rgba(138,124,255,0.30)",
              boxShadow: "0 0 40px rgba(138,124,255,0.20)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="font-[Space_Grotesk,system-ui,sans-serif] font-semibold text-[22px] sm:text-[24px] mb-4 leading-[1.2]"
              style={{ color: "#F3F5FF" }}
            >
              You're stepping in. Here's what happens next.
            </h3>
            <p
              className="font-[Source_Serif_4,Georgia,serif] leading-[1.65] text-[16px] mb-4"
              style={{ color: "#B0B8C6" }}
            >
              <span style={{ color: "var(--ether-gold)", fontWeight: 600 }}>$29 one-time.</span> That's the gesture. What you get back:
            </p>
            <ul className="space-y-2 mb-5">
              {[
                "Lifetime Founding Member status — once-ever, can't be bought later",
                "Immediate access to Ether — start building your mind right after checkout",
                "Direct line to the founder and team",
                "Real input on what gets built next",
                "Your $29 credited against your first year's subscription when paid plans launch",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 font-[Inter,system-ui,sans-serif] text-[14px] leading-[1.8]"
                  style={{ color: "#F3F5FF" }}
                >
                  <span
                    aria-hidden
                    className="inline-block flex-shrink-0 mt-[9px] w-[6px] h-[6px]"
                    style={{ background: "var(--ether-gold)" }}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p
              className="font-[Source_Serif_4,Georgia,serif] italic text-[14px] mb-6"
              style={{ color: "#8A93A6" }}
            >
              $29 today. Doubles at 25 members. Closes at 100.
            </p>
            <div className="flex flex-col gap-3">
              <EtherButton
                variant="primary"
                onClick={handleCheckout}
                className="w-full py-3"
              >
                Continue to checkout →
              </EtherButton>
              <button
                onClick={() => setModalOpen(false)}
                className="font-[Inter,system-ui,sans-serif] text-[14px] hover:underline"
                style={{ color: "#8A93A6" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
