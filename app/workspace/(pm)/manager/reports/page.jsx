"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ExportSection from "../../../../../components/workspace/pm/reports/ExportSection";
import ProjectStatusAnalytics from "../../../../../components/workspace/pm/reports/ProjectStatusAnalytics";
import LeaveApprovalReports from "../../../../../components/workspace/pm/reports/LeaveApprovalReports";
import HourLogsReports from "../../../../../components/workspace/pm/reports/HourLogsReports";
import TeamReports from "../../../../../components/workspace/pm/reports/TeamReports";
import ProjectReports from "../../../../../components/workspace/pm/reports/ProjectReports";
import ReportFilters from "../../../../../components/workspace/pm/reports/ReportFilters";
import ReportStatsCards from "../../../../../components/workspace/pm/reports/ReportStatsCards";
import ReportsSkeleton from "../../../../../components/workspace/pm/reports/ReportsSkeleton";


export default function ProjectManagerReportsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [projects, setProjects] = useState([]);
  const [hourLogs, setHourLogs] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projectSummaries, setProjectSummaries] = useState({});
  
  // Filters
  const [projectFilter, setProjectFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("");
  
  const [activeTab, setActiveTab] = useState("projects");

  const fetchData = useCallback(async (showRefreshToast = false) => {
    try {
      const [projectsRes, hourLogsRes, leaveRes, teamsRes] = await Promise.allSettled([
        apiRequest("/projects/my?per_page=100"),
        apiRequest("/hour-logs?per_page=500"),
        apiRequest("/leave/requests/pending/pm"),
        apiRequest("/teams/my"),
      ]);

      // Process Projects
      if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
        setProjects(projectsRes.value.data);
      }

      // Process Hour Logs
      if (hourLogsRes.status === "fulfilled" && hourLogsRes.value?.data) {
        setHourLogs(hourLogsRes.value.data);
      }

      // Process Leave Requests
      if (leaveRes.status === "fulfilled" && leaveRes.value?.data) {
        setLeaveRequests(leaveRes.value.data);
      }

      // Process Teams & Members
      if (teamsRes.status === "fulfilled" && teamsRes.value?.data) {
        const teamData = teamsRes.value.data;
        const members = teamData.members || [];
        setTeamMembers(members);
      }

      // Fetch project summaries for each project
      const summaries = {};
      if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
        for (const project of projectsRes.value.data) {
          try {
            const summaryRes = await apiRequest(`/hour-logs/project/${project.id}/summary`);
            if (summaryRes.status && summaryRes.data) {
              summaries[project.id] = summaryRes.data;
            }
          } catch (error) {
            console.error(`Failed to fetch summary for project ${project.id}:`, error);
          }
        }
        setProjectSummaries(summaries);
      }

      if (showRefreshToast) {
        gooeyToast.success("Reports Refreshed", {
          description: "Report data has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch report data:", error);
      gooeyToast.error("Failed to Load Reports", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const handleResetFilters = () => {
    setProjectFilter("");
    setTeamFilter("");
    setEmployeeFilter("");
    setDateRange({ from: "", to: "" });
    setStatusFilter("");
  };

  // Filter data based on selections
  const filteredProjects = projects.filter(project => {
    if (projectFilter && project.id.toString() !== projectFilter) return false;
    if (statusFilter && project.status !== statusFilter) return false;
    return true;
  });

  const filteredHourLogs = hourLogs.filter(log => {
    if (projectFilter && log.project_id?.toString() !== projectFilter) return false;
    if (employeeFilter && log.user_id?.toString() !== employeeFilter) return false;
    if (dateRange.from && log.log_date < dateRange.from) return false;
    if (dateRange.to && log.log_date > dateRange.to) return false;
    return true;
  });

  const filteredLeaveRequests = leaveRequests.filter(request => {
    if (projectFilter && request.project_id?.toString() !== projectFilter) return false;
    if (employeeFilter && request.user_id?.toString() !== employeeFilter) return false;
    if (statusFilter && request.status !== statusFilter) return false;
    return true;
  });

  // Calculate stats
  const stats = {
    totalProjects: projects.length,
    ongoingProjects: projects.filter(p => p.status === "ongoing").length,
    completedProjects: projects.filter(p => p.status === "delivered").length,
    totalHourLogs: hourLogs.length,
    pendingApprovals: leaveRequests.length,
    totalTeamMembers: teamMembers.length,
    totalHoursLogged: hourLogs.filter(l => l.status === "approved").reduce((sum, l) => sum + (l.hours_logged || 0), 0),
  };

  if (loading) {
    return <ReportsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Reports & Analytics
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Comprehensive reports for your projects and team
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
          <ReportStatsCards stats={stats} />

          {/* Filters */}
          <ReportFilters
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            teamFilter={teamFilter}
            setTeamFilter={setTeamFilter}
            employeeFilter={employeeFilter}
            setEmployeeFilter={setEmployeeFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            projects={projects}
            teamMembers={teamMembers}
            onReset={handleResetFilters}
          />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="projects" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="team" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Team
                </TabsTrigger>
                <TabsTrigger value="hourlogs" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Hour Logs
                </TabsTrigger>
                <TabsTrigger value="leave" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Leave Approvals
                </TabsTrigger>
                <TabsTrigger value="analytics" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="projects" className="space-y-4 sm:space-y-6">
              <ProjectReports 
                projects={filteredProjects} 
                projectSummaries={projectSummaries}
              />
            </TabsContent>

            <TabsContent value="team" className="space-y-4 sm:space-y-6">
              <TeamReports 
                teamMembers={teamMembers}
                projects={projects}
              />
            </TabsContent>

            <TabsContent value="hourlogs" className="space-y-4 sm:space-y-6">
              <HourLogsReports 
                hourLogs={filteredHourLogs}
                projects={projects}
              />
            </TabsContent>

            <TabsContent value="leave" className="space-y-4 sm:space-y-6">
              <LeaveApprovalReports 
                leaveRequests={filteredLeaveRequests}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
              <ProjectStatusAnalytics 
                projects={projects}
                hourLogs={hourLogs}
                leaveRequests={leaveRequests}
              />
            </TabsContent>
          </Tabs>

          {/* Export Section */}
          <ExportSection />
        </div>
      </div>
    </DashboardLayout>
  );
}