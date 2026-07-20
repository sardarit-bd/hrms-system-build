"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardHeader } from "./DashboardHeader";
import { KPIGrid } from "./KPIGrid";
import { DepartmentChart } from "./DepartmentChart";
import { ProjectStatusChart } from "./ProjectStatusChart";
import { LeaveStatusChart } from "./LeaveStatusChart";
import { RecentActivities } from "./RecentActivities";
import { StatCards } from "./StatCards";
import { EmployeeGrowthChart } from "./EmployeeGrowthChart";
import { DepartmentRadialChart } from "./DepartmentRadialChart";
import { AttendanceOverview } from "./AttendanceOverview";
import { QuickStats } from "./QuickStats";
import { useDashboard } from "@/hooks/useDashboard";
import { motion } from "framer-motion";

export function DashboardContent() {
  const {
    stats,
    statsData,
    departmentChartData,
    projectStatusData,
    leaveStatusData,
    recentActivities,
    isLoading,
    refreshing,
    handleRefresh,
  } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout>
      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
          {/* <DashboardHeader onRefresh={handleRefresh} refreshing={refreshing} /> */}
          <KPIGrid stats={stats} />
          <QuickStats />
          <div className="flex flex-col lg:flex-row gap-6">
            <EmployeeGrowthChart />
            <DepartmentRadialChart />
          </div>
          <AttendanceOverview />
          <div className="flex flex-col lg:flex-row gap-6">
            <DepartmentChart data={departmentChartData} />
            <ProjectStatusChart data={projectStatusData} />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <LeaveStatusChart data={leaveStatusData} />
            <RecentActivities activities={recentActivities} />
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
