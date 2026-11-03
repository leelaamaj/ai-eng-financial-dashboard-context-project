/** Wire types from backend/app/routes.py; validation evidence: verification.md. */
export type OperationType = "income" | "outcome";
/** Exact category values accepted by the API. Options displayed by UI come from facets. */
export type Category = "suppliers" | "sales" | "operational" | "administrative" | "others";
/** Exact business-line values. */
export type BusinessType = "B2B" | "B2C";
/** Supported aggregation units. */
export type GroupBy = "day" | "week" | "month";

export interface FacetsResponse {
  /** Available operation types; values income or outcome. */
  operation_types: OperationType[];
  /** Available business types; values B2B or B2C. */
  business_types: BusinessType[];
  /** Global available categories, not grouped by business type. */
  categories: Category[];
  /** Earliest dataset date, YYYY-MM-DD. */
  min_date: string;
  /** Latest dataset date, YYYY-MM-DD. */
  max_date: string;
}
export interface AlertEntry {
  /** Aggregated period: YYYY-MM-DD, YYYY-Www or YYYY-MM according to group_by. */
  period: string;
  /** Recorded spending for this period, rounded to two decimal places. */
  outcome_total: number;
  /** API mean of ALL earlier populated periods, rounded to two decimals; NOT rolling three. */
  baseline_average: number;
  /** Fractional increase over API baseline, rounded to four decimals; 0.3 means 30%. */
  increase_ratio: number;
}
/** Bare JSON array; the API returns no alerts wrapper. */
export type AlertsResponse = AlertEntry[];
export interface CategoryEntry {
  /** Category identifier from the API category enum and facets vocabulary. */
  category: Category;
  /** Operation selected by request: income or outcome. */
  operation_type: OperationType;
  /** Aggregated amount for this category, rounded to two decimals. */
  total_amount: number;
}
/** Bare JSON array, descending total_amount, at most limit rows. */
export type TopCategoriesResponse = CategoryEntry[];
export interface MovementEntry {
  /** Movement date in YYYY-MM-DD format. */
  create_date: string;
  /** Movement amount as a JSON number; synthetic dataset uses positive amounts. */
  amount: number;
  /** income or outcome. */
  operation_type: OperationType;
  /** Exact category identifier. */
  category: Category;
  /** B2B or B2C. */
  business_type: BusinessType;
}
/** Bare array returned by /api/metrics. */
export type MetricsResponse = MovementEntry[];
export interface SummaryEntry {
  /** YYYY-MM-DD, YYYY-Www or YYYY-MM according to group_by. */
  period: string;
  /** Income sum for period, rounded to two decimals. */
  income: number;
  /** Outcome sum for period, rounded to two decimals. */
  outcome: number;
  /** Income minus outcome, rounded to two decimals. */
  net: number;
}
/** Chronologically ascending populated periods; missing periods are omitted. */
export type SummaryResponse = SummaryEntry[];
