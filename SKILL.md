---
name: zo-control-deck
description: Multi-tab sci-fi operations dashboard for Zo Space. 8 themed tabs (Star Trek LCARS, Star Wars, Alien, Blade Runner, TRON, HAL 9000, Matrix, Star Wars Red Alert) monitoring services, agents, credits, routes, logs, and system status from your own environment. Zero dependencies, private by default.
compatibility: Created for Zo Computer
metadata:
  author: dagawdnyc.zo.computer
  version: "2.0"
  themes: "LCARS, Star Wars, Alien Nostromo, Blade Runner, TRON, HAL 9000, Matrix, Red Alert"
---

## Install

Deploy all routes from `routes-manifest.json` to the user's zo.space.

1. Read `routes-manifest.json` for the list of routes
2. For each route, read the source file and deploy it using `update_space_route`
3. The page route `/zo-control-deck` should be deployed as `route_type: "page"` with `public: false`
4. All `/api/*` routes should be deployed as `route_type: "api"`

### Route files

| Route | Type | File |
|---|---|---|
| `/zo-control-deck` | page (private) | `routes/pages/zo-control-deck.tsx` |
| `/api/system-stats` | api | `routes/api/system-stats.ts` |
| `/api/services` | api | `routes/api/services.ts` |
| `/api/agents` | api | `routes/api/agents.ts` |
| `/api/credits` | api | `routes/api/credits.ts` |
| `/api/sites` | api | `routes/api/sites.ts` |
| `/api/audit` | api | `routes/api/audit.ts` |
| `/api/billing` | api | `routes/api/billing.ts` |

### After install

Tell the user their dashboard is live at `https://<handle>.zo.space/zo-control-deck` and that it's private (only visible when logged in).
