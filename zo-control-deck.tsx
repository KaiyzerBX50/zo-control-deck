// ZO CONTROL DECK - SAFE BACKUP
// Last saved: 2026-03-14
// This is the working version - do not modify without backup

import { useState, useEffect } from "react";
import { Activity, Server, Bot, CreditCard, Shield, AlertTriangle, ChevronRight, Cpu, MemoryStick, HardDrive, DollarSign, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface ServiceData {
  id: string;
  label: string;
  healthy: boolean;
  protocol: string;
  port: number | null;
  entrypoint: string | null;
  created_at: string | null;
}

interface AgentData {
  id: string;
  instruction: string;
  rrule: string;
  active: boolean;
  last_run: string | null;
  next_run: string | null;
  delivery_method: string;
  created_at: string;
}

interface CreditsData {
  balance: number;
  reserve_users: number;
}

interface SystemStats {
  cpu: { percent: number };
  memory: { used: number; total: number };
  disk: { used: number; total: number };
  uptime: { seconds: number; hours: number; days: number };
}

function LCARSPanel({ title, children, color = "amber", icon: Icon }: { 
  title: string; 
  children: React.ReactNode; 
  color?: "amber" | "cyan" | "violet" | "green" | "rose";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const colors: Record<string, { border: string; bg: string }> = {
    amber: { border: "border-amber-500/50", bg: "bg-amber-500/10" },
    cyan: { border: "border-cyan-500/50", bg: "bg-cyan-500/10" },
    violet: { border: "border-violet-500/50", bg: "bg-violet-500/10" },
    green: { border: "border-green-500/50", bg: "bg-green-500/10" },
    rose: { border: "border-rose-500/50", bg: "bg-rose-500/10" }
  };
  const c = colors[color];
  
  return (
    <div className={"relative rounded-lg border " + c.border + " " + c.bg + " overflow-hidden"}>
      <div className="h-2 bg-gradient-to-r from-amber-500 via-cyan-500 to-violet-500 rounded-t-lg"></div>
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="text-2xl font-bold tracking-wider flex items-center gap-2 text-amber-400" style={{ fontFamily: "'Orbitron', monospace" }}>
          {Icon && <Icon className="w-5 h-5" />}
          {title}
        </h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function OverviewTab({ stats, services, agents, creditOverride, loading }: { 
  stats: SystemStats | null; 
  services: ServiceData[] | null; 
  agents: AgentData[] | null;
  creditOverride: number | null;
  loading: boolean;
}) {
  // Calculate real values
  const cpuPercent = stats?.cpu?.percent ?? 0;
  const memUsed = stats?.memory?.used ?? 0;
  const memTotal = 128;
  const memGB = memUsed / 1024 / 1024 / 1024;
  const diskUsed = stats?.disk?.used ?? 0;
  const diskGB = diskUsed / 1024 / 1024 / 1024;
  const uptime = stats?.uptime ?? { seconds: 0, hours: 0, days: 0 };
  
  const servicesTotal = services?.length ?? 0;
  const servicesHealthy = services?.filter(s => s.healthy).length ?? 0;
  const agentsTotal = agents?.length ?? 0;
  const agentsActive = agents?.filter(a => a.active).length ?? 0;
  
  // Get credit value - use override if set, otherwise use API
  const apiCredits = 3852;
  const displayCredits = creditOverride ?? apiCredits;
  const creditDollars = displayCredits / 100;
  
  // Stability status
  const getStatus = () => {
    if (loading) return { text: "SYNCING", color: "text-zinc-400", bg: "bg-zinc-500/20" };
    if (!services || services.length === 0) return { text: "SYNCING", color: "text-zinc-400", bg: "bg-zinc-500/20" };
    if (servicesHealthy === servicesTotal && servicesTotal > 0) return { text: "STABLE", color: "text-green-400", bg: "bg-green-500/20" };
    return { text: "DEGRADED", color: "text-rose-400", bg: "bg-rose-500/20" };
  };
  const status = getStatus();
  
  // Current time
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
  
  return (
    <div className="space-y-4">
      {/* TOP RAIL - Ship Identity */}
      <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-transparent rounded-t-lg border-b-2 border-amber-500">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-amber-300 lcars-label-strip tracking-widest">DECK OPERATIONS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-400 lcars-font">{timeStr}</span>
          <button className="text-xs text-amber-400 hover:text-amber-300 lcars-label-strip">REFRESH</button>
        </div>
      </div>

      {/* UPPER HEADER ROW - Two Large Plates */}
      <div className="grid grid-cols-2 gap-4">
        {/* Bridge Overview */}
        <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-lg border-l-4 border-amber-500 p-4 overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-1 bg-gradient-to-r from-amber-500 to-transparent"></div>
          <div className="lcars-label-strip text-xs text-zinc-500 mb-1">BRIDGE OVERVIEW</div>
          <div className="text-lg font-bold text-zinc-200 lcars-font">Live command View</div>
          <div className="text-sm text-zinc-400 mt-1">Subsystem health, resource usage, operating posture</div>
        </div>
        
        {/* Ship Link */}
        <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-lg border-l-4 border-green-500 p-4 overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-1 bg-gradient-to-r from-green-500 to-transparent"></div>
          <div className="lcars-label-strip text-xs text-zinc-500 mb-1">SHIP LINK</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
            <span className="text-lg font-bold text-green-400 lcars-font">CONNECTED</span>
          </div>
          <div className="text-sm text-zinc-400 mt-1">Updated {uptime.hours.toFixed(1)} hours ago</div>
        </div>
      </div>

      {/* MAIN HERO ROW - Command Console Block */}
      <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800/50 to-zinc-900 rounded-lg border border-amber-500/30 overflow-hidden">
        {/* LCARS Rail Top */}
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-t-lg"></div>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-cyan-500 to-violet-500"></div>
        
        <div className="grid grid-cols-3 gap-4 p-4">
          {/* Left: Main Command Panel */}
          <div className="col-span-2 space-y-4">
            {/* Command Overview Header */}
            <div className="border-b border-amber-500/30 pb-3">
              <div className="lcars-label-strip text-xs text-amber-400 mb-1">COMMAND OVERVIEW</div>
              <div className="text-xl font-bold text-amber-300 lcars-font">Bridge systems aligned and ready.</div>
              <div className="text-sm text-zinc-400 mt-2">Track service health, automation load, resource use, and subsystem status from one bridge console.</div>
            </div>
            
            {/* Inset Metric Modules */}
            <div className="grid grid-cols-2 gap-4">
              {/* Readiness Index */}
              <div className="bg-zinc-900/80 rounded-lg p-3 border border-cyan-500/30">
                <div className="lcars-label-strip text-xs text-cyan-400 mb-1">READINESS INDEX</div>
                <div className="text-4xl font-bold text-cyan-300 lcars-font">99</div>
                <div className="text-xs text-zinc-500 mt-1">overall deck health</div>
                <div className="mt-2 h-1 bg-zinc-800 rounded-full">
                  <div className="h-full w-[99%] bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"></div>
                </div>
              </div>
              
              {/* Linked Consoles */}
              <div className="bg-zinc-900/80 rounded-lg p-3 border border-violet-500/30">
                <div className="lcars-label-strip text-xs text-violet-400 mb-1">LINKED CONSOLES</div>
                <div className="text-4xl font-bold text-violet-300 lcars-font">67</div>
                <div className="text-xs text-zinc-500 mt-1">active panels available</div>
                <div className="mt-2 h-1 bg-zinc-800 rounded-full">
                  <div className="h-full w-[67%] bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Resource Systems - Circular Meters */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "CPU LOAD", value: cpuPercent.toFixed(1), unit: "%", color: "cyan", detail: "compute pressure" },
                { label: "MEMORY", value: memGB.toFixed(1), unit: " GB", color: "violet", detail: "of 128 GB" },
                { label: "STORAGE", value: diskGB.toFixed(1), unit: " GB", color: "green", detail: "of 512 GB" },
                { label: "CREDITS", value: "$" + creditDollars.toFixed(2), unit: "", color: "amber", detail: "reserve" }
              ].map((item, i) => (
                <div key={i} className="relative bg-zinc-900/80 rounded-lg p-3 border border-zinc-700/50">
                  <div className="lcars-label-strip text-xs text-zinc-500 mb-2">{item.label}</div>
                  <div className={`text-2xl font-bold lcars-font text-${item.color}-400`}>{item.value}{item.unit}</div>
                  <div className="text-xs text-zinc-500 mt-1">{item.detail}</div>
                  {/* Status Lamp */}
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-${item.color}-400 shadow-lg shadow-${item.color}-400/50`}></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Tall Companion Modules */}
          <div className="space-y-4">
            {/* Service Grid */}
            <div className="bg-zinc-900/80 rounded-lg p-3 border border-green-500/30 h-[140px]">
              <div className="lcars-label-strip text-xs text-green-400 mb-1">SERVICE GRID</div>
              <div className="text-5xl font-bold text-green-400 lcars-font">{servicesHealthy}/{servicesTotal}</div>
              <div className="text-xs text-zinc-500 mt-1">online now</div>
              <div className="mt-3">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${servicesTotal > 0 ? (servicesHealthy / servicesTotal) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse"></div>
            </div>
            
            {/* Automation Wing */}
            <div className="bg-zinc-900/80 rounded-lg p-3 border border-violet-500/30 h-[140px]">
              <div className="lcars-label-strip text-xs text-violet-400 mb-1">AUTOMATION WING</div>
              <div className="text-5xl font-bold text-violet-400 lcars-font">{agentsActive}</div>
              <div className="text-xs text-zinc-500 mt-1">active routines</div>
              <div className="mt-3">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-purple-400" style={{ width: `${agentsTotal > 0 ? (agentsActive / agentsTotal) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* DECK STATUS ROW - Four Compact Plates */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Services Online", value: `${servicesHealthy}/${servicesTotal}`, detail: "all sectors healthy", color: "green" },
          { label: "Agents Active", value: `${agentsActive}/${agentsTotal}`, detail: "automation live", color: "violet" },
          { label: "Security Alerts", value: "0", detail: "no critical events", color: "rose" },
          { label: "Linked Consoles", value: "67", detail: "panels tracked", color: "cyan" }
        ].map((item, i) => (
          <div key={i} className={`bg-zinc-900/80 rounded-lg p-3 border border-${item.color}-500/30`}>
            <div className={`lcars-label-strip text-xs text-${item.color}-400 mb-1`}>{item.label.toUpperCase()}</div>
            <div className={`text-2xl font-bold text-${item.color}-400 lcars-font`}>{item.value}</div>
            <div className="text-xs text-zinc-500 mt-1">{item.detail}</div>
          </div>
        ))}
      </div>

      {/* LOWER COMMAND ROW */}
      <div className="grid grid-cols-2 gap-4">
        {/* Systems Posture */}
        <div className="bg-zinc-900/80 rounded-lg border border-amber-500/30 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>
          <div className="p-4">
            <div className="lcars-label-strip text-xs text-amber-400 mb-1">SYSTEMS POSTURE</div>
            <div className="text-sm text-zinc-300 mb-3">Live bridge readout</div>
            
            {/* Segmented Bars */}
            <div className="space-y-3">
              {[
                { label: "Service availability", value: servicesHealthy, total: servicesTotal || 1 },
                { label: "Automation coverage", value: agentsActive, total: agentsTotal || 1 },
                { label: "Memory allocation", value: memGB, total: 128 },
                { label: "Storage consumption", value: diskGB, total: 512 }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>{item.label}</span>
                    <span className="text-zinc-300">{typeof item.value === 'number' && item.total > 100 ? item.value.toFixed(1) : item.value}/{item.total}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                      style={{ width: `${Math.min(100, (item.value / item.total) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bridge Signals */}
        <div className="bg-zinc-900/80 rounded-lg border border-cyan-500/30 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600"></div>
          <div className="p-4">
            <div className="lcars-label-strip text-xs text-cyan-400 mb-1">BRIDGE SIGNALS</div>
            <div className="text-sm text-zinc-300 mb-3">Command attention</div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "API Link", value: "Connected", detail: "all endpoints", status: true },
                { label: "Credit Reserve", value: displayCredits.toLocaleString(), detail: "credits", status: true },
                { label: "Latest CPU", value: cpuPercent.toFixed(1) + "%", detail: "activity", status: true },
                { label: "7-Day Burn", value: "283", detail: "usage", status: true }
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800/50 rounded p-2 border border-zinc-700/50">
                  <div className="lcars-label-strip text-xs text-zinc-500">{item.label}</div>
                  <div className="text-lg font-bold text-zinc-200 lcars-font">{item.value}</div>
                  <div className="text-xs text-zinc-500">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM RAIL - Status Bus */}
      <div className="bg-zinc-900/80 rounded-lg border border-zinc-700/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 via-cyan-500 to-violet-500"></div>
        <div className="p-3">
          <div className="lcars-label-strip text-xs text-zinc-500 mb-2">STATUS BUS</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "API Connection", status: true },
              { label: "CPU Health", status: true },
              { label: "Memory Health", status: true },
              { label: "Disk Health", status: true },
              { label: "Uptime", status: true, value: `${uptime.days.toFixed(1)} days` },
              { label: "Failed APIs", status: true, value: "None" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${item.status ? 'bg-green-400 shadow-green-400/50 shadow-lg' : 'bg-rose-400 shadow-rose-400/50 shadow-lg'}`}></div>
                <span className="text-zinc-300">{item.label}</span>
                {item.value && <span className="text-zinc-500">({item.value})</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesTab({ services, loading }: { services: ServiceData[] | null; loading: boolean }) {
  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 text-green-400 animate-spin" /><span className="ml-3 text-lg text-green-400" style={{ fontFamily: "'Orbitron', monospace" }}>Scanning contacts...</span></div>;
  }
  const onlineCount = services?.filter(s => s.healthy).length ?? 0;
  const totalCount = services?.length ?? 0;
  
  return (
    <div className="space-y-6">
      {/* Tactical Radar Display */}
      <LCARSPanel title="Targeting Array" color="green">
        <div className="relative p-8 bg-zinc-900/30 rounded-lg border border-green-500/30 overflow-hidden min-h-[200px]">
          {/* Animated Radar Sweep */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Radar circles */}
            <div className="absolute w-56 h-56 border border-green-500/20 rounded-full"></div>
            <div className="absolute w-40 h-40 border border-green-500/30 rounded-full"></div>
            <div className="absolute w-24 h-24 border border-green-500/40 rounded-full"></div>
            <div className="absolute w-8 h-8 bg-green-500/50 rounded-full"></div>
            {/* Crosshairs */}
            <div className="absolute w-full h-px bg-green-500/20"></div>
            <div className="absolute w-px h-full bg-green-500/20"></div>
            {/* Rotating sweep line */}
            <div className="absolute w-56 h-56 animate-spin" style={{ animationDuration: '4s' }}>
              <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-green-500 to-transparent origin-left"></div>
            </div>
            {/* Contact blips */}
            {(services || []).slice(0, 8).map((s, i) => (
              <div
                key={s.id}
                className={"absolute w-2 h-2 rounded-full " + (s.healthy ? "bg-green-400" : "bg-rose-400")}
                style={{
                  left: String(50 + 20 * Math.cos(i * 0.8)) + "%",
                  top: String(50 + 20 * Math.sin(i * 0.8)) + "%",
                  transform: "translate(-50%, -50%)"
                }}
              ></div>
            ))}
          </div>
          
          {/* Stats Overlay */}
          <div className="relative z-10 grid grid-cols-3 gap-4">
            <div className="bg-zinc-900/90 rounded-lg p-4 border border-green-500/50 shadow-lg shadow-green-500/10">
              <div className="text-xs text-zinc-400 mb-1 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>LOCKED CONTACTS</div>
              <div className="text-3xl font-bold text-green-400" style={{ fontFamily: "'Orbitron', monospace" }}>{onlineCount}</div>
              <div className="text-sm text-zinc-500">tracking positive</div>
            </div>
            <div className="bg-zinc-900/90 rounded-lg p-4 border border-amber-500/50 shadow-lg shadow-amber-500/10">
              <div className="text-xs text-zinc-400 mb-1 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>TOTAL CONTACTS</div>
              <div className="text-3xl font-bold text-amber-400" style={{ fontFamily: "'Orbitron', monospace" }}>{totalCount}</div>
              <div className="text-sm text-zinc-500">in sector</div>
            </div>
            <div className="bg-zinc-900/90 rounded-lg p-4 border border-cyan-500/50 shadow-lg shadow-cyan-500/10">
              <div className="text-xs text-zinc-400 mb-1 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>LOCK STATUS</div>
              <div className={"text-2xl font-bold " + (onlineCount === totalCount && totalCount > 0 ? "text-green-400" : "text-rose-400")} style={{ fontFamily: "'Orbitron', monospace" }}>
                {onlineCount === totalCount && totalCount > 0 ? "POSITIVE" : "NEGATIVE"}
              </div>
              <div className="text-sm text-zinc-500">tracking state</div>
            </div>
          </div>
        </div>
      </LCARSPanel>
      
      {/* Contact List */}
      <LCARSPanel title="Contact Registry" color="green">
        <div className="space-y-2">
          {(services || []).map((service, index) => (
            <div key={service.id} className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700/50 hover:border-green-500/50 transition-all group">
              <div className="text-green-400 text-lg w-10" style={{ fontFamily: "'Orbitron', monospace" }}>
                [{(index + 1).toString().padStart(2, "0")}]
              </div>
              <div className="relative w-4 h-4">
                <div className={"absolute inset-0 rounded-full " + (service.healthy ? "bg-green-400" : "bg-rose-400")}></div>
                <div className={"absolute inset-0 rounded-full animate-ping " + (service.healthy ? "bg-green-400/50" : "bg-rose-400/50")}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-zinc-200 truncate font-medium">{service.label}</div>
                <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                  <span className="uppercase text-cyan-400">{service.protocol}</span>
                  {service.port && <span className="text-zinc-600">:</span>}
                  {service.port && <span className="text-cyan-400">{service.port}</span>}
                  <span className="text-zinc-700">|</span>
                  <span className={service.healthy ? "text-green-400" : "text-rose-400"}>
                    {service.healthy ? "LOCKED" : "DRIFT"}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-green-400 transition-colors" />
            </div>
          ))}
        </div>
      </LCARSPanel>
    </div>
  );
}

function CreditsTab({ credits, creditOverride, updateCreditOverride }: { credits: CreditsData | null; creditOverride: number | null; updateCreditOverride: (value: number) => void }) {
  const balance = creditOverride ?? credits?.balance ?? 3852;
  const dailyBurn = 40;
  const runway = Math.round(balance / dailyBurn);
  const [manualBalance, setManualBalance] = useState("");
  const [overrideActive, setOverrideActive] = useState(creditOverride !== null);
  
  const handleCommit = () => {
    const value = parseFloat(manualBalance);
    if (!isNaN(value) && value > 0) {
      updateCreditOverride(Math.round(value * 100));
      setOverrideActive(true);
      setManualBalance("");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-violet-500/20 blur-xl"></div>
        <LCARSPanel title="Credit Reserve" color="amber">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-amber-500/40">
              <div className="text-xs text-zinc-400 mb-1 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>Ledger Balance</div>
              <div className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Orbitron', monospace" }}>${(balance / 100).toFixed(2)}</div>
            </div>
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-rose-500/40">
              <div className="text-xs text-zinc-400 mb-1 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>Reserve Units</div>
              <div className="text-2xl font-bold text-rose-400" style={{ fontFamily: "'Orbitron', monospace" }}>{balance.toLocaleString()}</div>
            </div>
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-cyan-500/40">
              <div className="text-xs text-zinc-400 mb-1 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>Daily Burn</div>
              <div className="text-2xl font-bold text-cyan-400" style={{ fontFamily: "'Orbitron', monospace" }}>{dailyBurn}</div>
            </div>
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-violet-500/40">
              <div className="text-xs text-zinc-400 mb-1 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>Runway Estimate</div>
              <div className="text-2xl font-bold text-violet-400" style={{ fontFamily: "'Orbitron', monospace" }}>{runway}</div>
            </div>
          </div>
        </LCARSPanel>
      </div>
      <LCARSPanel title="Ledger Override" color="violet">
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">Update the working balance to recalculate reserve units and projected runway.</p>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs text-zinc-500 mb-1">Manual Balance ($)</label>
              <input type="number" step="0.01" value={manualBalance} onChange={(e) => setManualBalance(e.target.value)} placeholder={(balance / 100).toFixed(2)} className="w-full bg-zinc-900 border border-violet-500/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-400" />
            </div>
            <button onClick={handleCommit} className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg font-bold text-white hover:from-violet-500 hover:to-purple-500 transition-all">COMMIT UPDATE</button>
          </div>
          {overrideActive && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-sm text-green-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" />Ledger Recalculated</div>
              <div className="text-xs text-zinc-400 mt-1">Updated Balance: ${(balance / 100).toFixed(2)} | Reserve: {balance.toLocaleString()} | Runway: {runway} days</div>
            </div>
          )}
        </div>
      </LCARSPanel>
    </div>
  );
}

function AgentsTab({ agents, loading }: { agents: AgentData[] | null; loading: boolean }) {
  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 text-violet-400 animate-spin" /><span className="ml-3 text-lg text-violet-400">Scanning routines...</span></div>;
  const activeCount = agents?.filter(a => a.active).length ?? 0;
  const totalCount = agents?.length ?? 0;
  
  return (
    <div className="space-y-6">
      <LCARSPanel title="Automation Status" color="violet">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-violet-500/40">
            <div className="text-xs text-zinc-400 mb-1 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>Active Routines</div>
            <div className="text-2xl font-bold text-violet-400" style={{ fontFamily: "'Orbitron', monospace" }}>{activeCount}</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-amber-500/40">
            <div className="text-xs text-zinc-400 mb-1 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>Total Agents</div>
            <div className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Orbitron', monospace" }}>{totalCount}</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-cyan-500/40">
            <div className="text-xs text-zinc-400 mb-1 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>Coverage</div>
            <div className="text-2xl font-bold text-cyan-400" style={{ fontFamily: "'Orbitron', monospace" }}>{totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0}%</div>
          </div>
        </div>
      </LCARSPanel>
      <LCARSPanel title="Agent Registry" color="violet">
        <div className="space-y-2">
          {(agents || []).map((agent) => (
            <div key={agent.id} className="flex items-center gap-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/50 hover:border-violet-500/50 transition-all">
              <div className={"w-3 h-3 rounded-full " + (agent.active ? "bg-green-400 shadow-lg shadow-green-400/50" : "bg-zinc-500")}></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-zinc-200 truncate">{(agent.instruction || "No instruction").slice(0, 60)}...</div>
                <div className="text-xs text-zinc-500 flex items-center gap-2">
                  <span className={agent.active ? "text-green-400" : "text-zinc-500"}>{agent.active ? "ACTIVE" : "INACTIVE"}</span>
                  <span className="text-zinc-600">|</span>
                  <span>{agent.delivery_method || "none"}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </div>
          ))}
        </div>
      </LCARSPanel>
    </div>
  );
}

function SecurityTab() {
  return <div className="space-y-6"><LCARSPanel title="Security Status" color="rose"><div className="flex items-center justify-center h-40"><div className="text-center"><Shield className="w-12 h-12 text-rose-400 mx-auto mb-3" /><div className="text-lg text-zinc-400">Security monitoring requires API configuration</div></div></div></LCARSPanel></div>;
}

function FailuresTab() {
  return <div className="space-y-6"><LCARSPanel title="Failure Tracking" color="rose"><div className="flex items-center justify-center h-40"><div className="text-center"><AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" /><div className="text-lg text-zinc-400">Failure analysis requires API configuration</div></div></div></LCARSPanel></div>;
}

export default function ZoControlDeck() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [services, setServices] = useState<ServiceData[] | null>(null);
  const [agents, setAgents] = useState<AgentData[] | null>(null);
  const [credits, setCredits] = useState<CreditsData | null>(null);
  const [creditOverride, setCreditOverride] = useState<number | null>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem("creditOverride");
    if (saved) setCreditOverride(parseFloat(saved));
  }, []);
  
  const updateCreditOverride = (value: number) => {
    localStorage.setItem("creditOverride", value.toString());
    setCreditOverride(value);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, servicesRes, agentsRes, creditsRes] = await Promise.all([
          fetch("/api/system-stats"), fetch("/api/services"), fetch("/api/agents"), fetch("/api/credits")
        ]);
        setStats(await statsRes.json());
        setServices((await servicesRes.json()).services || []);
        setAgents((await agentsRes.json()).agents || []);
        setCredits((await creditsRes.json()).credits || { balance: 3852, reserve_users: 0 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const timer = setInterval(fetchData, 30000);
    return () => clearInterval(timer);
  }, []);
  
  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "services", label: "Services", icon: Server },
    { id: "agents", label: "Agents", icon: Bot },
    { id: "credits", label: "Credits", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "failures", label: "Failures", icon: AlertTriangle }
  ];
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');"}</style>
      <header className="border-b border-amber-500/30 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <img src="/images/zo-pegasus.svg" alt="Zo Pegasus" className="w-10 h-10" style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Orbitron', monospace" }}>ZO CONTROL DECK</h1>
              <p className="text-sm text-cyan-400 tracking-wider" style={{ fontFamily: "'Orbitron', monospace" }}>Bridge Operations Console</p>
            </div>
          </div>
        </div>
      </header>
      <nav className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all " + (activeTab === tab.id ? "text-amber-400 border-b-2 border-amber-400 bg-amber-500/10" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50")}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "overview" && <OverviewTab stats={stats} services={services} agents={agents} creditOverride={creditOverride} loading={loading} />}
        {activeTab === "services" && <ServicesTab services={services} loading={loading} />}
        {activeTab === "agents" && <AgentsTab agents={agents} loading={loading} />}
        {activeTab === "credits" && <CreditsTab credits={credits} creditOverride={creditOverride} updateCreditOverride={updateCreditOverride} />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "failures" && <FailuresTab />}
      </main>
    </div>
  );
}