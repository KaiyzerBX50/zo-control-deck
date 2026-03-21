import type { Context } from "hono";

export default (c: Context) => c.json({
  apis: [
    {
      endpoint: "/api/system-stats",
      name: "System Statistics",
      data_source: "REAL",
      description: "Reads live system metrics from the current environment",
    },
    {
      endpoint: "/api/services",
      name: "Hosted Services",
      data_source: "REAL",
      description: "Reads current hosted services for the installing member",
    },
    {
      endpoint: "/api/agents",
      name: "Scheduled Agents",
      data_source: "REAL",
      description: "Reads current scheduled agents for the installing member",
    },
    {
      endpoint: "/api/credits",
      name: "Credits",
      data_source: "REAL_OR_LOCAL_FILE",
      description: "Reads the installer's configured credits source",
    },
    {
      endpoint: "/api/dashboards",
      name: "Zo Space Routes",
      data_source: "REAL",
      description: "Reads the installer's own Zo Space routes",
    },
    {
      endpoint: "/api/logs",
      name: "Service Logs",
      data_source: "REAL",
      description: "Reads local logs from the environment where the dashboard runs",
    },
    {
      endpoint: "/api/metrics-history",
      name: "Historical Metrics",
      data_source: "SIMULATED_HISTORICAL",
      description: "Historical metrics require persistent storage",
      requires_api: "Time-series metrics store",
    },
    {
      endpoint: "/api/audit",
      name: "Audit Events",
      data_source: "SIMULATED",
      description: "Audit events require a real audit source",
      requires_api: "Zo Audit API or custom audit pipeline",
    },
    {
      endpoint: "/api/security-failures",
      name: "Security Failures",
      data_source: "SIMULATED",
      description: "Security failures require a real incident source",
      requires_api: "Zo Security API or external incident feed",
    },
  ],
  last_updated: new Date().toISOString(),
  dashboard_version: "1.0.0-beta",
  routes: [],
});