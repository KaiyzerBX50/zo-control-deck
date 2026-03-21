import type { Context } from "hono";
import { existsSync, readFileSync } from "node:fs";

const CREDITS_FILE = "/home/workspace/.zo-credits.json";

export default (c: Context) => {
  try {
    if (!existsSync(CREDITS_FILE)) {
      return c.json({
        data_source: "LOCAL_FILE_MISSING",
        requires_file: CREDITS_FILE,
        description: "Credits data file was not found in this workspace.",
        how_to_enable: "Create or sync your own .zo-credits.json in your workspace, then reload this endpoint.",
        credits: null,
        last_updated: new Date().toISOString(),
      }, 404);
    }

    const raw = JSON.parse(readFileSync(CREDITS_FILE, "utf8"));
    const balance = Number(raw?.balance ?? raw?.credits_balance ?? raw?.remaining ?? 0);
    const reserveUsd = Number(raw?.reserve_usd ?? raw?.usd_balance ?? raw?.balance_usd ?? balance / 100);
    const burn7d = Number(raw?.burn_7d ?? raw?.weekly_burn ?? 0);

    return c.json({
      credits: {
        balance,
        reserve_usd: Math.round(reserveUsd * 100) / 100,
        burn_7d: burn7d,
        raw,
      },
      data_source: "REAL_LOCAL_FILE",
      file: CREDITS_FILE,
      note: "Reads credits from the installer's own workspace file",
      last_updated: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({
      error: error instanceof Error ? error.message : "Failed to read credits file",
      data_source: "ERROR",
      file: CREDITS_FILE,
      last_updated: new Date().toISOString(),
    }, 500);
  }
};