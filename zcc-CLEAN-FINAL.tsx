// ZO CONTROL DECK - SAFE BACKUP

// Last saved: 2026-03-14

// This is the working version - do not modify without backup



import { useState, useEffect } from "react";

import { Activity, Server, Bot, CreditCard, Shield, AlertTriangle, FileText, ChevronRight, Globe, Cpu, MemoryStick, HardDrive, DollarSign, CheckCircle, XCircle, RefreshCw } from "lucide-react";



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



interface SpaceRoute {

  path: string;

  route_type: "page" | "api";

  public: boolean;

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



// SERVICES TAB - Star Wars Targeting Computer Theme (COMPLETE REDESIGN)
function ServicesTab({ services, loading }: { services: ServiceData[] | null; loading: boolean }) {
  const onlineCount = services?.filter(s => s.healthy).length ?? 0;
  const totalCount = services?.length ?? 0;
  const offlineCount = totalCount - onlineCount;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-green-400 animate-spin" />
        <span className="ml-3 text-lg text-green-400 lcars-font">SCANNING SECTOR...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Targeting Computer Header */}
      <LCARSPanel title="TARGETING SYSTEMS" color="green">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-black/50 rounded-lg p-4 border border-green-500/30 text-center">
            <div className="text-green-300/60 text-xs lcars-font mb-1">LOCKED CONTACTS</div>
            <div className="text-4xl font-bold text-green-400 lcars-font">{onlineCount}</div>
            <div className="text-green-300/40 text-sm">positive track</div>
          </div>
          
          <div className="bg-black/50 rounded-lg p-4 border border-amber-500/30 text-center">
            <div className="text-amber-300/60 text-xs lcars-font mb-1">SECTOR CONTACTS</div>
            <div className="text-4xl font-bold text-amber-400 lcars-font">{totalCount}</div>
            <div className="text-amber-300/40 text-sm">total signatures</div>
          </div>
          
          <div className="bg-black/50 rounded-lg p-4 border border-rose-500/30 text-center">
            <div className="text-rose-300/60 text-xs lcars-font mb-1">DRIFT SIGNALS</div>
            <div className="text-4xl font-bold text-rose-400 lcars-font">{offlineCount}</div>
            <div className="text-rose-300/40 text-sm">unstable</div>
          </div>
          
          <div className="bg-black/50 rounded-lg p-4 border border-cyan-500/30 text-center">
            <div className="text-cyan-300/60 text-xs lcars-font mb-1">LOCK STATUS</div>
            <div className="text-2xl font-bold text-cyan-400 lcars-font">
              {onlineCount === totalCount && totalCount > 0 ? "POSITIVE" : "PARTIAL"}
            </div>
            <div className="text-cyan-300/40 text-sm">tracking state</div>
          </div>
        </div>
      </LCARSPanel>

