import type { Context } from "hono";
import { readFileSync, statSync } from "node:fs";
const AGENTS_FILE = "/home/workspace/.zo-agents.json";
export default async (c: Context) => {
  try {
    const raw = readFileSync(AGENTS_FILE, "utf-8");
    const agents = JSON.parse(raw);
    const stat = statSync(AGENTS_FILE);
    return c.json({ agents, stats: { total: agents.length, active: agents.filter((a: any) => a.active).length, inactive: agents.filter((a: any) => !a.active).length }, data_source: "SYNC_FILE", last_synced: stat.mtime.toISOString(), last_updated: new Date().toISOString() });
  } catch (e: any) {
    return c.json({ agents: [], stats: { total: 0, active: 0, inactive: 0 }, data_source: "ERROR", error: e.message, last_updated: new Date().toISOString() });
  }
};
