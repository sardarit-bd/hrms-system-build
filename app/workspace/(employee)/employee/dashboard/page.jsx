"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { gooeyToast } from "@/components/ui/goey-toaster";
import RecentNotifications from "../../../../../components/workspace/employee/dashboard/RecentNotifications";
import UpcomingHolidays from "../../../../../components/workspace/employee/dashboard/UpcomingHolidays";
import PayrollSummary from "../../../../../components/workspace/employee/dashboard/PayrollSummary";
import QuickActions from "../../../../../components/workspace/employee/dashboard/QuickActions";
import HourLogsSummary from "../../../../../components/workspace/employee/dashboard/HourLogsSummary";
import ProjectsList from "../../../../../components/workspace/employee/dashboard/ProjectsList";
import RosterPolicyCard from "../../../../../components/workspace/employee/dashboard/RosterPolicyCard";
import WelcomeHeader from "../../../../../components/workspace/employee/dashboard/WelcomeHeader";
import LeaveSummaryCard from "../../../../../components/workspace/employee/dashboard/LeaveSummaryCard";


export default function EmployeeDashboard() {
  const { user, apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [roster, setRoster] = useState(null);
  const [attendancePolicy, setAttendancePolicy] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [hourLogs, setHourLogs] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const [
        profileRes,
        rosterRes,
        policyRes,
        leaveRes,
        projectsRes,
        hourLogsRes,
        payrollRes,
        holidaysRes,
        notificationsRes,
        unreadRes,
      ] = await Promise.allSettled([
        apiRequest("/auth/me"),
        apiRequest(`/roster/user/${user.id}`),
        apiRequest(`/attendance/policies/user/${user.id}`),
        apiRequest("/leave/requests/my?per_page=10"),
        apiRequest("/projects/my?per_page=10"),
        apiRequest("/hour-logs/my?per_page=10"),
        apiRequest("/payroll/my?per_page=6"),
        apiRequest("/holidays/upcoming?limit=5"),
        apiRequest("/notifications?per_page=10"),
        apiRequest("/notifications/unread-count"),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value?.data) {
        setProfile(profileRes.value.data);
      }
      if (rosterRes.status === "fulfilled" && rosterRes.value?.data) {
        setRoster(rosterRes.value.data);
      }
      if (policyRes.status === "fulfilled" && policyRes.value?.data) {
        setAttendancePolicy(policyRes.value.data);
      }
      if (leaveRes.status === "fulfilled" && leaveRes.value?.data) {
        setLeaveRequests(leaveRes.value.data);
      }
      if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
        setProjects(projectsRes.value.data);
      }
      if (hourLogsRes.status === "fulfilled" && hourLogsRes.value?.data) {
        setHourLogs(hourLogsRes.value.data);
      }
      if (payrollRes.status === "fulfilled" && payrollRes.value?.data) {
        setPayroll(payrollRes.value.data);
      }
      if (holidaysRes.status === "fulfilled" && holidaysRes.value?.data) {
        setHolidays(holidaysRes.value.data);
      }
      if (notificationsRes.status === "fulfilled" && notificationsRes.value?.data) {
        setNotifications(notificationsRes.value.data);
      }
      if (unreadRes.status === "fulfilled" && unreadRes.value?.data) {
        setUnreadCount(unreadRes.value.data.unread_count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      gooeyToast.error("Failed to Load Dashboard", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [apiRequest, user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Welcome Header */}
          <WelcomeHeader profile={profile} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Roster & Policy Card */}
              <RosterPolicyCard roster={roster} attendancePolicy={attendancePolicy} />
              
              {/* Projects List */}
              <ProjectsList projects={projects} />
              
              {/* Hour Logs Summary */}
              <HourLogsSummary hourLogs={hourLogs} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <QuickActions />
              
              {/* Leave Summary */}
              <LeaveSummaryCard leaveRequests={leaveRequests} />
              
              {/* Payroll Summary */}
              <PayrollSummary payroll={payroll} />
              
              {/* Upcoming Holidays */}
              <UpcomingHolidays holidays={holidays} />
              
              {/* Recent Notifications */}
              <RecentNotifications notifications={notifications} unreadCount={unreadCount} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}