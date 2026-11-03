import type { MonthlyDataPoint } from "@/lib/financial-types";
import { formatCurrency, formatPercent } from "@/lib/financial-utils";

interface ChartDataTableProps {
  data: MonthlyDataPoint[];
  kind: "movements" | "profit";
}

/** Native disclosure and table provide the chart's complete keyboard-readable values. */
export function ChartDataTable({ data, kind }: ChartDataTableProps) {
  const profit = kind === "profit";
  return (
    <details className="mt-4">
      <summary className="cursor-pointer rounded-md px-2 py-3 text-sm font-medium">
        {profit ? "View profit margin data" : "View income and outcome data"}
      </summary>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{profit ? "Monthly profit margins" : "Monthly income and outcome"} in US dollars unless a percentage is shown</caption>
          <thead><tr>
            <th scope="col" className="p-2">Month</th>
            {profit ? <th scope="col" className="p-2">Profit margin</th> : <>
              <th scope="col" className="p-2">Income</th>
              <th scope="col" className="p-2">Outcome</th>
            </>}
          </tr></thead>
          <tbody>{data.map((point) => <tr key={point.month} className="border-t border-border">
            <th scope="row" className="p-2 font-medium">{point.month}</th>
            {profit ? <td className="p-2">{formatPercent(point.profitPercent)}</td> : <>
              <td className="p-2">{formatCurrency(point.income)}</td>
              <td className="p-2">{formatCurrency(point.outcome)}</td>
            </>}
          </tr>)}</tbody>
        </table>
      </div>
    </details>
  );
}
