import type { Context } from "hono";
import { createConnection } from "node:net";
function checkPort(port: number, timeout = 2000): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = createConnection({ port, host: "127.0.0.1" }, () => { sock.destroy(); resolve(true); });
    sock.on("error", () => resolve(false));
    sock.setTimeout(timeout, () => { sock.destroy(); resolve(false); });
  });
}
const CHECKS = [
  { name: "Zo Space", port: 3099, category: "Core Platform" },
  { name: "astranode-v2", port: 55353, category: "User Service" },
  { name: "cyberdj-frontend", port: 3000, category: "User Service" },
  { name: "cyberdj-backend", port: 8011, category: "User Service" },
  { name: "neonbreach", port: 3456, category: "User Service" },
];
export default async (c: Context) => {
  const results = await Promise.all(CHECKS.map(async (check) => {
    const alive = await checkPort(check.port);
    return { name: check.name, status: alive ? "Operational" : "Down", category: check.category, port: check.port, details: alive ? `Responding on port ${check.port}` : `Not responding on port ${check.port}` };
  }));
  return c.json({ services: results, timestamp: new Date().toISOString() });
};
