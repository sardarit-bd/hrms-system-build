import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <div className="flex flex-col gap-6 p-4 sm:p-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>

          {/* KPI Grid Skeleton (Flexbox instead of Grid) */}
          <div className="flex flex-wrap gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-28 rounded-lg flex-1 min-w-[240px]"
              />
            ))}
          </div>

          {/* Charts Row 1 Skeleton */}
          <div className="flex flex-col lg:flex-row gap-6">
            <Skeleton className="h-96 rounded-lg flex-1 min-w-[300px]" />
            <Skeleton className="h-96 rounded-lg flex-1 min-w-[300px]" />
          </div>

          {/* Charts Row 2 Skeleton */}
          <div className="flex flex-col lg:flex-row gap-6">
            <Skeleton className="h-96 rounded-lg flex-1 min-w-[300px]" />
            <Skeleton className="h-96 rounded-lg flex-1 min-w-[300px]" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
