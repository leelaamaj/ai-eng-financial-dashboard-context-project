# Verification trail

Baseline inspected: upstream 954f812d6fb0d95af6699b369ca6e88089ece90c. Agent-assisted findings were cross-checked against source and the running API, not inferred from PM wording.

## Corrections

| Claim | Status | Correction/evidence |
| --- | --- | --- |
| Alert baseline is rolling previous three | ❌ | routes.py detect_outcome_alerts averages all preceding entries. Visible rolling rows must derive from summary; raw alert model retains actual meaning. |
| Facets categories are grouped | ❌ | MetricsFacets has global categories plus business_types, no group map or business_type query. |
| Top categories response contains total/share | ❌ | TopCategoryItem has category, operation_type, total_amount only; derive denominator from summary income. |
| API threshold max is 1 | ❌ | threshold Query ge=0 only; 0.01..1 is the UI requirement. |
| API returns response envelopes | ❌ | Alerts and top categories response_model are lists; TypeScript array aliases reflect wire payloads. |
| Plain tsc checks specs | ❌ | inherited tsconfig.app.json includes src only; specs/tsconfig.json explicitly includes deliverable types. |
| Backend health | ✅ | GET /health returned {"status":"ok"} in Codespaces after docker compose up --build -d. |
| API docs browser access | ❓ | Private forwarded /docs URL failed in browser; validate the same live OpenAPI document at localhost:8000/openapi.json from workspace terminal. |

## Source references

backend/app/routes.py: MetricsFacets, MetricsAlert, TopCategoryItem, MetricsSummaryItem and route signatures.
frontend/src/App.tsx: environment-based base URL, response.ok check, KPI/chart derivation.
frontend/src/lib/financial-types.ts and financial-utils.ts: existing domain enums and formatting.
frontend/tsconfig.app.json: src include boundary.

## Final checks (2026-11-03)

- ✅ Live /openapi.json fetched from running backend; saved evidence/openapi.json. /docs HTML also fetched from the workspace, while browser access to the private forwarded URL failed.
- ✅ Live facets, alerts and top-category payloads inspected and asserted; saved evidence/responses.json. Date boundaries inclusive; future start returns [].
- ✅ npx tsc --noEmit -p specs/tsconfig.json: passed, strict mode and explicit specs inclusion.
- ✅ npx tsc --noEmit: passed (requested check).
- ✅ npm run build: passed, Vite built in 3.25s.
- ✅ Existing frontend tests: 5 passed.
- ✅ Existing backend tests: 15 passed, one upstream deprecation warning.
- ✅ git diff baseline -- frontend/src backend: empty; runtime code unchanged.

The three-period derivation and global-facets handling are specification decisions, not implemented features. Submission still requires the student's own authorship declaration in the 4Geeks delivery form.
