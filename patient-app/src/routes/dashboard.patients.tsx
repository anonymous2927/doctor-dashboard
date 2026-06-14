import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Search, User, Plus, Filter, Phone, Calendar, HeartPulse, Activity,
  Thermometer, Syringe, FileText, Download, ArrowUpRight, ChevronRight,
  Clock, AlertCircle, CheckCircle2, X, MoreHorizontal,
} from "lucide-react";
import { getPatients } from "../lib/api/server-functions";

export const Route = createFileRoute("/dashboard/patients")({
  head: () => ({ meta: [{ title: "Patients — Doctor Dashboard" }] }),
  component: PatientsPage,
});

const statusStyles: Record<string, string> = {
  Stable: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Critical: "bg-rose-100 text-rose-700 border border-rose-200",
  "In Treatment": "bg-amber-100 text-amber-700 border border-amber-200",
  Discharged: "bg-slate-100 text-slate-600 border border-slate-200",
};

const statusDots: Record<string, string> = {
  Stable: "bg-emerald-500",
  Critical: "bg-rose-500 animate-pulse",
  "In Treatment": "bg-amber-500",
  Discharged: "bg-slate-400",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("");
}

const colorCycle = ["from-emerald-500 to-green-600", "from-rose-500 to-red-600", "from-amber-400 to-yellow-500", "from-blue-500 to-indigo-600"];

