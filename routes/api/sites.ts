import type { Context } from "hono";

export default (c: Context) => {
  return c.json({
    routes: [
      { path: "/", type: "page", public: true, created_at: "2026-01-15T12:00:00Z", last_modified: "2026-03-10T14:30:00Z", requests_24h: 342, avg_response_ms: 45, status: "active" },
      { path: "/dashboard", type: "page", public: false, created_at: "2026-03-11T20:00:00Z", last_modified: "2026-03-11T23:30:00Z", requests_24h: 28, avg_response_ms: 120, status: "active" },
      { path: "/api/system-stats", type: "api", public: true, created_at: "2026-03-11T20:00:00Z", last_modified: "2026-03-11T20:00:00Z", requests_24h: 892, avg_response_ms: 12, status: "active" },
      { path: "/api/services", type: "api", public: true, created_at: "2026-03-11T21:00:00Z", last_modified: "2026-03-11T21:00:00Z", requests_24h: 156, avg_response_ms: 8, status: "active" },
      { path: "/api/agents", type: "api", public: true, created_at: "2026-03-11T21:00:00Z", last_modified: "2026-03-11T21:00:00Z", requests_24h: 234, avg_response_ms: 15, status: "active" },
      { path: "/api/billing", type: "api", public: true, created_at: "2026-03-11T22:00:00Z", last_modified: "2026-03-11T22:00:00Z", requests_24h: 78, avg_response_ms: 22, status: "active" },
      { path: "/api/audit", type: "api", public: true, created_at: "2026-03-11T23:00:00Z", last_modified: "2026-03-11T23:00:00Z", requests_24h: 45, avg_response_ms: 18, status: "active" },
      { path: "/blog", type: "page", public: true, created_at: "2026-02-20T10:00:00Z", last_modified: "2026-03-05T16:00:00Z", requests_24h: 567, avg_response_ms: 85, status: "active" },
      { path: "/projects", type: "page", public: true, created_at: "2026-02-01T08:00:00Z", last_modified: "2026-03-08T11:00:00Z", requests_24h: 234, avg_response_ms: 65, status: "active" },
    ],
    assets: [],
    stats: { total_routes: 9, pages: 4, apis: 5, public_routes: 8, total_requests_24h: 2576, avg_response_ms: 43, assets: 0, asset_bandwidth_mb: 0 },
    trafficByHour: [],
  });
};