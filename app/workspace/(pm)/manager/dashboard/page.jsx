"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import PendingApprovalsCard from "../../../../../components/workspace/pm/dashboard/PendingApprovalsCard";
import QuickActions from "../../../../../components/workspace/pm/dashboard/QuickActions";
import RecentActivity from "../../../../../components/workspace/pm/dashboard/RecentActivity";
import ProjectProgressChart from "../../../../../components/workspace/pm/dashboard/ProjectProgressChart";
import TeamSummary from "../../../../../components/workspace/pm/dashboard/TeamSummary";
import ProjectsOverview from "../../../../../components/workspace/pm/dashboard/ProjectsOverview";
import DashboardCharts from "../../../../../components/workspace/pm/dashboard/DashboardCharts";
import ProjectStatsCards from "../../../../../components/workspace/pm/dashboard/ProjectStatsCards";
import ManagerDashboardSkeleton from "../../../../../components/workspace/pm/dashboard/ManagerDashboardSkeleton";
import { ClockCalendarCard } from "../../../../../components/share/clock-calendar-card";

export default function ProjectManagerDashboard() {
  const { user, apiRequest } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State for API data
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState([]);
  const [pendingHourLogs, setPendingHourLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchDashboardData = useCallback(
    async (showRefreshToast = false) => {
      if (!user?.id) return;

      try {
        const [
          projectsRes,
          teamsRes,
          leaveRes,
          hourLogsRes,
          notificationsRes,
          unreadRes,
          holidaysRes,
        ] = await Promise.allSettled([
          apiRequest("/projects/my?per_page=50"),
          apiRequest("/teams/my"),
          apiRequest("/leave/requests/pending/pm"),
          apiRequest("/hour-logs?status=pending&per_page=20"),
          apiRequest("/notifications?per_page=20"),
          apiRequest("/notifications/unread-count"),
          apiRequest("/holidays/upcoming?limit=5"),
        ]);

        // Process Projects
        if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
          setProjects(projectsRes.value.data);
        }

        // Process Teams
        if (teamsRes.status === "fulfilled" && teamsRes.value?.data) {
          const teamsData = teamsRes.value.data;
          setTeams(teamsData);

          // Extract team members
          const members = [];
          if (Array.isArray(teamsData)) {
            teamsData.forEach((team) => {
              if (team.members) {
                members.push(...team.members);
              }
            });
          } else if (teamsData.members) {
            members.push(...teamsData.members);
          }
          setTeamMembers(members);
        }

        // Process Pending Leave Requests
        if (leaveRes.status === "fulfilled" && leaveRes.value?.data) {
          setPendingLeaveRequests(leaveRes.value.data);
        }

        // Process Pending Hour Logs
        if (hourLogsRes.status === "fulfilled" && hourLogsRes.value?.data) {
          setPendingHourLogs(hourLogsRes.value.data);
        }

        // Process Notifications
        if (
          notificationsRes.status === "fulfilled" &&
          notificationsRes.value?.data
        ) {
          setNotifications(notificationsRes.value.data);
        }
        if (unreadRes.status === "fulfilled" && unreadRes.value?.data) {
          setUnreadCount(unreadRes.value.data.unread_count || 0);
        }

        // Process Upcoming Holidays
        if (holidaysRes.status === "fulfilled" && holidaysRes.value?.data) {
          setUpcomingHolidays(holidaysRes.value.data);
        }

        // Build Recent Activities
        const activities = [];

        if (pendingLeaveRequests.length > 0) {
          activities.push({
            id: "leave-activity",
            type: "leave",
            title: "Pending Leave Requests",
            description: `${pendingLeaveRequests.length} leave request${pendingLeaveRequests.length !== 1 ? "s" : ""} awaiting approval`,
            time: "Now",
          });
        }

        if (pendingHourLogs.length > 0) {
          activities.push({
            id: "hourlog-activity",
            type: "hourlog",
            title: "Pending Hour Logs",
            description: `${pendingHourLogs.length} hour log${pendingHourLogs.length !== 1 ? "s" : ""} awaiting approval`,
            time: "Now",
          });
        }

        const ongoingProjects = projects.filter(
          (p) => p.status === "ongoing",
        ).length;
        if (ongoingProjects > 0) {
          activities.push({
            id: "project-activity",
            type: "project",
            title: "Active Projects",
            description: `${ongoingProjects} project${ongoingProjects !== 1 ? "s" : ""} currently ongoing`,
            time: "Active",
          });
        }

        setRecentActivities(activities.slice(0, 5));

        if (showRefreshToast) {
          gooeyToast.success("Dashboard Refreshed", {
            description: "Your dashboard data has been updated.",
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
    [apiRequest, user?.id],
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
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "ongoing").length,
    teamMembersCount: teamMembers.length,
    pendingApprovals: pendingLeaveRequests.length + pendingHourLogs.length,
    completedProjects: projects.filter((p) => p.status === "delivered").length,
    totalTeamLeads: teams.length,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <ManagerDashboardSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <section className="p-4 sm:p-6 pb-0">
          <ClockCalendarCard currentTime={currentTime} />
        </section>
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Project Manager Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Welcome back! Here's what's happening with your projects and
                team.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2 cursor-pointer"
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
          <ProjectStatsCards stats={stats} />

          {/* Charts Row */}
          <DashboardCharts
            projects={projects}
            hourLogs={pendingHourLogs}
            leaveRequests={pendingLeaveRequests}
          />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Projects Overview */}
              <ProjectsOverview projects={projects} />

              {/* Team Summary */}
              <TeamSummary teams={teams} teamMembers={teamMembers} />

              {/* Project Progress Chart */}
              <ProjectProgressChart projects={projects} />

              {/* Recent Activity */}
              <RecentActivity activities={recentActivities} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <QuickActions />

              {/* Pending Approvals */}
              <PendingApprovalsCard
                pendingLeaveRequests={pendingLeaveRequests}
                pendingHourLogs={pendingHourLogs}
                onRefresh={fetchDashboardData}
              />

              {/* Upcoming Holidays */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Upcoming Holidays
                </h3>
                {upcomingHolidays.length === 0 ? (
                  <p className="text-sm text-gray-500">No upcoming holidays</p>
                ) : (
                  <div className="space-y-2">
                    {upcomingHolidays.slice(0, 3).map((holiday) => (
                      <div
                        key={holiday.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {holiday.name}
                        </span>
                        <span className="text-gray-500">
                          {new Date(holiday.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-[#C9A84C] text-white px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">No notifications</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
