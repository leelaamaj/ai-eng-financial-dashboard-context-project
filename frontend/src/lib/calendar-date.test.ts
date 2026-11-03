import { expect, it } from "vitest";
import { computeMonthlyData } from "./financial-utils";
import type { FinancialMovement } from "./financial-types";
it("keeps API calendar-month boundaries independent of local timezone", () => {
 const data: FinancialMovement[] = ["2025-11-01", "2025-11-30"].map(create_date => ({create_date, amount:100, operation_type:"income", category:"sales", business_type:"B2B"}));
 expect(computeMonthlyData(data)).toEqual([{month:"Nov 2025",income:200,outcome:0,profitPercent:100}]);
});
