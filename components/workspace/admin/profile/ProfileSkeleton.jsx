import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "../../../dashboard-layout";

export function ProfileSkeleton() {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6 max-w-5xl mx-auto">
          <Skeleton className="h-40 rounded-lg" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }