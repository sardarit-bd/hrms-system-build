"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ApproveRejectDialog from "../../../../../components/workspace/pm/leave-requests/ApproveRejectDialog";
import LeaveDetailsModal from "../../../../../components/workspace/pm/leave-requests/LeaveDetailsModal";
import LeaveRequestsTable from "../../../../../components/workspace/pm/leave-requests/LeaveRequestsTable";
import LeaveRequestFilters from "../../../../../components/workspace/pm/leave-requests/LeaveRequestFilters";
import LeaveStatsCards from "../../../../../components/workspace/pm/leave-requests/LeaveStatsCards";
import LeaveRequestsSkeleton from "../../../../../components/workspace/pm/leave-requests/LeaveRequestsSkeleton";

export default function ProjectManagerLeaveRequestsPage() {
  const { apiRequest } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [projects, setProjects] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending_pm");

  const fetchLeaveRequests = useCallback(
    async (projectId, showRefreshToast = false) => {
      try {
        if (!projectId || projectId === "all") {
          setLeaveRequests([]);
          setLoading(false);
          setRefreshing(false);
          return;
        }

        const response = await apiRequest(
          `/leave/requests/pending/pm?project_id=${projectId}`
        );

        if (response.status && response.data) {
          setLeaveRequests(response.data);
        }

        if (showRefreshToast) {
          gooeyToast.success("Leave Requests Refreshed", {
            description: "Pending leave requests have been updated.",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
        console.log("ERROR STATUS:", error.status);
        console.log("ERROR DATA:", error.data);

        gooeyToast.error("Failed to Load Leave Requests", {
          description: error.data?.message || error.message,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiRequest]
  );

  const fetchFilterData = useCallback(async () => {
    try {
      const [projectsRes, leaveTypesRes, employeesRes] =
        await Promise.allSettled([
          apiRequest("/projects/my?per_page=100"),
          apiRequest("/leave/types"),
          apiRequest("/teams/my"),
        ]);

      if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
        const projectList = projectsRes.value.data;
        setProjects(projectList);

        if (projectList.length > 0) {
          setProjectFilter(projectList[0].id.toString());
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }

      if (leaveTypesRes.status === "fulfilled" && leaveTypesRes.value?.data) {
        setLeaveTypes(leaveTypesRes.value.data);
      }

      if (employeesRes.status === "fulfilled" && employeesRes.value?.data) {
        const teamData = employeesRes.value.data;
        const members = teamData.members || [];
        setEmployees(members);
      }
    } catch (error) {
      console.error("Failed to fetch filter data:", error);
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchFilterData();
  }, [fetchFilterData]);

  useEffect(() => {
    if (projectFilter && projectFilter !== "all") {
      fetchLeaveRequests(projectFilter);
    }
  }, [projectFilter, fetchLeaveRequests]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaveRequests(projectFilter, true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");

    if (projects.length > 0) {
      setProjectFilter(projects[0].id.toString());
    } else {
      setProjectFilter("all");
    }

    setLeaveTypeFilter("all");
    setEmployeeFilter("all");
    setFromDate("");
    setToDate("");
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const handleOpenAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleApproveReject = async (requestId, action, remarks) => {
    setActionLoading(true);

    try {
      const response = await apiRequest(
        `/leave/requests/${requestId}/pm-action`,
        {
          method: "POST",
          body: JSON.stringify({ action, remarks }),
        }
      );

      if (response.status) {
        gooeyToast.success(
          `${action === "approved" ? "Approved" : "Rejected"} Successfully`,
          {
            description: `Leave request has been ${action}.`,
            duration: 3000,
          }
        );

        setActionDialogOpen(false);
        setSelectedRequest(null);
        fetchLeaveRequests(projectFilter, true);
      }
    } catch (error) {
      gooeyToast.error("Action Failed", {
        description: error.data?.message || error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = leaveRequests.filter((request) => {
    if (
      searchTerm &&
      !request.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (
      projectFilter !== "all" &&
      request.project?.id?.toString() !== projectFilter
    ) {
      return false;
    }

    if (
      leaveTypeFilter !== "all" &&
      request.leave_type?.id?.toString() !== leaveTypeFilter
    ) {
      return false;
    }

    if (
      employeeFilter !== "all" &&
      request.user?.id?.toString() !== employeeFilter
    ) {
      return false;
    }

    if (fromDate && request.from_date < fromDate) {
      return false;
    }

    if (toDate && request.to_date > toDate) {
      return false;
    }

    if (statusFilter && request.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const stats = {
    pending: leaveRequests.filter((l) => l.status === "pending_pm").length,
    approved: leaveRequests.filter((l) => l.status === "approved").length,
    rejected: leaveRequests.filter((l) => l.status === "rejected").length,
    totalDays: leaveRequests.reduce((sum, l) => sum + (l.total_days || 0), 0),
  };

  if (loading) {
    return <LeaveRequestsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Leave Requests
              </h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Review and approve leave requests from your team
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing || projectFilter === "all"}
              className="gap-2 cursor-pointer"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <LeaveStatsCards stats={stats} />

          <LeaveRequestFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            leaveTypeFilter={leaveTypeFilter}
            setLeaveTypeFilter={setLeaveTypeFilter}
            employeeFilter={employeeFilter}
            setEmployeeFilter={setEmployeeFilter}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            projects={projects}
            leaveTypes={leaveTypes}
            employees={employees}
            onReset={handleResetFilters}
          />

          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="space-y-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="pending_pm" className="cursor-pointer">
                Pending
                {stats.pending > 0 && (
                  <span className="ml-2 rounded-full bg-yellow-200 px-1.5 py-0.5 text-xs text-yellow-800">
                    {stats.pending}
                  </span>
                )}
              </TabsTrigger>

              <TabsTrigger value="approved" className="cursor-pointer">
                Approved
              </TabsTrigger>

              <TabsTrigger value="rejected" className="cursor-pointer">
                Rejected
              </TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="space-y-6">
              <LeaveRequestsTable
                leaveRequests={filteredRequests}
                onViewDetails={handleViewDetails}
                onApprove={(request) => handleOpenAction(request, "approved")}
                onReject={(request) => handleOpenAction(request, "rejected")}
                statusFilter={statusFilter}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <LeaveDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        request={selectedRequest}
      />

      <ApproveRejectDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        request={selectedRequest}
        action={actionType}
        onConfirm={handleApproveReject}
        loading={actionLoading}
      />
    </DashboardLayout>
  );
}