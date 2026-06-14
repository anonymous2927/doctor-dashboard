import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Search, Send, User, BadgeCheck, Circle, Clock, Phone, Video } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/chat")({
  head: () => ({ meta: [{ title: "Chat — Carenium Doctor Dashboard" }] }),
  component: ChatPage,
});

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  availability: string;
  role: "Senior" | "Junior";
}

const hospitalDoctors: Doctor[] = [];

const availabilityColor: Record<string, string> = {};
const availabilityBg: Record<string, string> = {};

const initialChats: Record<string, any[]> = {};

const currentUser = "Dr. Mehta";

function ChatPage() {
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chats, setChats] = useState<Record<string, any>>({});

  const seniorDoctors = hospitalDoctors.filter(d => d.role === "Senior");
  const juniorDoctors = hospitalDoctors.filter(d => d.role === "Junior");

  const filteredSenior = seniorDoctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.department.toLowerCase().includes(search.toLowerCase())
  );
  const filteredJunior = juniorDoctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.department.toLowerCase().includes(search.toLowerCase())
  );

  function sendMessage() {
    if (!chatInput.trim() || !selectedDoctor) return;
    const newMsg = { sender: "me" as const, text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChats(prev => ({
      ...prev,
      [selectedDoctor.id]: [...(prev[selectedDoctor.id] || []), newMsg],
    }));
    setChatInput("");
    setTimeout(() => {
      setChats(prev => ({
        ...prev,
        [selectedDoctor.id]: [...(prev[selectedDoctor.id] || []), {
          sender: "them" as const,
          text: "Thanks for your message. I'll review and get back to you shortly.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }],
      }));
    }, 1500);
  }

  return (
    <div className="min-h-screen space-y-4 lg:space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 text-white p-2.5 rounded-xl">
            <MessageSquare size={22} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Hospital Chat</h1>
            <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Communicate with junior and senior doctors</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted bg-primary/10 px-3 py-2 rounded-xl">
          <Circle size={8} className="text-emerald-500 fill-emerald-500" />
          <span>{hospitalDoctors.filter(d => d.availability === "Available").length} doctors available</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-4 glass-card rounded-2xl shadow-card-soft overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-primary/10 border border-input text-sm outline-none focus:border-primary transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
            {filteredSenior.length > 0 && (
              <div className="px-3 pt-3 pb-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted px-2">Senior Doctors</p>
                {filteredSenior.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl mt-1 transition-all text-left ${
                      selectedDoctor?.id === doc.id ? "bg-primary/15 ring-1 ring-primary/30" : "hover:bg-primary/5"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 grid place-items-center text-white font-bold text-sm">
                        {doc.name.split(" ")[1]?.[0] || doc.name[1]}
                      </div>
                      <Circle size={10} className={`absolute -bottom-0.5 -right-0.5 ${availabilityColor[doc.availability]} fill-current ring-2 ring-white rounded-full`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
                        <BadgeCheck size={12} className="text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-xs text-text-muted truncate">{doc.specialization} · {doc.department}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${availabilityBg[doc.availability]}`}>
                      {doc.availability}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {filteredJunior.length > 0 && (
              <div className="px-3 pt-4 pb-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted px-2">Junior Doctors</p>
                {filteredJunior.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl mt-1 transition-all text-left ${
                      selectedDoctor?.id === doc.id ? "bg-primary/15 ring-1 ring-primary/30" : "hover:bg-primary/5"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 grid place-items-center text-white font-bold text-sm">
                        {doc.name.split(" ")[1]?.[0] || doc.name[1]}
                      </div>
                      <Circle size={10} className={`absolute -bottom-0.5 -right-0.5 ${availabilityColor[doc.availability]} fill-current ring-2 ring-white rounded-full`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
                      <p className="text-xs text-text-muted truncate">{doc.specialization} · {doc.department}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${availabilityBg[doc.availability]}`}>
                      {doc.availability}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {filteredSenior.length === 0 && filteredJunior.length === 0 && (
              <p className="text-sm text-text-muted text-center py-8">No doctors found matching "{search}"</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 glass-card rounded-2xl shadow-card-soft flex flex-col">
          {selectedDoctor ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 grid place-items-center text-white font-bold text-sm">
                    {selectedDoctor.name.split(" ")[1]?.[0] || selectedDoctor.name[1]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{selectedDoctor.name}</p>
                    <p className="text-xs text-text-muted">{selectedDoctor.specialization} · {selectedDoctor.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="size-9 rounded-xl bg-primary/10 text-foreground grid place-items-center hover:bg-primary/20 transition-all">
                    <Phone size={16} />
                  </button>
                  <button className="size-9 rounded-xl bg-primary/10 text-foreground grid place-items-center hover:bg-primary/20 transition-all">
                    <Video size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
                {chats[selectedDoctor.id]?.length ? (
                  chats[selectedDoctor.id].map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "me" ? "justify-end" : ""}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        msg.sender === "me"
                          ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                          : "bg-primary/10 text-foreground"
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-white/60" : "text-text-muted"}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare size={32} className="mx-auto mb-3 text-text-muted" />
                    <p className="text-sm font-medium text-foreground">Start a conversation with {selectedDoctor.name.split(" ")[0]} {selectedDoctor.name.split(" ")[1]}</p>
                    <p className="text-xs text-text-muted mt-1">Messages are visible only to hospital staff</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Message ${selectedDoctor.name.split(" ")[0]} ${selectedDoctor.name.split(" ")[1]}...`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary/10 border border-input text-sm outline-none focus:border-primary transition-all placeholder:text-gray-600"
                  />
                  <button onClick={sendMessage} className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white grid place-items-center hover:shadow-lg transition-all shrink-0">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 grid place-items-center p-8">
              <div className="text-center">
                <div className="icon-container bg-primary/10 text-foreground p-4 rounded-2xl mx-auto mb-4">
                  <MessageSquare size={40} />
                </div>
                <p className="text-foreground font-semibold">Select a doctor to chat</p>
                <p className="text-text-muted text-sm mt-1">Choose from senior or junior doctors in your hospital</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}