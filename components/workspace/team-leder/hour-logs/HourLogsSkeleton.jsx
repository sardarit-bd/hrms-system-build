"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function HourLogsSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-32 rounded-lg" />
        <div className="rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-8" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}