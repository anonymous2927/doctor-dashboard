import { createFileRoute } from "@tanstack/react-router";
import {
  Microscope, Search, Plus, Filter, Download, Upload, Printer,
  AlertCircle, CheckCircle2, Clock, FileText, Image, X, Eye,
  ChevronRight, ArrowRight, Activity, Heart, Brain, Bone, Scan,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/lab")({
  head: () => ({ meta: [{ title: "Lab & Imaging — Carenium Doctor Dashboard" }] }),
  component: LabPage,
});

function LabPage() {
  const filters = ["All", "Pending", "In Progress", "Completed", "Critical"];

  const labTests: any[] = [];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Completed: "badge-green",
      Critical: "bg-rose-100 text-rose-700",
      "In Progress": "badge-gold",
      Pending: "bg-primary text-white",
    };
    const Icon = {
      Completed: CheckCircle2,
      Critical: AlertCircle,
      "In Progress": Clock,
      Pending: Clock,
    }[status] || Clock;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || "bg-primary text-white"}`}>
        <Icon size={12} /> {status}
      </span>
    );
  };

  const priorityBadge = (priority: string) => {
    const map: Record<string, string> = {
      Normal: "bg-primary text-white",
      Urgent: "badge-gold",
      STAT: "bg-rose-100 text-rose-700",
    };
    return (
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${map[priority] || "bg-primary text-white"}`}>
        {priority}
      </span>
    );
  };

  const workflowSteps: any[] = [];

  const aiAnalyses: any[] = [];

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
            <Microscope size={22} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Lab & Imaging</h1>
            <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Manage orders, view results, and AI-assisted analysis</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-card-soft text-xs lg:text-sm font-medium text-foreground hover:shadow-elegant transition-all duration-300">
            <Printer size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-gradient-primary text-white text-xs lg:text-sm font-medium shadow-card-soft hover:shadow-elegant transition-all duration-300">
            <Plus size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Order New Test</span>
            <span className="sm:hidden">New Test</span>
          </button>
          <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold">
            <AlertCircle size={14} />
            3 Critical
          </span>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button key={f} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${f === "All" ? "bg-gradient-primary text-white shadow-card-soft" : "bg-primary/10 border border-primary/20 text-foreground hover:border-emerald-300 hover:text-emerald-600"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs lg:text-sm text-foreground hover:border-emerald-300 transition-all">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs lg:text-sm text-foreground hover:border-emerald-300 transition-all">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/20 bg-muted/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Test Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Patient</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Ordered By</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Priority</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labTests.map((t) => (
                <tr key={t.name} className="border-b border-primary/20 hover:bg-emerald-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2 rounded-lg">
                        {t.name.includes("X-Ray") ? <Scan size={14} /> : t.name.includes("MRI") || t.name.includes("CT") ? <Image size={14} /> : <Microscope size={14} />}
                      </div>
                      <span className="font-semibold text-foreground">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground font-medium">{t.patient}</td>
                  <td className="px-5 py-4 text-foreground">{t.orderedBy}</td>
                  <td className="px-5 py-4">{statusBadge(t.status)}</td>
                  <td className="px-5 py-4">{priorityBadge(t.priority)}</td>
                  <td className="px-5 py-4 text-foreground">{t.date}</td>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
              <Activity size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Sample Collection Workflow</h3>
          </div>
          <div className="space-y-0">
            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-start gap-3 relative pb-6 last:pb-0">
                  {i < workflowSteps.length - 1 && (
                    <div className="absolute left-[17px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 to-emerald-100" />
                  )}
                  <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2 rounded-lg shrink-0 z-10">
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{step.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{step.desc}</p>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <ChevronRight size={14} className="text-foreground ml-auto shrink-0 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container bg-gradient-to-br from-violet-500 to-purple-600 text-white p-2.5 rounded-xl">
              <Brain size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">AI-Assisted Analysis</h3>
          </div>
          <div className="space-y-3">
            {aiAnalyses.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.result} className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className={a.result.includes("No abnormalities") ? "text-emerald-500" : "text-amber-500"} />
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.badge}`}>
                      {a.result}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">{a.detail}</p>
                </div>
              );
            })}
          </div>
          <button className="mt-4 w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 text-sm font-semibold text-violet-700 hover:from-violet-100 hover:to-purple-100 transition-all duration-300">
            <span>View full AI report</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-2.5 rounded-xl">
              <Scan size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Radiology Viewer</h3>
          </div>
          <div className="relative rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 aspect-[4/3] flex items-center justify-center overflow-hidden mb-4">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.3)_0%,transparent_70%)]" />
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full border border-emerald-400/30" />
              <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 rounded-full border border-emerald-400/20" />
              <div className="absolute inset-[15%] border border-emerald-400/10 rounded-lg" />
            </div>
            <div className="relative text-center">
              <div className="icon-container bg-white/10 text-white/60 p-3 rounded-2xl mx-auto mb-3 backdrop-blur-sm">
                <Image size={32} />
              </div>
              <p className="text-white/80 text-sm font-semibold">X-Ray / MRI / CT Viewer</p>
              <p className="text-white/60 text-xs mt-1">Click to load DICOM image</p>
            </div>
            <div className="absolute top-3 left-3 flex gap-1.5">
              <span className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm text-[10px] font-semibold text-white/70">Chest PA</span>
              <span className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm text-[10px] font-semibold text-white/70">12:1</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-foreground transition-all" title="Zoom In">
                <Search size={14} />
              </button>
              <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-foreground transition-all" title="Pan">
                <ArrowRight size={14} />
              </button>
              <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-foreground transition-all" title="Download">
                <Download size={14} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Open viewer
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