function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    getPatients().then((res) => setPatients(res.data || []));
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = [
    { label: "Total Patients", value: patients.length.toString(), icon: User, gradient: "from-emerald-500 to-green-600" },
    { label: "In Treatment", value: patients.filter((p) => p.status === "In Treatment" || p.status === "Critical").length.toString(), icon: AlertCircle, gradient: "from-rose-500 to-red-600" },
    { label: "Stable", value: patients.filter((p) => p.status === "Stable").length.toString(), icon: CheckCircle2, gradient: "from-teal-500 to-cyan-600" },
    { label: "Discharged", value: patients.filter((p) => p.status === "Discharged").length.toString(), icon: Plus, gradient: "from-blue-500 to-indigo-600" },
  ];

  return (
    <div className="min-h-screen space-y-4 lg:space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gradient-emerald">Patients Management</h1>
          <p className="text-text-secondary mt-1 text-xs lg:text-sm">Manage patient records, admissions, and vitals</p>
        </div>
        <button className="btn-primary text-sm px-4 py-2.5">
          <Plus className="size-4" />
          Register Patient
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-2xl p-5 shadow-card-soft card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">{stat.label}</span>
                <div className={`icon-container-sm bg-gradient-to-br ${stat.gradient} text-white`}>
                  <Icon className="size-[18px]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-2xl p-4 lg:p-6 shadow-card-soft">
        <div className="flex flex-wrap items-center gap-3 mb-4 lg:mb-6">
          <div className="relative flex-1 min-w-[180px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground" />
            <input
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary/50 focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600"
            />
          </div>
          {[
            { label: "Department", icon: Filter },
            { label: "Status", icon: Filter },
            { label: "Date", icon: Calendar },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <button key={f.label} className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs lg:text-sm font-medium text-foreground hover:border-primary/30 hover:text-foreground transition-all">
                <Icon className="size-3.5 lg:size-4" />
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left text-xs font-semibold text-foreground uppercase tracking-wider pb-3 pr-4">Patient</th>
                <th className="text-left text-xs font-semibold text-foreground uppercase tracking-wider pb-3 pr-4">ID</th>
                <th className="text-left text-xs font-semibold text-foreground uppercase tracking-wider pb-3 pr-4">Age/Gender</th>
                <th className="text-left text-xs font-semibold text-foreground uppercase tracking-wider pb-3 pr-4">Department</th>
                <th className="text-left text-xs font-semibold text-foreground uppercase tracking-wider pb-3 pr-4">Status</th>
                <th className="text-left text-xs font-semibold text-foreground uppercase tracking-wider pb-3 pr-4">Admission</th>
                <th className="text-right text-xs font-semibold text-foreground uppercase tracking-wider pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-text-muted">
                    {patients.length === 0 ? "Loading patients..." : "No patients match your search."}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p, idx) => {
                  const color = colorCycle[idx % colorCycle.length];
                  return (
                    <tr key={p.id} className="border-b border-primary/20 last:border-0 group">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-9 rounded-full bg-gradient-to-br ${color} text-white grid place-items-center text-xs font-bold shrink-0`}>
                            {getInitials(p.name)}
                          </div>
                          <span className="text-sm font-semibold text-foreground">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-sm text-foreground font-mono">{p.id}</td>
                      <td className="py-3 pr-4 text-sm text-foreground">{p.age}/{p.gender}</td>
                      <td className="py-3 pr-4 text-sm text-foreground">{p.department}</td>
                      <td className="py-3 pr-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", statusStyles[p.status] || statusStyles.Stable)}>
                          <span className={cn("size-1.5 rounded-full", statusDots[p.status] || statusDots.Stable)} />
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-sm text-foreground">{p.admission_date || p.admissionDate}</td>
                      <td className="py-3 text-right">
                        <button data-handled="true"
                          onClick={() => setSelectedPatient(p)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                            selectedPatient?.id === p.id
                              ? "bg-primary text-primary-foreground shadow-elegant"
                              : "bg-primary/10 text-foreground hover:bg-primary hover:text-primary-foreground"
                          )}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/20">
          <span className="text-xs text-foreground">Showing {filteredPatients.length} of {patients.length} patients</span>
          <button className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors">
            View All
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 lg:p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white">
              <Syringe className="size-[18px]" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Admit Patient</h3>
          </div>
          <div className="space-y-3 mb-5">
            <input placeholder="Patient Name" className="w-full pl-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" />
            <input placeholder="MRN / Hospital ID" className="w-full pl-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" />
            <select className="w-full px-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground outline-none focus:border-primary/50 transition-colors">
              <option value="">Select Department</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Orthopedics</option>
              <option>General</option>
              <option>ICU</option>
            </select>
          </div>
          <button className="btn-primary w-full justify-center">
            <Plus className="size-4" />
            Admit Patient
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container-sm bg-gradient-to-br from-amber-400 to-yellow-500 text-white">
              <FileText className="size-[18px]" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Discharge Patient</h3>
          </div>
          <div className="space-y-3 mb-5">
            <input placeholder="Patient Name or ID" className="w-full pl-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" />
            <input placeholder="Discharge Date" className="w-full pl-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" />
            <textarea placeholder="Discharge Summary (optional)" rows={2} className="w-full px-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-gray-600" />
          </div>
          <div className="flex gap-3">
            <button className="flex-1 btn-primary justify-center">
              <Download className="size-4" />
              Discharge
            </button>
            <button className="px-4 py-2.5 rounded-xl border border-primary/20 text-sm font-semibold text-foreground hover:bg-muted transition-all">
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                <HeartPulse className="size-[18px]" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Vitals Tracking</h3>
            </div>
            <button className="text-xs font-semibold text-foreground flex items-center gap-1 hover:text-foreground/80 transition-colors">
              Full Report
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          {selectedPatient ? (
            <>
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-primary/20">
                <div className="size-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white grid place-items-center text-xs font-bold">
                  {getInitials(selectedPatient.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedPatient.name}</p>
                  <p className="text-xs text-text-muted">{selectedPatient.id} &middot; {selectedPatient.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Heart Rate", value: "—", unit: "bpm", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-100" },
                  { label: "Blood Pressure", value: "—", unit: "mmHg", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-100" },
                  { label: "SpO₂", value: "—", unit: "%", icon: Thermometer, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Temperature", value: "—", unit: "°C", icon: Thermometer, color: "text-amber-500", bg: "bg-amber-100" },
                ].map((v) => {
                  const Icon = v.icon;
                  return (
                    <div key={v.label} className={cn("rounded-xl p-3", v.bg)}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className={cn("size-3.5", v.color)} />
                        <span className="text-[11px] font-medium text-text-muted">{v.label}</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{v.value} <span className="text-xs font-normal text-text-muted">{v.unit}</span></p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-2 text-sm text-text-muted">Select a patient to view vitals</div>
          )}

          <button className="w-full mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 text-sm font-semibold text-foreground transition-all">
            <span>View detailed vitals</span>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
