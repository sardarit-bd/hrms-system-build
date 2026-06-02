"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import PayrollDetailsModal from "../../../../components/workspace/gm/payroll/PayrollDetailsModal";
import PayrollTable from "../../../../components/workspace/gm/payroll/PayrollTable";
import PayrollFilters from "../../../../components/workspace/gm/payroll/PayrollFilters";
import PayrollCharts from "../../../../components/workspace/gm/payroll/PayrollCharts";
import PayrollStatsCards from "../../../../components/workspace/gm/payroll/PayrollStatsCards";
import PayrollSkeleton from "../../../../components/workspace/gm/payroll/PayrollSkeleton";


export default function GMPayrollPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [quarterFilter, setQuarterFilter] = useState("");
  
  const [activeTab, setActiveTab] = useState("list");

  const fetchPayroll = useCallback(async (showRefreshToast = false) => {
    try {
      const params = new URLSearchParams();
      params.append("per_page", perPage);
      params.append("page", currentPage);
      if (employeeFilter) params.append("user_id", employeeFilter);
      if (monthFilter) params.append("payroll_month", monthFilter);
      if (statusFilter) params.append("payroll_status", statusFilter);
      if (yearFilter) params.append("year", yearFilter);
      if (quarterFilter) params.append("quarter", quarterFilter);
      
      const response = await apiRequest(`/payroll?${params.toString()}`);
      
      if (response.status && response.data) {
        setPayrollRecords(response.data);
        setTotal(response.meta?.total || response.data.length);
        
        // Extract unique employees from payroll data
        const uniqueEmployees = new Map();
        response.data.forEach(record => {
          if (record.user && !uniqueEmployees.has(record.user.id)) {
            uniqueEmployees.set(record.user.id, record.user);
          }
        });
        setEmployees(Array.from(uniqueEmployees.values()));
      }

      if (showRefreshToast) {
        gooeyToast.success("Payroll Data Refreshed", {
          description: "Payroll records have been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch payroll:", error);
      gooeyToast.error("Failed to Load Payroll", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest, perPage, currentPage, employeeFilter, monthFilter, statusFilter, yearFilter, quarterFilter]);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayroll(true);
  };

  const handleResetFilters = () => {
    setEmployeeFilter("");
    setMonthFilter("");
    setStatusFilter("");
    setYearFilter(new Date().getFullYear().toString());
    setQuarterFilter("");
    setCurrentPage(1);
  };

  const handleViewDetails = async (record) => {
    try {
      const response = await apiRequest(`/payroll/${record.id}`);
      if (response.status && response.data) {
        setSelectedRecord(response.data);
        setDetailsModalOpen(true);
      }
    } catch (error) {
      gooeyToast.error("Failed to Load Details", {
        description: error.message,
      });
    }
  };

  const handleApprovePayroll = async (record) => {
    if (!confirm(`Are you sure you want to approve payroll for ${record.user?.full_name}?`)) return;
    
    try {
      const response = await apiRequest(`/payroll/${record.id}/approve`, {
        method: "PATCH",
      });

      if (response.status) {
        gooeyToast.success("Payroll Approved", {
          description: `Payroll for ${record.user?.full_name} has been approved.`,
        });
        fetchPayroll(true);
      }
    } catch (error) {
      gooeyToast.error("Approval Failed", {
        description: error.message,
      });
    }
  };

  const handleMarkAsPaid = async (record) => {
    if (!confirm(`Are you sure you want to mark payroll as paid for ${record.user?.full_name}?`)) return;
    
    try {
      const response = await apiRequest(`/payroll/${record.id}/paid`, {
        method: "PATCH",
      });

      if (response.status) {
        gooeyToast.success("Payroll Marked as Paid", {
          description: `Payroll for ${record.user?.full_name} has been marked as paid.`,
        });
        fetchPayroll(true);
      }
    } catch (error) {
      gooeyToast.error("Action Failed", {
        description: error.message,
      });
    }
  };

  // Calculate stats
  const stats = {
    totalRecords: payrollRecords.length,
    draftCount: payrollRecords.filter(p => p.payroll_status === "draft").length,
    approvedCount: payrollRecords.filter(p => p.payroll_status === "approved").length,
    paidCount: payrollRecords.filter(p => p.payroll_status === "paid").length,
    totalNetSalary: payrollRecords.reduce((sum, p) => sum + (p.net_salary || 0), 0),
    totalDeductions: payrollRecords.reduce((sum, p) => sum + (p.total_deductions || 0), 0),
  };

  const totalPages = Math.ceil(total / perPage);

  if (loading) {
    return <PayrollSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Payroll Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage employee payroll, approvals, and payments
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
          <PayrollStatsCards stats={stats} />

          {/* Charts */}
          <PayrollCharts payrollRecords={payrollRecords} />

          {/* Filters */}
          <PayrollFilters
            employeeFilter={employeeFilter}
            setEmployeeFilter={setEmployeeFilter}
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
            quarterFilter={quarterFilter}
            setQuarterFilter={setQuarterFilter}
            employees={employees}
            onReset={handleResetFilters}
          />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="list" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  All Records
                  <span className="ml-1 sm:ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                    {stats.totalRecords}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="draft" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Draft
                  {stats.draftCount > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-full">
                      {stats.draftCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Approved
                  {stats.approvedCount > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded-full">
                      {stats.approvedCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="paid" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Paid
                  {stats.paidCount > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full">
                      {stats.paidCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="space-y-4 sm:space-y-6">
              <PayrollTable
                payrollRecords={payrollRecords}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                total={total}
                perPage={perPage}
                totalPages={totalPages}
                employees={employees}
                onViewDetails={handleViewDetails}
                onApprovePayroll={handleApprovePayroll}
                onMarkAsPaid={handleMarkAsPaid}
                statusFilter={activeTab}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Payroll Details Modal */}
      <PayrollDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        record={selectedRecord}
      />
    </DashboardLayout>
  );
}