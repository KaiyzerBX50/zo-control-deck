import type { Context } from "hono";

export default (c: Context) => {
  return c.json({ 
    plan: { name: "Pro", price: 20, credits_included: 500, credits_used: 187, credits_remaining: 313 },
    dailyUsage: [
      { date: "2026-03-11", credits: 18 }, { date: "2026-03-10", credits: 24 },
      { date: "2026-03-09", credits: 15 }, { date: "2026-03-08", credits: 21 },
      { date: "2026-03-07", credits: 19 },
    ],
    modelBreakdown: [
      { model: "openrouter:minimax", credits: 89, percentage: 47.6 },
      { model: "openai:gpt-5.4", credits: 62, percentage: 33.2 },
      { model: "anthropic:claude", credits: 36, percentage: 19.2 },
    ],
    note: "SIMULATED DATA - Connect to Zo Billing API for real usage data",
    data_source: "demo",
  });
};
