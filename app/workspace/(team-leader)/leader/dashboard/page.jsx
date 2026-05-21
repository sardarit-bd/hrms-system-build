"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import NotificationsCard from "../../../../../components/workspace/team-leder/dashboard/NotificationsCard";
import UpcomingHolidaysCard from "../../../../../components/workspace/team-leder/dashboard/UpcomingHolidaysCard";
import PendingApprovalsCard from "../../../../../components/workspace/team-leder/dashboard/PendingApprovalsCard";
import QuickActions from "../../../../../components/workspace/team-leder/dashboard/QuickActions";
import RecentActivity from "../../../../../components/workspace/team-leder/dashboard/RecentActivity";
import ProjectsList from "../../../../../components/workspace/team-leder/dashboard/ProjectsList";
import DashboardCharts from "../../../../../components/workspace/team-leder/dashboard/DashboardCharts";
import TeamOverviewCards from "../../../../../components/workspace/team-leder/dashboard/TeamOverviewCards";
import TeamMembersList from "../../../../../components/workspace/team-leder/dashboard/TeamMembersList";
import LeaderDashboardSkeleton from "../../../../../components/workspace/team-leder/dashboard/LeaderDashboardSkeleton";


export default function TeamLeaderDashboard() {
  const { user, apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for API data
  const [team, setTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState([]);
  const [pendingHourLogs, setPendingHourLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchDashboardData = useCallback(async (showRefreshToast = false) => {
    if (!user?.id) return;
    
    try {
      const [
        teamRes,
        projectsRes,
        leaveRes,
        hourLogsRes,
        notificationsRes,
        unreadRes,
        holidaysRes,
      ] = await Promise.allSettled([
        apiRequest("/teams/my"),
        apiRequest("/projects/my?per_page=50"),
        apiRequest("/leave/requests/pending/pm"),
        apiRequest("/hour-logs?status=pending&per_page=20"),
        apiRequest("/notifications?per_page=20"),
        apiRequest("/notifications/unread-count"),
        apiRequest("/holidays/upcoming?limit=5"),
      ]);

      // Process Team
      if (teamRes.status === "fulfilled" && teamRes.value?.data) {
        setTeam(teamRes.value.data);
        // Extract team members from response
        if (teamRes.value.data.members) {
          setTeamMembers(teamRes.value.data.members);
        }
      }

      // Process Projects
      if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
        setProjects(projectsRes.value.data);
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
      if (notificationsRes.status === "fulfilled" && notificationsRes.value?.data) {
        setNotifications(notificationsRes.value.data);
      }
      if (unreadRes.status === "fulfilled" && unreadRes.value?.data) {
        setUnreadCount(unreadRes.value.data.unread_count || 0);
      }

      // Process Upcoming Holidays
      if (holidaysRes.status === "fulfilled" && holidaysRes.value?.data) {
        setUpcomingHolidays(holidaysRes.value.data);
      }

      // Build Recent Activities from real data
      const activities = [];
      
      // Add recent leave requests
      if (pendingLeaveRequests.length > 0) {
        activities.push({
          id: "leave-activity",
          type: "leave",
          title: "Pending Leave Requests",
          description: `${pendingLeaveRequests.length} leave request${pendingLeaveRequests.length !== 1 ? "s" : ""} awaiting approval`,
          time: "Now",
        });
      }
      
      // Add recent hour logs
      if (pendingHourLogs.length > 0) {
        activities.push({
          id: "hourlog-activity",
          type: "hourlog",
          title: "Pending Hour Logs",
          description: `${pendingHourLogs.length} hour log${pendingHourLogs.length !== 1 ? "s" : ""} awaiting approval`,
          time: "Now",
        });
      }
      
      // Add project updates
      const ongoingProjects = projects.filter(p => p.status === "ongoing").length;
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
  }, [apiRequest, user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(true);
  };

  if (loading) {
    return <LeaderDashboardSkeleton />;
  }

  const teamName = team?.name || "My Team";
  const memberCount = teamMembers.length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Team Leader Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Welcome back! Here's what's happening with your team.
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
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Team Overview Cards */}
          <TeamOverviewCards
            memberCount={memberCount}
            pendingLeaveCount={pendingLeaveRequests.length}
            pendingHourLogsCount={pendingHourLogs.length}
            activeProjectsCount={projects.filter(p => p.status === "ongoing").length}
          />

          {/* Charts Row */}
          <DashboardCharts
            projects={projects}
            leaveRequests={pendingLeaveRequests}
            hourLogs={pendingHourLogs}
          />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Team Members List */}
              <TeamMembersList members={teamMembers} teamName={teamName} />
              
              {/* Projects List */}
              <ProjectsList projects={projects} />
              
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
              <UpcomingHolidaysCard holidays={upcomingHolidays} />
              
              {/* Notifications */}
              <NotificationsCard
                notifications={notifications}
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