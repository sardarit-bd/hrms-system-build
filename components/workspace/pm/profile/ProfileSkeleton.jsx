"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-end">
          <Skeleton className="h-7 sm:h-9 w-16 sm:w-24" />
        </div>
        
        {/* Profile Header Skeleton */}
        <div className="rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#1B2B4B] to-[#2A3D6B] px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full" />
              <div className="flex-1 text-center sm:text-left space-y-2">
                <Skeleton className="h-6 sm:h-7 w-40 sm:w-48 mx-auto sm:mx-0" />
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
                  <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                  <Skeleton className="h-3 sm:h-4 w-24 sm:w-28" />
                </div>
              </div>
              <Skeleton className="h-8 sm:h-9 w-20 sm:w-28" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <Skeleton className="h-8 sm:h-9 w-48 sm:w-64" />

        {/* Content Skeleton */}
        <div className="rounded-lg border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
            <Skeleton className="h-5 sm:h-6 w-32 sm:w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-7 sm:h-8 w-16 sm:w-20" />
              <Skeleton className="h-7 sm:h-8 w-20 sm:w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1 sm:space-y-2">
                <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                <Skeleton className="h-8 sm:h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}