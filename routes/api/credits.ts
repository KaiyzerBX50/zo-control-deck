import type { Context } from "hono";
import { existsSync, readFileSync } from "node:fs";

const CREDITS_FILE = "/home/workspace/.zo-credits.json";

export default (c: Context) => {
  try {
    if (!existsSync(CREDITS_FILE)) {
      return c.json({ data_source: "LOCAL_FILE_MISSING", credits: null, last_updated: new Date().toISOString() }, 404);
    }
    const raw = JSON.parse(readFileSync(CREDITS_FILE, "utf8"));
    const config = raw?.config || {};
    const balance = config.estimated_credits || config.credits_remaining || 0;
    const reserveUsd = config.balance_usd || 0;
    const used = config.credits_used || 0;
    const dailyUsage = raw?.daily_usage || [];
    const burn7d = dailyUsage.slice(-7).reduce((sum: number, d: any) => sum + (d.credits || 0), 0);
    return c.json({ credits: { balance, reserve_usd: Math.round(reserveUsd * 100) / 100, burn_7d: burn7d, used, raw: config }, data_source: "REAL_LOCAL_FILE", last_updated: new Date().toISOString() });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "Failed to read credits", last_updated: new Date().toISOString() }, 500);
  }
};
