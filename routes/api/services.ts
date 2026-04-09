import type { Context } from "hono";
import { readFileSync } from "node:fs";
import { createConnection } from "node:net";

const SUPERVISOR_CONF = "/etc/zo/supervisord-user.conf";
const SKIP_PREFIXES = ["frpc-"];

interface ServiceInfo {
  id: string;
  label: string;
  healthy: boolean;
  protocol: string;
  port: number | null;
  entrypoint: string | null;
  created_at: string | null;
  workdir: string | null;
}

function parseConfig(): { name: string; command: string; directory: string; port: number | null }[] {
  try {
    const raw = readFileSync(SUPERVISOR_CONF, "utf-8");
    const sections: { name: string; command: string; directory: string; port: number | null }[] = [];
    let current: any = null;
    for (const line of raw.split("\n")) {
      const programMatch = line.match(/^\[program:(.+)\]$/);
      if (programMatch) {
        if (current) sections.push(current);
        current = { name: programMatch[1], command: "", directory: "", port: null };
        continue;
      }
      if (!current) continue;
      if (line.startsWith("command=")) current.command = line.slice(8).trim();
      if (line.startsWith("directory=")) current.directory = line.slice(10).trim();
      if (line.startsWith("environment=")) {
        const portMatch = line.match(/PORT="(\d+)"/);
        if (portMatch) current.port = parseInt(portMatch[1]);
      }
    }
    if (current) sections.push(current);
    return sections.filter(s => !SKIP_PREFIXES.some(p => s.name.startsWith(p)));
  } catch {
    return [];
  }
}

function checkPort(port: number, timeout = 1500): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = createConnection({ port, host: "127.0.0.1" }, () => {
      sock.destroy();
      resolve(true);
    });
    sock.on("error", () => resolve(false));
    sock.setTimeout(timeout, () => { sock.destroy(); resolve(false); });
  });
}

const KNOWN_PORTS: Record<string, number> = {
  "astranode-v2": 55353,
  "cyberdj-frontend": 3000,
  "cyberdj-backend": 8011,
  "neonbreach": 3456,
};

export default async (c: Context) => {
  const programs = parseConfig();
  const services: ServiceInfo[] = [];
  for (const prog of programs) {
    const port = prog.port || KNOWN_PORTS[prog.name] || null;
    let healthy = false;
    if (port) healthy = await checkPort(port);
    services.push({
      id: `svc-${prog.name}`, label: prog.name, healthy, protocol: "http",
      port, entrypoint: prog.command || null, created_at: null, workdir: prog.directory || null,
    });
  }
  return c.json({
    services,
    stats: { total: services.length, healthy: services.filter(s => s.healthy).length, unhealthy: services.filter(s => !s.healthy).length },
    data_source: "LIVE_SUPERVISOR",
    timestamp: new Date().toISOString(),
  });
};
