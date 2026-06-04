"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function HolidaySkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="space-y-1 sm:space-y-2">
            <Skeleton className="h-6 sm:h-7 w-40 sm:w-48" />
            <Skeleton className="h-3 sm:h-4 w-56 sm:w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-7 sm:h-9 w-24 sm:w-28" />
            <Skeleton className="h-7 sm:h-9 w-16 sm:w-20" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-4 sm:p-5 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Table Skeleton */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {/* Table Header */}
          <div className="bg-muted/50 p-3 sm:p-4 border-b">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20 hidden sm:block" />
              <Skeleton className="h-4 w-28 hidden sm:block" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-3 sm:p-4">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 items-center">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-20 hidden sm:block" />
                  <Skeleton className="h-5 w-32 hidden sm:block" />
                  <div className="flex gap-1">
                    <Skeleton className="h-7 w-7 rounded" />
                    <Skeleton className="h-7 w-7 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-28" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    </DashboardLayout>
  );
}