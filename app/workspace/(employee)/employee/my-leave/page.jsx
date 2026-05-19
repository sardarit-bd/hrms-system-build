"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, CalendarDays } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import LeaveDetailsModal from "../../../../../components/workspace/employee/leave/LeaveDetailsModal";
import ApplyLeaveForm from "../../../../../components/workspace/employee/leave/ApplyLeaveForm";
import LeaveRequestsTable from "../../../../../components/workspace/employee/leave/LeaveRequestsTable";
import LeaveSummaryCards from "../../../../../components/workspace/employee/leave/LeaveSummaryCards";


export default function EmployeeLeavePage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchLeaveData = useCallback(async (showRefreshToast = false) => {
    try {
      const [requestsRes, typesRes] = await Promise.allSettled([
        apiRequest("/leave/requests/my?per_page=50"),
        apiRequest("/leave/types"),
      ]);

      if (requestsRes.status === "fulfilled" && requestsRes.value?.data) {
        setLeaveRequests(requestsRes.value.data);
      }
      if (typesRes.status === "fulfilled" && typesRes.value?.data) {
        setLeaveTypes(typesRes.value.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Leave Data Refreshed", {
          description: "Your leave requests have been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch leave data:", error);
      gooeyToast.error("Failed to Load Data", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchLeaveData();
  }, [fetchLeaveData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaveData(true);
  };

  const handleApplySuccess = () => {
    fetchLeaveData();
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  if (loading) {
    return <LeaveSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Leave Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Apply for leave and track your requests
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

          {/* Tabs */}
          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="requests" className="cursor-pointer">
                <CalendarDays size={14} className="mr-2" />
                My Requests
              </TabsTrigger>
              <TabsTrigger value="apply" className="cursor-pointer">
                Apply Leave
              </TabsTrigger>
            </TabsList>

            {/* My Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              {/* Summary Cards */}
              <LeaveSummaryCards leaveRequests={leaveRequests} />

              {/* Leave Requests Table */}
              <LeaveRequestsTable
                leaveRequests={leaveRequests}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            {/* Apply Leave Tab */}
            <TabsContent value="apply" className="space-y-6">
              <ApplyLeaveForm
                leaveTypes={leaveTypes}
                onSuccess={handleApplySuccess}
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
    </DashboardLayout>
  );
}

// Loading Skeleton
function LeaveSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-7 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </DashboardLayout>
  );
}