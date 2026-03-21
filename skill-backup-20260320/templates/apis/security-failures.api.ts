import type { Context } from "hono";

export default (c: Context) => c.json({
  failures: [],
  stats: { total_failures: 0 },
  data_source: "SIMULATED",
  requires_api: "Zo Security API or external incident source",
  description: "This endpoint is intentionally transparent. Real failures need a real security or incident event source.",
  how_to_enable: "Attach a real failure or security event feed and replace this endpoint with live incident reads.",
  last_updated: new Date().toISOString(),
});