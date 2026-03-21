import type { Context } from "hono";
import { readFileSync } from "node:fs";

function currentMemoryUsedGB() {
  const text = readFileSync("/proc/meminfo", "utf8");
  const values: Record<string, number> = {};
  for (const line of text.split("\n")) {
    const match = line.match(/^([^:]+):\s+(\d+)/);
    if (match) values[match[1]] = Number(match[2]);
  }
  const total = values.MemTotal || 0;
  const available = values.MemAvailable || values.MemFree || 0;
  const usedKb = Math.max(0, total - available);
  return Math.round((usedKb / 1024 / 1024) * 10) / 10;
}

export default (c: Context) => {
  const now = Date.now();
  const memory = currentMemoryUsedGB();
  const history = Array.from({ length: 24 }, (_, i) => {
    const hoursAgo = 23 - i;
    const timestamp = new Date(now - hoursAgo * 60 * 60 * 1000).toISOString();
    const wave = Math.sin(i / 3) * 2;
    const cpu = Math.max(0, Math.round((4 + wave + (i % 4) * 0.7) * 10) / 10);
    return { timestamp, cpu, memory };
  });

  return c.json({
    history,
    data_source: "SIMULATED_HISTORICAL",
    requires_api: "Time-series metrics store, e.g. Prometheus, InfluxDB, Grafana Cloud, or Datadog",
    description: "Current values are real, but historical points are generated because persistent metrics are not stored by default.",
    how_to_enable: "Connect the dashboard to a real time-series backend and replace this endpoint with stored history.",
    last_updated: new Date().toISOString(),
  });
};