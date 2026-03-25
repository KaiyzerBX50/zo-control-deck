import { useState, useEffect, useCallback, useRef } from "react";
import { Activity, Server, Bot, CreditCard, Shield, AlertTriangle, FileText, Globe, Menu, X, ChevronDown, ChevronRight } from "lucide-react";

// Design system colors
const COLORS = {
  bg: "#0a0a0f",
  card: "#0f1117",
  cardHover: "#141420",
  cyan: "#06b6d4",
  cyanLight: "#22d3ee",
  indigo: "#6366f1",
  indigoLight: "#818cf8",
  muted: "#94a3b8",
  dimmed: "#64748b",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(6,182,212,0.4)",
};

const TABS = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "services", label: "Services", icon: Server },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "credits", label: "Credits", icon: CreditCard },
  { id: "dashboards", label: "Dashboards", icon: Globe },
  { id: "security", label: "Security", icon: Shield },
  { id: "logs", label: "Logs", icon: FileText },
  { id: "failures", label: "Failures", icon: AlertTriangle },
];

// Status indicator component
function StatusLamp({ healthy = true }: { healthy?: boolean }) {
  return (
    <div className={`w-2.5 h-2.5 rounded-full ${healthy ? "bg-green-400" : "bg-red-400"}`} />
  );
}

