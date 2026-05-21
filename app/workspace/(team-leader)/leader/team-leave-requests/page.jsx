"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ApproveRejectDialog from "../../../../../components/workspace/team-leder/leave-requests/ApproveRejectDialog";
import LeaveDetailsModal from "../../../../../components/workspace/team-leder/leave-requests/LeaveDetailsModal";
import LeaveRequestsTable from "../../../../../components/workspace/team-leder/leave-requests/LeaveRequestsTable";
import LeaveRequestFilters from "../../../../../components/workspace/team-leder/leave-requests/LeaveRequestFilters";
import LeaveRequestsSkeleton from "../../../../../components/workspace/team-leder/leave-requests/LeaveRequestsSkeleton";

export default function TeamLeaderLeaveRequestsPage() {
  const { apiRequest } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [projects, setProjects] = useState([]);

  const fetchLeaveRequests = useCallback(
    async (showRefreshToast = false) => {
      try {
        if (!projectFilter) {
          setLeaveRequests([]);
          setLoading(false);
          setRefreshing(false);
          return;
        }

        const params = new URLSearchParams();
        params.append("project_id", projectFilter);

        if (fromDate) params.append("from_date", fromDate);
        if (toDate) params.append("to_date", toDate);

        const response = await apiRequest(
          `/leave/requests/pending/pm?${params.toString()}`,
        );

        if (response.status && response.data) {
          setLeaveRequests(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch leave requests:", {
          status: error.status,
          data: error.data,
          message: error.message,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiRequest, projectFilter, fromDate, toDate],
  );

  //   const fetchProjects = useCallback(async () => {
  //     try {
  //       const response = await apiRequest("/projects/my");
  //       if (response.status && response.data) {
  //         setProjects(response.data);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch projects:", error);
  //     }
  //   }, [apiRequest]);

  useEffect(() => {
    fetchLeaveRequests();
    // fetchProjects();
  }, [fetchLeaveRequests]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaveRequests(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setProjectFilter("");
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
        },
      );

      if (response.status) {
        gooeyToast.success(
          `${action === "approved" ? "Approved" : "Rejected"} Successfully`,
          {
            description: `Leave request has been ${action}.`,
            duration: 3000,
          },
        );

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

  const stats = {
    pending: leaveRequests.length,
    total: leaveRequests.length,
  };

  if (loading) {
    return <LeaveRequestsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Leave Requests
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Review and approve pending leave requests from your team
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Pending Requests</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.pending}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Clock size={18} className="text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Approved This Month</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      —
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Rejected This Month</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      —
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <XCircle size={18} className="text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <LeaveRequestFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            onReset={handleResetFilters}
          />
          {/* Leave Requests Table */}
          <LeaveRequestsTable
            leaveRequests={leaveRequests}
            onViewDetails={handleViewDetails}
            onApprove={(request) => handleOpenAction(request, "approved")}
            onReject={(request) => handleOpenAction(request, "rejected")}
          />
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
