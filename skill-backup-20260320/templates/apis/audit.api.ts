import type { Context } from "hono";

export default (c: Context) => c.json({
  events: [],
  stats: { total_events: 0 },
  data_source: "SIMULATED",
  requires_api: "Zo Audit API or custom audit event collection",
  description: "This endpoint is intentionally transparent. Real audit events need an audit event source.",
  how_to_enable: "Attach a real audit pipeline and replace this endpoint with live event reads.",
  last_updated: new Date().toISOString(),
});