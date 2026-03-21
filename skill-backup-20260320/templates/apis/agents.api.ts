import type { Context } from "hono";
import { list_agents } from "zo:agents";

export default async (c: Context) => {
  try {
    const agents = list_agents();
    
    const mapped = agents.map((agent: any) => ({
      id: agent.id || agent.agent_id || "unknown",
      name: agent.name || agent.label || "Unnamed Agent",
      active: agent.active ?? true,
      status: agent.status || (agent.active ? "active" : "inactive"),
      schedule: agent.schedule || agent.rrule || null,
      last_run: agent.last_run || agent.lastTriggered || null,
      delivery_method: agent.delivery_method || agent.delivery || null,
    }));

    return c.json({
      agents: mapped,
      stats: {
        total: mapped.length,
        active: mapped.filter((a: any) => a.active).length,
        inactive: mapped.filter((a: any) => !a.active).length,
      },
      data_source: "REAL",
      data_source_label: "Zo Agents API",
      last_updated: new Date().toISOString(),
    });
  } catch (e: any) {
    return c.json({
      agents: [],
      stats: { total: 0, active: 0, inactive: 0 },
      error: e.message || "Failed to fetch agents",
      data_source: "FALLBACK",
      data_source_label: "Zo Agents API unavailable",
      last_updated: new Date().toISOString(),
    }, 500);
  }
};
