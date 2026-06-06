import { DashboardLayout } from "../../../dashboard-layout";
import {Skeleton} from "../../../ui/skeleton"

function EmployeesListSkeleton() {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Skeleton className="h-10 col-span-2" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <div className="rounded-lg border">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-48 flex-1" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-8" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }


export { EmployeesListSkeleton }