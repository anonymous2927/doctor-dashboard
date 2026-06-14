import { createFileRoute } from "@tanstack/react-router";
import {
  HeartPulse, Activity, Thermometer, Droplets, Bed, AlertTriangle, Brain,
  TrendingUp, TrendingDown, Users, Monitor, Clock, Search, Filter, ChevronRight,
  ArrowRight, Radio, Gauge,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/icu")({
  head: () => ({ meta: [{ title: "Smart ICU — Carenium Doctor Dashboard" }] }),
  component: ICUPage,
});

const bedStatuses: any[] = [];

const bedConfig: Record<string, { label: string; bg: string; dot: string }> = {};

const vitalsData: Record<string, any> = {};

const riskPredictions: any[] = [];

const icuAlerts: any[] = [];

function ICUPage() {
  const [selectedBed, setSelectedBed] = useState<any>({ id: 0, status: 'available', patient: null });
  const [searchQuery, setSearchQuery] = useState("");

  const patientName = selectedBed.patient;
  const vitals = patientName && vitalsData[patientName] ? vitalsData[patientName] : null;

  const trendIcon = (trend: string, size = 14) => {
    if (trend === "up") return <TrendingUp size={size} className="text-rose-500" />;
    if (trend === "down") return <TrendingDown size={size} className="text-emerald-500" />;
    return null;
  };

  const filteredPredictions = riskPredictions.filter((r) =>
    r.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50 space-y-4 lg:space-y-6 animate-fade-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
            <HeartPulse size={22} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Smart ICU Monitoring</h1>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <p className="text-xs lg:text-sm text-text-secondary">Real-time patient surveillance</p>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-white border border-primary/20 text-xs lg:text-sm font-medium text-foreground hover:border-primary/30 hover:text-foreground transition-all">
            <Monitor size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Central Monitor</span>
          </button>
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs lg:text-sm font-medium text-foreground hover:border-primary/30 hover:text-foreground transition-all">
            <Filter size={14} className="lg:size-[15px]" />
            Filters
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: "Total Beds", value: "12", icon: Bed, gradient: "from-emerald-500 to-green-600" },
          { label: "Occupied", value: "7", icon: Users, gradient: "from-amber-400 to-yellow-500" },
          { label: "Critical", value: "3", icon: AlertTriangle, gradient: "from-rose-500 to-red-600" },
          { label: "Avg. LOS", value: "4.2d", icon: Clock, gradient: "from-blue-500 to-indigo-600" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-2xl p-5 shadow-card-soft card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">{stat.label}</span>
                <div className={`icon-container-sm bg-gradient-to-br ${stat.gradient} text-white`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center gap-2 mb-4">
              <Bed size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-foreground">Bed Occupancy</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {bedStatuses.map((bed) => {
                const cfg = bedConfig[bed.status];
                return (
                  <button data-handled="true"
                    key={bed.id}
                    onClick={() => setSelectedBed(bed)}
                    className={`${cfg.bg} rounded-xl p-2.5 text-center transition-all ${
                      selectedBed.id === bed.id ? "ring-2 ring-primary shadow-elegant scale-105" : "hover:scale-105"
                    }`}
                  >
                    <span className={`block mx-auto size-2 rounded-full ${cfg.dot} mb-1`} />
                    <p className="text-[11px] font-bold text-foreground">{bed.id}</p>
                    {bed.patient && (
                      <p className="text-[8px] text-text-muted truncate mt-0.5 leading-tight">
                        {bed.patient.split(" ").pop()}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-primary/20 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-500" /> Available</span>
              <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-rose-500" /> Critical</span>
              <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-amber-500" /> Stable</span>
              <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-gray-400" /> Offline</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={16} className="text-violet-600" />
              <h3 className="text-sm font-bold text-foreground">AI Risk Prediction</h3>
            </div>
            <div className="space-y-3">
              {riskPredictions.map((rp) => (
                <div key={rp.patient} className="p-3 rounded-xl bg-muted/50 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground">{rp.patient}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${rp.gradient}`}>
                      {rp.risk} · {rp.score}%
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed">{rp.detail}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 flex items-center justify-between px-3 py-2.5 rounded-xl bg-muted/50 text-xs font-semibold text-foreground hover:text-foreground transition-all">
              <span>Full risk analysis</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card rounded-2xl p-6 shadow-card-soft">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`icon-container-sm bg-gradient-to-br ${
                  selectedBed.status === "occupied-critical" ? "from-rose-500 to-red-600" :
                  selectedBed.status === "occupied-stable" ? "from-amber-400 to-yellow-500" :
                  "from-emerald-500 to-green-600"
                } text-white`}>
                  <HeartPulse size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {patientName || `Bed ${selectedBed.id}`}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {patientName ? `ICU Bed ${selectedBed.id} · ${selectedBed.status === "occupied-critical" ? "Critical" : "Stable"}` : "Unoccupied"}
                  </p>
                </div>
              </div>
              {vitals && (
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <span className="flex items-center gap-1"><Clock size={11} /> Last updated 12s ago</span>
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              )}
            </div>

            {vitals ? (
              <>
                <div className="grid grid-cols-4 gap-4 mb-5">
                  {[
                    { label: "Heart Rate", value: vitals.hr, unit: "bpm", icon: HeartPulse, trend: vitals.hrTrend, accent: vitals.hr > 100 ? "text-rose-500" : "text-emerald-500" },
                    { label: "Blood Pressure", value: vitals.bp, unit: "mmHg", icon: Activity, trend: vitals.bpTrend, accent: "text-blue-500" },
                    { label: "SpO₂", value: vitals.spo2, unit: "%", icon: Droplets, trend: vitals.spo2Trend, accent: vitals.spo2 < 94 ? "text-rose-500" : "text-cyan-500" },
                    { label: "Temperature", value: vitals.temp.toFixed(1), unit: "°C", icon: Thermometer, trend: vitals.tempTrend, accent: vitals.temp > 38 ? "text-rose-500" : "text-amber-500" },
                  ].map((v) => {
                    const Icon = v.icon;
                    return (
                      <div key={v.label} className={`rounded-xl p-4 border ${
                        v.label === "Heart Rate" && vitals.hr > 100 ? "bg-rose-100 border-rose-200" :
                        v.label === "SpO₂" && vitals.spo2 < 94 ? "bg-rose-100 border-rose-200" :
                        v.label === "Temperature" && vitals.temp > 38 ? "bg-rose-100 border-rose-200" :
                        "bg-muted/50 border-primary/20"
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <Icon size={15} className={v.accent} />
                          {trendIcon(v.trend)}
                        </div>
                        <p className="text-xl font-bold text-foreground">
                          {v.value}
                          <span className="text-xs font-normal text-text-muted ml-1">{v.unit}</span>
                        </p>
                        <p className="text-[10px] text-text-muted mt-0.5 font-medium">{v.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl bg-gray-900 p-5 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-emerald-400" />
                      <span className="text-xs font-semibold text-white/70">Lead II ECG</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-white/60">
                      <span>25 mm/s</span>
                      <span>10 mm/mV</span>
                      <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </div>
                  </div>
                  <svg viewBox="0 0 800 100" className="w-full h-auto" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ecgLineICU" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <linearGradient id="ecgFillICU" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 50 L80 50 L100 48 L120 52 L140 50 L180 50 L200 28 L220 72 L240 50 L280 50 L300 49 L320 51 L340 50 L380 50 L400 25 L410 75 L420 50 L460 50 L480 48 L500 52 L520 50 L560 50 L580 26 L590 74 L600 50 L640 50 L660 49 L680 51 L700 50 L740 50 L760 22 L770 78 L780 50 L800 50"
                      fill="none"
                      stroke="url(#ecgLineICU)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-sm"
                    />
                    <path
                      d="M0 50 L80 50 L100 48 L120 52 L140 50 L180 50 L200 28 L220 72 L240 50 L280 50 L300 49 L320 51 L340 50 L380 50 L400 25 L410 75 L420 50 L460 50 L480 48 L500 52 L520 50 L560 50 L580 26 L590 74 L600 50 L640 50 L660 49 L680 51 L700 50 L740 50 L760 22 L770 78 L780 50 L800 50 L800 100 L0 100 Z"
                      fill="url(#ecgFillICU)"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-xs text-text-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Sinus Rhythm
                    </span>
                    <span>PR 152 ms</span>
                    <span>QRS 98 ms</span>
                    <span>QT 386 ms</span>
                  </div>
                  <button className="flex items-center gap-1 text-foreground font-semibold hover:text-foreground/80 transition-colors">
                    Full ECG Report
                    <ArrowRight size={12} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="icon-container bg-primary/10 text-foreground p-4 rounded-2xl mb-4">
                  <Monitor size={36} />
                </div>
                <p className="text-sm font-semibold text-foreground">No patient assigned to this bed</p>
                <p className="text-xs text-text-muted mt-1">Select an occupied bed to view vitals</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio size={16} className="text-rose-500" />
                <h3 className="text-sm font-bold text-foreground">Real-time Alerts</h3>
              </div>
              <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">{icuAlerts.length}</span>
            </div>
            <div className="space-y-2">
              {icuAlerts.map((alert, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                  alert.type === "critical" ? "bg-rose-100 border border-rose-200" :
                  alert.type === "warning" ? "bg-amber-100 border border-amber-200" :
                  "bg-muted/50 border border-primary/20"
                }`}>
                  <div className={`mt-0.5 size-2 rounded-full shrink-0 ${
                    alert.type === "critical" ? "bg-rose-500 animate-pulse" :
                    alert.type === "warning" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{alert.message}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-semibold text-foreground hover:bg-primary/5 transition-all">
              <span>View Alert History</span>
              <ChevronRight size={12} />
            </button>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center gap-2 mb-4">
              <Gauge size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-foreground">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: "Assign Nurse", icon: Users, gradient: "from-emerald-500 to-green-600" },
                { label: "Transfer Patient", icon: ArrowRight, gradient: "from-blue-500 to-indigo-600" },
                { label: "Order Lab", icon: Search, gradient: "from-amber-400 to-yellow-500" },
                { label: "Emergency Protocol", icon: AlertTriangle, gradient: "from-rose-500 to-red-600" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.label} className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all border border-primary/20 group">
                    <div className="flex items-center gap-3">
                      <div className={`icon-container-sm bg-gradient-to-br ${action.gradient} text-white`}>
                        <Icon size={15} />
                      </div>
                      <span className="text-xs font-semibold text-foreground">{action.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-foreground group-hover:text-foreground transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-card-soft bg-gradient-to-br from-emerald-600/5 to-green-600/5 border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                <Activity size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Shift Summary</h3>
                <p className="text-xs text-text-muted">Current shift overview</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/60 border border-emerald-100">
                <span className="text-foreground">Nurses on duty</span>
                <span className="font-bold text-foreground">8</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/60 border border-emerald-100">
                <span className="text-foreground">Ventilators in use</span>
                <span className="font-bold text-foreground">5 / 10</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/60 border border-emerald-100">
                <span className="text-foreground">CRRT machines</span>
                <span className="font-bold text-foreground">2 / 4</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/60 border border-emerald-100">
                <span className="text-foreground">Code Blue today</span>
                <span className="font-bold text-foreground">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
