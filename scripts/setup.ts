#!/usr/bin/env bun
/**
 * Zo Control Deck Setup Script
 * 
 * Installs the Zo Control Deck dashboard in YOUR zo.space.
 * All routes read from YOUR environment - no cross-contamination.
 * 
 * Usage: bun /home/workspace/Skills/zo-control-deck/scripts/setup.ts
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const SPACE_API = "http://localhost:3099";
const TEMPLATES_DIR = join(import.meta.dir, "..", "templates");

function readTemplate(filename: string): string {
  return readFileSync(join(TEMPLATES_DIR, filename), "utf8");
}

async function createRoute(path: string, routeType: "page" | "api", code: string, isPublic: boolean = false) {
  try {
    const response = await fetch(`${SPACE_API}/api/space/routes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        route_type: routeType,
        code,
        public: isPublic
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create ${path}: ${response.statusText}`);
    }
    
    console.log(`✓ Created ${path}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to create ${path}:`, error);
    return false;
  }
}

async function main() {
  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║         ZO CONTROL DECK - Installation Script              ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
  console.log("This will install the Zo Control Deck dashboard in YOUR zo.space.");
  console.log("All data will be read from YOUR environment - no cross-contamination.\n");

  // Create all API routes
  console.log("Creating API routes...\n");
  
  const apiRoutes = [
    { path: "/api/system-stats", file: "apis/system-stats.api.ts" },
    { path: "/api/services", file: "apis/services.api.ts" },
    { path: "/api/agents", file: "apis/agents.api.ts" },
    { path: "/api/credits", file: "apis/credits.api.ts" },
    { path: "/api/dashboards", file: "apis/dashboards.api.ts" },
    { path: "/api/logs", file: "apis/logs.api.ts" },
    { path: "/api/status", file: "apis/status.api.ts" },
    { path: "/api/audit", file: "apis/audit.api.ts" },
    { path: "/api/security-failures", file: "apis/security-failures.api.ts" },
    { path: "/api/metrics-history", file: "apis/metrics-history.api.ts" },
  ];

  for (const route of apiRoutes) {
    const code = readTemplate(route.file);
    await createRoute(route.path, "api", code, true);
  }

  // Create the main dashboard page
  console.log("\nCreating dashboard page route...\n");
  
  const dashboardCode = readTemplate("dashboard.page.tsx");
  await createRoute("/zcc", "page", dashboardCode, false);

  console.log("\n✓ Installation complete!");
  console.log("\nYour Zo Control Deck is now available at:");
  console.log("  → https://[your-handle].zo.space/zcc\n");
  console.log("The dashboard is private by default. To make it public:");
  console.log("  1. Go to your Space tab");
  console.log("  2. Find the /zcc route");
  console.log("  3. Toggle visibility to public\n");
}

main().catch(console.error);