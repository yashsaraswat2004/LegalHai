import { useEffect, useState } from "react";

export function WaitlistDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Individual");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setDone(false);
        setError("");
      }, 200);
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    if (!/^[+\d][\d\s-]{7,}$/.test(phone)) {
      setError("Enter a valid WhatsApp number");
      return;
    }
    try {
      const list = JSON.parse(localStorage.getItem("legalhai_waitlist") || "[]");
      list.push({ email, phone, role, ts: Date.now() });
      localStorage.setItem("legalhai_waitlist", JSON.stringify(list));
    } catch {}
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-card border border-border p-7 shadow-glow"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground"
          aria-label="Close"
        >✕</button>

        {done ? (
          <div className="text-center py-6">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-signal text-ink flex items-center justify-center text-2xl">✓</div>
            <h3 className="font-display text-2xl mb-2">You're on the list.</h3>
            <p className="text-sm text-muted-foreground">
              We'll WhatsApp you the moment LegalHai opens its doors. Until then, tell a friend who hates paperwork.
            </p>
          </div>
        ) : (
          <>
            <div className="text-xs font-mono text-signal uppercase tracking-widest mb-2">Early access</div>
            <h3 className="font-display text-3xl mb-1 text-balance">Be first to skip the lawyer queue.</h3>
            <p className="text-sm text-muted-foreground mb-6">No spam. One message when we launch in your city.</p>

            <form onSubmit={submit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-signal transition"
                required
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 WhatsApp number"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-signal transition"
                required
              />
              <div className="flex gap-2 flex-wrap">
                {["Individual", "Landlord", "Founder", "SMB", "Lawyer"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition ${
                      role === r
                        ? "bg-signal text-ink border-signal"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {error && <div className="text-xs text-destructive">{error}</div>}

              <button
                type="submit"
                className="w-full mt-2 rounded-lg bg-signal text-ink py-3 font-medium hover:brightness-110 transition"
              >
                Reserve my spot →
              </button>
              <p className="text-[11px] text-muted-foreground text-center pt-1">
                By joining you agree to occasional WhatsApp updates from LegalHai.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
