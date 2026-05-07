import { useState, useEffect, useRef } from "react";
import { Brain, X } from "lucide-react";

type Props = {
  /** The current message — when this changes the avatar pings briefly. */
  message: string;
  /** Stable key for the active section, used to detect transitions. */
  sectionKey: string;
};

export function EtherAvatar({ message, sectionKey }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [autoShown, setAutoShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevSectionRef = useRef(sectionKey);
  const autoShowTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // First-load auto-show: open the bubble for 5s on initial mount.
  useEffect(() => {
    setExpanded(true);
    setAutoShown(true);
    autoShowTimerRef.current = setTimeout(() => {
      setExpanded(false);
    }, 5000);
    const cancel = () => {
      if (autoShowTimerRef.current) {
        clearTimeout(autoShowTimerRef.current);
        autoShowTimerRef.current = undefined;
      }
    };
    window.addEventListener("scroll", cancel, { passive: true, once: true });
    return () => {
      cancel();
      window.removeEventListener("scroll", cancel);
    };
  }, []);

  // Section change: brief ping + close auto-shown bubble so the next section
  // doesn't get the wrong message glued to the user's eye.
  useEffect(() => {
    if (prevSectionRef.current === sectionKey) return;
    prevSectionRef.current = sectionKey;
    setPinging(true);
    const t = setTimeout(() => setPinging(false), 4000);
    return () => clearTimeout(t);
  }, [sectionKey]);

  // Outside click closes the bubble.
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("click", handler);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handler);
    };
  }, [expanded]);

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((v) => !v);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1000] font-ui" ref={panelRef}>
      {expanded && (
        <div
          key={sectionKey}
          className="absolute bottom-12 sm:bottom-14 right-0 w-[240px] sm:w-[280px] rounded-xl p-4 animate-float-in"
          style={{
            background: "rgba(8,11,20,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(138,124,255,0.20)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[14px] leading-[1.5] text-[#F3F5FF]">
              {message}
            </p>
            <button
              onClick={() => setExpanded(false)}
              className="text-slate-500 hover:text-slate-300 flex-shrink-0 mt-0.5"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        {pinging && (
          <div
            className="absolute inset-0 rounded-full animate-avatar-ping"
            style={{ border: "2px solid rgba(138,124,255,0.5)" }}
          />
        )}
        <button
          onClick={handleAvatarClick}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center animate-avatar-float transition-colors"
          style={{
            background: "rgba(8,11,20,0.9)",
            border: "1px solid rgba(138,124,255,0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          aria-label="Open companion"
        >
          <Brain className="h-4 w-4" style={{ color: "var(--ether-violet)" }} />
        </button>
      </div>
      {autoShown ? null : null}
    </div>
  );
}
