---
name: zo-control-deck
description: Star Trek LCARS-themed operational dashboard for Zo Space. Monitors services, agents, credits, routes, logs, and system status from your own environment with full sci-fi UI themes.
compatibility: Created for Zo Computer
metadata:
  author: dagawdnyc.zo.computer
  version: "2.0.0"
  date: 2026-03-14
---

# Zo Control Deck (ZCC)

A multi-tab operational dashboard for Zo Computer with cinematic sci-fi themes. Each tab presents a distinct visual identity while maintaining operational clarity.

## Tab Themes & Visual Identity

### Overview Tab — LCARS Bridge Console
**Theme:** Star Trek LCARS (Library Computer Access/Retrieval System)
**Mood:** Command authority, bridge operations, shipwide status

**Visual Elements:**
- Thick amber/gold command rails across top and left
- Rounded panel corners with LCARS "elbow" styling
- Segmented horizontal bars (not plain progress bars)
- Capsule counters with Orbitron font
- Narrow label strips above panel titles
- Color-coded subsystem status lamps

**Key Panels:**
- DECK OPERATIONS (top rail with live clock)
- BRIDGE OVERVIEW + SHIP LINK (header plates)
- COMMAND OVERVIEW (hero with inset metric modules)
- SERVICE GRID + AUTOMATION WING (tall companion modules)
- Resource Systems: CPU LOAD, MEMORY, STORAGE, CREDITS (circular meters)
- Deck Status: Services Online, Agents Active, Security Alerts, Linked Consoles
- SYSTEMS POSTURE + BRIDGE SIGNALS (lower command row)
- STATUS BUS (footer rail)

**Color Roles:**
- Amber/gold → Navigation, structure, command rails
- Cyan → CPU and live compute signals
- Violet → Memory and automation systems
- Green → Stable status and healthy indicators
- Red → Failures and alerts

---

### Services Tab — Star Wars Targeting Computer
**Theme:** Star Wars targeting console
**Mood:** Tactical scanning, contact tracking, sector monitoring

**Visual Elements:**
- Black glass with green tactical glow
- Targeting reticle styling
- Contact registry with "LOCKED" / "DRIFT" status
- Sector scan aesthetic

**Key Panels:**
- TARGETING SYSTEMS (counters: Locked Contacts, Sector Contacts, Drift Signals, Lock Status)
- CONTACT REGISTRY (service list with lock status)

---

### Agents Tab — Automation Registry
**Theme:** Clean operational interface
**Mood:** Fleet visibility, routine dispatch

**Visual Elements:**
- Violet accent colors
- Agent statistics grid
- Registry list with status indicators
- Schedule and delivery method display

---

### Credits Tab — Resource Allocation Terminal
**Theme:** Financial/resource monitoring
**Mood:** Reserve tracking, burn rate analysis

**Visual Elements:**
- Amber for ledger balance
- Rose for reserve units
- Cyan for daily burn
- Violet for runway estimation
- AI Models pricing table
- Ledger Override input panel

---

### Dashboards Tab — TRON Grid Access Deck
**Theme:** TRON Grid portal network
**Mood:** Luminous, geometric, fast-read, black glass with cyan light rails

**Visual Elements:**
- Square grid background with pulsing node dots
- Cyan, violet, blue lightpath bands
- Portal cards with glowing edges
- Page nodes: violet edge marks
- API nodes: blue edge marks
- Hard-edged panels with crisp edge light

**Key Panels:**
- GRID NODE header with pulsing grid dots
- NODE SUMMARY: Total Nodes, Route Integrity, Network Mix
- NETWORK PULSE slab: Grid State, Node Count, Route Integrity, Public Access
- Network Split: Page Nodes vs API Nodes
- PORTAL REGISTRY: Glowing portal cards with ENTER buttons
- GRID LEGEND: Color codes
- LIGHTPATH TIMELINE

---

### Logs Tab — Matrix Terminal Trace Board
**Theme:** Matrix terminal with code rain
**Mood:** Phosphor green glow, black glass, dense trace output, machine rhythm

**Visual Elements:**
- Animated code rain backdrop (falling green streaks)
- Phosphor green glow and text shadows
- Signal rails (thin glowing horizontal lines)
- Scanlines (CRT monitor texture)
- Left gutter with timestamps
- State color bars for each row
- Terminal counters (not normal stat tiles)

**Key Panels:**
- TRACE CONSOLE header with code rain
- STREAM MONITOR slab: Trace Sources, Warning Flags, Error Spikes, Stream State, Tail Mode
- ACTIVITY MATRIX: INFO, WARN, ERROR, TRACE, BOOT, RUNTIME
- SOURCE FOCUS: Current File, Hottest Source, Last Fault, Tail State
- LIVE TRACE WINDOW: Scrollable log view with level indicators

---

### Security Tab — HAL 9000 Observation Console 🔒
**Theme:** HAL 9000 from 2001: A Space Odyssey
**Mood:** Silent machine observation, calm certainty, single red optic
**Data Status:** Simulated (Needs Zo Admin API)

**Visual Elements:**
- Black glass surfaces
- Single red optic (lens) as visual anchor
- Concentric rings around optic
- Scan arc animation
- Crosshair marks
- White reflection point on optic
- Deep crimson accents

