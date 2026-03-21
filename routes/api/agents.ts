import type { Context } from "hono";

export default async (c: Context) => {
  const agents = [
    {
      id: "d35c6bd8-d712-412f-a4a0-6ba212e9808f",
      name: "Generate DLP and DSPM Report",
      active: false,
      status: "inactive",
      schedule: "Daily at 11:00 AM",
      last_run: null,
      delivery_method: "sms",
    },
  ];

  return c.json({
    agents,
    stats: {
      total: agents.length,
      active: agents.filter((a) => a.active).length,
      inactive: agents.filter((a) => !a.active).length,
    },
    data_source: "STATIC",
    note: "Agent data is cached. For live updates, use the Zo app's Agents page.",
    last_updated: new Date().toISOString(),
  });
};
