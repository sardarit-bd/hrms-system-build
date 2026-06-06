// components/gm/profile-skeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Profile Header Card Skeleton */}
        <Card className="bg-white dark:bg-slate-900 overflow-hidden">
          <Skeleton className="h-24 w-full" />
          <div className="relative px-6 pb-6">
            <div className="flex gap-4 -mt-12">
              <Skeleton className="h-28 w-28 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-32 mt-2" />
                <div className="flex gap-4 mt-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-white dark:bg-slate-900 p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-3 w-24 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}