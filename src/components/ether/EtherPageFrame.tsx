import type { ReactNode } from "react";

export type EtherPageFrameProps = {
  children: ReactNode;
  topBar?: ReactNode;
  aliveElement?: ReactNode;
  aurora?: boolean;
  maxWidth?: string;
  contentClassName?: string;
};

export function EtherPageFrame({
  children,
  topBar,
  aliveElement,
  aurora = true,
  maxWidth = "max-w-6xl",
  contentClassName = "",
}: EtherPageFrameProps) {
  return (
    <div className="min-h-screen bg-ether-bg text-white relative overflow-hidden">
      {aurora && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(900px 600px at 10% -10%, color-mix(in srgb, var(--ether-violet) 18%, transparent), transparent 60%), radial-gradient(800px 500px at 100% 10%, color-mix(in srgb, var(--ether-cyan) 12%, transparent), transparent 60%), radial-gradient(700px 400px at 50% 110%, color-mix(in srgb, var(--ether-magenta) 10%, transparent), transparent 60%)",
          }}
        />
      )}
      {aliveElement && (
        <div
          aria-hidden="true"
          className="fixed pointer-events-none"
          style={{ top: "10%", right: "6%" }}
        >
          {aliveElement}
        </div>
      )}
      <div className={`relative ${maxWidth} mx-auto px-6 py-8 ${contentClassName}`}>
        {topBar && <div className="mb-8">{topBar}</div>}
        {children}
      </div>
    </div>
  );
}