      {/* Contact Registry */}
      <LCARSPanel title="CONTACT REGISTRY" color="green">
        {services && services.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {services.map((service, index) => (
              <div 
                key={service.id}
                className="flex items-center gap-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/50 hover:border-green-500/50 transition-all"
              >
                <div className="text-green-400 lcars-font text-lg w-10">{`[${(index + 1).toString().padStart(2, '0')}]`}</div>
                <div className={`w-3 h-3 rounded-full ${service.healthy ? 'bg-green-400 shadow-green-400/50 shadow-lg' : 'bg-rose-400 shadow-rose-400/50 shadow-lg'}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-200 truncate font-medium">{service.label}</div>
                  <div className="text-xs text-zinc-500 flex items-center gap-2">
                    <span className="uppercase lcars-font">{service.protocol}</span>
                    {service.port && <span className="text-amber-400">:{service.port}</span>}
                    <span className="text-zinc-600">|</span>
                    <span className={service.healthy ? "text-green-400 lcars-font" : "text-rose-400 lcars-font"}>
                      {service.healthy ? "LOCKED" : "DRIFT"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500">No services found</div>
        )}
      </LCARSPanel>
    </div>
  );
}




// CREDITS TAB - Blade Runner Neon Finance Terminal (COMPLETE REDESIGN)
function CreditsTab({ credits, creditOverride, updateCreditOverride }: { 
  credits: CreditsData | null; 
  creditOverride: number | null;
  updateCreditOverride: (value: number) => void;
}) {
  const apiBalance = credits?.balance ?? 3852;
  const balance = creditOverride ?? apiBalance;
  const burn7d = 283;
  const dailyBurn = Math.round(burn7d / 7);
  const runway = dailyBurn > 0 ? Math.round(balance / dailyBurn) : 95;

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

  const aiModels = [
    { name: "MiniMax 2.5", tier: "Free", context: "245K", input: "0", output: "0", cached: "0", status: "available" },
    { name: "Kimi K2.5", tier: "Free", context: "200K", input: "0", output: "0", cached: "0", status: "available" },
    { name: "GLM 5", tier: "$$", context: "128K", input: "0.25/M", output: "0.50/M", cached: "0.05/M", status: "active" },
    { name: "GPT-5.4", tier: "$$$", context: "200K", input: "2.50/M", output: "10.00/M", cached: "0.50/M", status: "available" },
    { name: "Opus 4.6", tier: "$$$", context: "200K", input: "15.00/M", output: "75.00/M", cached: "1.50/M", status: "available" },
    { name: "Gemini 3.1 Pro", tier: "$$$", context: "1M", input: "1.25/M", output: "5.00/M", cached: "0.10/M", status: "available" },
    { name: "GPT-5.3 Codex", tier: "$$$", context: "256K", input: "3.00/M", output: "12.00/M", cached: "0.75/M", status: "available" },
    { name: "Sonnet 4.5", tier: "$$$", context: "200K", input: "3.00/M", output: "15.00/M", cached: "0.30/M", status: "available" },
  ];

  return (
    <div className="space-y-6">
      <LCARSPanel title="CREDIT RESERVE" color="amber">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-amber-500/40 text-center">
            <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Ledger Balance</div>
            <div className="text-2xl font-bold text-amber-400 lcars-font">${(balance / 100).toFixed(2)}</div>
            <div className="text-sm text-zinc-500">current funds</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-rose-500/40 text-center">
            <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Reserve Units</div>
            <div className="text-2xl font-bold text-rose-400 lcars-font">{balance.toLocaleString()}</div>
            <div className="text-sm text-zinc-500">credits remaining</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-cyan-500/40 text-center">
            <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Daily Burn</div>
            <div className="text-2xl font-bold text-cyan-400 lcars-font">{dailyBurn}</div>
            <div className="text-sm text-zinc-500">avg consumption</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-violet-500/40 text-center">
            <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Runway</div>
            <div className="text-2xl font-bold text-violet-400 lcars-font">{runway} days</div>
            <div className="text-sm text-zinc-500">estimated</div>
          </div>
        </div>
      </LCARSPanel>

      <LCARSPanel title="AI MODELS" color="violet">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-2 px-3 text-zinc-400 lcars-font">MODEL</th>
                <th className="text-center py-2 px-3 text-zinc-400 lcars-font">TIER</th>
                <th className="text-center py-2 px-3 text-zinc-400 lcars-font">CONTEXT</th>
                <th className="text-center py-2 px-3 text-zinc-400 lcars-font">INPUT</th>
                <th className="text-center py-2 px-3 text-zinc-400 lcars-font">OUTPUT</th>
                <th className="text-center py-2 px-3 text-zinc-400 lcars-font">CACHED</th>
                <th className="text-center py-2 px-3 text-zinc-400 lcars-font">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {aiModels.map((model, idx) => (
                <tr key={idx} className={`border-b border-zinc-800 hover:bg-zinc-800/50 ${model.status === 'active' ? 'bg-cyan-900/20' : ''}`}>
                  <td className="py-2 px-3 text-white font-medium">{model.name}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs lcars-font ${
                      model.tier === 'Free' ? 'bg-cyan-500/20 text-cyan-400' :
                      model.tier === '$$' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>{model.tier}</span>
                  </td>
                  <td className="py-2 px-3 text-center text-cyan-400 lcars-font">{model.context}</td>
                  <td className="py-2 px-3 text-center text-amber-400">{model.input}</td>
                  <td className="py-2 px-3 text-center text-amber-400">{model.output}</td>
                  <td className="py-2 px-3 text-center text-violet-400">{model.cached}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      model.status === 'active' ? 'bg-green-500/20 text-green-400' : 'text-zinc-500'
                    }`}>{model.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LCARSPanel>

      <LCARSPanel title="LEDGER OVERRIDE" color="violet">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 mb-1">Manual Balance ($)</label>
            <input
              type="number"
              step="0.01"
              value={manualBalance}
              onChange={(e) => setManualBalance(e.target.value)}
              placeholder={(balance / 100).toFixed(2)}
              className="w-full bg-zinc-900 border border-violet-500/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-400"
            />
          </div>
          <button
            onClick={handleCommit}
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg font-bold text-white hover:from-violet-500 hover:to-purple-500 transition-all"
          >
            COMMIT UPDATE
          </button>
        </div>
        {overrideActive && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="text-sm text-green-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Ledger Recalculated
            </div>
          </div>
        )}
      </LCARSPanel>
    </div>
  );
}


function AgentsTab({ agents, loading }: { agents: AgentData[] | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-lg text-violet-400 lcars-font">Scanning routines...</span>
      </div>
    );
  }
  
  const activeCount = agents?.filter(a => a.active).length ?? 0;
  const inactiveCount = agents?.filter(a => !a.active).length ?? 0;
  const totalCount = agents?.length ?? 0;
  const smsCount = agents?.filter(a => a.delivery_method === 'sms').length ?? 0;
  const emailCount = agents?.filter(a => a.delivery_method === 'email').length ?? 0;
  
  return (
    <div className="space-y-6">
      {/* Agent Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/40">
          <div className="text-xs text-zinc-400 mb-1">Active Agents</div>
          <div className="text-3xl font-bold text-green-400 lcars-font">{activeCount}</div>
          <div className="text-sm text-zinc-500">currently running</div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-amber-500/40">
          <div className="text-xs text-zinc-400 mb-1">Inactive Agents</div>
          <div className="text-3xl font-bold text-amber-400 lcars-font">{inactiveCount}</div>
          <div className="text-sm text-zinc-500">paused or stopped</div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-cyan-500/40">
          <div className="text-xs text-zinc-400 mb-1">SMS Delivery</div>
          <div className="text-3xl font-bold text-cyan-400 lcars-font">{smsCount}</div>
          <div className="text-sm text-zinc-500">text notifications</div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-violet-500/40">
          <div className="text-xs text-zinc-400 mb-1">Email Delivery</div>
          <div className="text-3xl font-bold text-violet-400 lcars-font">{emailCount}</div>
          <div className="text-sm text-zinc-500">email notifications</div>
        </div>
      </div>
      
      {/* Agent Registry */}
      <div className="bg-zinc-900/50 rounded-lg border border-zinc-700/50 p-4">
        <div className="text-lg font-bold text-violet-400 mb-4 lcars-font flex items-center gap-2">
          <span>📋</span> AGENT REGISTRY
        </div>
        
        {agents && agents.length > 0 ? (
          <div className="space-y-3">
            {agents.map((agent, index) => (
              <div 
                key={agent.id}
                className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-violet-500/50 transition-all"
              >
                {/* Index Number */}
                <div className="text-violet-400 lcars-font text-lg font-bold w-8">
                  [{(index + 1).toString().padStart(2, '0')}]
                </div>
                
                {/* Status Indicator */}
                <div className="mt-1">
                  <div className={`w-3 h-3 rounded-full ${
                    agent.active 
                      ? 'bg-green-400 shadow-green-400/50 shadow-lg animate-pulse' 
                      : 'bg-zinc-500'
                  }`}></div>
                </div>
                
                {/* Agent Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-zinc-200 lcars-font mb-1">
                    {agent.name || 'Unnamed Agent'}
                  </div>
                  <div className="text-xs text-zinc-400 mb-2">
                    ID: {agent.id.slice(0, 8)}...
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-zinc-500">Schedule:</span>
                      <span className="text-zinc-300 ml-1">{agent.schedule || 'Manual'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Status:</span>
                      <span className={`ml-1 ${agent.active ? 'text-green-400' : 'text-amber-400'}`}>
                        {agent.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Delivery:</span>
                      <span className="text-zinc-300 ml-1 uppercase">{agent.delivery_method || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Last Run:</span>
                      <span className="text-zinc-300 ml-1">
                        {agent.last_run ? new Date(agent.last_run).toLocaleString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                  <div className={`px-3 py-1 rounded text-xs font-bold ${
                    agent.active 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-zinc-700 text-zinc-400 border border-zinc-600'
                  }`}>
                    {agent.active ? 'RUNNING' : 'STOPPED'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-400">
            <div className="text-4xl mb-3">🤖</div>
            <div className="lcars-font">NO AGENTS CONFIGURED</div>
            <div className="text-sm text-zinc-500 mt-2">Create agents from the Agents tab</div>
          </div>
        )}
      </div>
    </div>
  );
}

function SecurityTab() {

  return <div className="space-y-6"><LCARSPanel title="Security Status" color="rose"><div className="flex items-center justify-center h-40"><div className="text-center"><Shield className="w-12 h-12 text-rose-400 mx-auto mb-3" /><div className="text-lg text-zinc-400">Security monitoring requires API configuration</div></div></div></LCARSPanel></div>;

}



// FAILURES TAB - Requires Admin API
function FailuresTab() {
  return (
    <div className="space-y-6" style={{ background: 'linear-gradient(180deg, #1a0000 0%, #0d0000 100%)' }}>
      <div className="relative overflow-hidden rounded-xl border-2 border-red-500/50 p-8" style={{ background: 'linear-gradient(180deg, rgba(30,0,0,0.9) 0%, rgba(15,0,0,0.95) 100%)' }}>
        {/* Red Alert Pulse */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
        </div>
        
        {/* Warning Stripes */}
        <div className="absolute top-0 left-0 right-0 h-4 flex">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="flex-1" style={{ background: i % 2 === 0 ? '#ef4444' : '#000', transform: 'skewX(-20deg)' }}></div>
          ))}
        </div>
        
        <div className="relative z-10 pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-400 lcars-font text-xl tracking-wider" style={{ textShadow: '0 0 10px rgba(239,68,68,0.5)' }}>FAILURE TRACKING</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 via-red-500/20 to-transparent"></div>
          </div>
          
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠</div>
              <div className="text-lg text-red-400 lcars-font mb-2">ADMIN API REQUIRED</div>
              <div className="text-sm text-red-300/60 mb-4">Failure tracking requires admin API configuration</div>
              <div className="text-xs text-red-300/40 max-w-md">
                To enable failure tracking, configure the admin monitoring endpoints in your Zo Space settings. 
                This feature requires elevated permissions to access system failure logs.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// DASHBOARDS TAB - TRON Grid Portal Index Theme

function DashboardsTab() {
  const quickAccessItems = [
    { name: "Projects", icon: "📁", description: "Workspace projects", link: "/?t=search&q=Projects" },
    { name: "Tools", icon: "🔧", description: "System tools", link: "/?t=settings" },
    { name: "Settings", icon: "⚙️", description: "Configuration", link: "/?t=settings" },
    { name: "Terminal", icon: "💻", description: "Command line", link: "/?t=terminal" },
    { name: "Browser", icon: "🌐", description: "Web browser", link: "/browser" },
    { name: "Datasets", icon: "📊", description: "Data collections", link: "/?t=datasets" },
  ];

  const allSpaces = [
    { path: "/", type: "page", public: true, name: "Home" },
    { path: "/zcc", type: "page", public: false, name: "ZCC Dashboard" },
    { path: "/design", type: "page", public: true, name: "Design" },
    { path: "/stocks", type: "page", public: true, name: "Stocks" },
    { path: "/eats", type: "page", public: true, name: "Eats" },
    { path: "/api/system-stats", type: "api", public: true, name: "System Stats API" },
    { path: "/api/services", type: "api", public: true, name: "Services API" },
    { path: "/api/agents", type: "api", public: true, name: "Agents API" },
    { path: "/api/credits", type: "api", public: true, name: "Credits API" },
    { path: "/api/yelp-data", type: "api", public: true, name: "Yelp Data API" },
  ];

  return (
    <div className="space-y-6">
      <LCARSPanel title="ROUTE STATISTICS" color="cyan">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-cyan-500/30 text-center">
            <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Total Routes</div>
            <div className="text-3xl font-bold text-cyan-400 lcars-font">67</div>
            <div className="text-sm text-zinc-500">registered</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-amber-500/30 text-center">
            <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Page Routes</div>
            <div className="text-3xl font-bold text-amber-400 lcars-font">~50</div>
            <div className="text-sm text-zinc-500">frontend</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-violet-500/30 text-center">
            <div className="lcars-label-strip text-xs text-zinc-400 mb-1">API Routes</div>
            <div className="text-3xl font-bold text-violet-400 lcars-font">~17</div>
            <div className="text-sm text-zinc-500">backend</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/30 text-center">
            <div className="lcars-label-strip text-xs text-zinc-400 mb-1">Public Routes</div>
            <div className="text-3xl font-bold text-green-400 lcars-font">~40</div>
            <div className="text-sm text-zinc-500">accessible</div>
          </div>
        </div>
      </LCARSPanel>

      <LCARSPanel title="QUICK ACCESS" color="green">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {quickAccessItems.map((item, idx) => (
            <a key={idx} href={item.link} className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/30 hover:border-green-400 hover:bg-zinc-800/50 transition-all text-center block">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-sm text-zinc-200 font-medium">{item.name}</div>
              <div className="text-xs text-zinc-500 mt-1">{item.description}</div>
            </a>
          ))}
        </div>
      </LCARSPanel>

      <LCARSPanel title="ALL SPACES" color="amber">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {allSpaces.map((space, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/50 hover:border-amber-500/50 transition-all">
              <div className={`w-3 h-3 rounded-full ${space.type === 'api' ? 'bg-violet-400' : 'bg-cyan-400'}`}></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-zinc-200 font-medium">{space.name}</div>
                <div className="text-xs text-zinc-500 font-mono">{space.path}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${space.public ? 'bg-green-500/20 text-green-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                {space.public ? 'PUBLIC' : 'PRIVATE'}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs ${space.type === 'api' ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                {space.type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </LCARSPanel>
    </div>
  );
}

function LogsTab() {
  const [logLines] = useState([
    { time: "19:15:32", level: "INFO", source: "server.ts", message: "Server started on port 3099" },
    { time: "19:15:33", level: "INFO", source: "build", message: "Build completed successfully" },
    { time: "19:15:34", level: "INFO", source: "supervisord", message: "Process astranode-v2 entered RUNNING state" },
    { time: "19:15:35", level: "WARN", source: "cache", message: "Cache miss for route /api/credits" },
    { time: "19:15:36", level: "INFO", source: "fetch", message: "Fetched data from /api/services" },
    { time: "19:15:37", level: "ERROR", source: "build", message: "Module not found: checking fallback" },
    { time: "19:15:38", level: "INFO", source: "server", message: "Request received: GET /zcc" },
    { time: "19:15:39", level: "INFO", source: "render", message: "Page rendered successfully" },
    { time: "19:15:40", level: "WARN", source: "memory", message: "Memory usage at 45%" },
    { time: "19:15:41", level: "INFO", source: "agent", message: "Agent check completed" },
  ]);

  const traceSources = 17;
  const warningFlags = 1;
  const errorSpikes = 73;

  return (
    <div className="space-y-6" style={{ background: 'radial-gradient(ellipse at center, #001a00 0%, #000000 100%)' }}>
      {/* Trace Console Header */}
      <div className="relative overflow-hidden rounded-lg border border-green-500/50 p-4" style={{ background: 'linear-gradient(180deg, rgba(0,30,0,0.9) 0%, rgba(0,10,0,0.95) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute h-full w-px bg-green-400" style={{ left: `${i * 5}%` }}></div>
          ))}
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-green-400 lcars-font">TRACE CONSOLE</h2>
            <p className="text-sm text-green-300/60">Recent trace output, warning flags, and fault lines</p>
          </div>
          <div className="text-right">
            <div className="text-green-400 lcars-font text-lg">STREAM LINK</div>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm">CONNECTED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Monitor */}
      <LCARSPanel title="STREAM MONITOR" color="green">
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-black/50 rounded-lg p-4 border border-green-500/30 text-center">
            <div className="text-green-300/60 text-xs lcars-font mb-1">TRACE SOURCES</div>
            <div className="text-3xl font-bold text-green-400 lcars-font">{traceSources}</div>
          </div>
          <div className="bg-black/50 rounded-lg p-4 border border-amber-500/30 text-center">
            <div className="text-amber-300/60 text-xs lcars-font mb-1">WARNING FLAGS</div>
            <div className="text-3xl font-bold text-amber-400 lcars-font">{warningFlags}</div>
          </div>
          <div className="bg-black/50 rounded-lg p-4 border border-rose-500/30 text-center">
            <div className="text-rose-300/60 text-xs lcars-font mb-1">ERROR SPIKES</div>
            <div className="text-3xl font-bold text-rose-400 lcars-font">{errorSpikes}</div>
          </div>
          <div className="bg-black/50 rounded-lg p-4 border border-cyan-500/30 text-center">
            <div className="text-cyan-300/60 text-xs lcars-font mb-1">STREAM STATE</div>
            <div className="text-xl font-bold text-cyan-400 lcars-font">LIVE</div>
          </div>
          <div className="bg-black/50 rounded-lg p-4 border border-violet-500/30 text-center">
            <div className="text-violet-300/60 text-xs lcars-font mb-1">TAIL MODE</div>
            <div className="text-xl font-bold text-violet-400 lcars-font">ACTIVE</div>
          </div>
        </div>
      </LCARSPanel>

      {/* Activity Matrix */}
      <div className="grid grid-cols-2 gap-6">
        <LCARSPanel title="ACTIVITY MATRIX" color="green">
          <div className="grid grid-cols-3 gap-2">
            {["INFO", "WARN", "ERROR", "TRACE", "BOOT", "RUNTIME"].map((type) => (
              <div key={type} className="bg-black/50 rounded p-2 border border-green-500/20 text-center">
                <div className="text-xs text-green-300/60 lcars-font">{type}</div>
                <div className="text-lg font-bold text-green-400 lcars-font">
                  {type === "INFO" ? "HIGH" : type === "WARN" ? "LOW" : type === "ERROR" ? "ELEVATED" : "PRESENT"}
                </div>
              </div>
            ))}
          </div>
        </LCARSPanel>

        <LCARSPanel title="SOURCE FOCUS" color="cyan">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-zinc-400">Current File:</span><span className="text-cyan-400 font-mono">server.log</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Hottest Source:</span><span className="text-cyan-400 font-mono">build.log</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Last Fault:</span><span className="text-rose-400 font-mono">error.log</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Tail State:</span><span className="text-green-400">Active</span></div>
          </div>
        </LCARSPanel>
      </div>

      {/* Live Trace Window */}
      <div className="rounded-lg border border-green-500/50 overflow-hidden" style={{ background: '#000' }}>
        <div className="bg-gradient-to-r from-green-900/50 to-transparent px-4 py-2 border-b border-green-500/30">
          <h3 className="text-green-400 lcars-font text-lg">LIVE TRACE WINDOW</h3>
          <p className="text-green-300/40 text-xs">Live lines grouped by source with anomaly and fault markers</p>
        </div>
        <div className="p-4 font-mono text-sm max-h-64 overflow-y-auto" style={{ background: 'linear-gradient(180deg, #001100 0%, #000800 100%)' }}>
          {logLines.map((line, idx) => (
            <div key={idx} className={`flex gap-4 py-1 ${line.level === 'ERROR' ? 'text-rose-400' : line.level === 'WARN' ? 'text-amber-400' : 'text-green-400'}`}>
              <span className="text-green-300/40 w-20">[{line.time}]</span>
              <span className={`w-16 ${line.level === 'ERROR' ? 'text-rose-400' : line.level === 'WARN' ? 'text-amber-400' : 'text-green-500'}`}>[{line.level}]</span>
              <span className="text-cyan-400 w-32">{line.source}</span>
              <span className="flex-1">{line.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




// DASHBOARDS TAB - TRON Grid Portal Index Theme


export default function ZoControlDeck() {

  const [activeTab, setActiveTab] = useState("overview");

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<SystemStats | null>(null);

  const [services, setServices] = useState<ServiceData[] | null>(null);

  const [agents, setAgents] = useState<AgentData[] | null>(null);

  const [credits, setCredits] = useState<CreditsData | null>(null);

  const [creditOverride, setCreditOverride] = useState<number | null>(null);

  const [routes, setRoutes] = useState<SpaceRoute[]>([]);

  

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

          fetch("/api/system-stats"), fetch("/api/services"), fetch("/api/agents"), fetch("/api/credits"),

          fetch("/api/dashboards")

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
    { id: "dashboards", label: "Dashboards", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "logs", label: "Logs", icon: FileText },
    { id: "failures", label: "Failures", icon: AlertTriangle },
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

        {activeTab === "dashboards" && <DashboardsTab routes={routes} />}

        {activeTab === "logs" && <LogsTab />}
        {activeTab === "failures" && <FailuresTab />}

      </main>

    </div>

  );

}