**Key Panels:**
- OBSERVATION CORE header (thin red rails)
- SENTINEL LINK status (connected indicator)
- WATCH COUNTERS: Audit Events, Authentication Events, Interface Calls, Rejected Events
- SENTINEL OPTIC (large feature): Red lens with rings, scan arc, "WATCH ACTIVE" text
- OPTIC READOUTS: Observation State, Anomaly State, Access Posture, Audit Stream
- ACCESS POSTURE: Perimeter, Auth, Interface, Audit Stream (all channels)
- FAILURE GATE: Rejected Events, Failed Logins, API Auth Failures, Severity
- OBSERVATION LOG: "NO ANOMALIES RECORDED" with active observation badge
- EVENT CLASS MATRIX: AUTH, API, FAILURE, SYSTEM, PRIVILEGE, UNKNOWN
- OBSERVATION TIMELINE: NOW, 5M, 15M, 1H, 24H

**Transparency Label:** 🔒 Needs Zo Admin API

---

### Failures Tab — Star Wars Red Alert Tactical Board 🔒
**Theme:** Star Wars Red Alert
**Mood:** Alarm state, tactical urgency, sharp red signal bands
**Data Status:** Simulated (Needs Zo Admin API)

**Visual Elements:**
- Diagonal warning stripes (red/black)
- Red Alert Pulse overlay
- Dark command surfaces
- Red edge brackets on panels
- Dense console blocks
- Tactical grid layout

**Key Panels:**
- TACTICAL ALERT header with warning stripes
- THREAT COUNTERS: Total Incidents, Critical Threats, Priority Threats, Minor Alerts
- ALERT BEACON: Large concentric red rings with pulsing core
- SEVERITY RAILS: Severe, High, Moderate, Low, All Clear
- FAULT REGISTRY: Empty state with "WAITING FOR FAULT SIGNALS"
- DAMAGE CONTROL: Auth Breaches, Failed Logins, Rate Limit Breaches
- TRIAGE QUEUE: Immediate, Next, Later

**Transparency Label:** 🔒 Needs Zo Admin API

---

## Data Transparency

| Tab | Data Source | Status | Notes |
|-----|-------------|--------|-------|
| Overview | Live APIs | Real | System stats, services, agents, credits |
| Services | `/api/services` | Real | Your hosted services |
| Agents | `/api/agents` | Real | Your scheduled agents |
| Credits | `/api/credits` | Real | Your credit balance + local override |
| Dashboards | `/api/dashboards` | Real | Your zo.space routes |
| Logs | Simulated | Partial | Real-time logs require log streaming API |
| Security | Simulated | 🔒 Needs Zo Admin API | Audit events require Zo Audit API |
| Failures | Simulated | 🔒 Needs Zo Admin API | Security events require Zo Security API |

**Important:** Security and Failures tabs clearly display "🔒 Needs Zo Admin API" labels. They show simulated data for demonstration purposes until real APIs are configured.

---

## Required API Routes

The dashboard reads from these endpoints in YOUR Zo Space:

```
GET /api/system-stats    → CPU, memory, disk, uptime
GET /api/services        → Hosted services list
GET /api/agents          → Scheduled agents
GET /api/credits         → Credit balance
GET /api/dashboards      → Space routes
GET /api/logs            → System logs (if available)
```

**Note:** Logs, Security, and Failures can operate with simulated data until real APIs are available. The UI clearly indicates simulated vs real data.

---

## Installation

### Method 1: Via Skill (Recommended)

```bash
cd /home/workspace/Skills/zo-control-deck
bun scripts/setup.ts
```

This creates:
- `/zo-control-deck` — Main dashboard page
- Required API routes (if not already present)

### Method 2: Manual Copy

1. Copy `templates/dashboard.page.tsx` to your zo.space as `/zo-control-deck`
2. Ensure these API routes exist:
   - `/api/system-stats`
   - `/api/services`
   - `/api/agents`
   - `/api/credits`
   - `/api/dashboards`

---

## Privacy & Security Guarantee

**Environment-local by design.**

When installed in your Zo Space:
- ✅ Reads YOUR services, agents, routes, logs
- ✅ Shows YOUR credit balance
- ✅ Uses YOUR system stats
- ✅ Credit override stored in YOUR localStorage only
- ✅ No hardcoded secrets or tokens
- ✅ No cross-contamination with author's data
- ✅ All API calls are relative to your space

Other Zo members who install this get their own instance reading from their environment.

---

## Customization

### Changing Tab Order
Edit the `tabs` array in the main component:
```tsx
const tabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "services", label: "Services", icon: Server },
  // ... etc
];
```

### Enabling Real Security/Failures Data
To enable real data for Security and Failures tabs:

1. Configure Zo Audit API endpoint
2. Configure Zo Security API endpoint
3. Update the fetch calls in those tab components
4. Remove the "🔒 Needs Zo Admin API" labels

### Color Customization
Each tab uses theme-specific colors. Global color roles:
- Amber/gold → Navigation, command structure
- Cyan → Live compute, CPU
- Violet → Memory, automation
- Green → Healthy, stable
- Red → Failures, alerts, critical

---

## File Structure

```
Skills/zo-control-deck/
├── SKILL.md                          # This documentation
├── README.md                         # Quick start guide
├── templates/
│   └── dashboard.page.tsx           # Main dashboard code
├── scripts/
│   └── setup.ts                     # Installation script
└── assets/
    └── (static assets if needed)
```

---

## Credits & Attribution

- LCARS design inspired by Star Trek: The Next Generation
- HAL 9000 design inspired by 2001: A Space Odyssey
- TRON Grid design inspired by TRON Legacy
- Matrix design inspired by The Matrix
- Star Wars targeting computer inspired by A New Hope

**Created by:** dagawdnyc.zo.computer
**Version:** 2.0.0
**Date:** 2026-03-14

---

## Support

For issues or questions:
- Check the documentation in `SKILL.md`
- Review the sharing guide in `README.md`
- Verify API routes are accessible in your Zo Space