import { DashboardLayout } from "../../../dashboard-layout";
import {Skeleton} from "../../../ui/skeleton"

export function DashboardSkeleton() {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
          <div className="space-y-6 p-4 sm:p-6">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96 rounded-lg" />
              <Skeleton className="h-96 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96 rounded-lg" />
              <Skeleton className="h-96 rounded-lg" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }