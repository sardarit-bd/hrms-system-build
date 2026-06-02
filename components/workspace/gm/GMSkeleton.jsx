"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function GMSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-1 sm:space-y-2">
            <Skeleton className="h-6 sm:h-7 w-48 sm:w-56" />
            <Skeleton className="h-3 sm:h-4 w-64 sm:w-80" />
          </div>
          <Skeleton className="h-7 sm:h-9 w-16 sm:w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-20 sm:h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Skeleton className="h-64 sm:h-80 rounded-lg" />
          <Skeleton className="h-64 sm:h-80 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}