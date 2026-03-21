# Zo Control Deck (ZCC)

A cinematic sci-fi operational dashboard for your Zo Space.

![Dashboard Preview](https://dagawdnyc.zo.space/zo-control-deck)

## Quick Install

```bash
cd /home/workspace/Skills/zo-control-deck
bun scripts/setup.ts
```

Then visit: `https://[your-handle].zo.space/zo-control-deck`

## What You Get

8 themed tabs for complete operational visibility:

| Tab | Theme | Real Data |
|-----|-------|-----------|
| **Overview** | Star Trek LCARS Bridge Console | ✅ Live system stats |
| **Services** | Star Wars Targeting Computer | ✅ Your hosted services |
| **Agents** | Clean Automation Registry | ✅ Your scheduled agents |
| **Credits** | Resource Allocation Terminal | ✅ Your credit balance |
| **Dashboards** | TRON Grid Access Deck | ✅ Your routes |
| **Logs** | Matrix Terminal Trace Board | ✅ System logs |
| **Security** | HAL 9000 Observation Console | 🔒 Simulated* |
| **Failures** | Star Wars Red Alert Board | 🔒 Simulated* |

*Security and Failures show simulated data until Zo Admin API is configured. They display "🔒 Needs Zo Admin API" transparency labels.

## Privacy First

This dashboard reads from **YOUR environment only**:
- Your services
- Your agents  
- Your credits
- Your routes
- Your logs

No data from the original author. No secrets hardcoded. Safe to share.

## Prerequisites

Your Zo Space needs these API routes (they're standard):
- `GET /api/system-stats`
- `GET /api/services`
- `GET /api/agents`
- `GET /api/credits`
- `GET /api/dashboards`

If missing, the setup script will create them.

## Tab Order

The tabs are arranged logically:
1. **Overview** — High-level status
2. **Services** — Infrastructure health
3. **Agents** — Automation status
4. **Credits** — Resource usage
5. **Dashboards** — Route index
6. **Logs** — System trace
7. **Security** 🔒 — Access monitoring (simulated)
8. **Failures** 🔒 — Incident tracking (simulated)

Logs appear before Security/Failures since those require admin APIs.

## Enabling Real Security/Failures Data

To enable real security event data:

1. Configure Zo Audit API access
2. Configure Zo Security API access
3. Update the fetch calls in SecurityTab and FailuresTab components
4. Remove the "🔒 Needs Zo Admin API" labels

Until then, these tabs show simulated data with clear transparency labels.

## Customization

### Change Colors
Edit the Tailwind classes in each tab component. Global palette:
- Amber → Navigation, command
- Cyan → CPU, compute
- Violet → Memory, automation
- Green → Healthy, stable
- Red → Failures, alerts

### Change Tab Order
Edit the `tabs` array in the main component.

### Add New Tabs
Create a new function component (e.g., `CustomTab`) and add it to:
1. The `tabs` array
2. The rendering switch statement

## Troubleshooting

**Dashboard shows empty data?**
- Verify API routes are returning data: `curl https://[your-handle].zo.space/api/system-stats`
- Check browser console for fetch errors

**Security/Failures show "Simulated"?**
- This is expected. Real data requires Zo Admin API configuration.
- The transparency labels clearly indicate this.

**Styles not loading?**
- The dashboard uses Tailwind CSS (built into zo.space)
- Ensure Orbitron font loads (imported via Google Fonts)

## Documentation

- `SKILL.md` — Full documentation with theme details
- `templates/dashboard.page.tsx` — Source code
- `scripts/setup.ts` — Installation script

## License

Created for Zo Computer members. Share freely. Each installation is environment-local.

---

**Created by:** dagawdnyc.zo.computer
**Version:** 2.0.0