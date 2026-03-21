# Zo Control Deck Templates

This folder is for the installable route templates used by the Zo Control Deck skill.

Expected templates:
- `dashboard.page.tsx`
- `apis/system-stats.api.ts`
- `apis/services.api.ts`
- `apis/agents.api.ts`
- `apis/credits.api.ts`
- `apis/dashboards.api.ts`
- `apis/logs.api.ts`
- `apis/metrics-history.api.ts`
- `apis/audit.api.ts`
- `apis/security-failures.api.ts`
- `apis/status.api.ts`

Privacy rules:
- no hardcoded Zo handle
- no hardcoded secrets
- no hardcoded creator file paths unless explicitly documented as a user-owned local file they must replace
- all routes must run in the installing user's own Zo Space

Current status:
- skill scaffold is complete
- docs are complete
- final route templates still need to be copied from the current live implementation into these files