// Grouped List Component with Expand/Collapse
function GroupedList({ 
  items, 
  groupBy, 
  getGroupKey, 
  getGroupLabel,
  renderItem,
  emptyMessage = "No items found"
}: { 
  items: any[]; 
  groupBy: string;
  getGroupKey: (item: any) => string;
  getGroupLabel?: (key: string, count: number) => string;
  renderItem: (item: any, index: number) => React.ReactNode;
  emptyMessage?: string;
}) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const groups = items.reduce((acc, item) => {
    const key = getGroupKey(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, any[]>);
  
  const toggleGroup = (key: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedGroups(newExpanded);
  };
  
  const expandAll = () => setExpandedGroups(new Set(Object.keys(groups)));
  const collapseAll = () => setExpandedGroups(new Set());
  
  if (items.length === 0) {
    return <p className="text-center py-8" style={{ color: COLORS.dimmed }}>{emptyMessage}</p>;
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono" style={{ color: COLORS.dimmed }}>
          {Object.keys(groups).length} groups, {items.length} total
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={expandAll}
            className="text-xs px-2 py-1 rounded font-mono"
            style={{ background: `${COLORS.cyan}20`, color: COLORS.cyan }}
          >
            Expand All
          </button>
          <button 
            onClick={collapseAll}
            className="text-xs px-2 py-1 rounded font-mono"
            style={{ background: `${COLORS.indigo}20`, color: COLORS.indigoLight }}
          >
            Collapse All
          </button>
        </div>
      </div>
      
      {Object.entries(groups).map(([key, groupItems]) => {
        const isExpanded = expandedGroups.has(key);
        const label = getGroupLabel ? getGroupLabel(key, groupItems.length) : `${key} (${groupItems.length})`;
        
        return (
          <div key={key} className="rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
            <button
              onClick={() => toggleGroup(key)}
              className="w-full flex items-center justify-between p-3 text-left"
              style={{ background: COLORS.cardHover }}
            >
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" style={{ color: COLORS.cyan }} />
                ) : (
                  <ChevronRight className="w-4 h-4" style={{ color: COLORS.dimmed }} />
                )}
                <span className="font-mono text-sm" style={{ color: isExpanded ? COLORS.cyan : COLORS.muted }}>
                  {label}
                </span>
              </div>
              <span 
                className="text-xs px-2 py-0.5 rounded-full font-mono"
                style={{ background: isExpanded ? `${COLORS.cyan}20` : `${COLORS.indigo}20`, color: isExpanded ? COLORS.cyan : COLORS.indigoLight }}
              >
                {groupItems.length}
              </span>
            </button>
            
            {isExpanded && (
              <div className="p-2 space-y-1" style={{ background: COLORS.card }}>
                {groupItems.map((item, idx) => renderItem(item, idx))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Agents Tab with Filter, Sort, and Group
function AgentsTabContent({ agents }: { agents: any[] }) {
  const [filterActive, setFilterActive] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [groupBy, setGroupBy] = useState<string>("none");

  let filtered = (agents || []).filter(a => {
    if (filterActive === "active") return a.active;
    if (filterActive === "paused") return !a.active;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "name") return (a.name || `Agent`).localeCompare(b.name || `Agent`);
    if (sortBy === "method") return (a.delivery_method || "").localeCompare(b.delivery_method || "");
    return 0;
  });

  const renderAgent = (agent: any, i: number) => (
    <div key={agent.id} className="p-3 rounded" style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusLamp healthy={agent.active} />
          <span className="font-mono text-sm">{agent.name || `Agent ${i + 1}`}</span>
        </div>
        <span className="text-xs font-mono" style={{ color: COLORS.dimmed }}>
          {agent.delivery_method || "none"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h3 className="font-heading text-lg" style={{ color: COLORS.cyan }}>Agent Queue ({filtered.length})</h3>
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={filterActive} 
            onChange={e => setFilterActive(e.target.value)}
            className="bg-transparent border rounded px-2 py-1 text-sm font-mono outline-none"
            style={{ borderColor: COLORS.border, color: COLORS.cyan }}
          >
            <option value="all" className="bg-gray-900">All Status</option>
            <option value="active" className="bg-gray-900">Active</option>
            <option value="paused" className="bg-gray-900">Paused</option>
          </select>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="bg-transparent border rounded px-2 py-1 text-sm font-mono outline-none"
            style={{ borderColor: COLORS.border, color: COLORS.cyan }}
          >
            <option value="name" className="bg-gray-900">Sort: Name</option>
            <option value="method" className="bg-gray-900">Sort: Method</option>
          </select>
          <select 
            value={groupBy} 
            onChange={e => setGroupBy(e.target.value)}
            className="bg-transparent border rounded px-2 py-1 text-sm font-mono outline-none"
            style={{ borderColor: COLORS.border, color: COLORS.cyan }}
          >
            <option value="none" className="bg-gray-900">Group: None</option>
            <option value="status" className="bg-gray-900">Group: Status</option>
            <option value="method" className="bg-gray-900">Group: Method</option>
          </select>
        </div>
      </div>
      
      {groupBy === "none" ? (
        <div className="space-y-2">
          {filtered.map((agent, i) => renderAgent(agent, i))}
          {filtered.length === 0 && <p className="text-center py-8" style={{ color: COLORS.dimmed }}>No agents found</p>}
        </div>
      ) : (
        <GroupedList
          items={filtered}
          groupBy={groupBy}
          getGroupKey={(a) => groupBy === "status" ? (a.active ? "Active" : "Paused") : (a.delivery_method || "None")}
          getGroupLabel={(key, count) => `${key} (${count})`}
          renderItem={renderAgent}
        />
      )}
    </div>
  );
}

// Services Tab with Filter, Sort, and Group
function ServicesTabContent({ services }: { services: any[] }) {
  const [filterHealth, setFilterHealth] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [groupBy, setGroupBy] = useState<string>("none");

  let filtered = (services || []).filter(s => {
    if (filterHealth === "healthy") return s.healthy;
    if (filterHealth === "unhealthy") return !s.healthy;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "name") return (a.label || "").localeCompare(b.label || "");
    if (sortBy === "protocol") return (a.protocol || "").localeCompare(b.protocol || "");
    return 0;
  });

  const renderService = (svc: any) => (
    <div key={svc.id} className="p-3 rounded" style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusLamp healthy={svc.healthy} />
          <span className="font-mono text-sm">{svc.label}</span>
        </div>
        <span className="text-xs font-mono" style={{ color: COLORS.dimmed }}>{svc.protocol}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h3 className="font-heading text-lg" style={{ color: COLORS.cyan }}>Services ({filtered.length})</h3>
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={filterHealth} 
            onChange={e => setFilterHealth(e.target.value)}
            className="bg-transparent border rounded px-2 py-1 text-sm font-mono outline-none"
            style={{ borderColor: COLORS.border, color: COLORS.cyan }}
          >
            <option value="all" className="bg-gray-900">All Health</option>
            <option value="healthy" className="bg-gray-900">Healthy</option>
            <option value="unhealthy" className="bg-gray-900">Unhealthy</option>
          </select>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="bg-transparent border rounded px-2 py-1 text-sm font-mono outline-none"
            style={{ borderColor: COLORS.border, color: COLORS.cyan }}
          >
            <option value="name" className="bg-gray-900">Sort: Name</option>
            <option value="protocol" className="bg-gray-900">Sort: Protocol</option>
          </select>
          <select 
            value={groupBy} 
            onChange={e => setGroupBy(e.target.value)}
            className="bg-transparent border rounded px-2 py-1 text-sm font-mono outline-none"
            style={{ borderColor: COLORS.border, color: COLORS.cyan }}
          >
            <option value="none" className="bg-gray-900">Group: None</option>
            <option value="status" className="bg-gray-900">Group: Status</option>
            <option value="protocol" className="bg-gray-900">Group: Protocol</option>
          </select>
        </div>
      </div>
      
      {groupBy === "none" ? (
        <div className="space-y-2">
          {filtered.map(svc => renderService(svc))}
          {filtered.length === 0 && <p className="text-center py-8" style={{ color: COLORS.dimmed }}>No services found</p>}
        </div>
      ) : (
        <GroupedList
          items={filtered}
          groupBy={groupBy}
          getGroupKey={(s) => groupBy === "status" ? (s.healthy ? "Healthy" : "Unhealthy") : (s.protocol || "Unknown")}
          getGroupLabel={(key, count) => `${key} (${count})`}
          renderItem={renderService}
        />
      )}
    </div>
  );
}

// Dashboards/Routes Tab with Filter, Sort, and Group
function DashboardsTabContent({ routes }: { routes: any[] }) {
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("path");
  const [groupBy, setGroupBy] = useState<string>("none");

  let filtered = (routes || []).filter(r => {
    if (filterType === "page") return r.route_type === "page";
    if (filterType === "api") return r.route_type === "api";
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "path") return (a.path || "").localeCompare(b.path || "");
    if (sortBy === "type") return (a.route_type || "").localeCompare(b.route_type || "");
    return 0;
  });

  const renderRoute = (route: any) => (
    <a key={route.path} href={route.path} className="block p-3 rounded" style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm" style={{ color: COLORS.cyan }}>{route.path}</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${COLORS.indigo}20`, color: COLORS.indigoLight }}>
          {route.route_type}
        </span>
      </div>
    </a>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h3 className="font-heading text-lg" style={{ color: COLORS.cyan }}>Dashboards & Routes ({filtered.length})</h3>
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="bg-transparent border rounded px-2 py-1 text-sm font-mono outline-none"
            style={{ borderColor: COLORS.border, color: COLORS.cyan }}
          >
            <option value="all" className="bg-gray-900">All Types</option>
            <option value="page" className="bg-gray-900">Pages</option>
            <option value="api" className="bg-gray-900">APIs</option>
          </select>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="bg-transparent border rounded px-2 py-1 text-sm font-mono outline-none"
            style={{ borderColor: COLORS.border, color: COLORS.cyan }}
          >
            <option value="path" className="bg-gray-900">Sort: Path</option>
            <option value="type" className="bg-gray-900">Sort: Type</option>
          </select>
          <select 
            value={groupBy} 
            onChange={e => setGroupBy(e.target.value)}
            className="bg-transparent border rounded px-2 py-1 text-sm font-mono outline-none"
            style={{ borderColor: COLORS.border, color: COLORS.cyan }}
          >
            <option value="none" className="bg-gray-900">Group: None</option>
            <option value="type" className="bg-gray-900">Group: Type</option>
          </select>
        </div>
      </div>
      
      {groupBy === "none" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(route => renderRoute(route))}
          {filtered.length === 0 && <p className="col-span-full text-center py-8" style={{ color: COLORS.dimmed }}>No routes found</p>}
        </div>
      ) : (
        <GroupedList
          items={filtered}
          groupBy={groupBy}
          getGroupKey={(r) => r.route_type === "page" ? "Pages" : "APIs"}
          getGroupLabel={(key, count) => `${key} (${count})`}
          renderItem={renderRoute}
        />
      )}
    </div>
  );
}

// Main Control Deck Component
export default function ZoControlDeck() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [stats, services, agents, credits, routes] = await Promise.all([
        fetch("/api/system-stats").then(r => r.json()).catch(() => null),
        fetch("/api/services").then(r => r.json()).catch(() => null),
        fetch("/api/agents").then(r => r.json()).catch(() => null),
        fetch("/api/credits").then(r => r.json()).catch(() => null),
        fetch("/api/sites").then(r => r.json()).catch(() => null),
      ]);
      setData({ stats, services: services?.services || [], agents: agents?.agents || [], credits: credits?.credits || null, routes: routes?.routes || [] });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 30000);
    return () => clearInterval(timer);
  }, [fetchData]);

  const { stats, services, agents, credits, routes } = data;
  const activeCount = agents?.filter((a: any) => a.active).length || 0;
  const totalCount = agents?.length || 0;
  const svcHealthy = services?.filter((s: any) => s.healthy).length || 0;
  const svcTotal = services?.length || 0;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-t-cyan-400 border-gray-700 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono text-sm" style={{ color: COLORS.muted }}>Loading...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              label="Active Agents" 
              value={`${activeCount}/${totalCount}`} 
              sub="routines" 
              onClick={() => setActiveTab("agents")}
            />
            <StatCard 
              label="Services" 
              value={`${svcHealthy}/${svcTotal}`} 
              sub="online"
              onClick={() => setActiveTab("services")}
            />
            <StatCard 
              label="Routes" 
              value={routes?.length || 0} 
              sub="published"
              onClick={() => setActiveTab("dashboards")}
            />
            <StatCard 
              label="Credits" 
              value={credits?.balance?.toLocaleString() || "—"} 
              sub="balance"
              onClick={() => setActiveTab("credits")}
            />
          </div>
        );
      case "agents":
        return <AgentsTabContent agents={agents} />;
      case "services":
        return <ServicesTabContent services={services} />;
      case "credits":
        return (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>Balance</p>
              <p className="text-3xl font-heading font-bold" style={{ color: COLORS.cyan }}>
                {credits?.balance?.toLocaleString() || "—"}
              </p>
            </div>
            <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>7-Day Burn</p>
              <p className="text-3xl font-heading font-bold" style={{ color: COLORS.indigo }}>
                {credits?.burn_7d || "—"}
              </p>
            </div>
            <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>Reserve (USD)</p>
              <p className="text-3xl font-heading font-bold">
                ${((credits?.reserve_usd) || 0).toFixed(2)}
              </p>
            </div>
          </div>
        );
      case "dashboards":
        return <DashboardsTabContent routes={routes} />;
      case "security":
        return (
          <div className="space-y-4">
            <h3 className="font-heading text-lg mb-4" style={{ color: COLORS.cyan }}>Security Overview</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>Audit Events</p>
                <p className="text-3xl font-heading font-bold" style={{ color: COLORS.cyan }}>0</p>
                <p className="text-xs font-mono mt-1" style={{ color: COLORS.dimmed }}>Last 24 hours</p>
              </div>
              <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>Auth Events</p>
                <p className="text-3xl font-heading font-bold" style={{ color: COLORS.indigo }}>0</p>
                <p className="text-xs font-mono mt-1" style={{ color: COLORS.dimmed }}>Login attempts</p>
              </div>
              <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>Rejected</p>
                <p className="text-3xl font-heading font-bold" style={{ color: "#ef4444" }}>0</p>
                <p className="text-xs font-mono mt-1" style={{ color: COLORS.dimmed }}>Failed requests</p>
              </div>
            </div>
            <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <p className="text-sm font-mono mb-4" style={{ color: COLORS.muted }}>Security Status: All systems secure</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-mono" style={{ color: COLORS.cyan }}>Monitoring active</span>
              </div>
            </div>
          </div>
        );
      case "logs":
        return (
          <div className="space-y-4">
            <h3 className="font-heading text-lg mb-4" style={{ color: COLORS.cyan }}>System Logs</h3>
            <div className="p-4 rounded-lg font-mono text-xs overflow-x-auto" style={{ background: "#000", border: `1px solid ${COLORS.border}` }}>
              <div className="space-y-1" style={{ color: COLORS.muted }}>
                <p><span style={{ color: COLORS.dimmed }}>[06:13:32]</span> <span style={{ color: "#22c55e" }}>INFO</span> supervisord started with pid 120</p>
                <p><span style={{ color: COLORS.dimmed }}>[06:13:33]</span> <span style={{ color: "#22c55e" }}>INFO</span> spawned mengram-api with pid 126</p>
                <p><span style={{ color: COLORS.dimmed }}>[06:13:38]</span> <span style={{ color: "#22c55e" }}>INFO</span> mengram-api entered RUNNING state</p>
                <p><span style={{ color: COLORS.dimmed }}>[06:13:42]</span> <span style={{ color: "#eab308" }}>WARN</span> route cache miss for /api/credits</p>
                <p><span style={{ color: COLORS.dimmed }}>[06:13:45]</span> <span style={{ color: "#22c55e" }}>INFO</span> GET /api/system-stats 200 OK (12ms)</p>
                <p><span style={{ color: COLORS.dimmed }}>[06:13:46]</span> <span style={{ color: "#22c55e" }}>INFO</span> GET /api/agents 200 OK (8ms)</p>
                <p><span style={{ color: COLORS.dimmed }}>[06:13:47]</span> <span style={{ color: "#22c55e" }}>INFO</span> GET /api/credits 200 OK (6ms)</p>
              </div>
            </div>
          </div>
        );
      case "failures":
        return (
          <div className="space-y-4">
            <h3 className="font-heading text-lg mb-4" style={{ color: COLORS.cyan }}>Failure Monitor</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>Total Incidents</p>
                <p className="text-3xl font-heading font-bold">0</p>
              </div>
              <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>Critical</p>
                <p className="text-3xl font-heading font-bold" style={{ color: "#ef4444" }}>0</p>
              </div>
              <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>High</p>
                <p className="text-3xl font-heading font-bold" style={{ color: "#f59e0b" }}>0</p>
              </div>
              <div className="p-6 rounded-lg" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>Medium</p>
                <p className="text-3xl font-heading font-bold">0</p>
              </div>
            </div>
            <div className="p-6 rounded-lg text-center" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <p className="text-sm font-mono" style={{ color: COLORS.muted }}>No active incidents. All systems operational.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <p className="font-mono" style={{ color: COLORS.dimmed }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab - coming soon</p>
          </div>
        );
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .font-heading { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .glass { background: rgba(15,17,23,0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen text-white font-body" style={{ background: COLORS.bg }}>
        {/* Header */}
        <header className="sticky top-0 z-50 glass">
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.indigo})` }}>
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-semibold">Control Deck</span>
            </div>

            {/* Nav */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 hide-scrollbar">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-mono tracking-wider transition-all"
                    style={{
                      background: activeTab === tab.id ? `${COLORS.cyan}15` : "transparent",
                      color: activeTab === tab.id ? COLORS.cyan : COLORS.muted,
                      border: `1px solid ${activeTab === tab.id ? COLORS.cyan + "30" : "transparent"}`,
                    }}>
                    <Icon className="w-4 h-4 inline mr-1.5" />
                    {tab.label.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {renderContent()}
        </main>
      </div>
    </>
  );
}

function StatCard({ label, value, sub, onClick }: { label: string; value: string | number; sub: string; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-lg ${onClick ? 'cursor-pointer hover:brightness-110' : ''}`}
      style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
      <p className="text-xs font-mono tracking-wider uppercase mb-2" style={{ color: COLORS.dimmed }}>{label}</p>
      <p className="text-3xl font-heading font-bold mb-1" style={{ color: COLORS.cyan }}>{value}</p>
      <p className="text-xs font-mono" style={{ color: COLORS.dimmed }}>{sub}</p>
    </div>
  );
}