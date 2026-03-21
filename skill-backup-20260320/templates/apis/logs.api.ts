import type { Context } from "hono";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const LOG_DIR = "/dev/shm";

function tailLines(text: string, n: number) {
  const lines = text.split("\n").filter(Boolean);
  return lines.slice(-n);
}

export default (c: Context) => {
  try {
    if (!existsSync(LOG_DIR)) {
      return c.json({ files: [], entries: [], data_source: "LOCAL_LOG_DIR_MISSING", requires_path: LOG_DIR }, 404);
    }

    const files = readdirSync(LOG_DIR)
      .filter((name) => name.endsWith(".log"))
      .slice(0, 20)
      .map((name) => {
        const full = join(LOG_DIR, name);
        const stat = statSync(full);
        const text = readFileSync(full, "utf8");
        return {
          name,
          path: full,
          size: stat.size,
          modified_at: new Date(stat.mtimeMs).toISOString(),
          tail: tailLines(text, 20),
        };
      });

    const entries = files.flatMap((file) =>
      file.tail.map((line) => ({
        source: file.name,
        line,
        level: /error/i.test(line) ? "error" : /warn/i.test(line) ? "warn" : "info",
      }))
    ).slice(-120);

    return c.json({
      files,
      entries,
      stats: {
        sources: files.length,
        warnings: entries.filter((e) => e.level === "warn").length,
        errors: entries.filter((e) => e.level === "error").length,
      },
      data_source: "REAL_LOCAL_LOGS",
      path: LOG_DIR,
      last_updated: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({
      error: error instanceof Error ? error.message : "Failed to read logs",
      data_source: "ERROR",
      path: LOG_DIR,
      last_updated: new Date().toISOString(),
    }, 500);
  }
};