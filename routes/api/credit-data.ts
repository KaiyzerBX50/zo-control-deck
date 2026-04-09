import type { Context } from "hono";
import { readFileSync, writeFileSync } from "node:fs";
const CREDITS_FILE = "/home/workspace/.zo-credits.json";
function readCreditsFile() {
  const raw = JSON.parse(readFileSync(CREDITS_FILE, "utf-8"));
  const config = raw.config || {};
  const dailyUsage: any[] = raw.daily_usage || [];
  const modelUsage: any[] = raw.model_usage || [];
  const balance = config.estimated_credits || config.credits_remaining || 0;
  const reserveUsd = config.balance_usd || 0;
  const burn7d = dailyUsage.slice(-7).reduce((s: number, d: any) => s + (d.credits || 0), 0);
  return { raw, credits: { balance, reserve_usd: Math.round(reserveUsd * 100) / 100, burn_7d: burn7d, used: config.credits_used || 0 }, daily_usage: dailyUsage, model_usage: modelUsage };
}
export default async (c: Context) => {
  if (c.req.method === "POST") {
    try {
      const body = await c.req.json();
      const newBalanceUsd = body.balance_usd;
      if (typeof newBalanceUsd !== "number" || newBalanceUsd < 0) return c.json({ error: "balance_usd must be a non-negative number" }, 400);
      const raw = JSON.parse(readFileSync(CREDITS_FILE, "utf-8"));
      raw.config.balance_usd = newBalanceUsd;
      raw.config.estimated_credits = Math.round(newBalanceUsd * 100);
      raw.config.credits_remaining = Math.round(newBalanceUsd * 100);
      raw.config.last_override = new Date().toISOString();
      writeFileSync(CREDITS_FILE, JSON.stringify(raw, null, 2), "utf-8");
      const updated = readCreditsFile();
      return c.json({ ...updated, data_source: "REAL_LOCAL_FILE", last_updated: new Date().toISOString() });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  }
  try {
    const data = readCreditsFile();
    return c.json({ ...data, data_source: "REAL_LOCAL_FILE", last_updated: new Date().toISOString() });
  } catch (e: any) { return c.json({ error: e.message, last_updated: new Date().toISOString() }, 500); }
};
