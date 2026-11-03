import { lazy, Suspense, useEffect, useState } from "react";
import { ChartSkeleton } from "@/components/dashboard/chart-skeleton";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
const IncomeOutcomeChart = lazy(() => import("@/components/dashboard/income-outcome-chart").then(module => ({ default: module.IncomeOutcomeChart })));
const ProfitPercentChart = lazy(() => import("@/components/dashboard/profit-percent-chart").then(module => ({ default: module.ProfitPercentChart })));
import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(signal: AbortSignal): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchFinancialData(controller.signal)
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setError(
          "Unable to load financial data. Check the backend API and reload the page.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
    <a className="skip-link" href="#dashboard-content">Skip to dashboard</a>
    <main id="dashboard-content" tabIndex={-1}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period="All available data" />
          <p className="sr-only" role="status">{loading ? "Loading financial dashboard" : error ? "" : "Financial dashboard loaded"}</p>

          {error ? (
            <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              {error}
            </div>
          ) : null}

          <div aria-busy={loading}>
          <section aria-label="Key performance indicators">
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          {!error ? <section
            aria-label="Financial charts"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            {loading ? <><ChartSkeleton /><ChartSkeleton /></> : (
              <Suspense fallback={<><ChartSkeleton /><ChartSkeleton /></>}>
                <IncomeOutcomeChart data={monthlyData} />
                <ProfitPercentChart data={monthlyData} />
              </Suspense>
            )}
          </section> : null}
          </div>
        </div>
      </div>
    </main>
    </div>
  );
}

export default App;
