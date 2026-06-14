import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar, Clock, User, Video, Phone, Plus, Search, Filter, CheckCircle2, X, ChevronRight, ArrowRight, Sparkles, Stethoscope, Pill, AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/appointments")({
  head: () => ({ meta: [{ title: "Appointments — Carenium Doctor Dashboard" }] }),
  component: AppointmentsPage,
});

type Appointment = {
  time: string;
  patient: string;
  initials: string;
  doctor: string;
  type: "Consultation" | "Follow-up" | "Telemedicine";
  status: "Confirmed" | "Checked In" | "Cancelled" | "No Show";
};

const appointments: Appointment[] = [];

const statusConfig: Record<string, { badge: string; dot: string }> = {};

const typeIcon: Record<string, typeof Stethoscope> = {};

function AppointmentsPage() {
  return (
    <div className="min-h-screen space-y-4 lg:space-y-6 animate-fade-up">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage doctor schedules, bookings, and check-ins</p>
        </div>
        <button className="btn-primary text-sm">
          <Plus size={16} className="lg:size-[18px]" />
          Book Appointment
        </button>
      </header>

      {/* Stats row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-5">
        {[
          { label: "Total Today", value: "24", iconClass: "stat-icon-green" },
          { label: "Checked In", value: "8", iconClass: "stat-icon-blue" },
          { label: "Pending", value: "12", iconClass: "stat-icon-orange" },
          { label: "Cancelled", value: "4", iconClass: "stat-icon-red" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-5 shadow-card-soft card-hover">
            <span className="text-sm font-medium text-foreground">{s.label}</span>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <div className={`icon-container-sm ${s.iconClass} text-white p-2.5 rounded-xl`}>
                <Calendar size={16} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Calendar / Date Selector */}
      <section className="glass-silver rounded-2xl p-5 shadow-card-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-white/10 transition text-white/60">
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <span className="text-base font-semibold text-white">May 2026</span>
            <button className="p-2 rounded-xl hover:bg-white/10 transition text-white/60">
              <ChevronRight size={18} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-sm font-medium text-white/60 hover:bg-white/20 transition">
            <Filter size={14} />
            Filter
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2 lg:gap-3">
          {[
            { day: "Mon", date: "11", today: false },
            { day: "Tue", date: "12", today: true },
            { day: "Wed", date: "13", today: false },
            { day: "Thu", date: "14", today: false },
            { day: "Fri", date: "15", today: false },
          ].map((d) => (
            <button
              key={d.day}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-200 ${
                d.today
                  ? "calendar-selected"
                  : "text-white/60 calendar-hover-silver"
              } ${d.today ? "calendar-today" : ""}`}
            >
              <span className="text-xs font-medium">{d.day}</span>
              <span className="text-lg font-bold">{d.date}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Appointments List + Doctor Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Appointments List */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 lg:p-6 shadow-card-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h3 className="text-base lg:text-lg font-semibold text-foreground">Today's Schedule</h3>
            <div className="relative w-full sm:w-auto">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground" />
              <input placeholder="Search patients..." className="w-full sm:w-48 pl-9 pr-3 py-2 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600" />
            </div>
          </div>
          <div className="space-y-3">
            {appointments.map((a) => {
              const TypeIcon = typeIcon[a.type];
              const sc = statusConfig[a.status];
              return (
                <div key={`${a.time}-${a.patient}`} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 group">
                  <div className="text-center min-w-[52px]">
                    <p className="text-sm font-bold text-foreground">{a.time}</p>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1 ${sc.dot.split(" ")[0]}`} />
                  </div>
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="size-9 rounded-xl bg-[var(--gradient-primary)] grid place-items-center text-primary-foreground font-bold text-xs shrink-0">
                      {a.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.patient}</p>
                      <p className="text-xs text-text-muted">{a.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-[130px]">
                    <div className="icon-container-sm bg-gradient-to-br from-emerald-500/10 to-green-600/10 text-emerald-600 p-2 rounded-lg">
                      <TypeIcon size={14} />
                    </div>
                    <span className="text-xs font-medium text-text-muted">{a.type}</span>
                  </div>
                  <div className="min-w-[100px]">
                    <span className={`${sc.badge} inline-flex`}>{a.status}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {a.status !== "Cancelled" && (
                      <>
                        <button className="px-3 py-1.5 rounded-lg bg-[var(--gradient-primary)] text-primary-foreground text-xs font-semibold shadow-elegant hover:shadow-lift transition-all">
                          Start
                        </button>
                        <button className="px-3 py-1.5 rounded-lg border border-primary/20 text-xs font-semibold text-foreground hover:bg-accent transition">
                          Reschedule
                        </button>
                      </>
                    )}
                    {a.status !== "Cancelled" && (
                      <button className="p-1.5 rounded-lg text-foreground hover:bg-rose-100 hover:text-rose-600 transition">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-primary/20 text-sm font-semibold text-foreground hover:border-primary hover:text-foreground transition-all">
            <Plus size={16} />
            View All Appointments
          </button>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Doctor Schedule Card */}
          <div className="glass-card rounded-2xl p-6 shadow-card-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="icon-container-sm">
                <Calendar size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Dr. Rajesh Mehta</h3>
                <p className="text-xs text-text-muted">Today's Schedule</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { time: "08:00 — 09:00", label: "Morning Rounds", busy: true },
                { time: "09:00 — 10:00", label: "Anjali Verma", busy: true },
                { time: "10:00 — 11:00", label: "Ramesh Kumar", busy: true },
                { time: "11:00 — 12:00", label: "Sneha Patel", busy: true },
                { time: "12:00 — 13:00", label: "Lunch Break", busy: false },
                { time: "13:00 — 14:00", label: "Available", busy: false },
                { time: "14:00 — 15:00", label: "Kavita Rao", busy: true },
              ].map((slot) => (
                <div key={slot.label} className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  slot.busy ? "bg-muted/50" : "bg-emerald-100/50 border border-emerald-200/50"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${slot.busy ? "bg-primary" : "bg-emerald-400"}`} />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{slot.label}</p>
                      <p className="text-[11px] text-text-muted">{slot.time}</p>
                    </div>
                  </div>
                  {!slot.busy && (
                    <button className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[11px] font-semibold hover:bg-emerald-200 transition">
                      Book
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Reminders Card */}
          <div className="glass-card rounded-2xl p-6 shadow-card-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="icon-container-sm bg-gradient-to-br from-amber-400 to-yellow-500 text-white">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Reminders</h3>
                <p className="text-xs text-text-muted">Upcoming notifications</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { time: "08:45", label: "Pre-ops check with Dr. Shah", urgent: false },
                { time: "09:15", label: "Lab results: Anjali Verma", urgent: false },
                { time: "10:30", label: "E-Consult: Sneha Patel", urgent: false },
                { time: "12:00", label: "Staff meeting — Conference Room A", urgent: true },
                { time: "14:30", label: "Follow-up: Kavita Rao CT Scan", urgent: false },
              ].map((r) => (
                <div key={r.label} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition">
                  <div className={`size-8 rounded-lg grid place-items-center shrink-0 ${
                    r.urgent ? "bg-rose-100 text-rose-600" : "bg-primary/10 text-foreground"
                  }`}>
                    <Clock size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${r.urgent ? "text-rose-700" : "text-foreground"}`}>
                      {r.label}
                    </p>
                    <p className="text-xs text-text-muted">{r.time}</p>
                  </div>
                  {r.urgent && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider">
                      Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/5 transition">
              View All
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
