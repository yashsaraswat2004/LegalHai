import { useEffect, useState } from "react";

type Msg = {
  from: "bot" | "user";
  text: string;
  delay: number;
  typing?: number;
};

const SCRIPT: Msg[] = [
  { from: "bot", text: "Namaste 🙏 I'm LegalHai. What contract do you need today?", delay: 400, typing: 900 },
  { from: "user", text: "Rental agreement, Hindi me", delay: 1500 },
  { from: "bot", text: "Theek hai! Property kahaan hai aur kiraya kitna?", delay: 600, typing: 1100 },
  { from: "user", text: "Pune, ₹22,000/month, 11 months", delay: 1500 },
  { from: "bot", text: "✅ Draft ready. Tenant ka WhatsApp number bhejo for e-sign.", delay: 700, typing: 1300 },
  { from: "user", text: "+91 98••• ••432", delay: 1300 },
  { from: "bot", text: "Signed & stamped. Stored in your LegalHai vault. ⏱ 1 min 47 sec", delay: 800, typing: 1400 },
];

export function WhatsAppMock() {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (step >= SCRIPT.length) {
      const r = setTimeout(() => setStep(0), 4000);
      return () => clearTimeout(r);
    }
    const cur = SCRIPT[step];
    let typingTimer: ReturnType<typeof setTimeout> | undefined;
    const showTimer = setTimeout(() => {
      if (cur.from === "bot" && cur.typing) {
        setTyping(true);
        typingTimer = setTimeout(() => {
          setTyping(false);
          setStep((s) => s + 1);
        }, cur.typing);
      } else {
        setStep((s) => s + 1);
      }
    }, cur.delay);
    return () => {
      clearTimeout(showTimer);
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [step]);

  const visible = SCRIPT.slice(0, step);

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      {/* Phone frame */}
      <div className="relative rounded-[44px] bg-ink border border-paper/15 p-3 shadow-emerald">
        <div className="absolute left-1/2 -translate-x-1/2 top-2 h-5 w-28 rounded-full bg-paper/10 z-10" />
        <div className="rounded-[34px] overflow-hidden bg-[oklch(0.16_0.02_140)] h-[600px] flex flex-col">
          {/* WA header */}
          <div className="bg-emerald/90 text-ink px-4 pt-9 pb-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-ink/20 flex items-center justify-center font-display font-bold">ल</div>
            <div className="leading-tight">
              <div className="font-medium text-sm">LegalHai</div>
              <div className="text-[11px] opacity-70">online · typing legal magic</div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-hidden p-3 space-y-2"
            style={{
              backgroundImage:
                "radial-gradient(color-mix(in oklab, var(--paper) 6%, transparent) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          >
            {visible.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 text-[13px] leading-snug ${
                    m.from === "user"
                      ? "bubble-out bg-signal text-ink"
                      : "bubble-in bg-paper/10 text-paper"
                  }`}
                  style={{ animation: "float 0.4s ease-out" }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bubble-in bg-paper/10 px-3 py-2 flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-paper/60 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-paper/60 animate-bounce [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-paper/60 animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="bg-[oklch(0.2_0.01_140)] px-3 py-2 flex items-center gap-2">
            <div className="flex-1 bg-ink/60 rounded-full px-3 py-1.5 text-xs text-paper/50">Message</div>
            <div className="h-8 w-8 rounded-full bg-emerald flex items-center justify-center text-ink text-xs">▶</div>
          </div>
        </div>
      </div>

      {/* Floating tags */}
      <div className="absolute -left-12 top-20 hidden md:block float-slow">
        <div className="rounded-full bg-card border border-border px-3 py-1.5 text-xs font-mono">
          ⏱ avg 1m 52s
        </div>
      </div>
      <div className="absolute -right-10 top-1/2 hidden md:block float-slow [animation-delay:2s]">
        <div className="rounded-full bg-signal text-ink px-3 py-1.5 text-xs font-medium">
          e-Stamp ✓
        </div>
      </div>
      <div className="absolute -right-8 bottom-24 hidden md:block float-slow [animation-delay:4s]">
        <div className="rounded-full bg-card border border-border px-3 py-1.5 text-xs">
          12 भाषाएँ
        </div>
      </div>
    </div>
  );
}
