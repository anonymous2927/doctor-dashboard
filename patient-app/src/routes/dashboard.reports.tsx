import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3, FileText, Download, Printer, TrendingUp, TrendingDown,
  Users, Calendar, DollarSign, Pill, Microscope, Ambulance, HeartPulse,
  Brain, Clock, ChevronRight, ArrowRight, Search, Filter, PieChart,
  LineChart, Share2, Eye, Plus, ExternalLink, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Reports — Carenium Doctor Dashboard" }] }),
  component: ReportsPage,
});

const reportTypes: any[] = []; const recentReports: any[] = []; const monthlyData: number[] = [];

function ReportsPage() {
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Completed: "badge-green",
      Generating: "badge-gold",
      Failed: "bg-rose-100 text-rose-700",
    };
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || "badge-green"}`}>
        {status === "Generating" && <Clock size={12} />}
        {status === "Completed" && <CheckCircle2 size={12} />}
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
            <BarChart3 size={22} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Generate, export, and analyze hospital reports</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-card-soft text-xs lg:text-sm font-medium text-foreground hover:shadow-elegant transition-all duration-300">
            <Share2 size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-card-soft text-xs lg:text-sm font-medium text-foreground hover:shadow-elegant transition-all duration-300">
            <Download size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-gradient-primary text-white text-xs lg:text-sm font-medium shadow-card-soft hover:shadow-elegant transition-all duration-300">
            <FileText size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Generate Report</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </header>

      <section>
        <h3 className="text-xs lg:text-sm font-semibold text-foreground uppercase tracking-wider mb-3 lg:mb-4">Report Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
          {reportTypes.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.name} className="glass-card rounded-2xl p-5 shadow-card-soft card-hover cursor-pointer">
                <div className={`icon-container-sm bg-gradient-to-br ${r.gradient} text-white p-2.5 rounded-xl mb-3`}>
                  <Icon size={18} />
                </div>
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                  <span>View reports</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-2xl p-5 lg:p-6 shadow-card-soft card-hover">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-foreground">Monthly Trends</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">Jun 2026</span>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <TrendingUp size={12} />
                +8.2%
              </span>
            </div>
          </div>
          <div className="h-48">
            <svg viewBox="0 0 600 180" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="oklch(0.38 0.16 165)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="oklch(0.38 0.16 165)" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              {monthlyData.map((val, i) => {
                const barW = 600 / monthlyData.length - 6;
                const max = Math.max(...monthlyData);
                const h = (val / max) * 160;
                const x = i * (600 / monthlyData.length) + 3;
                return (
                  <g key={i}>
                    <rect x={x} y={170 - h} width={barW} height={h} rx={4} fill="url(#barGrad)" />
                    <text x={x + barW / 2} y={165} textAnchor="middle" className="text-[8px] font-semibold" fill="oklch(0.38 0.16 165)">
                      {val}
                    </text>
                  </g>
                );
              })}
              <line x1="0" y1="170" x2="600" y2="170" stroke="oklch(0.88 0.015 160)" strokeWidth="1" />
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <text key={m} x={i * (600 / 12) + (600 / 12) / 2} y="176" textAnchor="middle" className="text-[9px]" fill="oklch(0.48 0.03 160)">
                  {m}
                </text>
              ))}
            </svg>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container bg-gradient-to-br from-amber-400 to-yellow-500 text-white p-2.5 rounded-xl">
              <PieChart size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Distribution</h3>
          </div>
          <div className="flex items-center justify-center h-36 mb-4">
            <svg viewBox="0 0 120 120" className="w-36 h-36">
              <circle cx="60" cy="60" r="50" fill="none" stroke="oklch(0.38 0.16 165)" strokeWidth="16" strokeDasharray="180 134" strokeDashoffset="0" transform="rotate(-90 60 60)" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="oklch(0.75 0.15 85)" strokeWidth="16" strokeDasharray="95 219" strokeDashoffset="-180" transform="rotate(-90 60 60)" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="oklch(0.55 0.22 27)" strokeWidth="16" strokeDasharray="39 275" strokeDashoffset="-275" transform="rotate(-90 60 60)" />
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="text-foreground">IPD (48%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0" />
              <span className="text-foreground">OPD (34%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span className="text-foreground">ER (18%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl shadow-card-soft overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2 rounded-lg">
              <FileText size={16} />
            </div>
            <h3 className="text-base font-semibold text-foreground">Recent Reports</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground" />
              <input placeholder="Search reports..." className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary/50 focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground hover:border-emerald-300 transition-all">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/20 bg-muted/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Report Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Date Generated</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((r) => (
                <tr key={r.name} className="border-b border-primary/20 hover:bg-emerald-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2 rounded-lg">
                        <FileText size={14} />
                      </div>
                      <span className="font-semibold text-foreground">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground">{r.type}</td>
                  <td className="px-5 py-4 text-foreground">{r.date}</td>
                  <td className="px-5 py-4">{statusBadge(r.status)}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-emerald-100 text-foreground hover:text-emerald-600 transition-all">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-emerald-100 text-foreground hover:text-emerald-600 transition-all">
                      <Download size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-emerald-100 text-foreground hover:text-emerald-600 transition-all">
                      <Printer size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-2xl p-5 lg:p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
              <Download size={20} />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-foreground">Export Options</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2 rounded-lg">
                  <FileText size={16} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">PDF Export</p>
                  <p className="text-xs text-text-muted">Formatted document with charts</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all">
                <Download size={12} /> Export
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
              <div className="flex items-center gap-3">
                <div className="icon-container-sm bg-gradient-to-br from-violet-500 to-purple-600 text-white p-2 rounded-lg">
                  <BarChart3 size={16} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">Excel Export</p>
                  <p className="text-xs text-text-muted">Raw data with pivot tables</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-all">
                <Download size={12} /> Export
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="icon-container-sm bg-gradient-to-br from-amber-400 to-yellow-500 text-white p-2 rounded-lg">
                  <FileText size={16} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">CSV Export</p>
                  <p className="text-xs text-text-muted">Comma-separated values file</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-all">
                <Download size={12} /> Export
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
              <Plus size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Custom Report Builder</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">Date Range</label>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Start date" className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary/50 focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600" />
                <input type="text" placeholder="End date" className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary/50 focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">Department</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground outline-none focus:border-emerald-400 transition-all">
                <option>All Departments</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
                <option>Pediatrics</option>
                <option>Emergency</option>
                <option>ICU</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">Metrics</label>
              <div className="flex flex-wrap gap-2">
                {["Revenue", "Patient Count", "Bed Occupancy", "Surgery Count", "Lab Tests", "Pharmacy"].map((m) => (
                  <label key={m} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-foreground cursor-pointer hover:border-emerald-300 transition-all">
                    <input type="checkbox" className="accent-emerald-600" />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button className="w-full mt-5 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-card-soft hover:shadow-elegant transition-all duration-300">
            <Plus size={16} />
            Build Custom Report
          </button>
        </div>
      </div>
    </div>
  );
}
