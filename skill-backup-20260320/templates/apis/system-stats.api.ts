import type { Context } from "hono";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

function readMemInfo() {
  const text = readFileSync("/proc/meminfo", "utf8");
  const values: Record<string, number> = {};
  for (const line of text.split("\n")) {
    const match = line.match(/^([^:]+):\s+(\d+)/);
    if (match) values[match[1]] = Number(match[2]);
  }
  return values;
}

export default (c: Context) => {
  const mem = readMemInfo();
  const total = (mem.MemTotal || 0) * 1024;
  const available = (mem.MemAvailable || mem.MemFree || 0) * 1024;
  const used = Math.max(0, total - available);

  const diskRaw = execSync("df -B1 / | tail -1", { encoding: "utf8" }).trim().split(/\s+/);
  const diskTotal = Number(diskRaw[1] || 0);
  const diskUsed = Number(diskRaw[2] || 0);
  const diskAvail = Number(diskRaw[3] || 0);

  const loadavg = readFileSync("/proc/loadavg", "utf8").trim().split(/\s+/);
  const cpuCount = Number(execSync("nproc", { encoding: "utf8" }).trim() || "1");
  const load1 = Number(loadavg[0] || 0);
  const uptimeText = readFileSync("/proc/uptime", "utf8").trim().split(/\s+/)[0] || "0";
  const uptimeSeconds = Number(uptimeText);

  return c.json({
    timestamp: new Date().toISOString(),
    memory: {
      total,
      used,
      available,
      percent: total ? Math.round((used / total) * 1000) / 10 : 0,
      totalGB: Math.round((total / 1024 / 1024 / 1024) * 100) / 100,
      usedGB: Math.round((used / 1024 / 1024 / 1024) * 100) / 100,
    },
    disk: {
      total: diskTotal,
      used: diskUsed,
      available: diskAvail,
      percent: diskTotal ? Math.round((diskUsed / diskTotal) * 1000) / 10 : 0,
      totalGB: Math.round((diskTotal / 1024 / 1024 / 1024) * 100) / 100,
      usedGB: Math.round((diskUsed / 1024 / 1024 / 1024) * 100) / 100,
    },
    cpu: {
      load1,
      load5: Number(loadavg[1] || 0),
      load15: Number(loadavg[2] || 0),
      cpuCount,
      percent: cpuCount ? Math.round((load1 / cpuCount) * 1000) / 10 : 0,
    },
    uptime: {
      seconds: uptimeSeconds,
      hours: Math.round((uptimeSeconds / 3600) * 10) / 10,
      days: Math.round((uptimeSeconds / 86400) * 10) / 10,
    },
  });
};