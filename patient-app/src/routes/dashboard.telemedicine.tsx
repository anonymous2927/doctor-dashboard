import { createFileRoute } from "@tanstack/react-router";
import {
  Video, Phone, MessageSquare, Share2, Clock, User, Calendar, Plus, Search,
  Filter, Camera, Mic, Monitor, ScreenShare, Users, ArrowRight, ChevronRight,
  CheckCircle2, X, AlertCircle, Download, FileText, Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/telemedicine")({
  head: () => ({ meta: [{ title: "Telemedicine — Carenium Doctor Dashboard" }] }),
  component: TelemedicinePage,
});

const appointments: any[] = [];

const doctorContacts: any[] = [];

const chatData: Record<string, { sender: string; message: string; time: string; isPatient: boolean }[]> = {};

const waitingPatients: any[] = [];

function TelemedicinePage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [selectedChat, setSelectedChat] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  function sendChatMessage(text: string) {
    if (!text.trim()) return;
    const newMsg = { sender: "You", message: text.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isPatient: true };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput("");
  }

  return (
    <div className="min-h-screen space-y-4 lg:space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
            <Video size={22} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Telemedicine</h1>
            <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Virtual consultations and remote patient care</p>
          </div>
        </div>
        <button data-handled="true"
          onClick={() => setIsCallActive(!isCallActive)}
          className={`btn-primary flex items-center gap-2 text-sm ${isCallActive ? "bg-gradient-to-br from-rose-500 to-red-600" : ""}`}
        >
          {isCallActive ? (
            <><X size={14} className="lg:size-[16px]" /> End</>
          ) : (
            <><Video size={14} className="lg:size-[16px]" /> Start</>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 animate-fade-up">
        <div className="lg:col-span-8 space-y-5">
          <div className="glass-card rounded-2xl p-6 shadow-card-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video size={16} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">Consultation Room</h3>
              </div>
              {isCallActive && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live — 00:12:34
                </div>
              )}
            </div>

            <div className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              {isCallActive ? (
                <>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <div className="size-20 rounded-full bg-emerald-600/30 mx-auto mb-3 flex items-center justify-center">
                        <User size={36} className="text-white/60" />
                      </div>
                      <p className="text-white font-semibold text-lg">Rohit Verma</p>
                      <p className="text-white/70 text-sm mt-1">Connected via Video</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 w-48 aspect-video bg-gray-700 rounded-xl overflow-hidden border-2 border-emerald-500/50 shadow-lg">
                    <div className="w-full h-full grid place-items-center">
                      <div className="text-center">
                        <div className="size-10 rounded-full bg-emerald-600/30 mx-auto mb-1 flex items-center justify-center">
                          <User size={20} className="text-white/60" />
                        </div>
                        <p className="text-white/70 text-xs font-medium">You</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                    <button data-handled="true"
                      onClick={() => setIsMuted(!isMuted)}
                      className={`size-11 rounded-full grid place-items-center transition-all ${
                        isMuted ? "bg-rose-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <Mic size={18} />
                    </button>
                    <button data-handled="true"
                      onClick={() => setIsCameraOff(!isCameraOff)}
                      className={`size-11 rounded-full grid place-items-center transition-all ${
                        isCameraOff ? "bg-rose-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <Camera size={18} />
                    </button>
                    <button data-handled="true"
                      onClick={() => setIsCallActive(false)}
                      className="size-12 rounded-full bg-rose-500 text-white grid place-items-center hover:bg-rose-600 transition-colors shadow-lg"
                    >
                      <Phone size={20} className="rotate-135" />
                    </button>
                    <button data-handled="true"
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                      className={`size-11 rounded-full grid place-items-center transition-all ${
                        isScreenSharing ? "bg-emerald-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <ScreenShare size={18} />
                    </button>
                    <button onClick={() => toast.info("Remote Desktop", { description: "Remote desktop assist feature launching..." })} className="size-11 rounded-full bg-white/20 text-white grid place-items-center hover:bg-white/30 transition-all">
                      <Monitor size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="icon-container bg-primary/10 text-foreground p-4 rounded-2xl mx-auto mb-4">
                    <Video size={40} />
                  </div>
                  <p className="text-foreground font-semibold">No active consultation</p>
                  <p className="text-text-muted text-sm mt-1">Select an appointment or click Start Consultation</p>
                  <button data-handled="true"
                    onClick={() => setIsCallActive(true)}
                    className="mt-4 px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Video size={16} />
                    Start Virtual Room
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <button onClick={() => toast.info("Share File", { description: "Select a file to share during consultation." })} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm hover:bg-emerald-600 transition-colors">
                  <Download size={14} />
                  Share File
                </button>
                <button onClick={() => toast.info("Invite Participant", { description: "Send invite link to another doctor." })} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm hover:bg-emerald-600 transition-colors">
                  <Share2 size={14} />
                  Invite Participant
                </button>
              </div>
              {waitingPatients.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Clock size={10} />
                  <span>Waiting {waitingPatients[0].waitingSince}</span>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-foreground">Files & Documents</h3>
            </div>
            <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer mb-3">
              <Upload size={24} className="mx-auto mb-2 text-foreground" />
              <p className="text-sm font-medium text-foreground">Drop files to share during consultation</p>
              <p className="text-xs text-text-muted mt-0.5">Reports, images, or DICOM files</p>
            </div>
            <div className="space-y-2">
              {[
                { name: "ECG_Report_Rohit_Verma.pdf", size: "2.4 MB", shared: true },
                { name: "Chest_Xray_LAT_View.dcm", size: "8.1 MB", shared: false },
              ].map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-primary/10">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{file.name}</p>
                      <p className="text-xs text-text-muted">{file.size}</p>
                    </div>
                  </div>
                  <button onClick={() => toast.success(file.shared ? "Already shared" : "File shared", { description: `${file.name} has been ${file.shared ? "already" : ""} shared with the patient.` })} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    file.shared ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-foreground hover:bg-primary/20"
                  }`}>
                    {file.shared ? "Shared" : "Share"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="glass-card rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">Today's Schedule</h3>
              </div>
              <button onClick={() => toast.info("New Appointment", { description: "Booking form will open here." })} className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <Plus size={12} />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {appointments.slice(0, 4).map((apt, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 grid place-items-center text-white font-bold text-xs shrink-0">
                      {apt.patient.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{apt.patient}</p>
                      <p className="text-xs text-text-muted flex items-center gap-1">
                        <Clock size={10} />
                        {apt.time} · {apt.type}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => { setIsCallActive(true); toast.success("Joining call", { description: `Connecting to ${apt.patient}...` }); }} className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors shrink-0 ml-2">
                    Join
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => toast.info("All Appointments", { description: "Navigating to full schedule view..." })} className="w-full mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-foreground py-2 hover:text-emerald-600 transition-colors">
              View all appointments
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-card-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare size={15} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">Chat</h3>
              </div>
              {isCallActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
            <div className="h-52 overflow-y-auto space-y-3 mb-3 pr-1">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isPatient ? "" : "justify-end"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.isPatient
                      ? "bg-primary text-white"
                      : "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                  }`}>
                    <p className="text-xs font-semibold mb-0.5">{msg.sender}</p>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${msg.isPatient ? "text-gray-600" : "text-white/60"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message…"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { sendChatMessage(chatInput); } }}
                className="flex-1 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-primary transition-all placeholder:text-gray-600"
              />
              <button onClick={() => { sendChatMessage(chatInput); toast.success("Message sent"); }} className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white grid place-items-center hover:shadow-lg transition-all shrink-0">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-card-soft bg-gradient-to-br from-emerald-600/5 to-green-600/5 border-emerald-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Users size={15} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-foreground">Virtual Waiting Room</h3>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full ml-auto">{waitingPatients.length}</span>
            </div>
            <div className="space-y-3">
              {waitingPatients.map((wp, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 grid place-items-center text-white font-bold text-xs">
                      {wp.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{wp.name}</p>
<div className="flex items-center gap-2 text-xs text-text-muted">
                        <Clock size={10} />
                        <span>Waiting {wp.waitingSince}</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">{wp.reason}</p>
                    </div>
                  </div>
                  <button onClick={() => toast.success("Patient admitted", { description: `${wp.name} has been moved to consultation.` })} className="text-xs font-semibold text-white bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors shrink-0 ml-2">
                    Admit
                  </button>
                </div>
              ))}
            </div>
            {waitingPatients.length === 0 && (
              <p className="text-sm text-text-muted text-center py-4">No patients waiting</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
