"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ApproveRejectDialog from "../../../../components/workspace/gm/leave-approvals/ApproveRejectDialog";
import LeaveDetailsModal from "../../../../components/workspace/gm/leave-approvals/LeaveDetailsModal";
import LeaveRequestsTable from "../../../../components/workspace/gm/leave-approvals/LeaveRequestsTable";
import LeaveFilters from "../../../../components/workspace/gm/leave-approvals/LeaveFilters";
import LeaveStatsCards from "../../../../components/workspace/gm/leave-approvals/LeaveStatsCards";
import LeaveSkeleton from "../../../../components/workspace/gm/leave-approvals/LeaveSkeleton";


export default function GMLeaveApprovalsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending_gm");
  const [activeTab, setActiveTab] = useState("pending");

  const fetchLeaveRequests = useCallback(async (showRefreshToast = false) => {
    try {
      // Fetch all leave requests and pending GM requests
      const [allRes, pendingRes] = await Promise.allSettled([
        apiRequest("/leave/requests?per_page=200"),
        apiRequest("/leave/requests/pending/gm"),
      ]);

      let allData = [];
      let pendingData = [];

      if (allRes.status === "fulfilled" && allRes.value?.data) {
        allData = allRes.value.data;
        setLeaveRequests(allData);
      }
      if (pendingRes.status === "fulfilled" && pendingRes.value?.data) {
        pendingData = pendingRes.value.data;
        setPendingLeaves(pendingData);
      }

      // Extract unique employees, leave types, projects from data
      const allLeaves = [...allData, ...pendingData];
      const uniqueEmployees = new Map();
      const uniqueLeaveTypes = new Map();
      const uniqueProjects = new Map();

      allLeaves.forEach(leave => {
        if (leave.user && !uniqueEmployees.has(leave.user.id)) {
          uniqueEmployees.set(leave.user.id, leave.user);
        }
        if (leave.leave_type && !uniqueLeaveTypes.has(leave.leave_type.id)) {
          uniqueLeaveTypes.set(leave.leave_type.id, leave.leave_type);
        }
        if (leave.project && !uniqueProjects.has(leave.project.id)) {
          uniqueProjects.set(leave.project.id, leave.project);
        }
      });

      setEmployees(Array.from(uniqueEmployees.values()));
      setLeaveTypes(Array.from(uniqueLeaveTypes.values()));
      setProjects(Array.from(uniqueProjects.values()));

      if (showRefreshToast) {
        gooeyToast.success("Leave Requests Refreshed", {
          description: "Pending leave requests have been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch leave requests:", error);
      gooeyToast.error("Failed to Load Leave Requests", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaveRequests(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setProjectFilter("");
    setLeaveTypeFilter("");
    setEmployeeFilter("");
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
      const response = await apiRequest(`/leave/requests/${requestId}/gm-action`, {
        method: "POST",
        body: JSON.stringify({ action, remarks }),
      });

      if (response.status) {
        gooeyToast.success(`${action === "approved" ? "Approved" : "Rejected"} Successfully`, {
          description: `Leave request has been ${action}.`,
          duration: 3000,
        });
        
        setActionDialogOpen(false);
        setSelectedRequest(null);
        fetchLeaveRequests(true);
      }
    } catch (error) {
      gooeyToast.error("Action Failed", {
        description: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Filter requests based on status
  const getFilteredRequests = () => {
    let requests = [];
    if (activeTab === "pending") {
      requests = pendingLeaves;
    } else if (activeTab === "approved") {
      requests = leaveRequests.filter(l => l.status === "approved");
    } else if (activeTab === "rejected") {
      requests = leaveRequests.filter(l => l.status === "rejected");
    }
    
    // Apply additional filters
    return requests.filter(request => {
      if (searchTerm && !request.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (projectFilter && request.project?.id.toString() !== projectFilter) return false;
      if (leaveTypeFilter && request.leave_type?.id.toString() !== leaveTypeFilter) return false;
      if (employeeFilter && request.user?.id.toString() !== employeeFilter) return false;
      if (fromDate && request.from_date < fromDate) return false;
      if (toDate && request.to_date > toDate) return false;
      return true;
    });
  };

  const filteredRequests = getFilteredRequests();

  // Stats
  const stats = {
    pending: pendingLeaves.length,
    approved: leaveRequests.filter(l => l.status === "approved").length,
    rejected: leaveRequests.filter(l => l.status === "rejected").length,
    totalDays: leaveRequests.reduce((sum, l) => sum + (l.total_days || 0), 0),
  };

  if (loading) {
    return <LeaveSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Leave Approvals
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Review and approve GM-level leave requests
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
          <LeaveStatsCards stats={stats} />

          {/* Filters */}
          <LeaveFilters
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="pending" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Pending GM
                  {stats.pending > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-full">
                      {stats.pending}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Approved
                </TabsTrigger>
                <TabsTrigger value="rejected" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Rejected
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="space-y-4 sm:space-y-6">
              <LeaveRequestsTable
                leaveRequests={filteredRequests}
                onViewDetails={handleViewDetails}
                onApprove={(request) => handleOpenAction(request, "approved")}
                onReject={(request) => handleOpenAction(request, "rejected")}
                statusFilter={activeTab}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Leave Details Modal */}
      <LeaveDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        request={selectedRequest}
      />

      {/* Approve/Reject Dialog */}
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