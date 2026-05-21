"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
      <div className="space-y-6 p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-end">
          <Skeleton className="h-9 w-24" />
        </div>
        
        {/* Profile Header Skeleton */}
        <div className="rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#1B2B4B] to-[#2A3D6B] px-6 py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1 text-center md:text-left space-y-2">
                <Skeleton className="h-7 w-48 mx-auto md:mx-0" />
                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <Skeleton className="h-10 w-64" />

        {/* Content Skeleton */}
        <div className="rounded-lg border p-6">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}