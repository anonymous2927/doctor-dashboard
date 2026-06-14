import { createFileRoute } from "@tanstack/react-router";
import {
  Brain, Sparkles, Activity, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, Users, HeartPulse, BarChart3, Clock, MessageSquare,
  ChevronRight, ArrowRight, Search, Filter, Target, LineChart, Gauge,
  Bot, Lightbulb, Shield,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/ai")({
  head: () => ({ meta: [{ title: "AI Intelligence — Carenium Doctor Dashboard" }] }),
  component: AIPage,
});

const riskPatients: any[] = [];
const insights: any[] = [];
const predictions: any[] = [];
const chatMessages: any[] = [];
const recommendations: any[] = [];

function AIPage() {

  const riskColors: Record<string, string> = {
    high: "bg-rose-500",
    medium: "bg-amber-400",
    low: "bg-emerald-500",
  };

  const riskBg: Record<string, string> = {
    high: "bg-rose-50 border-rose-200",
    medium: "bg-amber-50 border-amber-200",
    low: "bg-emerald-50 border-emerald-200",
  };

  const riskText: Record<string, string> = {
    high: "text-rose-700",
    medium: "text-amber-700",
    low: "text-emerald-700",
  };

  const riskBadge: Record<string, string> = {
    high: "bg-rose-100 text-rose-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="icon-container bg-gradient-to-br from-violet-500 to-purple-600 text-white p-2.5 rounded-xl">
            <Brain size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 lg:gap-3">
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">AI Intelligence</h1>
              <span className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs lg:text-sm text-text-secondary mt-0.5">AI-powered clinical decision support</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-card-soft text-xs lg:text-sm font-medium text-foreground hover:shadow-elegant transition-all duration-300">
            <Search size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Search Insights</span>
          </button>
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-gradient-primary text-white text-xs lg:text-sm font-medium shadow-card-soft hover:shadow-elegant transition-all duration-300">
            <Sparkles size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Run AI Analysis</span>
            <span className="sm:hidden">Analyze</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 lg:p-6 shadow-card-soft card-hover">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="icon-container bg-gradient-to-br from-rose-500 to-red-600 text-white p-2.5 rounded-xl">
                <Activity size={20} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Risk Scoring</h3>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground" />
              <input placeholder="Search patients..." className="pl-9 pr-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-emerald-400 transition-all w-48 placeholder:text-gray-600" />
            </div>
          </div>
          <div className="space-y-3">
            {riskPatients.length === 0 && (
              <div className="p-6 text-center text-sm text-text-muted">No risk assessments available. Run an AI analysis to see results.</div>
            )}
            {riskPatients.map((p) => (
              <div key={p.name} className={`flex items-center gap-4 p-4 rounded-xl border ${riskBg[p.severity]}`}>
                <div className={`size-10 rounded-xl bg-gradient-to-br ${
                  p.severity === "high" ? "from-rose-500 to-red-600" :
                  p.severity === "medium" ? "from-amber-400 to-yellow-500" :
                  "from-emerald-500 to-green-600"
                } grid place-items-center text-white font-bold text-sm shrink-0`}>
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="text-xs text-text-muted">{p.risk} &middot; {p.ward}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${riskBadge[p.severity]}`}>
                      {p.level} ({p.pct}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-primary/20 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${riskColors[p.severity]}`}
                      style={{ width: `${p.severity === "low" ? Math.max(p.pct * 3, 8) : p.pct}%` }} />
                  </div>
                </div>
                <ChevronRight size={16} className="text-foreground shrink-0" />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-foreground py-2 hover:text-emerald-600 transition-colors">
            View all risk assessments
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container bg-gradient-to-br from-amber-400 to-yellow-500 text-white p-2.5 rounded-xl">
              <Lightbulb size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Clinical Decision Support</h3>
          </div>
          <div className="space-y-3">
            {recommendations.length === 0 && (
              <div className="p-4 text-center text-sm text-text-muted">No recommendations yet.</div>
            )}
            {recommendations.map((r, i) => {
              const borderMap: Record<string, string> = {
                critical: "border-l-rose-500 bg-rose-50/50",
                warning: "border-l-amber-400 bg-amber-50/50",
                info: "border-l-emerald-500 bg-emerald-50/50",
              };
              const IconMap: Record<string, typeof AlertTriangle> = {
                critical: AlertTriangle,
                warning: AlertTriangle,
                info: CheckCircle2,
              };
              const Icon = IconMap[r.type];
              const colorMap: Record<string, string> = {
                critical: "text-rose-600",
                warning: "text-amber-600",
                info: "text-emerald-600",
              };
              return (
                <div key={i} className={`border-l-4 ${borderMap[r.type]} rounded-r-xl p-4`}>
                  <div className="flex items-start gap-3">
                    <Icon size={16} className={`mt-0.5 shrink-0 ${colorMap[r.type]}`} />
                    <div>
                      <p className="text-sm font-bold text-foreground">{r.patient}</p>
                      <p className="text-xs text-text-muted mt-0.5">{r.issue}</p>
                      <p className="text-xs font-semibold mt-2 text-foreground flex items-center gap-1">
                        <ArrowRight size={10} />
                        {r.action}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-card-soft hover:shadow-elegant transition-all duration-300">
            <Brain size={16} />
            View All Recommendations
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-2xl p-5 lg:p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container text-white p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #F97316, #F59E0B)' }}>
              <Bot size={20} />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-foreground">AI Medical Assistant</h3>
            <span className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <div className="h-64 overflow-y-auto space-y-3 mb-4 pr-1">
            {chatMessages.length === 0 && (
              <div className="flex items-center justify-center h-full text-sm text-text-muted">Start a conversation with the AI assistant.</div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isAI ? "" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.isAI
                    ? "bg-violet-50 border border-violet-100 text-foreground"
                    : "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                }`}>
                  {msg.isAI && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Bot size={12} className="text-violet-600" />
                      <p className="text-xs font-semibold text-violet-700">{msg.sender}</p>
                    </div>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${msg.isAI ? "text-foreground" : "text-white/60"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask the AI assistant..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
            />
            <button className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white grid place-items-center hover:shadow-lg transition-all shrink-0">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container text-white p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #F97316, #F59E0B)' }}>
              <BarChart3 size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Population Health Insights</h3>
          </div>
          <div className="relative h-40 mb-5">
            <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.38 0.16 165)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="oklch(0.38 0.16 165)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d="M0,100 Q40,80 80,90 T160,60 T240,70 T320,40 T400,50 L400,120 L0,120 Z"
                fill="url(#areaGrad)" />
              <path d="M0,100 Q40,80 80,90 T160,60 T240,70 T320,40 T400,50"
                fill="none" stroke="oklch(0.38 0.16 165)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="320" cy="40" r="4" fill="oklch(0.38 0.16 165)" />
              <text x="320" y="32" textAnchor="middle" className="text-[9px] font-bold" fill="oklch(0.38 0.16 165)">
                +24%
              </text>
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-text-muted px-2">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {insights.length === 0 && (
              <div className="col-span-2 p-3 text-center text-sm text-text-muted">No population insights available.</div>
            )}
            {insights.map((ins) => (
              <div key={ins.label} className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                <span className="text-sm font-medium text-foreground">{ins.label}</span>
                <span className={`flex items-center gap-1 text-sm font-bold ${
                  ins.trend === "up" ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {ins.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {ins.value}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-card-soft hover:shadow-elegant transition-all duration-300">
            <Target size={16} />
            View Detailed Insights
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 lg:p-6 shadow-card-soft card-hover">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="icon-container bg-gradient-to-br from-violet-500 to-purple-600 text-white p-2.5 rounded-xl">
              <LineChart size={20} />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-foreground">Predictive Analytics</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs lg:text-sm text-foreground hover:border-violet-300 transition-all">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-primary text-white text-xs lg:text-sm font-semibold shadow-card-soft hover:shadow-elegant transition-all duration-300">
              <Sparkles size={14} /> Generate Predictions
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {predictions.length === 0 && (
            <div className="col-span-4 p-4 text-center text-sm text-text-muted">No predictions generated yet.</div>
          )}
          {predictions.map((p) => (
            <div key={p.metric} className="p-4 rounded-xl bg-gradient-to-br from-violet-50/50 to-purple-50/50 border border-violet-100">
              <p className="text-xs font-medium text-text-muted mb-2">{p.metric}</p>
              <p className="text-2xl font-bold text-foreground">{p.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${
                p.change >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}>
                {p.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {p.change >= 0 ? "+" : ""}{p.change}{p.unit} vs last week
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
