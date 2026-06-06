"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import NotificationsCard from "../../../../../components/workspace/hr/dashboard/NotificationsCard";
import UpcomingHolidaysCard from "../../../../../components/workspace/hr/dashboard/UpcomingHolidaysCard";
import LeaveRequestsSummary from "../../../../../components/workspace/hr/dashboard/LeaveRequestsSummary";
import PendingApprovalsCard from "../../../../../components/workspace/hr/dashboard/PendingApprovalsCard";
import QuickActions from "../../../../../components/workspace/hr/dashboard/QuickActions";
import AttendancePolicySummary from "../../../../../components/workspace/hr/dashboard/AttendancePolicySummary";
import ShiftRosterSummary from "../../../../../components/workspace/hr/dashboard/ShiftRosterSummary";
import DepartmentOverview from "../../../../../components/workspace/hr/dashboard/DepartmentOverview";
import EmployeeSummary from "../../../../../components/workspace/hr/dashboard/EmployeeSummary";
import HRCharts from "../../../../../components/workspace/hr/dashboard/HRCharts";
import HRStatsCards from "../../../../../components/workspace/hr/dashboard/HRStatsCards";
import HRSkeleton from "../../../../../components/workspace/hr/dashboard/HRSkeleton";


export default function HRManagerDashboard() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendancePolicies, setAttendancePolicies] = useState([]);
  const [rosters, setRosters] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);

  const fetchDashboardData = useCallback(async (showRefreshToast = false) => {
    try {
      const [
        usersRes,
        deptRes,
        leaveRes,
        policiesRes,
        rostersRes,
        shiftsRes,
        notificationsRes,
        holidaysRes,
      ] = await Promise.allSettled([
        apiRequest("/users?per_page=500"),
        apiRequest("/departments"),
        apiRequest("/leave/requests?per_page=200"),
        apiRequest("/attendance/policies"),
        apiRequest("/roster?per_page=200"),
        apiRequest("/shifts"),
        apiRequest("/notifications?per_page=20"),
        apiRequest("/holidays/upcoming?limit=5"),
      ]);

      // Process Users
      if (usersRes.status === "fulfilled" && usersRes.value?.data) {
        setUsers(usersRes.value.data);
      }

      // Process Departments
      if (deptRes.status === "fulfilled" && deptRes.value?.data) {
        setDepartments(deptRes.value.data);
      }

      // Process Leave Requests
      if (leaveRes.status === "fulfilled" && leaveRes.value?.data) {
        setLeaveRequests(leaveRes.value.data);
      }

      // Process Attendance Policies
      if (policiesRes.status === "fulfilled" && policiesRes.value?.data) {
        setAttendancePolicies(policiesRes.value.data);
      }

      // Process Rosters
      if (rostersRes.status === "fulfilled" && rostersRes.value?.data) {
        setRosters(rostersRes.value.data);
      }

      // Process Shifts
      if (shiftsRes.status === "fulfilled" && shiftsRes.value?.data) {
        setShifts(shiftsRes.value.data);
      }

      // Process Notifications
      if (notificationsRes.status === "fulfilled" && notificationsRes.value?.data) {
        setNotifications(notificationsRes.value.data);
        // Get unread count
        const unread = notificationsRes.value.data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }

      // Process Upcoming Holidays
      if (holidaysRes.status === "fulfilled" && holidaysRes.value?.data) {
        setUpcomingHolidays(holidaysRes.value.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Dashboard Refreshed", {
          description: "HR dashboard data has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      gooeyToast.error("Failed to Load Dashboard", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(true);
  };

  // Calculate stats
  const stats = {
    totalEmployees: users.length,
    activeEmployees: users.filter(u => u.status === "active").length,
    inactiveEmployees: users.filter(u => u.status === "inactive").length,
    pendingApprovals: users.filter(u => u.status === "pending").length,
    totalDepartments: departments.length,
    pendingLeaveRequests: leaveRequests.filter(l => l.status === "pending_pm" || l.status === "pending_gm").length,
    totalLeaveRequests: leaveRequests.length,
    totalPolicies: attendancePolicies.length,
    activePolicies: attendancePolicies.filter(p => p.is_active).length,
    totalRosters: rosters.length,
    activeRosters: rosters.filter(r => r.is_active).length,
    totalShifts: shifts.length,
  };

  if (loading) {
    return <HRSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                HR Manager Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Overview of HR operations, employees, and workforce analytics
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <HRStatsCards stats={stats} />

          {/* Charts Row */}
          <HRCharts 
            users={users} 
            departments={departments} 
            leaveRequests={leaveRequests} 
            shifts={shifts}
          />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-2">
              <EmployeeSummary users={users} departments={departments} />
              <DepartmentOverview departments={departments} users={users} />
              <ShiftRosterSummary rosters={rosters} shifts={shifts} />
              <AttendancePolicySummary policies={attendancePolicies} />
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <QuickActions />
              <PendingApprovalsCard 
                pendingUsers={users.filter(u => u.status === "pending")}
                pendingLeaves={leaveRequests.filter(l => l.status === "pending_pm" || l.status === "pending_gm")}
                onRefresh={fetchDashboardData}
              />
              <LeaveRequestsSummary leaveRequests={leaveRequests} />
              <UpcomingHolidaysCard holidays={upcomingHolidays} />
              <NotificationsCard
                notifications={notifications.slice(0, 5)} 
                unreadCount={unreadCount}
                onRefresh={fetchDashboardData}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}