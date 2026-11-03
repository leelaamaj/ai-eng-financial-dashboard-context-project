# Financial dashboard frontend data contract

Branch: feature/frontend-specs. Scope: types and specifications only. See components.md for page ownership/props, rendering states, accessibility and EARS behavior. See verification.md for evidence and checks.

## API and application types

api-types.ts: FacetsResponse, AlertEntry, AlertsResponse, CategoryEntry, TopCategoriesResponse, MovementEntry/MetricsResponse and SummaryEntry/SummaryResponse. Responses named AlertsResponse and TopCategoriesResponse are array aliases because the server returns bare arrays.
param-types.ts: DateRangeFilter, MetricsParams, AlertsParams, TopCategoriesParams, SummaryParams.
No endpoint returns group_total, percentage, rolling_average or grouped facet categories. Those are application derivations described below.

## Shared parameter constraints

| Parameter | API constraints/default | Feature choice |
| --- | --- | --- |
| start_date | Optional calendar date, YYYY-MM-DD, inclusive | Omit if empty; start-only supported |
| end_date | Optional calendar date, YYYY-MM-DD, inclusive | Omit if empty; end-only supported |
| operation_type | income or outcome; default varies by endpoint | Home omits; comparison explicitly income |
| category | suppliers, sales, operational, administrative, others; optional on metrics/summary | No category filtering in these features; vocabulary from facets |
| business_type | B2B or B2C; optional on summary/top/alerts | Omit for home; explicit group for comparison |
| group_by | day, week, month; default month | month |
| threshold | API number >=0, default 0.3, no upper bound | finite ratio 0.01..1 inclusive, initial 0.3 |
| limit | API integer 1..20, default 5 | comparison explicitly 5 |

Validate date order in UI: backend does not reject start > end and returns an empty list. Invalid date strings/enum values/constraint violations return 422; network/5xx/422 produce explicit errors and retry as appropriate, never successful empty states. Normalize empty control values to absent query parameters. Do not send "undefined", "null", or an empty date. URL-encode query parameters. A range outside facets bounds is not rejected by API; show its truthful empty/partial result.

## Feature 1: home date filter

GET /api/metrics/facets takes no parameters and returns FacetsResponse with required operation_types, business_types, categories, min_date, max_date. It is unfiltered global metadata.
GET /api/metrics takes MetricsParams and returns MetricsResponse, chronological movements. Apply the same range to movements, raw alerts and summary used for visible rolling alerts. Preserve existing computeKPIs/computeMonthlyData behavior; loading/error states must not show stale previous-range numbers as current.

Examples:
- Both dates empty: GET /api/metrics.
- Start only: GET /api/metrics?start_date=2026-01-01.
- End only: GET /api/metrics?end_date=2026-01-31.
Dates in examples illustrate syntax; actual bounds must come from facets.

| Edge case | Required UI |
| --- | --- |
| One date filled | Inclusive one-sided filter; do not auto-fill the other date |
| Both empty/reset | All data and accurate all-data header |
| Reversed/malformed dates | Inline validation, block Apply; preserve last valid applied selection |
| Successful [] | Zero KPIs and explicit no-data charts |
| Facets error | Reference unavailable + retry; valid manual dates remain usable |

## Feature 2: anomaly alerts

GET /api/metrics/alerts takes AlertsParams and returns AlertsResponse. Exact fields: period, outcome_total, baseline_average, increase_ratio. No response envelope. Existing baseline averages all prior populated periods after date filtering; first period has no baseline, baseline <=0 is skipped, alert criterion is strictly greater than threshold.
GET /api/metrics/summary takes SummaryParams and returns SummaryResponse with period, income, outcome, net. Its periods are sorted and missing periods omitted.

Resolution of PM mismatch: preserve the requested three-prior-period visible table by deriving RollingAlertRow from complete filtered monthly summary, as specified in components.md. Do not relabel API baseline_average or restrict derived candidates to API alerts. Raw /alerts is an API reference; /summary supplies visible rolling calculations. This adds a documented existing endpoint dependency, no backend change.
For outcomes [100,100,100,200] and threshold .3, fourth row has baseline 100 and increase 100%; threshold 1 excludes equality. With fewer than four populated periods, show insufficient history. Dates select the history window too.
Ratio .3 is displayed as 30.0%, never 0.3%.

| Edge case | Required UI |
| --- | --- |
| No derived spikes | Persistent table and explicit no-anomalies message |
| Fewer than four periods | Persistent table and insufficient-history message |
| Baseline zero | Skip candidate; never divide by zero |
| Invalid threshold/blank | Inline error; block Apply |
| Summary failure | Table error/retry; never no-anomalies |
| Only raw /alerts fails | Separate API-reference error; retain summary-derived rows |

## Feature 3: B2B versus B2C

GET /api/metrics/facets -> FacetsResponse (no query).
For each group:
GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B (or B2C), plus optional dates -> TopCategoriesResponse.
GET /api/metrics/summary?group_by=month&operation_type=income&business_type=B2B (or B2C), plus identical dates -> SummaryResponse.
Each request uses TopCategoriesParams or SummaryParams respectively. Top rows are descending total_amount. Group total = sum of every summary income. Row share uses that complete group total; chart uses the same totals. A top-five sum is never a valid substitute if more categories exist.
Facets categories are global; use this API-derived vocabulary for both panels. The server has no per-business facets. Known income categories in synthetic data may be fewer than five; do not fabricate rows.

| Edge case | Required UI |
| --- | --- |
| B2B [] | B2B-specific empty message; B2C remains visible |
| B2C [] | B2C-specific empty message; B2B remains visible |
| Group total zero | $0 total, 0.0% shares, no divide-by-zero |
| One group's request fails | Group error/retry; successful other panel retained; chart awaits both successful totals |
| Both groups zero | Single chart region with explicit no-income state and text totals |
| Facets fails | Category/reference error + retry; no invented options |

## Verification and handoff

Run from frontend: npx tsc --noEmit -p specs/tsconfig.json. This explicitly includes specifications; the inherited app config includes only src. Also run npx tsc --noEmit as requested, plus npm run build to cover the actual application project.
No React, fetch implementation or backend change belongs in this delivery. Implementation follows in a later assignment.
