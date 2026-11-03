import type { BusinessType, Category, GroupBy, OperationType } from "./api-types";
/** Calendar dates, inclusive; validate format and order before issuing requests. */
export interface DateRangeFilter {
  /** Optional inclusive start, YYYY-MM-DD; omit entirely when input is empty. */
  start_date?: string;
  /** Optional inclusive end, YYYY-MM-DD; omit entirely when input is empty. */
  end_date?: string;
}
export interface MetricsParams extends DateRangeFilter {
  /** Optional category identifier; omit to include every category. */
  category?: Category;
  /** Optional income/outcome selector; omit to include both. */
  operation_type?: OperationType;
}
export interface AlertsParams extends DateRangeFilter {
  /** API default 0.3, API minimum 0 with no maximum; UI restricts finite ratios to 0.01..1 inclusive. */
  threshold?: number;
  /** day, week or month; API default month; feature fixes month. */
  group_by?: GroupBy;
  /** Optional B2B/B2C filter; home omits to include both. */
  business_type?: BusinessType;
}
export interface TopCategoriesParams extends DateRangeFilter {
  /** income or outcome; API default outcome; comparison explicitly sends income. */
  operation_type?: OperationType;
  /** Integer 1..20; API default 5; comparison explicitly sends 5. */
  limit?: number;
  /** B2B or B2C; comparison must send the corresponding panel value. */
  business_type?: BusinessType;
}
export interface SummaryParams extends DateRangeFilter {
  /** Aggregation: day, week or month; default month. */
  group_by?: GroupBy;
  /** Optional category, omitted for group totals and anomaly history. */
  category?: Category;
  /** Optional income/outcome; comparison sends income, anomaly history omits. */
  operation_type?: OperationType;
  /** Optional B2B/B2C selector; required by comparison's application logic. */
  business_type?: BusinessType;
}
