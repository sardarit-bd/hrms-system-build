"use client";

import { useState, useEffect } from "react";
import {
  useGetAdminDashboardStatsQuery,
  useGetDepartmentDistributionQuery,
  useGetProjectStatusQuery,
  useGetLeaveStatusQuery,
  useGetRecentActivitiesQuery,
} from "@/store/modules/dashboardApi";
import {
  transformDepartmentData,
  transformProjectStatusData,
  transformLeaveStatusData,
} from "@/lib/dashboard-utils";

export function useDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const { data: statsData, isLoading: statsLoading } =
    useGetAdminDashboardStatsQuery();
  const { data: departmentData, isLoading: deptLoading } =
    useGetDepartmentDistributionQuery();
  const { data: projectData, isLoading: projectLoading } =
    useGetProjectStatusQuery();
  const { data: leaveData, isLoading: leaveLoading } = useGetLeaveStatusQuery();
  const { data: activitiesData, isLoading: activitiesLoading } =
    useGetRecentActivitiesQuery();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Transform data for charts
  const departmentChartData = transformDepartmentData(departmentData);
  const projectStatusData = transformProjectStatusData(projectData);
  const leaveStatusData = transformLeaveStatusData(leaveData);
  const recentActivities = activitiesData?.slice(0, 5) || [];

  // Extract stats
  const stats = {
    totalEmployees: statsData?.total_employees || 0,
    activeEmployees: statsData?.active_employees || 0,
    departments: statsData?.total_departments || 0,
    ongoingProjects: statsData?.ongoing_projects || 0,
    pendingLeaveRequests: statsData?.pending_leaves || 0,
    totalPayroll: statsData?.total_payroll || 0,
  };

  const isLoading =
    statsLoading ||
    deptLoading ||
    projectLoading ||
    leaveLoading ||
    activitiesLoading;

  return {
    currentTime,
    refreshing,
    stats,
    statsData,
    departmentChartData,
    projectStatusData,
    leaveStatusData,
    recentActivities,
    isLoading,
    handleRefresh,
  };
}
