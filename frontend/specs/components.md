# Component specifications

This is a design handoff, not React implementation. All prop signatures below are contracts only. Import API types from api-types.ts and query types from param-types.ts. Application state and derived display data are not wire response fields.

## Shared types and behavior

`LoadState<T> = {status:"loading"} | {status:"error"; message:string} | {status:"success"; data:T}`.
`DateRangeValue = {start_date:string; end_date:string}` uses empty strings in controls; normalize empty values to omitted DateRangeFilter properties.
`RollingAlertRow = {period:string; outcome_total:number; rolling_average:number; increase_ratio:number}` is a derived UI type, never an API alias.

All controls have visible labels, keyboard operation, linked validation messages, aria-invalid on invalid fields, and polite status announcements. Error sections use role=alert. Tables retain headers in loading/error/empty states, with one full-width status row. Money follows existing USD formatCurrency; percentage follows formatPercent. Ratios multiply by 100 exactly once. Provide text equivalents for charts.

## Feature 1: home dates

| Component | Props | Responsibility |
| --- | --- | --- |
| HomeDashboardPage | none (page owns state) | Own draft dates and applied DateRangeFilter; obtain facets, movements and anomaly data; pass the same applied dates to every home section. |
| DateRangeFilter | value: DateRangeValue; onChange:(value:DateRangeValue)=>void; onApply:()=>void; onReset:()=>void; error:string\|null; disabled:boolean | Labeled Start date and End date inputs; Apply and Reset buttons. No request during typing. |
| AvailableDateRange | state:LoadState<FacetsResponse>; onRetry:()=>void | Show “Available data: {min_date} to {max_date}”. Loading shows reference skeleton; error shows “Available date range unavailable” and retry. |
| DashboardResults | state:LoadState<MetricsResponse> | Reuse KPIRow, IncomeOutcomeChart and ProfitPercentChart through existing pure utilities. |

When Apply is pressed with valid dates, all home sections shall use the applied inclusive range. A lone start means on/after; a lone end means on/before. Both blank means all data. Reset clears both draft and applied dates and restores all data.
Invalid calendar/format or start > end shall block Apply and show a specific inline error. Valid out-of-dataset dates are allowed and may return zero records; bounds are a reference, not invented API restrictions.
On applied-range changes show loading; discard older request results (cancellation or request version). Never mix a new range header with old results. An empty successful movement result shows zero KPIs and explicit “No financial data for this date range” in chart regions. A failed request shows retry and does not represent missing data as zero. The header shall display applied range/all available dates rather than the inherited hardcoded year.

## Feature 2: anomaly table

| Component | Props | Responsibility |
| --- | --- | --- |
| AnomalyAlertsSection | dateRange:DateRangeFilter | Own threshold draft/applied value, monthly summary and raw API alert state. |
| ThresholdInput | value:string; onChange:(value:string)=>void; onApply:()=>void; error:string\|null; disabled:boolean | Labeled ratio input min 0.01 max 1 step 0.01; initial 0.3; helper “0.30 = 30%”. Blank/nonfinite/out-of-range values block Apply; valid values with more precision remain acceptable. |
| AnomalyAlertsTable | state:LoadState<RollingAlertRow[]>; threshold:number; onRetry:()=>void | Four columns: Period, Recorded outcome, Previous 3 periods average, Increase (%). |

Position below existing home charts. Preserve threshold when dates change; reset dates does not reset threshold. Threshold Apply with valid value recomputes derived rows and refreshes raw alerts request for the same dates.

The API /alerts uses all earlier periods. To meet the PM's exact previous-three requirement, the visible table shall derive rows from /summary?group_by=month using each period's preceding three populated summary entries within the applied date range. Require three earlier entries; do not pad absent calendar months with zero. Baseline = sum(previous three outcome)/3; skip baseline <= 0; include only (outcome-baseline)/baseline > threshold. Compare unrounded values; round display only. No pre-range history is included because the existing API filters before summarizing. Show a helper “Requires three earlier periods within the selected range.”
/alerts response remains typed and is checked as API evidence, but its candidate list shall not filter the rolling rows: doing so could miss valid three-period anomalies. Summary is authoritative for the visible table. Failure of summary shows table error/retry. Failure of the nonauthoritative raw alerts request shows a separate “API alert reference unavailable” status and does not erase correctly derived rows.
Successful zero rows shall render “No spending anomalies found for this date range and threshold.” Fewer than four populated periods shall render “Not enough periods to calculate a 3-period average.” These states never remove the table heading, threshold control or columns.

## Feature 3: business comparison

| Component | Props | Responsibility |
| --- | --- | --- |
| BusinessComparisonPage | none | Own independent date state and reuse DateRangeFilter/AvailableDateRange; route /comparison; home link and comparison link in navigation. |
| BusinessCategoryPanel | businessType:BusinessType; categories:Category[]; state:LoadState<{rows:TopCategoriesResponse; totalIncome:number}>; onRetry:()=>void | Heading B2B or B2C; category/income/share table; descending totals, at most five rows. |
| BusinessIncomeComparisonChart | state:LoadState<{B2B:number; B2C:number}>; onRetry:()=>void | One chart below both panels with two labeled bars, zero-based common axis and textual totals. |

Two panels side by side on desktop; stack in B2B then B2C order on narrow screens. Each panel explicitly requests operation_type=income, limit=5, business_type matching its heading and applied dates. For each group's denominator/chart total, sum income across /summary?group_by=month&operation_type=income&business_type={group} with identical dates. Never sum only the top five for group total.
Share = category total_amount / complete group total * 100; show one decimal. If total is zero, show 0.0%, never NaN/Infinity. API amounts are already rounded; formatting must not imply exact underlying accounting precision.
Facets supplies a global category vocabulary. Use the same returned vocabulary for both panels; restrict returned row category names to this vocabulary and map labels for display. Do not invent per-group facets or zero rows. If a group-specific available list is needed, intersect its returned category rows with facets, labeled “income categories represented”, not all possible group categories.
Empty B2B shows “No B2B income categories for this date range”; empty B2C shows the corresponding message. Do not fabricate five rows when API returns fewer. If one panel fails, keep the other usable, show group-specific retry and chart error until both totals succeed. Both totals zero shows explicit “No income for either business line in this date range” with textual $0 values. Facets failure shows reference/category error and retry, not invented category choices.
