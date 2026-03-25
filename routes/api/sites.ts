import type { Context } from "hono";

// Returns zo.space routes from the Zo Computer API
export default async (c: Context) => {
  try {
    const response = await fetch("https://api.zo.computer/v1/spaces/routes", {
      headers: {
        "Authorization": `Bearer ${process.env.ZO_CLIENT_IDENTITY_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const routes = Array.isArray(data) ? data : data.routes || [];
    
    return c.json({ 
      routes,
      total: routes.length,
      pages: routes.filter((r: any) => r.route_type === "page").length,
      apis: routes.filter((r: any) => r.route_type === "api").length
    });
  } catch (error) {
    return c.json({ 
      error: "Failed to fetch routes",
      routes: [],
      total: 0,
      pages: 0,
      apis: 0
    }, 500);
  }
};
