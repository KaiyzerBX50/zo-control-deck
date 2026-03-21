# Zo Control Deck — Design Documentation

## Overview

This document details the visual design system, themes, and UI patterns used across all 8 tabs of the Zo Control Deck.

## Global Design System

### Typography

**Primary Font:** Orbitron (Google Fonts)
- Usage: Headers, labels, technical text, counters
- Weights: 400, 500, 600, 700
- Load: `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');`

**Secondary Font:** System sans-serif (Tailwind default)
- Usage: Body text, descriptions, details

### Color Palette

#### Semantic Colors (Global)
| Color | Role | Usage |
|-------|------|-------|
| **Amber/Gold** (`amber-400/500`) | Navigation, command structure | Rails, headers, command text |
| **Cyan** (`cyan-400/500`) | Live compute, CPU signals | CPU metrics, compute panels |
| **Violet** (`violet-400/500`) | Memory, automation | Memory stats, agent panels |
| **Green** (`green-400/500`) | Healthy, stable status | Status indicators, healthy services |
| **Red/Rose** (`red-400/500`, `rose-400/500`) | Failures, alerts | Error states, critical panels |

#### Background Colors
| Color | Usage |
|-------|-------|
| `zinc-950` | Main page background |
| `zinc-900` | Panel backgrounds |
| `zinc-800` | Card interiors |
| `black` | Terminal/log backgrounds |

### Visual Elements

#### LCARS Rail System
- Thick rounded rails (gradient amber/cyan/violet)
- Left vertical rail for navigation
- Top command rail
- Thin rail dividers between sections
- Elbow corners at section joins

#### Panel Structure
```
┌─ Top Rail (gradient) ───────────────┐
│  Header Title                       │
├─ Content Area ──────────────────────┤
│                                     │
│  [Inset Modules]                    │
│                                     │
└─ Bottom Status (optional) ────────┘
```

#### Label Strips
Technical labels above panel titles:
- Font: Orbitron, uppercase, tracking-widest
- Color: Theme-specific with 60% opacity
- Size: text-xs

#### Status Lamps
Small glowing indicators:
- Size: 2px × 2px or 3px × 3px
- Style: `rounded-full` with `shadow-lg` and `shadow-{color}-400/50`
- Animation: `animate-pulse` for active states

#### Segmented Bars
Horizontal progress indicators:
- Background: `zinc-800`
- Fill: gradient from theme color
- Rounded: `rounded-full`

## Tab-by-Tab Design

### 1. Overview Tab — LCARS Bridge Console

**Theme Core:** Star Trek LCARS (Library Computer Access/Retrieval System)

**Mood:** Command authority, bridge operations, shipwide status

#### Visual Hierarchy

**Level 1: Top Rail**
- DECK OPERATIONS label
- Live clock (right side)
- Refresh button
- Pulse indicator (green dot)

**Level 2: Header Plates**
- BRIDGE OVERVIEW (amber left border)
- SHIP LINK (green left border, CONNECTED status)

**Level 3: Hero Panel**
- Command Overview header
- Two inset metric modules:
  - READINESS INDEX (cyan border)
  - LINKED CONSOLES (violet border)
- Four resource rings (CPU, MEMORY, STORAGE, CREDITS)

**Level 4: Status Plates**
- Four compact status cards:
  - Services Online (green)
  - Agents Active (violet)
  - Security Alerts (rose)
  - Linked Consoles (cyan)

**Level 5: Command Panels**
- SYSTEMS POSTURE (amber rail, segmented bars)
- BRIDGE SIGNALS (cyan rail, 4 signal inserts)

**Level 6: Status Bus**
- Full-width footer rail
- 6 subsystem health indicators

#### CSS Patterns
```css
/* Top rail */
bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-transparent

/* Header plates */
bg-gradient-to-br from-zinc-900 to-zinc-950
border-l-4 border-amber-500

/* Hero panel */
bg-gradient-to-br from-zinc-900 via-zinc-800/50 to-zinc-900
border border-amber-500/30

/* LCARS rail top */
h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600

/* Left vertical rail */
absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-cyan-500 to-violet-500

/* Label strips */
text-xs text-{color}-400 lcars-font tracking-widest

/* Status lamps */
absolute top-2 right-2 w-2 h-2 rounded-full bg-{color}-400 shadow-lg shadow-{color}-400/50
```

