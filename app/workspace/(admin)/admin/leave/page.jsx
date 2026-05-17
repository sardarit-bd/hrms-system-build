"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import LeaveTypesManager from "../../../../../components/workspace/admin/Leave/LeaveTypesManager";
import LeaveRequestsTable from "../../../../../components/workspace/admin/Leave/LeaveRequestsTable";
import LeaveFilters from "../../../../../components/workspace/admin/Leave/LeaveFilters";


export default function LeaveManagementPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  // Active tab
  const [activeTab, setActiveTab] = useState("requests");

  const fetchLeaveRequests = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("per_page", perPage);
      params.append("page", currentPage);
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (leaveTypeFilter) params.append("leave_type_id", leaveTypeFilter);
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      
      const response = await apiRequest(`/leave/requests?${params.toString()}`);
      
      if (response.status && response.data) {
        setLeaveRequests(response.data);
        setTotal(response.meta?.total || response.data.length);
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
  }, [apiRequest, perPage, currentPage, searchTerm, statusFilter, leaveTypeFilter, fromDate, toDate]);

  const fetchLeaveTypes = useCallback(async () => {
    try {
      const response = await apiRequest("/leave/types");
      if (response.status && response.data) {
        setLeaveTypes(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch leave types:", error);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchLeaveRequests();
    fetchLeaveTypes();
  }, [fetchLeaveRequests, fetchLeaveTypes]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaveRequests();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setLeaveTypeFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  if (loading) {
    return <LeaveManagementSkeleton />;
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
                Manage leave requests, approvals, and leave types
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="requests" className="cursor-pointer">
                Leave Requests
              </TabsTrigger>
              <TabsTrigger value="types" className="cursor-pointer">
                Leave Types
              </TabsTrigger>
            </TabsList>

            {/* Leave Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              {/* Filters */}
              <LeaveFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                leaveTypeFilter={leaveTypeFilter}
                setLeaveTypeFilter={setLeaveTypeFilter}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                leaveTypes={leaveTypes}
                onReset={resetFilters}
              />

              {/* Leave Requests Table */}
              <LeaveRequestsTable
                leaveRequests={leaveRequests}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                total={total}
                perPage={perPage}
                onRefresh={fetchLeaveRequests}
              />
            </TabsContent>

            {/* Leave Types Tab */}
            <TabsContent value="types" className="space-y-6">
              <LeaveTypesManager
                leaveTypes={leaveTypes}
                onLeaveTypesChange={fetchLeaveTypes}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Loading Skeleton
function LeaveManagementSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="rounded-lg border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}