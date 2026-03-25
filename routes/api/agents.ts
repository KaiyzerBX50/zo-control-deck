import type { Context } from "hono";

// Returns agents from the Zo Computer API
// Install this skill to see YOUR actual agents
export default async (c: Context) => {
  try {
    const response = await fetch("https://api.zo.computer/v1/agents/list", {
      headers: {
        "Authorization": `Bearer ${process.env.ZO_CLIENT_IDENTITY_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const agents = Array.isArray(data) ? data : data.agents || [];
    
    return c.json({ 
      agents,
      total: agents.length,
      active: agents.filter((a: any) => a.active).length
    });
  } catch (error) {
    return c.json({ 
      error: "Failed to fetch agents",
      agents: [],
      total: 0,
      active: 0
    }, 500);
  }
};
