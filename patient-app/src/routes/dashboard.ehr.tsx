import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  FileText, Search, User, Calendar, Download, Upload, Plus, Filter, Clock,
  Stethoscope, Pill, Microscope, AlertCircle, CheckCircle2, ChevronRight,
  ArrowRight, Printer, Share2, HeartPulse,
} from "lucide-react";
import { getPatients } from "../lib/api/server-functions";

export const Route = createFileRoute("/dashboard/ehr")({
  head: () => ({ meta: [{ title: "EHR — Carenium Doctor Dashboard" }] }),
  component: EHRPage,
});

const tabs = ["Clinical Notes", "Diagnosis", "Prescriptions", "Lab Reports", "Documents"];

function EHRPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Clinical Notes");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPatients().then((res) => setPatients(res.data || []));
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen space-y-4 lg:space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
            <FileText size={22} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Electronic Health Records</h1>
            <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Manage patient medical records and history</p>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          New Record
        </button>
      </header>

      <div className="glass-card rounded-2xl p-3 lg:p-4 shadow-card-soft animate-fade-up">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground" />
            <input
              type="text"
              placeholder="Search patients by name or ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm hover:bg-emerald-600 transition-colors">
            <Filter size={15} />
            Filters
          </button>
          <div className="flex items-center gap-2 text-sm text-foreground bg-primary/10 px-4 py-2.5 rounded-xl border border-primary/20">
            <Calendar size={15} />
            Last 30 days
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 animate-fade-up">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {filteredPatients.length === 0 && (
            <div className="text-sm text-text-muted p-4 text-center">
              {patients.length === 0 ? "Loading patients..." : "No patients found."}
            </div>
          )}
          {filteredPatients.map((patient) => {
            const firstStatus = patient.status === "Critical" ? "critical" : "stable";
            return (
              <button
                key={patient.id} data-handled="true"
                onClick={() => setSelectedPatient(patient)}
                className={`w-full glass-card rounded-2xl p-4 shadow-card-soft card-hover text-left transition-all ${
                  selectedPatient?.id === patient.id
                    ? "ring-2 ring-emerald-500 border-emerald-500/30"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-xl grid place-items-center text-white font-bold text-sm ${
                    patient.status === "Critical"
                      ? "bg-gradient-to-br from-rose-500 to-red-600"
                      : "bg-gradient-to-br from-emerald-500 to-green-600"
                  }`}>
                    {patient.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{patient.name}</p>
                    <p className="text-xs text-text-muted">{patient.age} yrs &middot; {patient.id}</p>
                  </div>
                  <ChevronRight size={16} className="text-foreground shrink-0" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    patient.status === "Critical"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {patient.status === "Critical" ? "Critical" : "Stable"}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock size={10} />
                    {patient.admission_date || patient.admissionDate || "—"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-9 space-y-5">
          {!selectedPatient ? (
            <div className="glass-card rounded-2xl shadow-card-soft p-12 text-center">
              <FileText size={48} className="mx-auto text-primary/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a Patient</h3>
              <p className="text-sm text-text-muted">Choose a patient from the list to view their electronic health records.</p>
            </div>
          ) : (<>
          <div className="glass-card rounded-2xl shadow-card-soft overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 grid place-items-center text-white font-bold">
                  {selectedPatient.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{selectedPatient.name}</h2>
                  <div className="flex items-center gap-3 text-sm text-foreground mt-0.5">
                    <span>{selectedPatient.age} yrs &middot; {selectedPatient.gender}</span>
                    <span className="w-1 h-1 rounded-full bg-primary/20" />
                    <span>{selectedPatient.id}</span>
                    <span className="w-1 h-1 rounded-full bg-primary/20" />
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {selectedPatient.doctor || "—"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-sm hover:bg-emerald-600 transition-colors">
                  <Printer size={14} />
                  Print
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-sm hover:bg-emerald-600 transition-colors">
                  <Download size={14} />
                  Export
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-sm hover:bg-emerald-600 transition-colors">
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </div>

            <div className="flex border-b border-primary/20 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab} data-handled="true"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "Clinical Notes" && (
                <div className="space-y-4">
                  <p className="text-sm text-text-muted">No clinical notes available for this patient.</p>
                </div>
              )}

              {activeTab === "Diagnosis" && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <AlertCircle size={20} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{selectedPatient.diagnosis || "No diagnosis recorded"}</p>
                    <p className="text-xs text-text-muted mt-0.5">Current primary diagnosis</p>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-500 ml-auto shrink-0" />
                </div>
              )}

              {activeTab === "Prescriptions" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-foreground">Current Medications</h4>
                    <button className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                      <Plus size={13} />
                      Add Prescription
                    </button>
                  </div>
                  <p className="text-sm text-text-muted">No prescriptions recorded.</p>
                </div>
              )}

              {activeTab === "Lab Reports" && (
                <div className="space-y-3">
                  <p className="text-sm text-text-muted">No lab reports available.</p>
                </div>
              )}

              {activeTab === "Documents" && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group">
                    <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-3 rounded-xl mx-auto mb-4 group-hover:scale-105 transition-transform">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Drop files here or click to upload</p>
                    <p className="text-xs text-text-muted mt-1">PDF, DICOM, JPEG, PNG — Max 25 MB each</p>
                    <button className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors">
                      Browse Files
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <FileText size={13} />
                    <span>No documents uploaded yet for this patient</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="glass-card rounded-2xl p-5 shadow-card-soft">
              <div className="flex items-center gap-2 mb-4">
                <HeartPulse size={18} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">Vitals Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "BP", value: "—", unit: "mmHg" },
                  { label: "HR", value: "—", unit: "bpm" },
                  { label: "Temp", value: "—", unit: "°C" },
                  { label: "SpO2", value: "—", unit: "%" },
                ].map((v) => (
                  <div key={v.label} className="bg-primary/10 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">{v.label}</p>
                    <p className="text-lg font-bold text-foreground">{v.value}</p>
                    <p className="text-[10px] text-text-muted">{v.unit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 shadow-card-soft">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">Upcoming Appointments</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-text-muted">No upcoming appointments.</p>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
