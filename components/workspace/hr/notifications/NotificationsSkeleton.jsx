"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 max-w-5xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="space-y-1 sm:space-y-2">
            <Skeleton className="h-6 sm:h-7 w-32 sm:w-40" />
            <Skeleton className="h-3 sm:h-4 w-48 sm:w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-7 sm:h-9 w-16 sm:w-20" />
            <Skeleton className="h-7 sm:h-9 w-20 sm:w-24" />
            <Skeleton className="h-7 sm:h-9 w-24 sm:w-32" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 sm:h-20 rounded-lg" />
          ))}
        </div>

        {/* Filters Skeleton */}
        <Skeleton className="h-28 sm:h-32 rounded-lg" />

        {/* Tabs Skeleton */}
        <Skeleton className="h-8 sm:h-9 w-48 sm:w-64" />

        {/* Notifications List Skeleton */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-lg border p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
                <div className="flex-1 space-y-1 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
                    <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
                  </div>
                  <Skeleton className="h-3 sm:h-4 w-full" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                  <div className="flex gap-2 mt-1">
                    <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                    <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded" />
                  <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}