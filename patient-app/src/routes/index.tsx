import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Activity, Brain, ShieldCheck, Stethoscope, HeartPulse, Hospital,
  Radio, Sparkles, ArrowRight, CheckCircle2, Cpu, Globe2, LineChart,
  Lock, Pill, Video, Ambulance, Microscope, Languages, LayoutDashboard,
  FileText, BadgeCheck, User, Menu, X, Twitter, Linkedin, Info,
  Mail, Phone, ExternalLink, AlertTriangle, Bed, TrendingUp, Monitor,
  Search, Bell, Calendar, ChevronRight, LogOut, Settings, Users, Gauge,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carenium Doctor Dashboard" },
      { name: "description", content: "Enterprise AI clinical intelligence, smart ICU, telemedicine and EHR for next-generation hospitals." },
    ],
  }),
  component: Landing,
});

function Nav() {
  const navItems = [
    { label: "Platform", icon: LayoutDashboard, href: "#platform" },
    { label: "AI Intelligence", icon: Brain, href: "#ai" },
    { label: "Smart ICU", icon: HeartPulse, href: "#icu" },
    { label: "Compliance", icon: ShieldCheck, href: "#compliance" },
    { label: "About", icon: Info, href: "#about" },
  ];
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/75 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="AI Healthcare System" className="size-8" />
          <div className="leading-tight">
<div className="font-bold text-sm text-foreground">Carenium Doctor Dashboard</div>
          <div className="text-[10px] text-foreground -mt-0.5">AI Healthcare System</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button key={item.label} onClick={() => document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-200">
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm font-semibold text-foreground px-4 py-2 hover:text-emerald-600 transition-colors">
            Sign in
          </Link>
          <button onClick={() => document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary text-sm px-5 py-2">
            <ArrowRight className="size-4" /> Explore Platform
          </button>
        </div>
      </div>
    </header>
  );
}

function StatCard({ value, label, delay }: { value: string; label: string; delay: string }) {
  return (
    <div className="glass-card rounded-2xl px-5 py-4 shadow-card-soft card-hover">
      <div className="text-2xl font-bold text-gradient-emerald">{value}</div>
      <div className="text-xs text-foreground mt-0.5 font-medium">{label}</div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative bg-hero overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-40 right-20 size-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 size-48 rounded-full bg-primary/8 blur-3xl" />
      </div>



      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/15 text-xs font-medium">
            <Sparkles className="size-3.5 text-foreground" />
            <span className="text-gradient-primary font-semibold">AI-Powered Clinical Intelligence</span>
            <span className="text-foreground">· v2026</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Transforming Healthcare<br />
            Through <span className="text-gradient-emerald">AI Clinical</span><br />
            <span className="text-gradient-gold">Intelligence</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-foreground max-w-xl leading-relaxed">
            The enterprise smart hospital command center — unifying EHR, ICU monitoring,
            telemedicine and AI diagnostics into one secure, cloud-native ecosystem.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary px-7 py-3.5 text-base">
              Sign in <ArrowRight className="size-5" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard value="2,400+" label="Hospitals Connected" delay="0.1s" />
            <StatCard value="18M+" label="Patients Managed" delay="0.2s" />
            <StatCard value="99.99%" label="Uptime SLA" delay="0.3s" />
            <StatCard value="HIPAA" label="& ABDM Ready" delay="0.4s" />
          </div>
        </div>

        <div className="lg:col-span-5 relative lg:self-start lg:mt-8">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const [hub, setHub] = useState<any>(null);
  useEffect(() => {
    fetch("/api/public/hub").then(r => r.json()).then(setHub).catch(() => {});
  }, []);
  const h = hub || {};
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-[var(--gradient-emerald-gold)] opacity-15 blur-3xl rounded-[3rem]" />
      <div className="relative glass rounded-3xl p-5 shadow-xl-elegant border border-primary/15">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="status-dot" />
            <span className="text-sm font-bold text-foreground">ICU Command Center</span>
          </div>
          <span className="badge-green"><span className="status-dot" /> {h.totalBeds || "—"} beds &middot; {h.criticalCases || 0} critical</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MiniMetric label="Heart Rate" value="82" unit="bpm" trend="stable" tone="primary" />
          <MiniMetric label="SpO₂" value="97" unit="%" trend="up" tone="gold" />
          <MiniMetric label="BP" value="124/78" unit="mmHg" trend="stable" tone="primary" />
          <MiniMetric label="Temp" value="36.9" unit="°C" trend="stable" tone="gold" />
        </div>

        <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <Bed size={16} className="text-foreground" />
            <span className="text-sm font-semibold text-foreground">Bed Availability</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-bold">{h.icuBeds || 0} ICU</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-xs font-bold">{h.hduBeds || 0} HDU</span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-xs font-bold">{h.occupiedBeds || 0} Occupied</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-foreground">{h.activeDoctors || "—"} doctors on duty</span>
          <span className="badge-gold py-1 px-2"><AlertTriangle className="size-3" /> {h.criticalCases || 0} alerts</span>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ label, value, unit, trend, tone }: { label: string; value: string; unit: string; trend: string; tone: "primary" | "gold" }) {
  return (
    <div className="rounded-2xl p-3.5 bg-card border border-primary/20 shadow-card-soft card-hover">
      <div className="text-[10px] uppercase tracking-wider text-foreground font-semibold">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={tone === "gold" ? "text-2xl font-bold text-gradient-gold" : "text-2xl font-bold text-gradient-primary"}>{value}</span>
        <span className="text-xs text-foreground">{unit}</span>
      </div>
      <div className="mt-2 flex gap-0.5 items-end h-4">
        {[6, 9, 7, 11, 8, 13, 10, 12].map((h, i) => (
          <div key={i} className="w-1.5 rounded-sm bg-primary/40" style={{ height: `${h * 1.2}px` }} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, to }: { icon: any; title: string; desc: string; to: string }) {
  return (
    <Link to={to} className="block group">
      <div className="relative bg-card rounded-3xl p-6 border border-primary/20 shadow-card-soft card-hover">
        <div className="absolute inset-0 rounded-3xl bg-[var(--gradient-green-subtle)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="icon-container icon-container-light mb-4">
            <Icon className="size-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-foreground mt-1.5 leading-relaxed">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

function Features() {
  const items = [
    { icon: Brain, title: "AI Clinical Intelligence", desc: "Disease prediction, ICU risk scoring and AI-assisted diagnosis trained on millions of cases.", to: "/dashboard/ai" },
    { icon: HeartPulse, title: "Smart ICU Monitoring", desc: "Real-time vitals streaming, anomaly detection and instant trauma escalation.", to: "/dashboard/icu" },
    { icon: Video, title: "Telemedicine Platform", desc: "HD video consultations with low-bandwidth mode optimized for rural healthcare.", to: "/dashboard/telemedicine" },
    { icon: FileText, title: "Unified EHR", desc: "HL7 FHIR R4 compliant records, voice-to-text notes and smart documentation.", to: "/dashboard/ehr" },
    { icon: Ambulance, title: "Emergency Response", desc: "GPS ambulance tracking, smart dispatch and live bed availability.", to: "/dashboard/emergency" },
    { icon: Microscope, title: "AI Diagnostics", desc: "DICOM imaging, ECG trend analysis and automated lab insights.", to: "/dashboard/lab" },
    { icon: Pill, title: "Pharmacy & E-Rx", desc: "Drug interaction alerts, QR prescriptions and smart inventory.", to: "/dashboard/pharmacy" },
    { icon: Activity, title: "IoT Health Devices", desc: "ECG, BP, glucose and wearable integration with live streaming.", to: "/dashboard" },
  ];
  return (
    <section id="platform" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="badge-green mx-auto w-fit">
            <LayoutDashboard className="size-3.5" /> ENTERPRISE PLATFORM
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            One ecosystem for the <span className="text-gradient-emerald">entire hospital</span>
          </h2>
          <p className="mt-4 text-foreground">
            Modular microservices covering every clinical, operational and analytical workflow.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((f, i) => <div key={f.title}><FeatureCard {...f} /></div>)}
        </div>
      </div>
    </section>
  );
}

function SmartICUSection() {
  return (
    <section id="icu" className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="badge-green w-fit">
            <Monitor className="size-3.5" /> SMART ICU MONITORING
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-tight text-foreground">
            Real-time vitals, <span className="text-gradient-emerald">intelligent</span>.
          </h2>
          <p className="mt-5 text-foreground leading-relaxed">
            Centralised ICU command center with continuous vitals streaming, AI-driven risk
            prediction, smart bed allocation and instant trauma escalation — all in one pane.
          </p>
          <div className="mt-6 space-y-3">
            {[
              "Live ECG, SpO₂, BP and temperature monitoring",
              "AI sepsis and deterioration prediction engine",
              "Bed occupancy tracking with acuity-based allocation",
              "Automated trauma escalation and code-blue alerts",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3">
                <div className="icon-container-sm shrink-0">
                  <CheckCircle2 className="size-4" />
                </div>
                <span className="text-sm text-foreground font-medium leading-relaxed pt-1">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="glass rounded-3xl p-6 shadow-xl-elegant border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="icon-container-sm">
                  <Activity className="size-4" />
                </div>
                <span className="text-sm font-bold text-foreground">Live ICU · Bed 04</span>
              </div>
              <span className="badge-green"><span className="size-1.5 rounded-full bg-emerald-500 inline-block mr-1" /> Stable</span>
            </div>
            {/* ECG Waveform */}
            <svg viewBox="0 0 300 80" className="w-full mb-4">
              <path d="M0,60 L30,60 L35,20 L40,70 L45,65 L50,60 L70,60 L75,55 L80,58 L85,55 L90,60 L110,60 L115,30 L120,50 L125,35 L130,55 L135,60 L155,60 L160,58 L165,55 L170,58 L175,60 L195,60 L200,25 L205,55 L210,30 L215,50 L220,55 L225,60 L245,60 L250,58 L255,55 L260,58 L265,60 L285,60 L290,50 L295,55 L300,58" fill="none" stroke="oklch(0.48 0.18 165)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Vitals Grid */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Heart Rate", value: "82", unit: "bpm" },
                { label: "SpO₂", value: "97", unit: "%" },
                { label: "BP", value: "124/78", unit: "mmHg" },
                { label: "Temp", value: "36.9", unit: "°C" },
              ].map((v) => (
                <div key={v.label} className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-center">
                  <div className="text-[10px] text-foreground font-semibold uppercase tracking-wider">{v.label}</div>
                  <div className="mt-1 text-lg font-bold text-foreground">{v.value}</div>
                  <div className="text-[10px] text-foreground">{v.unit}</div>
                </div>
              ))}
            </div>
            {/* Bed Metrics */}
            <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <Bed size={16} className="text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-800">Bed Availability</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-bold">3 ICU</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-xs font-bold">2 HDU</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-xs font-bold">6 Occupied</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section id="ai" className="py-24 px-6 bg-[var(--gradient-hero)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="badge-gold w-fit">
            <Sparkles className="size-3.5" /> AI INTELLIGENCE LAYER
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-tight text-foreground">
            Clinical decisions, <span className="text-gradient-gold">augmented</span>.
          </h2>
          <p className="mt-5 text-foreground leading-relaxed">
            Our AI engine ingests vitals, labs, imaging and history to surface risk scores,
            differential diagnoses and treatment pathways — explained, auditable and HL7-compliant.
          </p>
          <div className="mt-6 space-y-3">
            {[
              "Predictive readmission and sepsis risk scoring",
              "AI documentation assistant — voice to structured notes",
              "Population health intelligence and outbreak signals",
              "Smart triage and emergency escalation engine",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3">
                <div className="icon-container-sm shrink-0">
                  <CheckCircle2 className="size-4" />
                </div>
                <span className="text-sm text-foreground font-medium leading-relaxed pt-1">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="glass rounded-3xl p-6 shadow-xl-elegant border border-gold/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="icon-container-sm">
                  <LineChart className="size-4" />
                </div>
                <span className="text-sm font-bold text-foreground">Population Health · Last 30 days</span>
              </div>
            </div>
            <svg viewBox="0 0 300 120" className="w-full">
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.15 165)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="oklch(0.55 0.15 165)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,90 C40,70 70,40 110,55 C150,70 180,30 220,40 C250,48 280,20 300,25 L300,120 L0,120 Z" fill="url(#g1)" />
              <path d="M0,90 C40,70 70,40 110,55 C150,70 180,30 220,40 C250,48 280,20 300,25" fill="none" stroke="oklch(0.55 0.15 165)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0,100 C50,95 90,80 140,82 C190,84 230,70 300,60" fill="none" stroke="oklch(0.75 0.15 85)" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
            </svg>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-2xl bg-card/50 border border-primary/20">
                <div className="text-xl font-bold text-gradient-primary">+24%</div>
                <div className="text-[10px] text-foreground font-medium">Early detection</div>
              </div>
              <div className="text-center p-3 rounded-2xl bg-card/50 border border-primary/20">
                <div className="text-xl font-bold text-gradient-gold">−38%</div>
                <div className="text-[10px] text-foreground font-medium">Readmissions</div>
              </div>
              <div className="text-center p-3 rounded-2xl bg-card/50 border border-primary/20">
                <div className="text-xl font-bold text-gradient-primary">12s</div>
                <div className="text-[10px] text-foreground font-medium">Avg AI response</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Compliance() {
  const items = [
    { icon: ShieldCheck, label: "HIPAA" },
    { icon: Lock, label: "DPDP Act" },
    { icon: Hospital, label: "ABDM / NDHM" },
    { icon: FileText, label: "HL7 FHIR R4" },
    { icon: Globe2, label: "Multilingual" },
    { icon: BadgeCheck, label: "NABH" },
  ];
  return (
    <section id="compliance" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-3xl p-10 md:p-12 shadow-xl-elegant border border-primary/20">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <div className="badge-green">
                <ShieldCheck className="size-3.5" /> COMPLIANCE
              </div>
              <h3 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Government-grade <span className="text-gradient-gold">compliance</span></h3>
              <p className="mt-3 text-sm text-foreground leading-relaxed">End-to-end encrypted. Auditable. Built for regulated healthcare environments worldwide.</p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[var(--gradient-green-subtle)] border border-primary/10 card-hover">
                  <div className="icon-container-sm shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="py-16 px-6 bg-[var(--gradient-hero)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "500+", label: "Hospitals Connected", icon: Hospital },
            { value: "10M+", label: "Patients Managed", icon: Users },
            { value: "99.99%", label: "Uptime SLA", icon: TrendingUp },
            { value: "Certified", label: "NABH & HIPAA", icon: BadgeCheck },
          ].map((item, i) => (
            <div key={item.label} className="text-center p-6 rounded-2xl bg-card border border-primary/20 shadow-card-soft card-hover">
              <div className="icon-container icon-container-light mx-auto mb-3">
                <item.icon className="size-6" />
              </div>
              <div className="text-3xl font-bold text-foreground">{item.value}</div>
              <div className="text-sm text-foreground mt-1 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2.5rem] p-12 md:p-16 shadow-xl-elegant" style={{ background: "var(--gradient-emerald-gold)" }}>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ background: "radial-gradient(circle at 80% 20%, white, transparent 50%)" }} />
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative text-center text-primary-foreground">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to build the smart hospital of tomorrow?</h2>
          <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">Join 500+ healthcare institutions transforming care delivery with AI.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/login" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/25 hover:text-emerald-900 transition-all duration-200">
              Contact Sales <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-card/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="AI Healthcare System" className="size-8" />
              <div className="leading-tight">
<div className="font-bold text-sm text-foreground">Carenium Doctor Dashboard</div>
                    <div className="text-[10px] text-foreground">AI Healthcare System</div>
              </div>
            </Link>
            <p className="text-sm text-foreground leading-relaxed">Enterprise AI-powered smart healthcare platform for the world's most demanding clinical environments.</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="icon-container-sm hover:opacity-80 transition"><Twitter className="size-4" /></a>
              <a href="#" className="icon-container-sm hover:opacity-80 transition"><Linkedin className="size-4" /></a>
              <a href="#" className="icon-container-sm hover:opacity-80 transition"><Mail className="size-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-4">Company</h4>
            <div className="space-y-2.5">
              <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-foreground transition"><Info className="size-3.5" /> About</a>
              <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-foreground transition"><Phone className="size-3.5" /> Contact</a>
              <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-foreground transition"><Mail className="size-3.5" /> Support</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-4">Legal</h4>
            <div className="space-y-2.5">
              <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-foreground transition"><ShieldCheck className="size-3.5" /> Privacy Policy</a>
              <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-foreground transition"><FileText className="size-3.5" /> Terms of Service</a>
              <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-foreground transition"><BadgeCheck className="size-3.5" /> Certifications</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-4">Certifications</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-foreground"><ShieldCheck className="size-3.5 text-foreground" /> HIPAA Compliant</div>
              <div className="flex items-center gap-2 text-sm text-foreground"><Lock className="size-3.5 text-foreground" /> DPDP Act Ready</div>
              <div className="flex items-center gap-2 text-sm text-foreground"><Hospital className="size-3.5 text-foreground" /> ABDM / NDHM</div>
              <div className="flex items-center gap-2 text-sm text-foreground"><BadgeCheck className="size-3.5 text-foreground" /> NABH Certified</div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground">
          <span>© 2026 AI Healthcare System. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition">Privacy</a>
            <a href="#" className="hover:text-foreground transition">Terms</a>
            <a href="#" className="hover:text-foreground transition">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AboutSection() {
  const timeline = [
    { year: "2019", event: "Carenium founded in Bengaluru by a team of clinicians and AI researchers from IIT and AIIMS." },
    { year: "2020", event: "Launched AI-powered ICU monitoring platform across 12 partner hospitals during the pandemic." },
    { year: "2022", event: "Secured Series A funding and expanded to 200+ hospitals with full EHR and telemedicine suite." },
    { year: "2024", event: "Achieved HIPAA, ABDM and NABH compliance. Crossed 10M patients managed on the platform." },
    { year: "2026", event: "Now serving 500+ hospitals globally with AI-driven clinical intelligence and smart command centers." },
  ];
  const team = [
    { name: "Dr. Arvind Mehta", role: "CEO & Co-Founder", bio: "Former Head of ICU at AIIMS Delhi. 18 years in critical care medicine and health IT." },
    { name: "Priya Srinivasan", role: "CTO & Co-Founder", bio: "AI researcher from IIT Madras. Previously led ML teams at Philips Healthcare." },
    { name: "Dr. Kavita Nair", role: "Chief Medical Officer", bio: "Board-certified cardiologist with 15 years experience in digital health transformation." },
    { name: "Rohit Deshmukh", role: "VP of Engineering", bio: "Scaled products from zero to 10M+ users. Expertise in cloud-native healthcare architectures." },
  ];
  return (
    <section id="about" className="py-24 px-6 bg-[var(--gradient-hero)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="badge-green mx-auto w-fit">
            <Info className="size-3.5" /> ABOUT
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Built for clinicians, <span className="text-gradient-emerald">by clinicians</span>
          </h2>
          <p className="mt-4 text-foreground">
            Carenium is on a mission to make world-class healthcare infrastructure accessible
            to every hospital, clinic and patient through the power of AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "500+", label: "Hospitals" },
                { value: "10M+", label: "Patients" },
                { value: "99.99%", label: "Uptime" },
                { value: "24/7", label: "Support" },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-2xl p-6 text-center shadow-card-soft card-hover">
                  <div className="text-3xl font-bold text-gradient-emerald">{s.value}</div>
                  <div className="text-sm text-foreground mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            <p className="text-foreground leading-relaxed">
              To empower every healthcare provider with an AI co-pilot that reduces clinical burnout,
              catches deterioration early, and delivers data-driven insights — so doctors can focus on
              what matters most: patient care.
            </p>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span><strong>HQ:</strong> Bengaluru, India · <strong>Offices:</strong> Mumbai, Delhi, Singapore</span>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground text-center mb-10">Our Journey</h3>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-emerald-200 hidden md:block" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <div key={t.year} className={`relative flex items-center gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block md:w-1/2" />
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 size-5 rounded-full bg-emerald-500 border-4 border-emerald-100 shadow-md" />
                  <div className="md:w-1/2 glass-card rounded-2xl p-5 shadow-card-soft card-hover">
                    <span className="text-sm font-bold text-emerald-600">{t.year}</span>
                    <p className="text-sm text-foreground mt-1">{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-foreground text-center mb-10">Leadership Team</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((m) => (
              <div key={m.name} className="glass-card rounded-2xl p-6 shadow-card-soft card-hover text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 grid place-items-center text-white font-bold text-xl mx-auto mb-4 shadow-md">
                  {m.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <h4 className="font-bold text-foreground">{m.name}</h4>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">{m.role}</p>
                <p className="text-xs text-foreground mt-2 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Landing() {
  return (
    <main>
      <Nav />
      <Hero />
      <Features />
      <AISection />
      <SmartICUSection />
      <Compliance />
      <AboutSection />
      <TrustSection />
      <CTA />
      <Footer />
    </main>
  );
}
