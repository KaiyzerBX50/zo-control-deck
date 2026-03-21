import type { Context } from "hono";

type RouteRecord = {
  path: string;
  type: string;
  status?: string;
  public?: boolean;
};

async function fetchJson(url: string) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export default async (c: Context) => {
  try {
    const host = c.req.header("host");
    if (!host) {
      return c.json({ routes: [], data_source: "REQUEST_HOST_MISSING" }, 400);
    }

    const origin = `https://${host}`;
    const data = await fetchJson(`${origin}/api/status`);

    const routes: RouteRecord[] = Array.isArray(data?.routes)
      ? data.routes
      : [];

    return c.json({
      routes,
      stats: {
        total: routes.length,
        pages: routes.filter((r) => r.type === "page").length,
        apis: routes.filter((r) => r.type === "api").length,
      },
      data_source: "SELF_REPORTED_ROUTE_INDEX",
      note: "Uses the installer's own route index response",
      last_updated: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({
      routes: [],
      data_source: "ERROR",
      error: error instanceof Error ? error.message : "Failed to read dashboards",
      last_updated: new Date().toISOString(),
    }, 500);
  }
};