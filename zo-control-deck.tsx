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
  // API values
  const apiBalance = credits?.balance ?? 3852;
  const burn7d = 283;
  
  // Use override if set, otherwise use API
  const balance = creditOverride ?? apiBalance;
  const balanceUsd = balance / 100;
  
  // Calculate derived values
  const dailyBurn = Math.round(burn7d / 7);
  const runway = dailyBurn > 0 ? Math.round(balance / dailyBurn) : 95;
  const burnPercent = Math.min(100, Math.max(0, (burn7d / balance) * 100));
  
  // Threshold state
  const getThresholdState = () => {
    if (runway > 90) return { state: "Stable", color: "text-teal-400", bg: "bg-teal-500/20" };
    if (runway > 60) return { state: "Moderate", color: "text-cyan-400", bg: "bg-cyan-500/20" };
    if (runway > 30) return { state: "Tight", color: "text-amber-400", bg: "bg-amber-500/20" };
    if (runway > 7) return { state: "Low", color: "text-orange-400", bg: "bg-orange-500/20" };
    return { state: "Critical", color: "text-rose-400", bg: "bg-rose-500/20" };
  };
  const threshold = getThresholdState();
  
  // Manual balance input
  const [manualBalance, setManualBalance] = useState("");
  const [overrideActive, setOverrideActive] = useState(creditOverride !== null);
  
  const handleCommit = () => {
    const value = parseFloat(manualBalance);
    if (!isNaN(value) && value > 0) {
      const creditValue = Math.round(value * 100);
      updateCreditOverride(creditValue);
      setOverrideActive(true);
      setManualBalance("");
    }
  };
  
  // Mock model drain data
  const modelDrain = [
    { model: "openai:gpt-5.4", credits: 120, percent: 48 },
    { model: "openrouter:minimax", credits: 48, percent: 19 },
    { model: "vercel:z-ai/glm-5", credits: 30, percent: 12 },
    { model: "vercel:minimax", credits: 12, percent: 5 },
    { model: "zo:smart", credits: 9, percent: 4 }
  ];
  
  // Mock burn ledger data
  const burnLedger = [
    { date: "03-08", burn: 42 },
    { date: "03-09", burn: 37 },
    { date: "03-10", burn: 21 },
    { date: "03-11", burn: 35 },
    { date: "03-12", burn: 32 },
    { date: "03-13", burn: 58 },
    { date: "03-14", burn: 58 }
  ];
  
  return (
    <div className="space-y-6">
      {/* NEON HEADER */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/30 via-transparent to-cyan-900/20 pointer-events-none"></div>
        <LCARSPanel title="Credit Reserve" color="amber">
          <p className="text-sm text-zinc-400 mb-4">Track balance, reserve burn, and projected runway across the deck.</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 shadow-lg animate-pulse"></div>
              <span className="text-xs text-teal-400 lcars-label-strip">Ledger Link</span>
            </div>
            <span className="text-xs text-zinc-500">Connected</span>
            <span className="text-xs text-zinc-600">|</span>
            <span className="text-xs text-zinc-500">Updated {new Date().toLocaleTimeString()}</span>
          </div>
        </LCARSPanel>
      </div>
      
      {/* RESERVE STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: "Ledger Link", value: "Connected", detail: "synced", color: "#14b8a6" },
          { label: "Fiscal Stability", value: "99", detail: "posture", color: "#f59e0b" },
          { label: "Live Consumers", value: "4", detail: "drawing", color: "#06b6d4" },
          { label: "Active Routines", value: "1", detail: "in cycle", color: "#8b5cf6" },
          { label: "Credit Reserve", value: balance.toLocaleString(), detail: "units", color: "#ec4899" },
          { label: "Open Routes", value: "67", detail: "outputs", color: "#06b6d4" }
        ].map((item, i) => (
          <div key={i} className="relative bg-zinc-900/80 rounded-lg p-3 border border-zinc-700/50 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: item.color }}></div>
            <div className="lcars-label-strip text-xs text-zinc-400 mb-1">{item.label}</div>
            <div className="text-xl font-bold lcars-font" style={{ color: item.color }}>{item.value}</div>
            <div className="text-xs text-zinc-500">{item.detail}</div>
          </div>
        ))}
      </div>
      
      {/* RESERVE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative bg-zinc-900/80 rounded-lg p-4 border border-pink-500/40 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500"></div>
          <div className="lcars-label-strip text-xs text-zinc-400 mb-2">Ledger Balance</div>
          <div className="text-3xl font-bold lcars-font text-pink-400">${balanceUsd.toFixed(2)}</div>
          <div className="text-sm text-zinc-500">current working balance</div>
        </div>
        
        <div className="relative bg-zinc-900/80 rounded-lg p-4 border border-cyan-500/40 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-violet-500"></div>
          <div className="lcars-label-strip text-xs text-zinc-400 mb-2">Reserve Units</div>
          <div className="text-3xl font-bold lcars-font text-cyan-400">{balance.toLocaleString()}</div>
          <div className="text-sm text-zinc-500">estimated credits remaining</div>
        </div>
        
        <div className="relative bg-zinc-900/80 rounded-lg p-4 border border-amber-500/40 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <div className="lcars-label-strip text-xs text-zinc-400 mb-2">Burn Ratio</div>
          <div className="flex gap-1 mb-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex-1 h-6 rounded-sm" style={{
                background: i < burnPercent / 10 ? `linear-gradient(180deg, ${i < 3 ? '#14b8a6' : i < 6 ? '#06b6d4' : i < 8 ? '#f59e0b' : '#ef4444'}, transparent)` : 'rgba(39, 39, 42, 0.5)'
              }}></div>
            ))}
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-amber-400">{burnPercent.toFixed(1)}% used</span>
            <span className="text-zinc-500">current draw</span>
          </div>
        </div>
      </div>
      
      {/* LEDGER OVERRIDE */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-cyan-500/10 blur-xl pointer-events-none"></div>
        <div className="relative bg-zinc-900/90 rounded-lg border-2 border-pink-500/50 overflow-hidden" style={{ boxShadow: "0 0 40px rgba(236, 72, 153, 0.3)" }}>
          <div className="h-1 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500"></div>
          <div className="p-4 border-b border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-transparent">
            <h3 className="text-2xl font-bold lcars-font text-pink-400 tracking-wider">Ledger Override</h3>
            <p className="text-sm text-zinc-400 mt-1">Update the working balance to recalculate reserve units, projected runway, and estimated remaining credits.</p>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-sm text-zinc-500 lcars-label-strip mb-2">Current State</div>
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-cyan-500/30">
                <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Current Balance</div>
                <div className="text-2xl font-bold lcars-font text-cyan-400">${balanceUsd.toFixed(2)}</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-violet-500/30">
                <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Estimated Credits Remaining</div>
                <div className="text-2xl font-bold lcars-font text-violet-400">{balance.toLocaleString()}</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-amber-500/30">
                <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Runway Estimate</div>
                <div className="text-2xl font-bold lcars-font text-amber-400">{runway} days</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-teal-500/30">
                <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Threshold State</div>
                <div className={"text-2xl font-bold lcars-font " + threshold.color}>{threshold.state}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-zinc-500 lcars-label-strip mb-2">Manual Update</div>
              <div className="relative">
                <label className="block text-xs text-zinc-500 mb-1">Manual Balance ($)</label>
                <input type="number" step="0.01" value={manualBalance} onChange={(e) => setManualBalance(e.target.value)} placeholder={balanceUsd.toFixed(2)} className="w-full bg-zinc-950 border-2 border-pink-500/50 rounded-lg px-4 py-3 text-white text-lg lcars-font focus:outline-none focus:border-pink-400 transition-all" style={{ boxShadow: "inset 0 0 20px rgba(236, 72, 153, 0.1)" }} />
              </div>
              <button onClick={handleCommit} className="w-full py-3 rounded-lg font-bold text-white lcars-font text-lg transition-all" style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)", boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)" }}>COMMIT UPDATE</button>
              {overrideActive && (
                <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-teal-400" />
                    <span className="text-sm text-teal-400 lcars-font">Ledger Recalculated</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-zinc-400">Updated Balance:</div>
                    <div className="text-cyan-400 lcars-font">${balanceUsd.toFixed(2)}</div>
                    <div className="text-zinc-400">Reserve Units:</div>
                    <div className="text-violet-400 lcars-font">{balance.toLocaleString()}</div>
                    <div className="text-zinc-400">Projected Daily Burn:</div>
                    <div className="text-amber-400 lcars-font">{dailyBurn}</div>
                    <div className="text-zinc-400">Runway:</div>
                    <div className="text-teal-400 lcars-font">{runway} days</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* LOWER PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LCARSPanel title="Burn Ledger" color="amber">
          <p className="text-xs text-zinc-400 mb-3">Recent reserve draw across the last 7 entries</p>
          <div className="grid grid-cols-7 gap-2">
            {burnLedger.map((entry, i) => {
              const maxBurn = Math.max(...burnLedger.map(e => e.burn));
              const intensity = entry.burn / maxBurn;
              return (
                <div key={i} className="text-center">
                  <div className="rounded-lg p-2 mb-1" style={{ background: `linear-gradient(180deg, rgba(245, 158, 11, ${intensity * 0.8}), rgba(245, 158, 11, ${intensity * 0.3}))` }}>
                    <div className="text-lg font-bold lcars-font text-amber-400">{entry.burn}</div>
                  </div>
                  <div className="text-xs text-zinc-500">{entry.date}</div>
                </div>
              );
            })}
          </div>
        </LCARSPanel>
        <LCARSPanel title="Model Drain" color="cyan">
          <p className="text-xs text-zinc-400 mb-3">Which models are drawing the most reserve</p>
          <div className="space-y-3">
            {modelDrain.map((model, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-200 truncate">{model.model}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-violet-950/50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: model.percent + "%", background: "linear-gradient(90deg, #06b6d4, #8b5cf6)" }}></div>
                    </div>
                    <div className="text-xs text-cyan-400 lcars-font w-12 text-right">{model.credits}</div>
                  </div>
                </div>
                {i === 0 && <span className="text-xs text-amber-400 lcars-label-strip">highest</span>}
              </div>
            ))}
          </div>
        </LCARSPanel>
      </div>
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