"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import NotificationsCard from "../../../../components/workspace/gm/dashboard/NotificationsCard";
import PendingGMApprovals from "../../../../components/workspace/gm/dashboard/PendingGMApprovals";
import QuickActions from "../../../../components/workspace/gm/dashboard/QuickActions";
import PayrollSummary from "../../../../components/workspace/gm/dashboard/PayrollSummary";
import UpcomingHolidays from "../../../../components/workspace/gm/dashboard/UpcomingHolidays";
import ProjectSummary from "../../../../components/workspace/gm/dashboard/ProjectSummary";
import DepartmentSummary from "../../../../components/workspace/gm/dashboard/DepartmentSummary";
import EmployeeSummary from "../../../../components/workspace/gm/dashboard/EmployeeSummary";
import CompanyOverview from "../../../../components/workspace/gm/dashboard/CompanyOverview";
import GMCharts from "../../../../components/workspace/gm/dashboard/GMCharts";
import GMStatsCards from "../../../../components/workspace/gm/dashboard/GMStatsCards";
import GMSkeleton from "../../../../components/workspace/gm/dashboard/GMSkeleton";
import { ClockCalendarCard } from "../../../../components/share/clock-calendar-card";

export default function GeneralManagerDashboard() {
  const { apiRequest } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [overdueProjects, setOverdueProjects] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [pendingGMLeaves, setPendingGMLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchDashboardData = useCallback(
    async (showRefreshToast = false) => {
      try {
        const [
          usersRes,
          deptRes,
          projectsRes,
          ongoingRes,
          overdueRes,
          leaveRes,
          pendingGMRes,
          payrollRes,
          notificationsRes,
          holidaysRes,
        ] = await Promise.allSettled([
          apiRequest("/users?per_page=500"),
          apiRequest("/departments"),
          apiRequest("/projects?per_page=200"),
          apiRequest("/projects/ongoing"),
          apiRequest("/projects/overdue"),
          apiRequest("/leave/requests?per_page=200"),
          apiRequest("/leave/requests/pending/gm"),
          apiRequest("/payroll?per_page=100"),
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

        // Process Projects
        if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
          setProjects(projectsRes.value.data);
        }
        if (ongoingRes.status === "fulfilled" && ongoingRes.value?.data) {
          setOngoingProjects(ongoingRes.value.data);
        }
        if (overdueRes.status === "fulfilled" && overdueRes.value?.data) {
          setOverdueProjects(overdueRes.value.data);
        }

        // Process Leave Requests
        if (leaveRes.status === "fulfilled" && leaveRes.value?.data) {
          setLeaveRequests(leaveRes.value.data);
        }
        if (pendingGMRes.status === "fulfilled" && pendingGMRes.value?.data) {
          setPendingGMLeaves(pendingGMRes.value.data);
        }

        // Process Payroll
        if (payrollRes.status === "fulfilled" && payrollRes.value?.data) {
          setPayroll(payrollRes.value.data);
        }

        // Process Notifications
        if (
          notificationsRes.status === "fulfilled" &&
          notificationsRes.value?.data
        ) {
          setNotifications(notificationsRes.value.data);
          const unread = notificationsRes.value.data.filter(
            (n) => !n.is_read,
          ).length;
          setUnreadCount(unread);
        }

        // Process Upcoming Holidays
        if (holidaysRes.status === "fulfilled" && holidaysRes.value?.data) {
          setUpcomingHolidays(holidaysRes.value.data);
        }

        if (showRefreshToast) {
          gooeyToast.success("Dashboard Refreshed", {
            description: "Dashboard data has been updated.",
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
    },
    [apiRequest],
  );

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
    activeEmployees: users.filter((u) => u.status === "active").length,
    totalDepartments: departments.length,
    totalProjects: projects.length,
    ongoingProjects: ongoingProjects.length,
    overdueProjects: overdueProjects.length,
    pendingGMLeaves: pendingGMLeaves.length,
    totalPayroll: payroll.reduce((sum, p) => sum + (p.net_salary || 0), 0),
    notifications: unreadCount,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <GMSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <section className="p-4 sm:p-6 pb-0">
          <ClockCalendarCard currentTime={currentTime} />
        </section>
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                General Manager Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Company-wide overview and strategic insights
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
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <GMStatsCards stats={stats} />

          {/* Charts Row */}
          <GMCharts
            users={users}
            departments={departments}
            projects={projects}
            leaveRequests={leaveRequests}
            payroll={payroll}
          />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-2">
              <CompanyOverview />
              <EmployeeSummary users={users} />
              <DepartmentSummary departments={departments} users={users} />
              <ProjectSummary
                projects={projects}
                ongoingProjects={ongoingProjects}
                overdueProjects={overdueProjects}
              />
              <PayrollSummary payroll={payroll} />
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <QuickActions />
              <PendingGMApprovals
                pendingLeaves={pendingGMLeaves}
                onRefresh={fetchDashboardData}
              />
              <UpcomingHolidays holidays={upcomingHolidays} />
              <NotificationsCard
                notifications={notifications.slice(0, 5)}
                unreadCount={unreadCount}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
