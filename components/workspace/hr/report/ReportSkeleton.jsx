"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-1 sm:space-y-2">
            <Skeleton className="h-6 sm:h-7 w-40 sm:w-48" />
            <Skeleton className="h-3 sm:h-4 w-56 sm:w-64" />
          </div>
          <Skeleton className="h-7 sm:h-9 w-16 sm:w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-20 sm:h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-28 sm:h-32 rounded-lg" />
        <Skeleton className="h-8 sm:h-9 w-64 sm:w-80" />
        <div className="hidden sm:block rounded-lg border">
          <div className="p-3 sm:p-4 border-b">
            <div className="flex gap-3 sm:gap-4">
              <Skeleton className="h-4 sm:h-5 w-32" />
              <Skeleton className="h-4 sm:h-5 w-48" />
              <Skeleton className="h-4 sm:h-5 w-32" />
              <Skeleton className="h-4 sm:h-5 w-24" />
            </div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b">
              <Skeleton className="h-4 sm:h-5 w-32" />
              <Skeleton className="h-4 sm:h-5 w-48" />
              <Skeleton className="h-4 sm:h-5 w-32" />
              <Skeleton className="h-4 sm:h-5 w-24" />
            </div>
          ))}
        </div>
        <div className="sm:hidden space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}