"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, DollarSign, TrendingUp } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import PayrollDetailsModal from "../../../../../components/workspace/employee/payroll/PayrollDetailsModal";
import QuarterlySummaryCard from "../../../../../components/workspace/employee/payroll/QuarterlySummaryCard";
import PayrollTable from "../../../../../components/workspace/employee/payroll/PayrollTable";
import PayrollFilters from "../../../../../components/workspace/employee/payroll/PayrollFilters";
import PayrollSummaryCards from "../../../../../components/workspace/employee/payroll/PayrollSummaryCards";


export default function EmployeePayrollPage() {
  const { user, apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [quarterlyData, setQuarterlyData] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [quarterFilter, setQuarterFilter] = useState("");

  const fetchPayrollData = useCallback(async (showRefreshToast = false) => {
    if (!user?.id) return;
    
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("payroll_status", statusFilter);
      if (yearFilter) params.append("year", yearFilter);
      
      const [payrollRes, quarterlyRes] = await Promise.allSettled([
        apiRequest(`/payroll/my?${params.toString()}`),
        apiRequest(`/payroll/user/${user.id}/quarterly?year=${yearFilter}&quarter=${quarterFilter || 1}`),
      ]);

      if (payrollRes.status === "fulfilled" && payrollRes.value?.data) {
        setPayrollRecords(payrollRes.value.data);
      }
      if (quarterlyRes.status === "fulfilled" && quarterlyRes.value?.data) {
        setQuarterlyData(quarterlyRes.value.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Payroll Data Refreshed", {
          description: "Your payroll information has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch payroll data:", error);
      gooeyToast.error("Failed to Load Data", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest, user?.id, statusFilter, yearFilter, quarterFilter]);

  useEffect(() => {
    fetchPayrollData();
  }, [fetchPayrollData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayrollData(true);
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

  const handlePrintPayslip = (record) => {
    // Open print window with payslip data
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payslip - ${record.payroll_month}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .company { font-size: 24px; font-weight: bold; color: #1B2B4B; }
          .payslip-title { font-size: 20px; margin: 10px 0; }
          .employee-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .salary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .salary-table th, .salary-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .salary-table th { background: #f5f5f5; }
          .total-row { font-weight: bold; background: #f5f5f5; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company">Sardar IT HRMS</div>
          <div class="payslip-title">Salary Payslip</div>
          <div>Month: ${record.payroll_month}</div>
        </div>
        <div class="employee-info">
          <div class="info-row"><strong>Employee Name:</strong> <span>${record.user?.full_name || "N/A"}</span></div>
          <div class="info-row"><strong>Employee Code:</strong> <span>${record.user?.employee_code || "N/A"}</span></div>
          <div class="info-row"><strong>Department:</strong> <span>${record.user?.department || "N/A"}</span></div>
          <div class="info-row"><strong>Designation:</strong> <span>${record.user?.designation || "N/A"}</span></div>
        </div>
        <table class="salary-table">
          <tr><th>Description</th><th>Amount</th></tr>
          <tr><td>Basic Salary</td><td>${record.basic_salary?.toLocaleString()} BDT</td></tr>
          <tr><td>Gross Salary</td><td>${record.gross_salary?.toLocaleString()} BDT</td></tr>
          <tr><td>Total Deductions</td><td>${(record.total_deductions || 0).toLocaleString()} BDT</td></tr>
          <tr class="total-row"><td>Net Salary</td><td>${record.net_salary?.toLocaleString()} BDT</td></tr>
        </table>
        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return <PayrollSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                My Payroll
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                View your salary details and payment history
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

          {/* Summary Cards */}
          <PayrollSummaryCards payrollRecords={payrollRecords} />

          {/* Tabs */}
          <Tabs defaultValue="monthly" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="monthly" className="cursor-pointer">
                <DollarSign size={14} className="mr-2" />
                Monthly Records
              </TabsTrigger>
              <TabsTrigger value="quarterly" className="cursor-pointer">
                <TrendingUp size={14} className="mr-2" />
                Quarterly Summary
              </TabsTrigger>
            </TabsList>

            {/* Monthly Records Tab */}
            <TabsContent value="monthly" className="space-y-6">
              {/* Filters */}
              <PayrollFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                onRefresh={fetchPayrollData}
              />

              {/* Payroll Table */}
              <PayrollTable
                payrollRecords={payrollRecords}
                onViewDetails={handleViewDetails}
                onPrintPayslip={handlePrintPayslip}
              />
            </TabsContent>

            {/* Quarterly Summary Tab */}
            <TabsContent value="quarterly" className="space-y-6">
              <QuarterlySummaryCard
                quarterlyData={quarterlyData}
                yearFilter={yearFilter}
                quarterFilter={quarterFilter}
                setQuarterFilter={setQuarterFilter}
                onRefresh={fetchPayrollData}
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

// Loading Skeleton
function PayrollSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </DashboardLayout>
  );
}