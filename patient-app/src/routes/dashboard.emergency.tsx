import { createFileRoute } from "@tanstack/react-router";
import {
  Ambulance, AlertTriangle, Phone, Clock, Users, Bed, HeartPulse,
  Search, Plus, Filter, ChevronRight, ArrowRight, MapPin, Activity,
  User, X, CheckCircle2, TrendingUp, TrendingDown, Siren, Navigation,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/emergency")({
  head: () => ({ meta: [{ title: "Emergency — Carenium Doctor Dashboard" }] }),
  component: EmergencyPage,
});

const triageConfig: Record<string, { badge: string; dot: string }> = {
  Critical: { badge: "bg-rose-100 text-rose-700 border border-rose-200", dot: "bg-rose-500" },
  Urgent: { badge: "bg-amber-100 text-amber-700 border border-amber-200", dot: "bg-amber-500" },
  Standard: { badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
};

const emergencyQueue: any[] = [];
const ambulances: any[] = [];
const icuBeds: any[] = [];
const alerts: any[] = [];

function EmergencyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQueue = emergencyQueue.filter((e) =>
    e.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50 space-y-4 lg:space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="icon-container bg-gradient-to-br from-rose-500 to-red-600 text-white p-2.5 rounded-xl shadow-elegant">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Emergency Response Center</h1>
            <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Real-time triage, dispatch, and critical care coordination</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-white border border-primary/20 text-xs lg:text-sm font-medium text-foreground hover:border-rose-300 hover:text-rose-600 transition-all">
            <Phone size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Call Dispatch</span>
          </button>
          <button className="btn-primary bg-gradient-to-br from-rose-500 to-red-600 flex items-center gap-2 shadow-elegant text-sm">
            <Plus size={14} className="lg:size-[16px]" />
            <span className="hidden xs:inline">Register Emergency</span>
            <span className="xs:hidden">Emergency</span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {[
          { label: "Critical", value: "3", icon: AlertTriangle, gradient: "from-rose-500 to-red-600", accent: "bg-rose-100 border-rose-200" },
          { label: "Urgent", value: "8", icon: Activity, gradient: "from-amber-400 to-yellow-500", accent: "bg-amber-100 border-amber-200" },
          { label: "Standard", value: "14", icon: Clock, gradient: "from-emerald-500 to-green-600", accent: "bg-emerald-100 border-emerald-200" },
          { label: "Available Beds", value: "7", icon: Bed, gradient: "from-blue-500 to-indigo-600", accent: "bg-blue-50 border-blue-200" },
          { label: "Ambulances En Route", value: "4", icon: Ambulance, gradient: "from-cyan-500 to-teal-600", accent: "bg-cyan-50 border-cyan-200" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`glass-card rounded-2xl p-5 shadow-card-soft card-hover ${stat.accent}`}>
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
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-2xl shadow-card-soft overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20">
              <div className="flex items-center gap-2">
                <Siren size={16} className="text-rose-500" />
                <h3 className="text-sm font-bold text-foreground">Emergency Queue</h3>
                <span className="text-xs bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded-full">{emergencyQueue.length}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground" />
                  <input
                    placeholder="Search patient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-44 pl-9 pr-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-gray-600"
                  />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground hover:border-primary/30 transition-all">
                  <Filter size={14} />
                  Filter
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary/20 bg-muted/50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Patient</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Triage</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Condition</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Wait Time</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Doctor</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueue.map((entry, i) => {
                    const tc = triageConfig[entry.triage];
                    return (
                      <tr key={i} className="border-b border-primary/20 hover:bg-rose-100/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                              entry.triage === "Critical" ? "bg-gradient-to-br from-rose-500 to-red-600" :
                              entry.triage === "Urgent" ? "bg-gradient-to-br from-amber-400 to-yellow-500" :
                              "bg-gradient-to-br from-emerald-500 to-green-600"
                            }`}>
                              {entry.patient.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="font-semibold text-foreground">{entry.patient}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${tc.badge}`}>
                            <span className={`size-1.5 rounded-full ${tc.dot}`} />
                            {entry.triage}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-foreground font-medium">{entry.condition}</td>
                        <td className="px-5 py-4">
                          <span className={`flex items-center gap-1 text-xs font-semibold ${
                            entry.waitTime.startsWith("1") || entry.waitTime.startsWith("2") ? "text-rose-600" : "text-foreground"
                          }`}>
                            <Clock size={12} />
                            {entry.waitTime}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-foreground">{entry.doctor}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            entry.status === "In Treatment" ? "bg-rose-100 text-rose-700" :
                            entry.status === "Waiting" ? "badge-gold" :
                            "bg-primary text-white"
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button className="p-2 rounded-lg hover:bg-rose-100 text-foreground hover:text-rose-600 transition-all">
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center gap-2 mb-4">
              <Navigation size={16} className="text-cyan-600" />
              <h3 className="text-sm font-bold text-foreground">Ambulance Tracking</h3>
            </div>
            <div className="space-y-3">
              {ambulances.map((amb) => (
                <div key={amb.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all border border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className={`icon-container-sm bg-gradient-to-br ${
                      amb.status === "En Route" ? "from-cyan-500 to-teal-600" :
                      amb.status === "At Scene" ? "from-rose-500 to-red-600" :
                      "from-amber-400 to-yellow-500"
                    } text-white`}>
                      <Ambulance size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{amb.id}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          amb.status === "En Route" ? "bg-cyan-100 text-cyan-700" :
                          amb.status === "At Scene" ? "bg-rose-100 text-rose-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {amb.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {amb.location}</span>
                        <span className="flex items-center gap-1"><User size={10} /> {amb.crew}</span>
                      </div>
                    </div>
                  </div>
                  {amb.eta !== "—" && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{amb.eta}</p>
                      <p className="text-[10px] text-text-muted">ETA</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center gap-2 mb-4">
              <Bed size={16} className="text-blue-600" />
              <h3 className="text-sm font-bold text-foreground">ICU Allocation</h3>
            </div>
            <div className="space-y-4">
              {icuBeds.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-foreground">{item.label}</span>
                    <span className="text-xs font-bold text-foreground">{item.value}/{item.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all"
                      style={{ width: `${(item.value / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-muted/50 text-sm font-semibold text-foreground hover:text-foreground transition-all">
              <span>Manage ICU beds</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-500" />
                <h3 className="text-sm font-bold text-foreground">Emergency Alerts</h3>
              </div>
              <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">{alerts.length}</span>
            </div>
            <div className="space-y-2">
              {alerts.map((alert, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                  alert.type === "critical"
                    ? "bg-rose-100 border border-rose-200"
                    : alert.type === "urgent"
                    ? "bg-amber-100 border border-amber-200"
                    : "bg-muted/50 border border-primary/20"
                }`}>
                  <div className={`mt-0.5 size-2 rounded-full shrink-0 ${
                    alert.type === "critical" ? "bg-rose-500 animate-pulse" :
                    alert.type === "urgent" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{alert.message}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{alert.time}</p>
                  </div>
                  <button className="shrink-0 p-1 rounded-lg hover:bg-rose-100 text-foreground hover:text-rose-600 transition-all">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-foreground hover:bg-primary/5 transition-all">
              View All Alerts
              <ChevronRight size={12} />
            </button>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-card-soft bg-gradient-to-br from-rose-600/5 to-red-600/5 border-rose-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container-sm bg-gradient-to-br from-rose-500 to-red-600 text-white">
                <Phone size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Quick Dial</h3>
                <p className="text-xs text-text-muted">Emergency contacts</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Resuscitation Team", number: "Ext. 1122" },
                { label: "Trauma Surgeon On-Call", number: "Ext. 1201" },
                { label: "Blood Bank", number: "Ext. 1080" },
              ].map((contact) => (
                <div key={contact.label} className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-rose-100">
                  <span className="text-xs font-semibold text-foreground">{contact.label}</span>
                  <button className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors">
                    <Phone size={11} />
                    {contact.number}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
