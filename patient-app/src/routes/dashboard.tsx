import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Calendar, Stethoscope, Video, Microscope,
  Pill, Ambulance, HeartPulse, Brain, BarChart3, Settings, LogOut,
  Heart, Sparkles, Search, Bell, User, Menu, X, ChevronRight, MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { logoutClient } from "../lib/auth-client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Command Center — Carenium Doctor Dashboard" }],
  }),
  component: DashboardLayout,
});

const sidebarItems = [
  { icon: LayoutDashboard, label: "Command Center", path: "/dashboard" },
  { icon: Users, label: "Patients", path: "/dashboard/patients" },
  { icon: Calendar, label: "Appointments", path: "/dashboard/appointments" },
  { icon: MessageSquare, label: "Chat", path: "/dashboard/chat" },
  { icon: Stethoscope, label: "EHR", path: "/dashboard/ehr" },
  { icon: Video, label: "Telemedicine", path: "/dashboard/telemedicine" },
  { icon: Microscope, label: "Lab & Imaging", path: "/dashboard/lab" },
  { icon: Pill, label: "Pharmacy", path: "/dashboard/pharmacy" },
  { icon: Ambulance, label: "Emergency", path: "/dashboard/emergency" },
  { icon: HeartPulse, label: "Smart ICU", path: "/dashboard/icu" },
  { icon: Brain, label: "AI Intelligence", path: "/dashboard/ai" },
  { icon: BarChart3, label: "Reports", path: "/dashboard/reports" },
];

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  function handleLogout() {
    logoutClient();
    toast.success("Signed out", { description: "You have been logged out." });
    navigate({ to: "/login" });
  }

  return (
    <div className="flex bg-background min-h-screen">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 lg:w-64 bg-card border-r border-primary/20 p-4 flex flex-col transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between lg:justify-start">
          <Link to="/" className="flex items-center gap-2.5 px-2 py-3" onClick={() => setMobileOpen(false)}>
            <img src="/logo.png" alt="AI Healthcare System" className="size-8" />
            <div className="leading-tight">
              <div className="font-bold text-sm text-foreground">Carenium Doctor Dashboard</div>
              <div className="text-[10px] text-foreground -mt-0.5">AI Healthcare System</div>
            </div>
          </Link>
          <button data-handled="true" className="lg:hidden p-2 text-foreground" onClick={() => setMobileOpen(false)}><X className="size-5" /></button>
        </div>

        <nav className="mt-6 space-y-1 flex-1 overflow-y-auto">
          {sidebarItems.map((it) => (
            <Link
              key={it.path}
              to={it.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-r-xl text-sm font-medium ${
                isActive(it.path)
                  ? "sidebar-active"
                  : "text-foreground sidebar-hover"
              }`}
            >
              <it.icon className="size-4 shrink-0" />
              <span className="truncate">{it.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-4 p-3 rounded-2xl bg-emerald-600/10 border border-emerald-600/20">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <Sparkles className="size-3.5 text-emerald-700" /> AI Co-Pilot
          </div>
          <p className="mt-1 text-[11px] text-emerald-700 leading-relaxed">3 patients flagged for review.</p>
        </div>

        <Link to="/dashboard/settings" onClick={() => setMobileOpen(false)} className={`mt-3 flex items-center gap-3 px-4 py-2.5 rounded-r-xl text-sm ${isActive("/dashboard/settings") ? "sidebar-active" : "text-foreground font-semibold sidebar-hover"}`}>
          <Settings className="size-4" /><span>Settings</span>
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 mt-1">
          <LogOut className="size-4" /><span>Sign out</span>
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-primary/20 px-3 lg:px-6 py-2.5 lg:py-3 flex items-center justify-between gap-2 lg:gap-4">
          <div className="flex items-center gap-1 lg:gap-3">
            <button data-handled="true" className="lg:hidden p-1.5 lg:p-2 rounded-lg hover:bg-muted transition" onClick={() => setMobileOpen(true)}>
              <Menu className="size-5 lg:size-5" />
            </button>
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground" />
              <input
                placeholder="Search patients, MRN, phone..."
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600"
                onChange={(e) => {
                  if (e.target.value.length > 2) {
                    toast.info("Search results", { description: `Showing results for "${e.target.value}"` });
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 lg:gap-2">
            <button className="relative p-1.5 lg:p-2 rounded-xl hover:bg-primary/5 transition" onClick={() => toast("Notifications", { description: "2 critical alerts · 1 lab result ready" })}>
              <Bell className="size-5 text-foreground" />
              <span className="absolute top-0.5 right-0.5 size-3 bg-destructive rounded-full animate-pulse-glow border-2 border-background flex items-center justify-center text-[8px] text-white font-bold">3</span>
            </button>
            <Link to="/dashboard/settings" className="flex items-center gap-2 pl-1.5 lg:pl-2 border-l border-primary/20">
              <div className="size-9 lg:size-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 grid place-items-center text-white font-bold text-sm shadow-elegant ring-2 ring-primary/20">RM</div>
              <span className="text-sm font-bold text-foreground hidden sm:block">Dr. Mehta</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
