import type { Context } from "hono";
import { readdirSync, readFileSync, statSync } from "node:fs";
export default async (c: Context) => {
  try {
    const dir = "/dev/shm";
    const files = readdirSync(dir).filter(f => f.endsWith(".log"));
    const logs: { file: string; sizeKb: number; lines: number; tail: string[] }[] = [];
    for (const f of files.slice(0, 20)) {
      try {
        const path = `${dir}/${f}`;
        const stat = statSync(path);
        const content = readFileSync(path, "utf-8");
        const allLines = content.split("\n").filter(Boolean);
        logs.push({ file: f, sizeKb: Math.round(stat.size / 1024), lines: allLines.length, tail: allLines.slice(-15) });
      } catch {}
    }
    return c.json({ logs, totalFiles: files.length });
  } catch (e) { return c.json({ error: String(e) }, 500); }
};
