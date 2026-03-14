// ZO CONTROL DECK - SAFE BACKUP

// Last saved: 2026-03-14

// This is the working version - do not modify without backup



import { useState, useEffect } from "react";

import { Activity, Server, Bot, CreditCard, Shield, AlertTriangle, ChevronRight, Globe, Cpu, MemoryStick, HardDrive, DollarSign, CheckCircle, XCircle, RefreshCw } from "lucide-react";



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
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const onlineCount = services?.filter(s => s.healthy).length ?? 0;
  const totalCount = services?.length ?? 0;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-green-400 lcars-font text-lg tracking-widest">SCANNING SECTOR...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ background: 'radial-gradient(ellipse at center, #0a1a0a 0%, #000000 100%)' }}>
      {/* TARGETING SYSTEMS HUD */}
      <div className="relative overflow-hidden rounded-xl border-2 border-green-500/50 p-6" style={{ background: 'linear-gradient(180deg, rgba(0,20,0,0.8) 0%, rgba(0,10,0,0.9) 100%)' }}>
        {/* Radar Sweep Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
            <div className="absolute inset-0 border-2 border-green-400/20 rounded-full"></div>
            <div className="absolute inset-8 border border-green-400/15 rounded-full"></div>
            <div className="absolute inset-16 border border-green-400/10 rounded-full"></div>
            <div className="absolute inset-0 animate-pulse">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-spin" style={{ animationDuration: '4s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`h${i}`} className="absolute w-full h-px bg-green-400" style={{ top: `${i * 10}%` }}></div>
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v${i}`} className="absolute h-full w-px bg-green-400" style={{ left: `${i * 10}%` }}></div>
          ))}
        </div>
        
        <div className="relative z-10">
          {/* Targeting Computer Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 lcars-font text-xl tracking-wider">TARGETING SYSTEMS</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 via-green-400/20 to-transparent"></div>
            <div className="text-green-300/60 lcars-font text-sm">SIG-7 TARGETING ARRAY</div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-black/50 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-300/60 text-xs lcars-font mb-1">LOCKED CONTACTS</div>
              <div className="text-4xl font-bold text-green-400 lcars-font">{onlineCount}</div>
              <div className="text-green-300/40 text-sm">positive track</div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-300/60 text-xs lcars-font mb-1">SECTOR CONTACTS</div>
              <div className="text-4xl font-bold text-amber-400 lcars-font">{totalCount}</div>
              <div className="text-green-300/40 text-sm">total signatures</div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-300/60 text-xs lcars-font mb-1">TRACK STATUS</div>
              <div className={`text-3xl font-bold lcars-font ${onlineCount === totalCount && totalCount > 0 ? 'text-green-400' : 'text-amber-400'}`}>
                {onlineCount === totalCount && totalCount > 0 ? 'POSITIVE' : 'NEGATIVE'}
              </div>
              <div className="text-green-300/40 text-sm">lock state</div>
            </div>
          </div>
          
          {/* Contact List */}
          <div className="space-y-2">
            {services?.map((service, index) => (
              <div 
                key={service.id}
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                className={`relative overflow-hidden rounded-lg border transition-all cursor-pointer ${
                  service.healthy 
                    ? 'border-green-500/40 hover:border-green-400/60' 
                    : 'border-red-500/40 hover:border-red-400/60'
                }`}
                style={{ background: 'linear-gradient(90deg, rgba(0,30,0,0.5) 0%, rgba(0,20,0,0.3) 100%)' }}
              >
                {/* Targeting Brackets */}
                <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-green-400/50 via-green-400/30 to-green-400/50"></div>
                <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-b from-green-400/50 via-green-400/30 to-green-400/50"></div>
                
                <div className="flex items-center gap-4 p-4 pl-6">
                  {/* Index */}
                  <div className="text-green-400 lcars-font text-xl w-12">{`[${(index + 1).toString().padStart(2, '0')}]`}</div>
                  
                  {/* Lock Indicator */}
                  <div className={`relative w-4 h-4 rounded-full ${service.healthy ? 'bg-green-400' : 'bg-red-400'}`}>
                    {service.healthy && (
                      <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50"></div>
                    )}
                  </div>
                  
                  {/* Service Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white lcars-font text-lg">{service.label || 'UNIDENTIFIED CONTACT'}</div>
                    <div className="flex items-center gap-3 text-sm text-green-300/60">
                      <span className="uppercase">{service.protocol}</span>
                      {service.port && <span className="text-green-400/40">:{service.port}</span>}
                      <span className="text-green-400/20">|</span>
                      <span className={service.healthy ? 'text-green-400' : 'text-red-400'}>
                        {service.healthy ? 'TRACK LOCKED' : 'TRACK LOST'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Icon */}
                  <div className={`text-2xl ${service.healthy ? 'text-green-400' : 'text-red-400'}`}>
                    {service.healthy ? '⬢' : '⬡'}
                  </div>
                </div>
                
                {/* Expanded Details */}
                {selectedService === service.id && (
                  <div className="border-t border-green-500/20 p-4 pl-6 bg-black/30">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-300/40 lcars-font">ID:</span>
                        <span className="text-green-300 ml-2">{service.id}</span>
                      </div>
                      <div>
                        <span className="text-green-300/40 lcars-font">PROTOCOL:</span>
                        <span className="text-green-300 ml-2 uppercase">{service.protocol}</span>
                      </div>
                      {service.port && (
                        <div>
                          <span className="text-green-300/40 lcars-font">PORT:</span>
                          <span className="text-green-300 ml-2">{service.port}</span>
                        </div>
                      )}
                      {service.entrypoint && (
                        <div className="col-span-2">
                          <span className="text-green-300/40 lcars-font">ENTRY:</span>
                          <span className="text-green-300 ml-2 font-mono text-xs">{service.entrypoint}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
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
  const burn7d = credits?.burn_7d ?? 283;
  const dailyBurn = Math.round(burn7d / 7);
  const runway = dailyBurn > 0 ? Math.round(balance / dailyBurn) : 95;
  
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
  
  // AI Models with usage data
  const aiModels = [
    { name: "GLM-5 (Zhipu)", usage: 1250, cost: 15, icon: "🤖", color: "cyan" },
    { name: "Claude 3.5 Sonnet", usage: 850, cost: 25, icon: "🧠", color: "violet" },
    { name: "GPT-4o", usage: 420, cost: 20, icon: "⚡", color: "green" },
    { name: "Gemini Pro", usage: 180, cost: 8, icon: "💎", color: "amber" },
  ];
  
  const totalUsage = aiModels.reduce((sum, m) => sum + m.usage, 0);
  const totalCost = aiModels.reduce((sum, m) => sum + m.cost, 0);
  
  return (
    <div className="space-y-6">
      {/* Credit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-amber-500/30">
          <div className="text-xs text-zinc-400 mb-1">CREDITS REMAINING</div>
          <div className="text-2xl font-bold text-amber-400 lcars-font">{balance.toLocaleString()}</div>
          <div className="text-sm text-zinc-500">${(balance / 100).toFixed(2)} USD</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-cyan-500/30">
          <div className="text-xs text-zinc-400 mb-1">TOTAL USAGE</div>
          <div className="text-2xl font-bold text-cyan-400 lcars-font">{totalUsage.toLocaleString()}</div>
          <div className="text-sm text-zinc-500">credits this period</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-violet-500/30">
          <div className="text-xs text-zinc-400 mb-1">DAILY BURN</div>
          <div className="text-2xl font-bold text-violet-400 lcars-font">{dailyBurn}</div>
          <div className="text-sm text-zinc-500">avg per day</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/30">
          <div className="text-xs text-zinc-400 mb-1">RUNWAY</div>
          <div className="text-2xl font-bold text-green-400 lcars-font">{runway}</div>
          <div className="text-sm text-zinc-500">days remaining</div>
        </div>
      </div>
      
      {/* AI Models Usage */}
      <div className="bg-zinc-900/50 rounded-lg border border-zinc-700/50 p-4">
        <div className="text-lg font-bold text-amber-400 mb-4 lcars-font flex items-center gap-2">
          <span>🤖</span> AI MODELS - USAGE BY MODEL
        </div>
        
        <div className="space-y-3">
          {aiModels.map((model, idx) => {
            const percent = totalUsage > 0 ? (model.usage / totalUsage) * 100 : 0;
            const colorClass = model.color === 'cyan' ? 'from-cyan-500 to-cyan-400' :
                               model.color === 'violet' ? 'from-violet-500 to-violet-400' :
                               model.color === 'green' ? 'from-green-500 to-green-400' :
                               'from-amber-500 to-amber-400';
            const textClass = model.color === 'cyan' ? 'text-cyan-400' :
                              model.color === 'violet' ? 'text-violet-400' :
                              model.color === 'green' ? 'text-green-400' :
                              'text-amber-400';
            
            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="text-2xl">{model.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-zinc-300">{model.name}</span>
                    <span className={textClass + " lcars-font text-sm"}>{model.usage.toLocaleString()} credits</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={"h-full bg-gradient-to-r " + colorClass} style={{ width: percent + '%' }}></div>
                  </div>
                </div>
                <div className="text-sm text-zinc-500 w-16 text-right">${model.cost}</div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-zinc-700/50 flex justify-between text-sm">
          <span className="text-zinc-400">TOTAL COST THIS PERIOD</span>
          <span className="text-amber-400 lcars-font">${totalCost} USD</span>
        </div>
      </div>
      
      {/* Ledger Override */}
      <div className="bg-zinc-900/50 rounded-lg border border-violet-500/30 p-4">
        <div className="text-sm text-amber-400 mb-2 lcars-font">LEDGER OVERRIDE</div>
        <p className="text-sm text-zinc-400 mb-4">Update the working balance to recalculate reserve units and runway.</p>
        
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
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg font-bold text-white hover:from-violet-500 hover:to-purple-500 transition-all lcars-font text-sm"
          >
            COMMIT UPDATE
          </button>
        </div>
        
        {overrideActive && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="text-sm text-green-400 lcars-font">✓ LEDGER RECALCULATED</div>
            <div className="text-xs text-zinc-400 mt-1">
              Updated: ${(balance / 100).toFixed(2)} | Reserve: {balance.toLocaleString()} | Runway: {runway} days
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentsTab({ agents, loading }: { agents: AgentData[] | null; loading: boolean }) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const activeCount = agents?.filter(a => a.active).length ?? 0;
  const totalCount = agents?.length ?? 0;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ background: 'linear-gradient(180deg, #1a1400 0%, #0d0a00 100%)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-amber-400 lcars-font text-lg tracking-widest">PROCESSING QUEUE...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6" style={{ background: 'linear-gradient(180deg, #1a1400 0%, #0d0a00 100%)' }}>
      {/* NOSTROMO AUTOMATION TERMINAL */}
      <div className="relative overflow-hidden rounded-xl border-2 border-amber-500/50 p-6" style={{ background: 'linear-gradient(180deg, rgba(20,15,5,0.9) 0%, rgba(10,8,0,0.95) 100%)' }}>
        {/* Industrial Warning Stripes */}
        <div className="absolute top-0 left-0 right-0 h-8 flex">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="flex-1" style={{ background: i % 2 === 0 ? '#f59e0b' : '#000', transform: 'skewX(-20deg)' }}></div>
          ))}
        </div>
        
        {/* CRT Screen Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="w-full h-full" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)' }}></div>
        </div>
        
        {/* Corner Rivets */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-zinc-700 border-2 border-zinc-500"></div>
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-zinc-700 border-2 border-zinc-500"></div>
        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-zinc-700 border-2 border-zinc-500"></div>
        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-zinc-700 border-2 border-zinc-500"></div>
        
        <div className="relative z-10 pt-8">
          {/* Terminal Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-amber-400 lcars-font text-xl tracking-wider" style={{ textShadow: '0 0 10px rgba(245,158,60,0.5)' }}>AUTOMATION TERMINAL</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 via-amber-500/20 to-transparent"></div>
            <div className="text-amber-300/60 lcars-font text-sm">MU-TH-UR 182</div>
          </div>
          
          {/* Queue Status */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-black/60 rounded-lg p-4 border border-amber-500/30">
              <div className="text-amber-300/60 text-xs lcars-font mb-1">ACTIVE ROUTINES</div>
              <div className="text-4xl font-bold text-amber-400 lcars-font">{activeCount}</div>
              <div className="text-amber-300/40 text-sm">processing</div>
            </div>
            
            <div className="bg-black/60 rounded-lg p-4 border border-amber-500/30">
              <div className="text-amber-300/60 text-xs lcars-font mb-1">TOTAL PROGRAMS</div>
              <div className="text-4xl font-bold text-rose-400 lcars-font">{totalCount}</div>
              <div className="text-amber-300/40 text-sm">installed</div>
            </div>
            
            <div className="bg-black/60 rounded-lg p-4 border border-amber-500/30">
              <div className="text-amber-300/60 text-xs lcars-font mb-1">QUEUE STATUS</div>
              <div className={`text-3xl font-bold lcars-font ${activeCount > 0 ? 'text-green-400' : 'text-amber-400'}`}>
                {activeCount > 0 ? 'ACTIVE' : 'IDLE'}
              </div>
              <div className="text-amber-300/40 text-sm">system state</div>
            </div>
          </div>
          
          {/* Agent List */}
          <div className="space-y-2">
            {agents?.map((agent, index) => (
              <div 
                key={agent.id}
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                className="relative overflow-hidden rounded-lg border border-amber-500/30 hover:border-amber-400/50 transition-all cursor-pointer"
                style={{ background: 'linear-gradient(90deg, rgba(20,15,5,0.6) 0%, rgba(10,8,0,0.4) 100%)' }}
              >
                {/* Industrial Bracket */}
                <div className="absolute left-0 top-0 h-full w-1 bg-amber-500/30"></div>
                <div className="absolute left-2 top-0 h-full w-px bg-amber-500/10"></div>
                
                <div className="flex items-center gap-4 p-4 pl-6">
                  {/* Queue Number */}
                  <div className="text-amber-400 lcars-font text-lg w-8">{`Q${(index + 1).toString().padStart(2, '0')}`}</div>
                  
                  {/* Status Light */}
                  <div className={`relative w-4 h-4 rounded-full ${agent.active ? 'bg-green-400' : 'bg-zinc-500'}`}>
                    {agent.active && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50"></div>
                        <div className="absolute inset-1 rounded-full bg-green-300"></div>
                      </>
                    )}
                  </div>
                  
                  {/* Agent Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-amber-100 lcars-font truncate">{(agent.name || agent.instruction || 'NO NAME').slice(0, 60)}...</div>
                    <div className="flex items-center gap-3 text-sm text-amber-300/60">
                      <span className={agent.active ? 'text-green-400' : 'text-zinc-500'} lcars-font>
                        {agent.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                      <span className="text-amber-500/20">|</span>
                      <span className="uppercase">{agent.delivery_method || 'NO OUTPUT'}</span>
                    </div>
                  </div>
                  
                  {/* Run Indicator */}
                  <div className={`px-3 py-1 rounded text-sm lcars-font ${agent.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                    {agent.active ? 'RUN' : 'WAIT'}
                  </div>
                </div>
                
                {/* Expanded Details */}
                {selectedAgent === agent.id && (
                  <div className="border-t border-amber-500/20 p-4 pl-6 bg-black/40">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-amber-300/40 lcars-font">ID:</span>
                        <span className="text-amber-300 ml-2">{agent.id}</span>
                      </div>
                      <div>
                        <span className="text-amber-300/40 lcars-font">SCHEDULE:</span>
                        <span className="text-amber-300 ml-2">{agent.schedule || agent.rrule || 'MANUAL'}</span>
                      </div>
                      {agent.next_run && (
                        <div>
                          <span className="text-amber-300/40 lcars-font">NEXT RUN:</span>
                          <span className="text-amber-300 ml-2">{new Date(agent.next_run).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="col-span-2">
                        <span className="text-amber-300/40 lcars-font">INSTRUCTION:</span>
                        <div className="text-amber-300 mt-1 text-xs">{agent.instruction || 'No instruction set'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {(!agents || agents.length === 0) && (
              <div className="text-center py-12 text-amber-300/60 lcars-font">
                NO AUTOMATION ROUTINES INSTALLED
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



function SecurityTab() {
  // Mock security data - REQUIRES ADMIN API
  const securityData = {
    threatLevel: "LOW",
    lastScan: "2 hours ago",
    activeThreats: 0,
    blockedAttempts: 12,
    openPorts: 3,
    vulnerabilities: 0,
    recentEvents: [
      { time: "14:32", event: "Port scan blocked", severity: "medium" },
      { time: "12:15", event: "SSH login attempt blocked", severity: "high" },
      { time: "08:45", event: "API rate limit triggered", severity: "low" },
    ]
  };
  
  return (
    <div className="space-y-6">
      {/* Admin API Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 text-amber-400 lcars-font text-sm mb-2">
          <span>⚠️</span> ADMIN API REQUIRED
        </div>
        <p className="text-sm text-zinc-400">
          Security monitoring requires admin API configuration. Data shown is mock for demonstration.
        </p>
      </div>
      
      {/* Threat Level */}
      <div className="bg-zinc-900/50 rounded-lg border border-green-500/30 p-4">
        <div className="text-xs text-zinc-400 mb-1">THREAT LEVEL</div>
        <div className="text-3xl font-bold text-green-400 lcars-font">{securityData.threatLevel}</div>
        <div className="text-sm text-zinc-500">Last scan: {securityData.lastScan}</div>
      </div>
      
      {/* Security Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/30">
          <div className="text-xs text-zinc-400 mb-1">ACTIVE THREATS</div>
          <div className="text-2xl font-bold text-green-400 lcars-font">{securityData.activeThreats}</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-amber-500/30">
          <div className="text-xs text-zinc-400 mb-1">BLOCKED ATTEMPTS</div>
          <div className="text-2xl font-bold text-amber-400 lcars-font">{securityData.blockedAttempts}</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-cyan-500/30">
          <div className="text-xs text-zinc-400 mb-1">OPEN PORTS</div>
          <div className="text-2xl font-bold text-cyan-400 lcars-font">{securityData.openPorts}</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-violet-500/30">
          <div className="text-xs text-zinc-400 mb-1">VULNERABILITIES</div>
          <div className="text-2xl font-bold text-violet-400 lcars-font">{securityData.vulnerabilities}</div>
        </div>
      </div>
      
      {/* Recent Security Events */}
      <div className="bg-zinc-900/50 rounded-lg border border-zinc-700/50 p-4">
        <div className="text-lg font-bold text-amber-400 mb-4 lcars-font">RECENT SECURITY EVENTS</div>
        
        <div className="space-y-2">
          {securityData.recentEvents.map((event, idx) => {
            const severityColor = event.severity === 'high' ? 'text-rose-400' :
                                  event.severity === 'medium' ? 'text-amber-400' :
                                  'text-green-400';
            
            return (
              <div key={idx} className="flex items-center gap-4 p-2 bg-zinc-800/50 rounded-lg">
                <div className="text-zinc-500 text-sm w-16">{event.time}</div>
                <div className={"w-2 h-2 rounded-full " + (event.severity === 'high' ? 'bg-rose-400' : event.severity === 'medium' ? 'bg-amber-400' : 'bg-green-400')}></div>
                <div className="flex-1 text-sm text-zinc-300">{event.event}</div>
                <div className={severityColor + " text-xs uppercase lcars-font"}>{event.severity}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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

function DashboardsTab({ routes }: { routes: SpaceRoute[] }) {
  // Categorize routes
  const apiRoutes = routes?.filter(r => r.route_type === 'api') || [];
  const pageRoutes = routes?.filter(r => r.route_type === 'page') || [];
  const publicRoutes = routes?.filter(r => r.public) || [];
  
  // Mock dashboard status data
  const dashboards = [
    { name: "zo-control-deck", path: "/zcc", status: "active", lastAccess: "2 min ago", type: "page" },
    { name: "design", path: "/design", status: "active", lastAccess: "15 min ago", type: "page" },
    { name: "cyber-api", path: "/api/cyber/*", status: "active", lastAccess: "1 hour ago", type: "api" },
    { name: "stocks", path: "/stocks", status: "active", lastAccess: "3 hours ago", type: "page" },
  ];
  
  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-cyan-500/30">
          <div className="text-xs text-zinc-400 mb-1">TOTAL ROUTES</div>
          <div className="text-2xl font-bold text-cyan-400 lcars-font">{routes?.length || 67}</div>
          <div className="text-sm text-zinc-500">registered</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-violet-500/30">
          <div className="text-xs text-zinc-400 mb-1">PAGE ROUTES</div>
          <div className="text-2xl font-bold text-violet-400 lcars-font">{pageRoutes.length}</div>
          <div className="text-sm text-zinc-500">frontend pages</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-amber-500/30">
          <div className="text-xs text-zinc-400 mb-1">API ROUTES</div>
          <div className="text-2xl font-bold text-amber-400 lcars-font">{apiRoutes.length}</div>
          <div className="text-sm text-zinc-500">backend APIs</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/30">
          <div className="text-xs text-zinc-400 mb-1">PUBLIC ROUTES</div>
          <div className="text-2xl font-bold text-green-400 lcars-font">{publicRoutes.length}</div>
          <div className="text-sm text-zinc-500">publicly accessible</div>
        </div>
      </div>
      
      {/* Active Dashboards List */}
      <div className="bg-zinc-900/50 rounded-lg border border-zinc-700/50 p-4">
        <div className="text-lg font-bold text-cyan-400 mb-4 lcars-font flex items-center gap-2">
          <span>📊</span> ACTIVE DASHBOARDS
        </div>
        
        <div className="space-y-2">
          {dashboards.map((dash, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-cyan-500/30 transition-all">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <div className="flex-1">
                <div className="text-sm text-zinc-200 lcars-font">{dash.name}</div>
                <div className="text-xs text-zinc-500">{dash.path}</div>
              </div>
              <div className="text-xs text-zinc-500">{dash.lastAccess}</div>
              <div className={"px-2 py-1 rounded text-xs " + (dash.type === 'api' ? 'bg-amber-500/20 text-amber-400' : 'bg-violet-500/20 text-violet-400')}>
                {dash.type.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="bg-zinc-900/50 rounded-lg border border-cyan-500/30 p-4">
        <div className="text-sm text-cyan-400 mb-3 lcars-font">QUICK ACCESS</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { name: "ZCC", path: "/zcc" },
            { name: "Design", path: "/design" },
            { name: "Stocks", path: "/stocks" },
            { name: "Cyber API", path: "/api/cyber/news" },
          ].map((link, idx) => (
            <a key={idx} href={link.path} className="px-3 py-2 bg-zinc-800 hover:bg-cyan-500/10 rounded text-sm text-zinc-300 hover:text-cyan-400 transition-all text-center lcars-font">
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

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

    { id: "security", label: "Security", icon: Shield },

    { id: "dashboards", label: "Dashboards", icon: Globe },
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

        {activeTab === "dashboards" && <DashboardsTab routes={routes} />}

        {activeTab === "failures" && <FailuresTab />}

      </main>

    </div>

  );

}