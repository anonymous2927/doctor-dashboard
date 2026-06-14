import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Settings, Shield, Bell, Lock, Moon, Sun, LogOut,
  Calendar, Clock, MapPin, Mail, Phone, Globe, Key, Fingerprint,
  Smartphone, Monitor, Save, CheckCircle2, Edit3, Eye, EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Carenium Doctor Dashboard" }] }),
  component: SettingsPage,
});

const days: string[] = []; const timeSlots: any[] = []; const notifications: any[] = []; const sessions: any[] = []; const activities: any[] = [];

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [notifState, setNotifState] = useState<Record<string, boolean>>({});
  const [twoFactor, setTwoFactor] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Settings },
  ];

  return (
    <div className="min-h-screen space-y-4 lg:space-y-6 animate-fade-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gradient-emerald">Settings</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage your profile and preferences</p>
        </div>
        <button className="btn-primary text-sm">
          <Save size={16} className="lg:size-[18px]" />
          Save Changes
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-5">
          <div className="glass-card rounded-2xl p-6 shadow-card-soft text-center">
            <div className="size-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white grid place-items-center text-2xl font-bold shadow-elegant mb-4">
              RM
            </div>
            <h3 className="text-lg font-bold text-foreground">Dr. Rajesh Mehta</h3>
            <p className="text-sm text-text-muted">Cardiology</p>
            <div className="flex items-center justify-center gap-1.5 mt-1 mb-4">
              <MapPin size={12} className="text-foreground" />
              <span className="text-xs text-text-muted">Apollo Mumbai</span>
            </div>
            <div className="space-y-2 mb-4 text-left">
              <div className="flex items-center gap-2.5 text-sm text-foreground">
                <Mail size={14} className="shrink-0" />
                <span>rajesh.mehta@apollo.in</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-foreground">
                <Phone size={14} className="shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-foreground">
                <Key size={14} className="shrink-0" />
                <span>License: MCI-2024-08472</span>
              </div>
            </div>
            <button className="btn-primary w-full justify-center">
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>

          <div className="glass-card rounded-2xl p-4 shadow-card-soft">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id} data-handled="true"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-elegant"
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <TabIcon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-card-soft border border-rose-200/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container-sm bg-gradient-to-br from-rose-500 to-red-600 text-white">
                <LogOut size={16} />
              </div>
              <h3 className="text-base font-semibold text-rose-700">Danger Zone</h3>
            </div>
            <p className="text-sm text-text-muted mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold border border-rose-200 hover:bg-rose-100 transition-all">
              <LogOut size={16} />
              Delete Account
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          {activeTab === "schedule" && (
            <div className="glass-card rounded-2xl p-6 shadow-card-soft">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Schedule Management</h3>
                    <p className="text-sm text-text-muted">Manage your weekly consultation hours</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-foreground text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
                  <Clock size={16} />
                  Set Hours
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                {days.map((day) => (
                  <button
                    key={day} data-handled="true"
                    onClick={() => setSelectedDay(day)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedDay === day
                        ? "bg-primary text-primary-foreground shadow-elegant"
                        : "bg-primary/10 text-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {timeSlots
                  .find((d) => d.day === selectedDay)
                  ?.slots.map((slot) => (
                    <div
                      key={slot}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        ["09:00", "10:00", "11:00"].includes(slot) && selectedDay !== "Sat"
                          ? "bg-emerald-50/50 border-emerald-200/50"
                          : "bg-muted/30 border-primary/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${["09:00", "10:00", "11:00"].includes(slot) && selectedDay !== "Sat" ? "bg-emerald-500" : "bg-gray-400"}`} />
                        <span className="text-sm font-medium text-foreground">{slot}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        ["09:00", "10:00", "11:00"].includes(slot) && selectedDay !== "Sat"
                          ? "badge-green"
                          : "bg-primary/10 text-foreground"
                      }`}>
                        {["09:00", "10:00", "11:00"].includes(slot) && selectedDay !== "Sat" ? "Available" : "Free"}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-primary/20 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Available slots
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  Free slots
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="glass-card rounded-2xl p-6 shadow-card-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-container-sm bg-gradient-to-br from-amber-400 to-yellow-500 text-white">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
                  <p className="text-sm text-text-muted">Choose which alerts you receive</p>
                </div>
              </div>

              <div className="space-y-1">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{n.label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{n.desc}</p>
                    </div>
                    <Switch
                      checked={notifState[n.id]}
                      onCheckedChange={(v) => setNotifState((s) => ({ ...s, [n.id]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="glass-card rounded-2xl p-6 shadow-card-soft">
                <div className="flex items-center gap-3 mb-6">
                  <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Password & Authentication</h3>
                    <p className="text-sm text-text-muted">Manage your login credentials</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-primary/20">
                  <div className="relative">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} defaultValue="••••••••" className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-primary/50 transition-colors" />
                      <button data-handled="true" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground hover:text-foreground transition">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600" />
                  </div>
                  <button className="btn-primary">
                    <Key size={16} />
                    Update Password
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white shrink-0">
                      <Fingerprint size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Two-Factor Authentication</p>
                      <p className="text-xs text-text-muted mt-0.5">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 shadow-card-soft">
                <div className="flex items-center gap-3 mb-6">
                  <div className="icon-container-sm bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <Monitor size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Active Sessions</h3>
                    <p className="text-sm text-text-muted">Devices currently logged into your account</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {sessions.map((s) => (
                    <div key={s.device} className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      s.current ? "bg-emerald-50/50 border border-emerald-200/50" : "hover:bg-muted/50"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`icon-container-sm shrink-0 ${
                          s.current
                            ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                            : "bg-primary/10 text-foreground"
                        }`}>
                          {s.device.includes("Mobile") ? <Smartphone size={16} /> : <Monitor size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{s.device}</p>
                          <p className="text-xs text-text-muted">{s.ip} &middot; {s.location}</p>
                          <p className="text-xs text-text-muted mt-0.5">{s.time}</p>
                        </div>
                      </div>
                      {s.current ? (
                        <span className="badge-green text-xs">Current</span>
                      ) : (
                        <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors px-3 py-1 rounded-lg hover:bg-rose-50">
                          Logout
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="glass-card rounded-2xl p-6 shadow-card-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                  <Settings size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
                  <p className="text-sm text-text-muted">Customize your dashboard experience</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="icon-container-sm bg-primary/10 text-foreground">
                      {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Theme</p>
                      <p className="text-xs text-text-muted">{darkMode ? "Dark Mode" : "Light Mode"}</p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="icon-container-sm bg-primary/10 text-foreground">
                      <Globe size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Language</p>
                      <p className="text-xs text-text-muted">Choose your preferred language</p>
                    </div>
                  </div>
                  <select className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground outline-none focus:border-primary/50 transition-colors">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="icon-container-sm bg-primary/10 text-foreground">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Timezone</p>
                      <p className="text-xs text-text-muted">Set your local timezone</p>
                    </div>
                  </div>
                  <select className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground outline-none focus:border-primary/50 transition-colors">
                    <option>Asia/Kolkata (IST, UTC +5:30)</option>
                    <option>Asia/Dubai (GST, UTC +4:00)</option>
                    <option>America/New_York (EST, UTC -5:00)</option>
                    <option>Europe/London (GMT, UTC +0:00)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="icon-container-sm bg-primary/10 text-foreground">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Date Format</p>
                      <p className="text-xs text-text-muted">Choose how dates are displayed</p>
                    </div>
                  </div>
                  <select className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground outline-none focus:border-primary/50 transition-colors">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="glass-card rounded-2xl p-6 shadow-card-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                <Shield size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Account Activity</h3>
                <p className="text-sm text-text-muted">Recent login and security events</p>
              </div>
            </div>

            <div className="space-y-3">
              {activities.map((a) => (
                <div key={`${a.action}-${a.time}`} className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all">
                  <div className="size-9 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{a.action}</p>
                    <p className="text-xs text-text-muted mt-0.5">{a.device} &middot; {a.ip}</p>
                  </div>
                  <span className="text-xs text-text-muted shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
