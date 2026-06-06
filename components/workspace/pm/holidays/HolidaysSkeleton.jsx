"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function HolidaysSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="space-y-1 sm:space-y-2">
            <Skeleton className="h-6 sm:h-7 w-32 sm:w-40" />
            <Skeleton className="h-3 sm:h-4 w-48 sm:w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-7 sm:h-9 w-20 sm:w-24" />
            <Skeleton className="h-7 sm:h-9 w-16 sm:w-20" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 sm:h-20 rounded-lg" />
          ))}
        </div>

        {/* Tabs Skeleton */}
        <Skeleton className="h-8 sm:h-9 w-48 sm:w-64" />

        {/* Content Skeleton */}
        <div className="rounded-lg border p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
                <div className="flex-1 space-y-1 sm:space-y-2">
                  <Skeleton className="h-4 sm:h-5 w-32 sm:w-48" />
                  <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
                </div>
                <Skeleton className="h-6 sm:h-7 w-20 sm:w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}