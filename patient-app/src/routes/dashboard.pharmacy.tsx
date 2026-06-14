import { createFileRoute } from "@tanstack/react-router";
import {
  Pill, Search, Plus, Filter, AlertTriangle, CheckCircle2, Clock,
  FileText, Download, Printer, QrCode, TrendingDown, ArrowRight,
  ChevronRight, RefreshCw, Package, ShoppingCart, AlertCircle,
  DollarSign, BarChart3, Upload,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/pharmacy")({
  head: () => ({ meta: [{ title: "Pharmacy — Carenium Doctor Dashboard" }] }),
  component: PharmacyPage,
});

function PharmacyPage() {
  const stats: any[] = [];
  const inventory: any[] = [];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      "In Stock": "badge-green",
      "Low Stock": "badge-gold",
      "Out of Stock": "bg-rose-100 text-rose-700",
    };
    const Icon = {
      "In Stock": CheckCircle2,
      "Low Stock": AlertTriangle,
      "Out of Stock": AlertCircle,
    }[status] || CheckCircle2;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || "badge-green"}`}>
        <Icon size={12} /> {status}
      </span>
    );
  };

  const lowStockItems: any[] = [];

  return (
    <div className="space-y-4 lg:space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="icon-container icon-container-silver p-2.5 rounded-xl">
            <Pill size={22} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Pharmacy Management</h1>
            <p className="text-xs lg:text-sm text-text-secondary mt-0.5">Inventory, prescriptions, and drug interaction checker</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-card-soft text-xs lg:text-sm font-medium text-foreground hover:shadow-elegant transition-all duration-300">
            <RefreshCw size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-gradient-primary text-white text-xs lg:text-sm font-medium shadow-card-soft hover:shadow-elegant transition-all duration-300">
            <Plus size={14} className="lg:size-[16px]" />
            <span className="hidden sm:inline">Generate E-Prescription</span>
            <span className="sm:hidden">E-Rx</span>
          </button>
          <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 text-amber-700 text-xs font-bold">
            <AlertTriangle size={14} />
            Low Stock
          </span>
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-5 shadow-card-soft card-hover">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-text-muted">{s.label}</span>
                <div className="icon-container-sm icon-container-silver p-2.5 rounded-xl">
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          );
        })}
      </section>

      <div className="glass-card rounded-2xl shadow-card-soft overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="icon-container-sm icon-container-silver p-2 rounded-lg">
              <Package size={16} />
            </div>
            <h3 className="text-base font-semibold text-foreground">Medicine Inventory</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground" />
              <input placeholder="Search drugs..." className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary/50 focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600" />
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
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Drug Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Stock Quantity</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Expiry Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((med) => (
                <tr key={med.name} className="border-b border-primary/20 hover:bg-emerald-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="icon-container-sm icon-container-silver p-2 rounded-lg">
                        <Pill size={14} />
                      </div>
                      <span className="font-semibold text-foreground">{med.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground">{med.category}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{med.stock}</td>
                  <td className="px-5 py-4 text-foreground">{med.expiry}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{med.price}</td>
                  <td className="px-5 py-4">{statusBadge(med.status)}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-emerald-100 text-foreground hover:text-emerald-600 transition-all">
                      <FileText size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-emerald-100 text-foreground hover:text-emerald-600 transition-all">
                      <Download size={16} />
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
            <div className="icon-container icon-container-silver p-2.5 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-foreground">Low Stock Alerts</h3>
            <span className="ml-auto badge-gold text-xs font-bold px-2.5 py-1 rounded-full">{lowStockItems.length} items</span>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => {
              const progress = Math.min((item.stock / item.threshold) * 100, 100);
              const isCritical = item.stock === 0;
              return (
                <div key={item.name} className="flex items-center gap-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <div className={`icon-container-sm ${isCritical ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"} p-2 rounded-lg shrink-0`}>
                    {isCritical ? <AlertCircle size={14} /> : <TrendingDown size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <span className={`text-xs font-bold ${isCritical ? "text-rose-600" : "text-amber-600"}`}>
                        {item.stock} / {item.threshold} {item.unit}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-primary/20 overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${isCritical ? "bg-rose-500" : "bg-amber-400"}`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 transition-all">
                    <RefreshCw size={12} /> Reorder
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container icon-container-silver p-2.5 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Drug Interaction Checker</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">Drug 1</label>
              <input placeholder="Search or type drug name..." className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary/50 focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-primary/20" />
              <span className="text-xs font-semibold text-foreground">+</span>
              <div className="h-px flex-1 bg-primary/20" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">Drug 2</label>
              <input placeholder="Search or type drug name..." className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary/50 focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600" />
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold shadow-card-soft hover:shadow-elegant transition-all duration-300">
            <AlertTriangle size={16} />
            Check Interactions
          </button>
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-800 font-medium">No interactions checked yet. Enter drug names above.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-2xl p-5 lg:p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container icon-container-silver p-2.5 rounded-xl">
              <FileText size={20} />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-foreground">E-Prescription Generator</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">Patient Name</label>
              <input placeholder="Enter patient name" className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary/50 focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">Medicine</label>
              <input placeholder="e.g. Amoxicillin 500mg" className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary/50 focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">Dosage</label>
                <select className="w-full px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-emerald-400 transition-all">
                  <option>500 mg</option>
                  <option>250 mg</option>
                  <option>1 g</option>
                  <option>As directed</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">Duration</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm outline-none focus:border-emerald-400 transition-all">
                  <option>7 days</option>
                  <option>5 days</option>
                  <option>10 days</option>
                  <option>14 days</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">Instructions</label>
              <textarea rows={2} placeholder="e.g. Take after meals" className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 focus:border-primary/50 focus:bg-card outline-none text-sm transition-all placeholder:text-gray-600" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-card-soft hover:shadow-elegant transition-all duration-300">
              <FileText size={16} />
              Generate Prescription
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-sm font-semibold hover:border-emerald-300 hover:text-emerald-600 transition-all duration-300">
              <Printer size={16} />
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card-soft card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-container icon-container-silver p-2.5 rounded-xl">
              <QrCode size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">QR Code Scanning</h3>
          </div>
          <div className="relative rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 aspect-[4/3] flex items-center justify-center overflow-hidden mb-4">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.3)_0%,transparent_70%)]" />
            </div>
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto mb-3 relative">
                <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-xl" />
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />
                <div className="absolute inset-3 flex items-center justify-center">
                  <QrCode size={36} className="text-white/60" />
                </div>
              </div>
              <p className="text-white font-semibold text-sm">Scan Medicine QR</p>
              <p className="text-white/70 text-xs mt-1">Point camera at QR code</p>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-0.5 bg-emerald-400/40 animate-pulse rounded-full" style={{ boxShadow: "0 0 12px rgba(16,185,129,0.3)" }} />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-card-soft hover:shadow-elegant transition-all duration-300">
              <QrCode size={16} />
              Open Scanner
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-sm font-semibold hover:border-emerald-300 hover:text-emerald-600 transition-all duration-300">
              <Upload size={16} />
              Upload QR
            </button>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-800">Scan to verify medicine authenticity, auto-fill prescription fields, and check expiry.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
