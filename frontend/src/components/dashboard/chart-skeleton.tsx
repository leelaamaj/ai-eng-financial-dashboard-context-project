import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Reserve chart layout while data or the chart module loads. */
export function ChartSkeleton() {
  return <Card className="min-h-[420px] border-border/60" aria-hidden="true">
    <CardHeader><Skeleton className="h-5 w-52" /><Skeleton className="h-3 w-full max-w-64" /></CardHeader>
    <CardContent><Skeleton className="h-[280px] w-full rounded-lg" /></CardContent>
  </Card>;
}
