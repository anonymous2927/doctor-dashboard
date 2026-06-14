import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HeartPulse, User, ShieldCheck, Lock, BadgeCheck, Calendar, Fingerprint, Building2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { registerClient } from "../lib/auth-client";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Carenium Doctor Dashboard" },
      { name: "description", content: "Register as a clinician or hospital administrator." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    doctorName: "", dob: "", aadhaar: "", hospitalName: "", licenseNo: "", passCode: "",
  });

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [field]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.doctorName || !form.dob || !form.aadhaar || !form.hospitalName || !form.licenseNo || !form.passCode) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (form.passCode.length < 6) {
      toast.error("Pass code must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const result = await registerClient(form);
      toast.success("Account created successfully", { description: `Welcome, ${result.user?.doctorName}.` });
      navigate({ to: "/dashboard" });
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
          <h2 className="text-4xl font-bold leading-tight">Join India's leading<br />smart hospital<br />network.</h2>
          <p className="mt-4 opacity-90 max-w-md">Register your credentials and start managing patients, ICUs, and clinical workflows in minutes.</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="mt-2 text-foreground text-sm">Register your credentials to access the system.</p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Doctor Name</span>
                <div className="mt-1.5 relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground" />
                  <input type="text" value={form.doctorName} onChange={update("doctorName")} placeholder="Full name as on license" className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm placeholder:text-gray-600" />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Date of Birth</span>
                <div className="mt-1.5 relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground" />
                  <input type="date" value={form.dob} onChange={update("dob")} className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm" />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Aadhaar Number</span>
                <div className="mt-1.5 relative">
                  <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground" />
                  <input type="text" value={form.aadhaar} onChange={update("aadhaar")} placeholder="XXXX XXXX XXXX" className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm placeholder:text-gray-600" />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Hospital Name</span>
                <div className="mt-1.5 relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground" />
                  <input type="text" value={form.hospitalName} onChange={update("hospitalName")} placeholder="Full hospital name" className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm placeholder:text-gray-600" />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Doctor License No.</span>
                <div className="mt-1.5 relative">
                  <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground" />
                  <input type="text" value={form.licenseNo} onChange={update("licenseNo")} placeholder="e.g. MCI-12-34567" className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm placeholder:text-gray-600" />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Hospital Pass Code</span>
                <div className="mt-1.5 relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground" />
                  <input type="password" value={form.passCode} onChange={update("passCode")} placeholder="At least 6 characters" className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm placeholder:text-gray-600" />
                </div>
              </label>

              <button type="submit" disabled={loading} className="w-full btn-primary justify-center">
                {loading ? "Creating account..." : <>Create Account <ArrowRight className="size-4" /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-foreground font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
