---
name: dashboard-quality-gate
description: Run this dashboard's pre-merge QA with repo commands, API checks, and chart accessibility evidence. Use for dashboard QA or release checks; not styling-only tasks or deployment execution.
---

# Dashboard quality gate

## Objective
Produce a reproducible, evidence-backed pre-merge QA report for this React/Vite and FastAPI financial dashboard. Do not deploy, merge, or claim accounting accuracy.

## Inputs
- Required: repository checkout and target branch/diff.
- Required for live checks: a reachable frontend URL and backend URL.
- Optional: previous build log and the change's skill/rule references.
If a service URL is missing or unreachable, complete static/build checks and mark its live checks UNVERIFIED. Never substitute synthetic passing results.

## Expected output
A Markdown report with Scope, Commands, Results, Evidence, Limitations, and Next action. Each result is PASS, FAIL, or UNVERIFIED. Record exact commands and exit status. Reference paths, schema pointers, or captured rendered evidence.

## Procedure
1. Read AGENTS.md, .agents/rules, memory-bank/contexts and progress.md. Inspect git status and diff before changes. Confirm frontend/package.json still defines build, test, and lint; do not assume Next.js.
2. Run docker compose up --build -d when services need startup. Use the published ports from docker-compose.yml. The Vite /api proxy targets the backend service inside Compose; a successful frontend HTML request alone does not establish API health.
3. Check GET {backend}/health and GET {backend}/api/metrics/facets. Record min_date/max_date; reject a hardcoded reporting year as dataset evidence. The movements are generated synthetic data, not connected bank records.
4. Check a same-day inclusive range using facets.min_date and a successful empty future range. Verify alerts/top-categories remain bare arrays with their existing snake_case fields. Do not label alerts.baseline_average a fixed three-period rolling average.
5. Run docker compose exec -T frontend npm run build, npm test, and npm run lint from the corresponding frontend working context. Type-check frontend/specs explicitly with npx tsc --noEmit -p specs/tsconfig.json when specifications are in the diff.
6. Inspect the rendered dashboard on desktop and a narrow viewport. Check loading, success, and error states. Tab to each data disclosure and open it with Enter/Space; verify table headers, month rows, visible focus, and no keyboard trap. Confirm chart data is available without hover or color perception. Check reduced-motion/forced-color styling and text contrast with available audit tools.
7. Run a Lighthouse accessibility audit or axe when available. Report exact issue findings and scope; never equate an automated score with complete WCAG conformance.
8. Compare bundle output only under equivalent build conditions. Preserve layout space around asynchronous charts. Do not claim field Core Web Vitals or production deployment from a local build.
9. Review the diff for unrelated changes and secrets. Update memory-bank/progress.md with actual checks, limitations, and remaining work. Keep distinct skill applications in distinct commits.

## Acceptance criteria
- The documented build and applicable tests pass, or every failure has an explicit owner/blocker.
- Live checks have real response evidence; absent services remain UNVERIFIED.
- Chart values are keyboard-readable and errors are announced.
- No invented API fields, static dataset dates, or unsupported deployment claims.
- The report separates implementation, verification, and submission status.

## Example
| Check | Result | Evidence |
| --- | --- | --- |
| Backend health | PASS | GET /health -> 200, status ok |
| Live API without backend URL | UNVERIFIED | Required backend URL missing |
| Default report year | FAIL | Static header conflicts with facets bounds |

## Trigger and boundary cases
- "Run dashboard pre-merge QA": activate and follow all applicable steps.
- "Check dashboard QA; the API is unavailable": run independent checks, mark live checks UNVERIFIED.
- "Change the header icon color": do not activate this full workflow unless QA is also requested.

## Version
1.0.0: initial quality gate derived from this repository's ports, scripts, synthetic data, and chart behavior.
