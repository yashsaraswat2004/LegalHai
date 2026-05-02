import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function WaitlistDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Individual");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setDone(false);
        setError("");
        setLoading(false);
      }, 200);
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    if (!/^[+\d][\d\s-]{7,}$/.test(phone)) {
      setError("Enter a valid WhatsApp number");
      return;
    }

    setLoading(true);

    try {
      const { error: supabaseError } = await supabase.from("leads").insert([
        {
          full_name: name,
          email,
          phone,
          role,
          created_at: new Date().toISOString(),
        },
      ]);

      if (supabaseError) {
        // Fallback to localStorage if Supabase fails or isn't configured yet
        console.error("Supabase error:", supabaseError);
        const list = JSON.parse(localStorage.getItem("legalhai_waitlist") || "[]");
        list.push({ name, email, phone, role, ts: Date.now() });
        localStorage.setItem("legalhai_waitlist", JSON.stringify(list));
      }

      setDone(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md animate-in fade-in duration-300" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-card border border-border p-7 shadow-glow animate-in zoom-in-95 duration-300"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {done ? (
          <div className="text-center py-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-signal text-ink flex items-center justify-center text-3xl shadow-glow">
              ✓
            </div>
            <h3 className="font-display text-3xl mb-2">You're on the list.</h3>
            <p className="text-sm text-muted-foreground">
              We'll WhatsApp you the moment LegalHai opens its doors. Until then, tell a friend who hates paperwork.
            </p>
          </div>
        ) : (
          <>
            <div className="text-xs font-mono text-signal uppercase tracking-[0.2em] mb-3 opacity-80">
              Priority Access
            </div>
            <h3 className="font-display text-3xl mb-2 text-balance leading-tight">
              Be first to skip the <span className="text-signal italic">lawyer queue.</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-8">
              No spam. One message when we launch in your city.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/30 transition-all placeholder:text-muted-foreground/50"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/30 transition-all placeholder:text-muted-foreground/50"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 WhatsApp number"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/30 transition-all placeholder:text-muted-foreground/50"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">I am a...</label>
                <div className="flex gap-2 flex-wrap">
                  {["Individual", "Landlord", "Founder", "SMB", "Lawyer"].map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      disabled={loading}
                      className={`px-3.5 py-2 rounded-lg text-xs border transition-all ${
                        role === r
                          ? "bg-signal text-ink border-signal font-medium shadow-sm"
                          : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 group relative overflow-hidden rounded-xl bg-signal text-ink py-4 font-semibold hover:brightness-110 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-glow hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                    <span>Reserving...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Reserve my spot
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                )}
              </button>
              
              <p className="text-[10px] text-muted-foreground text-center pt-2 leading-relaxed">
                By joining you agree to occasional WhatsApp updates. <br/>
                We respect your privacy. No marketing spam.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
