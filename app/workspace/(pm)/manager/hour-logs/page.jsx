"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import HourLogDetailsModal from "../../../../../components/workspace/pm/hour-logs/HourLogDetailsModal";
import HourLogsTable from "../../../../../components/workspace/pm/hour-logs/HourLogsTable";
import HourLogsFilters from "../../../../../components/workspace/pm/hour-logs/HourLogsFilters";
import HourLogsCharts from "../../../../../components/workspace/pm/hour-logs/HourLogsCharts";
import ProjectSummaryCard from "../../../../../components/workspace/pm/hour-logs/ProjectSummaryCard";
import HourLogStatsCards from "../../../../../components/workspace/pm/hour-logs/HourLogStatsCards";
import HourLogsSkeleton from "../../../../../components/workspace/pm/hour-logs/HourLogsSkeleton";

export default function ProjectManagerHourLogsPage() {
  const { apiRequest } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hourLogs, setHourLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [projects, setProjects] = useState([]);
  const [projectSummary, setProjectSummary] = useState(null);
  const [employees, setEmployees] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchHourLogs = useCallback(
    async (showRefreshToast = false) => {
      try {
        const params = new URLSearchParams();

        if (projectFilter !== "all") {
          params.append("project_id", projectFilter);
        }

        if (employeeFilter !== "all") {
          params.append("user_id", employeeFilter);
        }

        if (fromDate) {
          params.append("from_date", fromDate);
        }

        if (toDate) {
          params.append("to_date", toDate);
        }

        params.append("per_page", "100");

        const response = await apiRequest(`/hour-logs?${params.toString()}`);

        if (response.status && response.data) {
          setHourLogs(response.data);
        }

        if (showRefreshToast) {
          gooeyToast.success("Hour Logs Refreshed", {
            description: "Hour logs have been updated.",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch hour logs:", error);
        console.log("HOUR LOG ERROR STATUS:", error.status);
        console.log("HOUR LOG ERROR DATA:", error.data);

        gooeyToast.error("Failed to Load Hour Logs", {
          description: error.data?.message || error.message,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiRequest, projectFilter, employeeFilter, fromDate, toDate]
  );

  const fetchProjects = useCallback(async () => {
    try {
      const response = await apiRequest("/projects/my?per_page=100");

      if (response.status && response.data) {
        const projectList = response.data;
        setProjects(projectList);

        const employeesMap = new Map();

        projectList.forEach((project) => {
          const members =
            project.team?.members ||
            project.teams?.flatMap((team) => team.members || []) ||
            [];

          members.forEach((member) => {
            const employee = member.user || member;

            if (employee?.id) {
              employeesMap.set(employee.id, employee);
            }
          });
        });

        setEmployees(Array.from(employeesMap.values()));
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      console.log("PROJECT ERROR STATUS:", error.status);
      console.log("PROJECT ERROR DATA:", error.data);

      setProjects([]);
      setEmployees([]);
    }
  }, [apiRequest]);

  const fetchProjectSummary = useCallback(async () => {
    if (!projectFilter || projectFilter === "all") {
      setProjectSummary(null);
      return;
    }

    try {
      const response = await apiRequest(
        `/hour-logs/project/${projectFilter}/summary`
      );

      if (response.status && response.data) {
        setProjectSummary(response.data);
      } else {
        setProjectSummary(null);
      }
    } catch (error) {
      console.error("Failed to fetch project summary:", error);
      console.log("SUMMARY ERROR STATUS:", error.status);
      console.log("SUMMARY ERROR DATA:", error.data);

      setProjectSummary(null);
    }
  }, [apiRequest, projectFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchHourLogs();
  }, [fetchHourLogs]);

  useEffect(() => {
    fetchProjectSummary();
  }, [fetchProjectSummary]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHourLogs(true);
    fetchProjects();
    fetchProjectSummary();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setProjectFilter("all");
    setEmployeeFilter("all");
    setFromDate("");
    setToDate("");
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDetailsModalOpen(true);
  };

  const handleApprove = async (logId) => {
    try {
      const response = await apiRequest(`/hour-logs/${logId}/approve`, {
        method: "PATCH",
      });

      if (response.status) {
        gooeyToast.success("Hour Log Approved", {
          description: "Hour log has been approved successfully.",
          duration: 3000,
        });

        fetchHourLogs(true);
        fetchProjectSummary();
      }
    } catch (error) {
      gooeyToast.error("Approval Failed", {
        description: error.data?.message || error.message,
      });
    }
  };

  const handleReject = async (logId) => {
    try {
      const response = await apiRequest(`/hour-logs/${logId}/reject`, {
        method: "PATCH",
      });

      if (response.status) {
        gooeyToast.success("Hour Log Rejected", {
          description: "Hour log has been rejected.",
          duration: 3000,
        });

        fetchHourLogs(true);
        fetchProjectSummary();
      }
    } catch (error) {
      gooeyToast.error("Rejection Failed", {
        description: error.data?.message || error.message,
      });
    }
  };

  const filteredLogs = hourLogs.filter((log) => {
    if (statusFilter && log.status !== statusFilter) {
      return false;
    }

    if (
      searchTerm &&
      !log.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const stats = {
    pending: hourLogs.filter((l) => l.status === "pending").length,
    approved: hourLogs.filter((l) => l.status === "approved").length,
    rejected: hourLogs.filter((l) => l.status === "rejected").length,
    totalHours: hourLogs
      .filter((l) => l.status === "approved")
      .reduce((sum, l) => sum + (l.hours_logged || 0), 0),
  };

  if (loading) {
    return <HourLogsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 p-3 sm:space-y-6 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Hour Logs
              </h1>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                Review and approve team hour logs
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-1 cursor-pointer text-xs sm:gap-2 sm:text-sm"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <HourLogStatsCards stats={stats} />

          {projectFilter !== "all" && projectSummary && (
            <ProjectSummaryCard summary={projectSummary} />
          )}

          <HourLogsCharts hourLogs={hourLogs} projects={projects} />

          <HourLogsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            employeeFilter={employeeFilter}
            setEmployeeFilter={setEmployeeFilter}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            projects={projects}
            employees={employees}
            onReset={handleResetFilters}
          />

          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="space-y-4 sm:space-y-6"
          >
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full gap-1 sm:min-w-0">
                <TabsTrigger
                  value="pending"
                  className="cursor-pointer px-3 text-xs sm:px-4 sm:text-sm"
                >
                  Pending
                  {stats.pending > 0 && (
                    <span className="ml-1 rounded-full bg-yellow-200 px-1.5 py-0.5 text-xs text-yellow-800 sm:ml-2">
                      {stats.pending}
                    </span>
                  )}
                </TabsTrigger>

                <TabsTrigger
                  value="approved"
                  className="cursor-pointer px-3 text-xs sm:px-4 sm:text-sm"
                >
                  Approved
                </TabsTrigger>

                <TabsTrigger
                  value="rejected"
                  className="cursor-pointer px-3 text-xs sm:px-4 sm:text-sm"
                >
                  Rejected
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={statusFilter} className="space-y-4 sm:space-y-6">
              <HourLogsTable
                hourLogs={filteredLogs}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
                onReject={handleReject}
                statusFilter={statusFilter}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <HourLogDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        hourLog={selectedLog}
      />
    </DashboardLayout>
  );
}