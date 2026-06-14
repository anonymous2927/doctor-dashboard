import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, Bed, Activity, BarChart3, HeartPulse, Brain,
  TrendingUp, TrendingDown, Calendar,
  Sparkles, Microscope, Video, AlertTriangle,
  ArrowRight, ChevronRight, X, CheckCircle, Clock, Thermometer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getDashboardStats } from "../lib/api/server-functions";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const [stats, setStats] = useState<any>(null);
  const [roundActive, setRoundActive] = useState(false);
  const [completedPatients, setCompletedPatients] = useState<string[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  const roundPatients: any[] = [];

  const kpiCards = stats ? [
    { label: "Active Patients", value: stats.totalPatients.toString(), delta: "+12%", icon: Users, trend: "up", tone: "primary" },
    { label: "Available Beds", value: stats.availableBeds.toString(), delta: "of 8 total", icon: Bed, trend: "up", tone: "gold" },
    { label: "Critical Cases", value: stats.criticalCases.toString(), delta: "-15%", icon: Activity, trend: "down", tone: "warning" },
    { label: "Today's Revenue", value: `₹${(stats.totalRevenue / 100).toFixed(1)}L`, delta: "+12.4%", icon: BarChart3, trend: "up", tone: "success" },
    { label: "Active Doctors", value: stats.activeDoctors.toString(), delta: "on duty", icon: HeartPulse, trend: "up", tone: "primary" },
    { label: "Pending Labs", value: stats.pendingBills.toString(), delta: "needs review", icon: Microscope, trend: "up", tone: "gold" },
    { label: "Appointments Today", value: stats.todayAppointments.toString(), delta: "+18%", icon: Calendar, trend: "up", tone: "primary" },
    { label: "AI Alerts", value: "7", delta: "+40%", icon: Brain, trend: "up", tone: "warning", flagged: true },
  ] : [];

  const insights: any[] = [];

  return (
    <div className="min-h-screen space-y-4 lg:space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Good morning, Dr. Mehta
          </h1>
          <p className="text-text-secondary mt-1 text-sm lg:text-base">
            Here's what's happening across your wards today.
          </p>
        </div>
        <div className="flex items-center gap-2 lg:gap-3">
          <button onClick={() => toast.info("Schedule", { description: "Opening calendar view..." })} className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-card-soft text-xs lg:text-sm font-medium text-foreground hover:shadow-elegant transition-all duration-300">
            <Calendar size={14} className="lg:size-4" />
            <span className="hidden xs:inline">12 May 2026</span>
            <span className="xs:hidden">12 May</span>
          </button>
          <button onClick={() => { setRoundActive(true); setCompletedPatients([]); toast.success("Round started", { description: "Morning rounds initiated for ward 3A." }); }} className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-gradient-primary text-white text-xs lg:text-sm font-medium shadow-card-soft hover:shadow-elegant transition-all duration-300">
            <Video size={14} className="lg:size-4" />
            <span className="hidden xs:inline">Start Round</span>
            <span className="xs:hidden">Round</span>
          </button>
        </div>
      </header>

      {roundActive && (
        <div className="glass-card rounded-2xl p-6 shadow-card-soft border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2 rounded-xl">
                <Activity size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Morning Rounds — Ward 3A</h2>
                <p className="text-xs text-text-muted">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · Dr. Mehta</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full">{completedPatients.length}/{roundPatients.length} completed</span>
              <button onClick={() => setRoundActive(false)} className="size-8 rounded-lg bg-primary/10 text-foreground grid place-items-center hover:bg-primary/20 transition-all"><X size={16} /></button>
            </div>
          </div>
          <div className="grid gap-3">
            {roundPatients.map((p) => {
              const done = completedPatients.includes(p.id);
              const statusColor = p.status === "critical" ? "bg-rose-500" : p.status === "moderate" ? "bg-amber-500" : "bg-emerald-500";
              const statusLabel = p.status === "critical" ? "Critical" : p.status === "moderate" ? "Moderate" : "Stable";
              return (
                <div key={p.id} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${done ? "bg-emerald-50/50 opacity-60" : "bg-primary/5 hover:bg-primary/10"}`}>
                  <button onClick={() => setCompletedPatients(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])} className={`size-6 rounded-full border-2 grid place-items-center shrink-0 transition-all ${done ? "bg-emerald-500 border-emerald-500 text-white" : "border-primary/30 hover:border-emerald-400"}`}>
                    {done && <CheckCircle size={14} />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{p.name}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${statusColor}`}>{statusLabel}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{p.room} · {p.condition}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5 justify-end"><Thermometer size={12} className="text-rose-400" />{p.vitals}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/20">
            <p className="text-xs text-text-muted flex items-center gap-1.5"><Clock size={12} /> Estimated time remaining: {roundPatients.length - completedPatients.length * 4} mins</p>
            <button onClick={() => { setRoundActive(false); toast.success("Round completed", { description: "All patients reviewed. Summary saved to EHR." }); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-card-soft hover:shadow-elegant transition-all duration-300">
              <CheckCircle size={16} />
              Complete Round
            </button>
          </div>
        </div>
      )}

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
          const trendColor = kpi.trend === "up" ? "text-emerald-500" : "text-rose-500";
          const iconBg: Record<string, string> = {
            "Active Patients": "bg-emerald-500",
            "Available Beds": "bg-amber-500",
            "Critical Cases": "bg-rose-500",
            "Today's Revenue": "bg-emerald-500",
            "Active Doctors": "bg-emerald-500",
            "Pending Labs": "bg-emerald-500",
            "Appointments Today": "bg-amber-500",
            "AI Alerts": "bg-rose-500",
          };
          return (
            <div key={kpi.label} className="glass-card rounded-2xl p-5 shadow-card-soft card-hover">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-foreground">{kpi.label}</span>
                <div className={`${iconBg[kpi.label] || 'bg-emerald-500'} text-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <TrendIcon size={14} className={trendColor} />
                    <span className={`text-sm font-semibold ${trendColor}`}>{kpi.delta}</span>
                    <span className="text-xs text-text-muted ml-1">vs last week</span>
                  </div>
                </div>
                {kpi.flagged && (
                  <span className="badge-green text-xs font-semibold px-2.5 py-1 rounded-full">Flagged</span>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 lg:p-6 shadow-card-soft">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
                <HeartPulse size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Live ECG Monitor
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-emerald-600 font-medium">
                    Receiving data
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">112</p>
                <p className="text-xs text-foreground font-medium">bpm</p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wide">
                Tachycardia
              </span>
            </div>
          </div>
          <div className="relative">
            <svg
              viewBox="0 0 800 120"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="ecgLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="ecgFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 60 L100 60 L120 58 L140 62 L160 60 L200 60 L220 35 L240 85 L260 60 L300 60 L320 59 L340 61 L360 60 L400 60 L420 30 L430 90 L440 60 L480 60 L500 58 L520 62 L540 60 L580 60 L600 32 L610 88 L620 60 L660 60 L680 59 L700 61 L720 60 L760 60 L780 28 L790 92 L800 60"
                fill="none"
                stroke="url(#ecgLine)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
              <path
                d="M0 60 L100 60 L120 58 L140 62 L160 60 L200 60 L220 35 L240 85 L260 60 L300 60 L320 59 L340 61 L360 60 L400 60 L420 30 L430 90 L440 60 L480 60 L500 58 L520 62 L540 60 L580 60 L600 32 L610 88 L620 60 L660 60 L680 59 L700 61 L720 60 L760 60 L780 28 L790 92 L800 60 L800 120 L0 120 Z"
                fill="url(#ecgFill)"
              />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/20">
            <div className="flex items-center gap-4 text-sm text-foreground">
              <span>Lead II</span>
              <span className="w-1 h-1 rounded-full bg-primary/20" />
              <span>25 mm/s</span>
              <span className="w-1 h-1 rounded-full bg-primary/20" />
              <span>10 mm/mV</span>
            </div>
            <button onClick={() => toast.info("ECG Report", { description: "Loading full ECG analysis report..." })} className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              View full report
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft bg-gradient-to-br from-emerald-600 via-emerald-500 to-amber-500 text-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container bg-white/20 text-white p-2.5 rounded-xl backdrop-blur-sm">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-lg font-semibold">Emergency Triage</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-6">
            <div className="bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-white/80 mt-1 font-medium">
                Critical
              </p>
            </div>
            <div className="bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold">8</p>
              <p className="text-sm text-white/80 mt-1 font-medium">Urgent</p>
            </div>
            <div className="bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold">14</p>
              <p className="text-sm text-white/80 mt-1 font-medium">
                Standard
              </p>
            </div>
          </div>
          <Link to="/dashboard" className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-sm font-semibold transition-all duration-300">
            <span>Open command center</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-bold text-foreground">AI Insights</h2>
          </div>
          <Link
            to="/dashboard/ai"
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {insights.map((item) => (
            <div
              key={item.patient}
              className="glass-card rounded-2xl p-5 shadow-card-soft card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div
                    className={`${item.badge} text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-2`}
                  >
                    {item.risk} Risk
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {item.condition}
                  </p>
                </div>
                <div className="icon-container-sm bg-primary text-white p-2 rounded-lg">
                  <Brain size={16} />
                </div>
              </div>
              <p className="text-sm text-foreground mb-3">{item.patient}</p>
              <p className="text-sm text-foreground leading-relaxed mb-4">
                {item.description}
              </p>
              <Link
                to="/dashboard/patients"
                className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Review case
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
