# Zo Control Deck

A multi-tab operations dashboard for [Zo Computer](https://zocomputer.com) with 8 distinct sci-fi themed tabs, each pulling live data from your own environment.

![Star Trek LCARS](https://img.shields.io/badge/Overview-LCARS-F59E0B?style=flat-square) ![Star Wars](https://img.shields.io/badge/Services-Targeting_Computer-DC2626?style=flat-square) ![Alien](https://img.shields.io/badge/Agents-Nostromo-22C55E?style=flat-square) ![Blade Runner](https://img.shields.io/badge/Credits-Neon_Finance-EC4899?style=flat-square) ![TRON](https://img.shields.io/badge/Dashboards-TRON_Grid-22D3EE?style=flat-square) ![HAL 9000](https://img.shields.io/badge/Security-HAL_9000-DC2626?style=flat-square) ![Matrix](https://img.shields.io/badge/Logs-Matrix_Terminal-22C55E?style=flat-square) ![Red Alert](https://img.shields.io/badge/Failures-Red_Alert-DC2626?style=flat-square)

## What's New in v3.0

- **Live Health Checks** — Real-time ping status for every registered service
- **Real Log Tailing** — Logs tab pulls actual log files from `/dev/shm`, not simulated data
- **Ask Zo to Fix** — Manual button on degraded/outage services that triggers Zo to diagnose and repair (only uses credits when YOU click it)
- **`/deck/*` route namespace** — New APIs live under `/deck/` to avoid conflicts with `/api/*` wildcard catch-alls

## Tabs

| Tab | Theme | Data Source |
|---|---|---|
| **Overview** | Star Trek LCARS bridge | CPU, memory, disk, services, agents, credits |
| **Services** | Star Wars targeting computer | Live process list from your server |
| **Agents** | Alien Nostromo terminal | Scheduled agents and dispatch state |
| **Credits** | Blade Runner neon finance | Credit balance, burn rate, model drain |
| **Dashboards** | TRON Grid access deck | Published routes and space assets |
| **Security** | HAL 9000 observation console | Audit events (requires admin API) |
| **Logs** | Matrix terminal trace | Live log output from supervisord |
| **Failures** | Star Wars Red Alert board | Incident tracking (requires admin API) |

## Privacy — No Cross-Contamination

Every piece of data on this dashboard comes from **your own Zo Computer instance**:

- Services, agents, credits, routes → read from your local Zo APIs (`localhost`)
- Logs → tailed from `/dev/shm/*.log` on your server
- System stats → read from `/proc/meminfo`, `/proc/loadavg`, your filesystem
- Health checks → pings your own registered service ports
- Credit overrides → stored in your own `localStorage` and server-side `.zo-credits.json`

**Nothing is shared between instances.** If 100 people install this, each dashboard reads only from that person's environment. There are no external API calls, no shared databases, no telemetry.

## Install

> **Requires a [Zo Computer](https://zocomputer.com) account with zo.space access.**

### Option 1: Ask Zo to install it

Open a chat with Zo and say:

```
Install the zo-control-deck skill and deploy all routes
```

### Option 2: Manual install via Zo chat

1. Clone this repo into your workspace:
   ```
   cd /home/workspace/Skills
   git clone https://github.com/KaiyzerBX50/zo-control-deck.git
   ```

2. Ask Zo to run the skill:
   ```
   Run the zo-control-deck skill
   ```

   Zo will read `SKILL.md`, find the route files, and deploy them to your space.

### Option 3: Manual route deployment

Copy each file from `routes/` to your zo.space using `update_space_route`:

- `routes/pages/zo-control-deck.tsx` → page at `/zo-control-deck` (private)
- `routes/api/system-stats.ts` → API at `/api/system-stats`
- `routes/api/services.ts` → API at `/api/services`
- `routes/api/agents.ts` → API at `/api/agents`
- `routes/api/credits.ts` → API at `/api/credits`
- `routes/api/sites.ts` → API at `/api/sites`
- `routes/api/audit.ts` → API at `/api/audit`
- `routes/api/billing.ts` → API at `/api/billing`
- `routes/api/deck-health.ts` → API at `/deck/health`
- `routes/api/deck-logs.ts` → API at `/deck/logs`
- `routes/api/deck-diagnose.ts` → API at `/deck/diagnose`

## Secrets (Optional)

| Secret | Required? | Purpose |
|---|---|---|
| `ZO_API_KEY` | Optional | Powers the "Ask Zo to Fix" button. Without it, everything else works — you just can't trigger auto-diagnosis. Set in [Settings > Advanced](/?t=settings&s=advanced). |

## Ask Zo to Fix

When a service shows **Degraded** or **Outage** in the Live Health Check section (Services tab), an "Ask Zo to Fix" button appears. Clicking it:

1. Sends the service name/status to `/deck/diagnose`
2. That endpoint calls the Zo API with a diagnostic prompt
3. Zo investigates, attempts repair, and sends you a summary

**This is the ONLY feature that uses credits**, and only when you manually click the button. Viewing the dashboard is always free.

## Security

- The dashboard page (`/zo-control-deck`) is **private by default** — only you can see it when logged into your Zo Computer.
- All data comes from **your own environment** — no external APIs, no third-party services.
- API routes read from local system files (`/proc/meminfo`, `/proc/loadavg`, process list) and workspace files.
- No secrets or API keys are required.
- No data leaves your server.

## Architecture

- **Runtime**: Zo Space (Bun + Hono server + React + Tailwind CSS 4)
- **Font**: [Orbitron](https://fonts.google.com/specimen/Orbitron) (loaded via Google Fonts CDN)
- **Icons**: lucide-react (pre-installed in zo.space)
- **Data refresh**: Auto-polls every 30 seconds
- **Zero dependencies**: No npm packages to install — uses only what zo.space provides

## Customization

Each tab is a self-contained React function. To customize:

1. Get the route code: ask Zo to `get the code for /zo-control-deck`
2. Edit the specific tab function (e.g., `OverviewTab`, `ServicesTab`)
3. Update the route: ask Zo to apply your changes

### Credits tab manual override

The Credits tab includes a **Ledger Override** feature. Enter a custom balance and click COMMIT UPDATE to recalculate projected runway and reserve units. The override persists in localStorage.

## License

MIT — do whatever you want with it.
