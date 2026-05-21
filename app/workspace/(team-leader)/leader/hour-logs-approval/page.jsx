"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import HourLogDetailsModal from "../../../../../components/workspace/team-leder/hour-logs/HourLogDetailsModal";
import HourLogsTable from "../../../../../components/workspace/team-leder/hour-logs/HourLogsTable";
import HourLogsFilters from "../../../../../components/workspace/team-leder/hour-logs/HourLogsFilters";
import HourLogsSkeleton from "../../../../../components/workspace/team-leder/hour-logs/HourLogsSkeleton";

export default function TeamLeaderHourLogsPage() {
  const { apiRequest } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hourLogs, setHourLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchHourLogs = useCallback(
    async (showRefreshToast = false) => {
      try {
        const params = new URLSearchParams();

        if (statusFilter) params.append("status", statusFilter);
        if (fromDate) params.append("from_date", fromDate);
        if (toDate) params.append("to_date", toDate);
        if (searchTerm) params.append("search", searchTerm);

        params.append("per_page", "100");

        const response = await apiRequest(`/hour-logs?${params.toString()}`);

        if (response.status && response.data) {
          setHourLogs(Array.isArray(response.data) ? response.data : []);
        }

        if (showRefreshToast) {
          gooeyToast.success("Hour Logs Refreshed", {
            description: "Hour logs have been updated.",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch hour logs:", {
          status: error.status,
          data: error.data,
          message: error.message,
        });

        gooeyToast.error("Failed to Load Hour Logs", {
          description: error.message,
        });

        setHourLogs([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiRequest, statusFilter, fromDate, toDate, searchTerm]
  );

  useEffect(() => {
    fetchHourLogs();
  }, [fetchHourLogs]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHourLogs(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
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
      }
    } catch (error) {
      gooeyToast.error("Approval Failed", {
        description: error.message,
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
      }
    } catch (error) {
      gooeyToast.error("Rejection Failed", {
        description: error.message,
      });
    }
  };

  const stats = {
    pending: hourLogs.filter((log) => log.status === "pending").length,
    approved: hourLogs.filter((log) => log.status === "approved").length,
    rejected: hourLogs.filter((log) => log.status === "rejected").length,
    totalHours: hourLogs
      .filter((log) => log.status === "approved")
      .reduce((sum, log) => sum + Number(log.hours_logged || 0), 0),
  };

  if (loading) {
    return <HourLogsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Hour Logs Approval
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Review and approve pending hour logs from your team
              </p>
            </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pending}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.approved}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.rejected}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalHours}
                </p>
              </CardContent>
            </Card>
          </div>

          <HourLogsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            onReset={handleResetFilters}
          />

          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="space-y-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="pending" className="cursor-pointer">
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="cursor-pointer">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="cursor-pointer">
                Rejected
              </TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="space-y-6">
              <HourLogsTable
                hourLogs={hourLogs}
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