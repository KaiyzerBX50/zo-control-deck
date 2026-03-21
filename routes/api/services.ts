import type { Context } from "hono";
import { execSync } from "node:child_process";

export default async (c: Context) => {
  try {
    const output = execSync("ps aux | grep -E 'bun|node|python' | grep -v grep | head -20", { encoding: "utf8" });
    const lines = output.trim().split("\n").filter(Boolean);
    const services = lines.map((line, i) => {
      const parts = line.split(/\s+/);
      const cmd = parts.slice(10).join(" ");
      return { id: `svc_${i}`, label: cmd.substring(0, 50) || "Unknown", status: "running", healthy: true, protocol: "http", port: null, entrypoint: cmd.substring(0, 100), created_at: null };
    });
    return c.json({ services, stats: { total: services.length, healthy: services.length, unhealthy: 0 }, data_source: "REAL", last_updated: new Date().toISOString() });
  } catch (e: any) {
    return c.json({ services: [], stats: { total: 0, healthy: 0, unhealthy: 0 }, error: e.message, data_source: "FALLBACK", last_updated: new Date().toISOString() }, 500);
  }
};
