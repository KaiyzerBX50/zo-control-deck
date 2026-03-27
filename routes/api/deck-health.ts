import type { Context } from "hono";
import { execSync } from "node:child_process";

async function ping(port: number, ms = 3000): Promise<{ ok: boolean; lat: number }> {
  const t = Date.now();
  try {
    const ac = new AbortController();
    const id = setTimeout(() => ac.abort(), ms);
    const r = await fetch(`http://localhost:${port}`, { signal: ac.signal, method: "GET", redirect: "follow" });
    clearTimeout(id);
    return { ok: r.status < 500, lat: Date.now() - t };
  } catch {
    return { ok: false, lat: Date.now() - t };
  }
}

export default async (c: Context) => {
  let registeredServices: Array<{ label: string; port: number; http_url?: string }> = [];
  try {
    const res = await fetch("http://localhost:41193/api/services");
    if (res.ok) registeredServices = await res.json();
  } catch {}

  const results = await Promise.all(
    registeredServices.map(async (s) => {
      const h = await ping(s.port);
      return {
        name: s.label,
        category: "Local Services",
        status: h.ok ? "Operational" as const : "Outage" as const,
        details: h.ok ? `${h.lat}ms latency` : "Service unreachable",
        port: s.port,
        url: s.http_url || "",
      };
    })
  );

  results.push({
    name: "Zo Space",
    category: "Platform",
    status: "Operational",
    details: "Serving this page",
    port: 3099,
    url: "",
  });

  let bootTime = "Unknown";
  try {
    bootTime = execSync("uptime -s", { encoding: "utf-8" }).trim();
  } catch {}

  return c.json({ services: results, bootTime });
};
