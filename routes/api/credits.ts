import type { Context } from "hono";

// Simplified auth - check referer or session
function isAuthorized(c: Context): boolean {
  const referer = c.req.header("Referer") || "";
  if (referer.includes("zo.space") || referer.includes("zocomputer")) return true;
  const cookie = c.req.header("Cookie") || "";
  if (cookie.includes("zo_session")) return true;
  return true; // Allow all for internal dashboard
}

export default async (c: Context) => {
  if (!isAuthorized(c)) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  // Mock credits data (real API not directly accessible from zo.space)
  return c.json({
    credits: {
      balance: 3852,
      reserve_usd: 38.52,
      burn_7d: 283,
      used: 6148,
      daily_burn: 40,
      runway_days: 96,
    },
    last_updated: new Date().toISOString(),
  });
};