---

### 2. Services Tab — Star Wars Targeting Computer

**Theme Core:** Star Wars targeting console

**Mood:** Tactical scanning, contact tracking, sector monitoring

#### Key Visual Elements

**Targeting Systems Panel:**
- 4 counter tiles in a row
- Black glass background
- Green tactical glow
- "LOCKED CONTACTS" label (military-style uppercase)

**Contact Registry:**
- List of services with "LOCKED" or "DRIFT" status
- Contact numbers: [01], [02], [03]...
- Status dots (green = locked, red = drift)

#### Color Usage
- Primary: Green (locked, healthy)
- Warning: Amber (partial lock)
- Alert: Red (drift, unhealthy)
- Background: Black with subtle green glow

---

### 3. Agents Tab — Automation Registry

**Theme Core:** Clean operational interface

**Mood:** Fleet visibility, routine dispatch

#### Key Visual Elements

**Statistics Grid:**
- 4 stat cards in a row
- Color-coded: Green (active), Amber (inactive), Cyan (SMS), Violet (email)

**Agent Registry:**
- List with index numbers: [01], [02]...
- Status indicators (pulsing violet dot for active)
- Grid of metadata: Schedule, Status, Delivery, Created

---

### 4. Credits Tab — Resource Allocation Terminal

**Theme Core:** Financial/resource monitoring

**Mood:** Reserve tracking, burn rate analysis

#### Key Visual Elements

**Credit Reserve Panel:**
- 4 metric tiles:
  - Ledger Balance (amber)
  - Reserve Units (rose)
  - Daily Burn (cyan)
  - Runway (violet)

**AI Models Table:**
- Full-width table with columns: MODEL, TIER, CONTEXT, INPUT, OUTPUT, CACHED, STATUS
- Tier badges: Free (cyan), $$ (amber), $$$ (red)
- Active row highlight

**Ledger Override Panel:**
- Input field for manual balance
- "COMMIT UPDATE" button
- Success message with CheckCircle icon

---

### 5. Dashboards Tab — TRON Grid Access Deck

**Theme Core:** TRON Grid portal network

**Mood:** Luminous, geometric, fast-read, black glass with cyan light rails

#### Key Visual Elements

**Grid Background:**
```css
background-image: 
  linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
  linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px);
background-size: 40px 40px;
```

**Pulsing Node Dots:**
- Scattered across grid
- Animation: pulse with random delays
- Color: Cyan with varying opacity

**Node Summary Counters:**
- 3 large tiles: Total Nodes, Route Integrity, Network Mix
- Glowing borders (cyan, green, violet)

**Portal Cards:**
- Left edge mark (violet = page, blue = API)
- Glowing border on hover
- ENTER button (not "Open")
- HEALTHY badge
- Pulsing dot in corner

**Lightpath Timeline:**
- Horizontal gradient line
- Text: "LIGHTPATH TIMELINE • NOW: GRID LIVE"

#### CSS Patterns
```css
/* Glow effects */
glow-cyan: box-shadow: 0 0 20px rgba(6, 182, 212, 0.3)
glow-violet: box-shadow: 0 0 20px rgba(139, 92, 246, 0.3)
glow-blue: box-shadow: 0 0 20px rgba(59, 130, 246, 0.3)

/* Lightpath */
h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent

/* Grid node dot */
animation: pulse-node 2s ease-in-out infinite
```

---

### 6. Logs Tab — Matrix Terminal Trace Board

**Theme Core:** Matrix terminal with code rain

**Mood:** Phosphor green glow, black glass, dense trace output, machine rhythm

#### Key Visual Elements

**Code Rain Backdrop:**
```css
.code-rain-column {
  background: linear-gradient(to bottom, 
    transparent 0%, 
    rgba(34, 197, 94, 0.15) 20%, 
    rgba(34, 197, 94, 0.3) 50%, 
    rgba(34, 197, 94, 0.15) 80%, 
    transparent 100%
  );
  animation: rain-fall 8s linear infinite;
}
```

**Scanlines:**
```css
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.3) 2px,
    rgba(0, 0, 0, 0.3) 4px
  );
}
```

