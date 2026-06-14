import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HeartPulse, User, Lock, ShieldCheck, BadgeCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { loginClient } from "../lib/auth-client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Carenium Doctor Dashboard" },
      { name: "description", content: "Secure sign in for clinicians and hospital administrators." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("dr.mehta");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const result = await loginClient(username, password);
      if (result.success) {
        toast.success("Signed in successfully", { description: `Welcome back, ${result.user?.name}.` });
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Login failed", { description: result.error || "Invalid credentials." });
      }
    } catch {
      toast.error("Connection error", { description: "Could not reach the server." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-hero">
      <aside className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden" style={{ background: "var(--gradient-emerald-gold)" }}>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ background: "radial-gradient(circle at 20% 20%, white, transparent 50%), radial-gradient(circle at 80% 80%, white, transparent 50%)" }} />
        <Link to="/" className="relative flex items-center gap-2.5 text-white">
          <img src="/logo.png" alt="AI Healthcare System" className="size-8" />
          <div>
<div className="font-bold">Carenium Doctor Dashboard</div>
                <div className="text-xs opacity-80">AI Healthcare System</div>
          </div>
        </Link>
        <div className="relative text-white">
          <h2 className="text-4xl font-bold leading-tight">AI-powered smart hospital command center.</h2>
          <p className="mt-4 opacity-90 max-w-md">Real-time ICU monitoring, predictive analytics and secure EHR — built for the world's most demanding clinical environments.</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[["2,400+", "Hospitals"], ["18M+", "Patients"], ["99.99%", "Uptime"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-2xl font-bold">{v}</div>
                <div className="text-xs opacity-80">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-2 text-white/80 text-xs">
          <ShieldCheck className="size-4" /> HIPAA · DPDP · ABDM · HL7 FHIR R4
        </div>
      </aside>

      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <img src="/logo.png" alt="AI Healthcare System" className="size-8" />
            <span className="font-bold">Carenium Doctor Dashboard</span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Doctor Login</h1>
            <p className="mt-2 text-foreground text-sm">Enter your credentials to access the hospital system.</p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Username</span>
                <div className="mt-1.5 relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground" />
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. dr.mehta" className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm placeholder:text-gray-600" />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Password</span>
                <div className="mt-1.5 relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm placeholder:text-gray-600" />
                </div>
              </label>

              <button type="submit" disabled={loading} className="w-full btn-primary justify-center">
                {loading ? "Signing in..." : <>Sign in <ArrowRight className="size-4" /></>}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-foreground">
              New to the hospital?{" "}
              <Link to="/signup" className="text-foreground font-semibold hover:underline">Register with license</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
