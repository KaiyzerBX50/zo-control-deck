---
name: zo-control-deck
description: Multi-tab sci-fi operations dashboard for Zo Space. 8 themed tabs (Star Trek LCARS, Star Wars, Alien, Blade Runner, TRON, HAL 9000, Matrix, Star Wars Red Alert) monitoring services, agents, credits, routes, logs, and system status from your own environment. Includes live health checks, real log tailing, and a manual "Ask Zo to Fix" diagnose button (only uses credits when you click it). Zero dependencies, private by default.
compatibility: Created for Zo Computer
metadata:
  author: dagawdnyc.zo.computer
  version: "3.0"
  themes: "LCARS, Star Wars, Alien Nostromo, Blade Runner, TRON, HAL 9000, Matrix, Red Alert"
---

## Install

Deploy all routes from `routes-manifest.json` to the user's zo.space.

1. Read `routes-manifest.json` for the list of routes
2. For each route, read the source file and deploy it using `update_space_route`
3. The page route `/zo-control-deck` should be deployed as `route_type: "page"` with `public: false`
4. All `/api/*` and `/deck/*` routes should be deployed as `route_type: "api"`

### Route files

| Route | Type | File | Purpose |
|---|---|---|---|
| `/zo-control-deck` | page (private) | `routes/pages/zo-control-deck.tsx` | Main dashboard UI |
| `/api/system-stats` | api | `routes/api/system-stats.ts` | CPU, memory, disk, uptime |
| `/api/services` | api | `routes/api/services.ts` | Registered user services |
| `/api/agents` | api | `routes/api/agents.ts` | Scheduled automations |
| `/api/credits` | api | `routes/api/credits.ts` | Credit balance and usage |
| `/api/sites` | api | `routes/api/sites.ts` | Zo Space routes |
| `/api/audit` | api | `routes/api/audit.ts` | Security audit |
| `/api/billing` | api | `routes/api/billing.ts` | Billing info |
| `/deck/health` | api | `routes/api/deck-health.ts` | Live health pings for all services |
| `/deck/logs` | api | `routes/api/deck-logs.ts` | Real log file tailing from /dev/shm |
| `/deck/diagnose` | api | `routes/api/deck-diagnose.ts` | Manual "Ask Zo to Fix" trigger (requires ZO_API_KEY) |

### Important notes

- **No cross-contamination**: Every data source reads from the installer's own environment (`localhost` APIs, `/dev/shm` logs, local filesystem). No data is shared between instances.
- **No automatic credit usage**: Viewing the dashboard costs zero credits. The only feature that uses credits is the "Ask Zo to Fix" button, which requires a manual click and a `ZO_API_KEY` secret.
- **The `/deck/*` routes are namespaced** to avoid conflicts with the `/api/*` wildcard catch-all that some users may have.
- All data is pulled from the user's own Zo Computer — services, agents, credits, logs, and stats are unique to each instance.

### Secrets (optional)

For the "Ask Zo to Fix" diagnose feature, the user needs:
- `ZO_API_KEY` — set in [Settings > Advanced](/?t=settings&s=advanced)

Without this key, the diagnose button will show an error. All other features work without any secrets.

### After install

Tell the user their dashboard is live at `https://<handle>.zo.space/zo-control-deck` and that it's private (only visible when logged in).
