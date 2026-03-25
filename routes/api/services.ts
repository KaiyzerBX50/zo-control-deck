import type { Context } from "hono";

// Returns user services from the Zo Computer API
export default async (c: Context) => {
  try {
    const response = await fetch("https://api.zo.computer/v1/services/list", {
      headers: {
        "Authorization": `Bearer ${process.env.ZO_CLIENT_IDENTITY_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const services = Array.isArray(data) ? data : data.services || [];
    
    return c.json({ 
      services,
      total: services.length,
      healthy: services.filter((s: any) => s.healthy).length
    });
  } catch (error) {
    return c.json({ 
      error: "Failed to fetch services",
      services: [],
      total: 0,
      healthy: 0
    }, 500);
  }
};
