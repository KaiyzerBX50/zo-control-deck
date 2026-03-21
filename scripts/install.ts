#!/usr/bin/env bun
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const SKILL_ROOT = resolve(dirname(import.meta.path), "..");
const MANIFEST_PATH = resolve(SKILL_ROOT, "routes-manifest.json");

async function main() {
  console.log("\n⢕⣿⣏⣿⢳⡕⣆⢺⣋⢟  ZO CONTROL DECK INSTALLER\n");

  if (!existsSync(MANIFEST_PATH)) {
    console.error("ERROR: routes-manifest.json not found at", MANIFEST_PATH);
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  const routes = manifest.routes;
  let success = 0;
  let failed = 0;

  for (const route of routes) {
    const filePath = resolve(SKILL_ROOT, route.file);
    if (!existsSync(filePath)) {
      console.error(`  ✗ ${route.path} — file not found: ${route.file}`);
      failed++;
      continue;
    }

    const code = readFileSync(filePath, "utf8");
    console.log(`  → Installing ${route.path} (${route.type})...`);

    try {
      const resp = await fetch("http://localhost:3099/__space/update-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: route.path,
          route_type: route.type,
          code,
          public: route.public,
        }),
      });

      if (resp.ok) {
        console.log(`  ✓ ${route.path} installed`);
        success++;
      } else {
        const text = await resp.text();
        console.error(`  ✗ ${route.path} — ${resp.status}: ${text.slice(0, 200)}`);
        failed++;
      }
    } catch (err: any) {
      console.error(`  ✗ ${route.path} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${success} routes installed, ${failed} failed\n`);
  
  if (success > 0) {
    console.log("Dashboard is live at: https://<your-handle>.zo.space/zo-control-deck");
    console.log("The page is PRIVATE by default — only you can see it.\n");
  }
}

main();
