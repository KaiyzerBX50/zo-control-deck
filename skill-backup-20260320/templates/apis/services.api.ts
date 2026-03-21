import type { Context } from "hono";
import { list_user_services } from "zo:services";

export default async (c: Context) => {
  try {
    const services = list_user_services();
    
    const mapped = services.map((svc: any) => ({
      id: svc.id || svc.service_id || "unknown",
      label: svc.label || svc.name || "Unnamed Service",
      status: svc.status || "unknown",
      healthy: svc.healthy ?? true,
      protocol: svc.protocol || "http",
      port: svc.port || null,
      entrypoint: svc.entrypoint || null,
      created_at: svc.created_at || null,
    }));

    return c.json({
      services: mapped,
      stats: {
        total: mapped.length,
        healthy: mapped.filter((s: any) => s.healthy).length,
        unhealthy: mapped.filter((s: any) => !s.healthy).length,
      },
      data_source: "REAL",
      data_source_label: "Zo Services API",
      last_updated: new Date().toISOString(),
    });
  } catch (e: any) {
    return c.json({
      services: [],
      stats: { total: 0, healthy: 0, unhealthy: 0 },
      error: e.message || "Failed to fetch services",
      data_source: "FALLBACK",
      data_source_label: "Zo Services API unavailable",
      last_updated: new Date().toISOString(),
    }, 500);
  }
};
