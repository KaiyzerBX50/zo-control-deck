import type { Context } from "hono";

export default async (c: Context) => {
  const service = await c.req.json();
  const apiKey = process.env.ZO_API_KEY;

  if (!apiKey) {
    return c.json({ error: "ZO_API_KEY is not configured in Settings > Advanced" }, 500);
  }

  const prompt = `A service on my Zo Computer is having issues. Please diagnose and attempt to fix it.

Service: ${service.name}
Status: ${service.status}
Details: ${service.details || "None"}
Port: ${service.port || "N/A"}

Please check the service logs at /dev/shm/, inspect the process, attempt a restart if needed, and send me a summary of what you found and any actions taken.`;

  fetch("https://api.zo.computer/zo/ask", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      input: prompt,
      model_name: "anthropic:claude-sonnet-4-20250514"
    }),
  }).catch(e => console.error("Diagnose error:", e));

  return c.json({ success: true, message: "Diagnosis requested — Zo is looking into it." });
};