**Terminal Glow:**
```css
.terminal-glow {
  box-shadow: 
    inset 0 0 60px rgba(34, 197, 94, 0.1), 
    0 0 30px rgba(34, 197, 94, 0.05);
}
```

**Signal Rails:**
- Thin vertical lines on left/right
- Gradient from green-400/50 to transparent

**Stream Monitor:**
- 5 counter tiles with terminal styling
- Trace Sources (green), Warning Flags (lime), Error Spikes (red), Stream State (green), Tail Mode (emerald)

**Activity Matrix:**
- 6 tiles in 3×2 grid
- INFO (green), WARN (amber), ERROR (red), TRACE (green), BOOT (emerald), RUNTIME (lime)

**Live Trace Window:**
- Black background (#000)
- Left gutter with timestamps
- Status color bars (red/amber/green)
- Monospace font for logs
- Scanline overlay

---

### 7. Security Tab — HAL 9000 Observation Console

**Theme Core:** HAL 9000 from 2001: A Space Odyssey

**Mood:** Silent machine observation, calm certainty, single red optic

**Data Status:** Simulated (displays 🔒 Needs Zo Admin API label)

#### Key Visual Elements

**Observation Core Header:**
- Thin red rail top/bottom
- "OBSERVATION CORE" title with text shadow
- SENTINEL LINK status (green dot = connected)

**Watch Counters:**
- 4 tiles: Audit Events, Authentication Events, Interface Calls, Rejected Events
- Deep crimson backgrounds
- White numbers with subtle shadow
- Small red indicator dots

**Sentinel Optic (Centerpiece):**
```css
/* Main lens */
background: radial-gradient(circle at 30% 30%, 
  rgba(220, 38, 38, 0.9), 
  rgba(150, 0, 0, 0.8), 
  rgba(80, 0, 0, 0.9)
);
box-shadow: 
  0 0 60px rgba(220, 38, 38, 0.4), 
  inset 0 0 40px rgba(220, 38, 38, 0.2);
animation: optic-breathe 4s ease-in-out infinite;

/* Inner glow */
background: radial-gradient(circle at 40% 40%, 
  rgba(255, 100, 100, 0.8), 
  rgba(180, 0, 0, 0.6)
);

/* Reflection point */
absolute top-6 left-8 w-3 h-3 rounded-full bg-white/80

/* Text */
"WATCH ACTIVE" in center
```

**Scan Arc:**
```css
.scan-arc {
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 50%;
  border-top-color: rgba(220, 38, 38, 0.8);
  animation: scan-rotate 8s linear infinite;
}
```

**Concentric Rings:**
- Multiple rings around optic
- Thin red borders with low opacity
- Subtle red glow

**Crosshair Marks:**
- Horizontal and vertical lines through center
- Very low opacity (10%)

**Optic Readouts:**
- OBSERVATION STATE: ACTIVE (red)
- ANOMALY STATE: CLEAR (white)
- ACCESS POSTURE: STABLE (green)
- AUDIT STREAM: QUIET (white)

**Access Posture:**
- 4 channel strips: PERIMETER, AUTH, INTERFACE, AUDIT STREAM
- Green stable state
- Detailed descriptions under each

**Failure Gate:**
- Rejected Events, Failed Logins, API Auth Failures, Severity
- Red styling
- Severity shows LOW (green)

**Observation Log:**
- "NO ANOMALIES RECORDED" in center
- "🔴 OBSERVATION ACTIVE" badge
- Thin red rails top/bottom

**Event Class Matrix:**
- 6 tiles: AUTH, API, FAILURE, SYSTEM, PRIVILEGE, UNKNOWN
- All showing 0

**Observation Timeline:**
- NOW, 5M, 15M, 1H, 24H
- All showing QUIET (green)

#### CSS Patterns
```css
/* Optic glow */
.optic-glow {
  box-shadow: 
    0 0 60px rgba(220, 38, 38, 0.4), 
    inset 0 0 40px rgba(220, 38, 38, 0.2);
}

/* Optic pulse */
@keyframes optic-breathe {
  0%, 100% { 
    box-shadow: 0 0 30px rgba(220, 38, 38, 0.3), 
                 inset 0 0 20px rgba(220, 38, 38, 0.1);
  }
  50% { 
    box-shadow: 0 0 50px rgba(220, 38, 38, 0.5), 
                 inset 0 0 30px rgba(220, 38, 38, 0.2);
  }
}

/* Background */
background: radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)
```

---

### 8. Failures Tab — Star Wars Red Alert Tactical Board

**Theme Core:** Star Wars Red Alert

**Mood:** Alarm state, tactical urgency, sharp red signal bands

**Data Status:** Simulated (displays 🔒 Needs Zo Admin API label)

#### Key Visual Elements

**Tactical Alert Header:**
- Diagonal warning stripes (red/black)
- Red Alert Pulse overlay
- "FAILURE TRACKING" title

**Threat Counters:**
- 4 tiles with alert styling:
  - Total Incidents
  - Critical Threats
  - Priority Threats
  - Minor Alerts
- Red/crimson/amber/white color coding

**Alert Beacon (Centerpiece):**
- Large concentric red rings
- Pulsing red core
- Red glow shadow
- Tactical crosshairs

**Severity Rails:**
- Vertical sliver bars: Severe, High, Moderate, Low, All Clear
- Red gradient from dark to bright

**Fault Registry:**
- "WAITING FOR FAULT SIGNALS" message
- Empty state with active surveillance
- Red edge brackets

**Damage Control:**
- Auth Breaches, Failed Logins, Rate Limit Breaches
- All showing 0

**Triage Queue:**
- IMMEDIATE, NEXT, LATER
- Stacked in priority order

#### CSS Patterns
```css
/* Warning stripes */
background: i % 2 === 0 ? '#ef4444' : '#000'
transform: skewX(-20deg)

/* Red alert pulse */
absolute inset-0 bg-red-500/5 animate-pulse

/* Alert glow */
box-shadow: 0 0 60px rgba(220, 38, 38, 0.4)

/* Background */
background: linear-gradient(180deg, #1a0000 0%, #0d0000 100%)
```

---

## Animation Standards

### Pulse
```css
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Scan Rotate
```css
animation: scan-rotate 8s linear infinite;
@keyframes scan-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Rain Fall
```css
animation: rain-fall 8s linear infinite;
@keyframes rain-fall {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
```

### Optic Breathe
```css
animation: optic-breathe 4s ease-in-out infinite;
@keyframes optic-breathe {
  0%, 100% { box-shadow: 0 0 30px rgba(220, 38, 38, 0.3); }
  50% { box-shadow: 0 0 50px rgba(220, 38, 38, 0.5); }
}
```

---

## Responsive Considerations

The dashboard is optimized for desktop/tablet viewing:
- Max width: `max-w-7xl` (1280px)
- Responsive grids: 1-4 columns depending on viewport
- Touch-friendly button sizes: minimum 44px

Mobile considerations:
- Stack panels vertically on narrow screens
- Reduce font sizes slightly
- Maintain tap targets

---

## Accessibility Notes

- Color is not the only indicator (icons, text labels included)
- High contrast text on dark backgrounds
- Animations are decorative (can be disabled with `prefers-reduced-motion`)
- Focus states should be added for keyboard navigation

---

## Extension Guidelines

To add a new tab:

1. Create a new function component:
```tsx
function NewTab() {
  return (
    <div className="space-y-6">
      {/* Your tab content */}
    </div>
  );
}
```

2. Add to tabs array:
```tsx
const tabs = [
  // ... existing tabs
  { id: "newtab", label: "New Tab", icon: YourIcon },
];
```

3. Add to rendering switch:
```tsx
{activeTab === "newtab" && <NewTab />}
```

4. Choose a theme or create new:
- Match existing theme
- Or create new color palette
- Maintain consistency with rail/panel patterns

---

## Credits

**Visual Themes:**
- LCARS: Star Trek: The Next Generation
- HAL 9000: 2001: A Space Odyssey (Stanley Kubrick)
- TRON Grid: TRON Legacy (Disney)
- Matrix: The Matrix (Wachowskis)
- Star Wars Targeting: Star Wars: A New Hope (Lucas)

**Design System:** Based on Zo Computer's dashboard patterns

**Fonts:** Orbitron by Matt McInerney (The League of Moveable Type)