import type { Context } from "hono";
import { readFileSync, statSync } from "node:fs";
const ROUTES_FILE = "/home/workspace/.zo-routes.json";
export default async (c: Context) => {
  try {
    const raw = readFileSync(ROUTES_FILE, "utf-8");
    const routes = JSON.parse(raw);
    const stat = statSync(ROUTES_FILE);
    return c.json({ routes, count: routes.length, data_source: "SYNC_FILE", last_synced: stat.mtime.toISOString() });
  } catch (e: any) {
    return c.json({ routes: [], count: 0, error: e.message });
  }
};
