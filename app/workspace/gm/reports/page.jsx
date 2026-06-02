"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ExportSection from "../../../../components/workspace/gm/reports/ExportSection";
import AnalyticsDashboard from "../../../../components/workspace/gm/reports/AnalyticsDashboard";
import LeaveReports from "../../../../components/workspace/gm/reports/LeaveReports";
import PayrollReports from "../../../../components/workspace/gm/reports/PayrollReports";
import ProjectReports from "../../../../components/workspace/gm/reports/ProjectReports";
import DepartmentReports from "../../../../components/workspace/gm/reports/DepartmentReports";
import EmployeeReports from "../../../../components/workspace/gm/reports/EmployeeReports";
import ReportFilters from "../../../../components/workspace/gm/reports/ReportFilters";
import ReportStatsCards from "../../../../components/workspace/gm/reports/ReportStatsCards";
import ReportSkeleton from "../../../../components/workspace/gm/reports/ReportSkeleton";


export default function GMReportsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  
  // Filters
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [activeTab, setActiveTab] = useState("employee");

  const fetchData = useCallback(async (showRefreshToast = false) => {
    try {
      const [
        usersRes,
        deptRes,
        projectsRes,
        payrollRes,
        leaveRes,
      ] = await Promise.allSettled([
        apiRequest("/users?per_page=500"),
        apiRequest("/departments"),
        apiRequest("/projects?per_page=200"),
        apiRequest("/payroll?per_page=500"),
        apiRequest("/leave/requests?per_page=500"),
      ]);

      if (usersRes.status === "fulfilled" && usersRes.value?.data) {
        setUsers(usersRes.value.data);
      }
      if (deptRes.status === "fulfilled" && deptRes.value?.data) {
        setDepartments(deptRes.value.data);
      }
      if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
        setProjects(projectsRes.value.data);
      }
      if (payrollRes.status === "fulfilled" && payrollRes.value?.data) {
        setPayroll(payrollRes.value.data);
      }
      if (leaveRes.status === "fulfilled" && leaveRes.value?.data) {
        setLeaveRequests(leaveRes.value.data);
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
    setDepartmentFilter("");
    setEmployeeFilter("");
    setProjectFilter("");
    setStatusFilter("");
    setDateRange({ from: "", to: "" });
  };

  // Filter data
  const filteredUsers = users.filter(user => {
    if (departmentFilter && user.department !== departmentFilter) return false;
    if (statusFilter && user.status !== statusFilter) return false;
    return true;
  });

  const filteredProjects = projects.filter(project => {
    if (projectFilter && project.id.toString() !== projectFilter) return false;
    if (statusFilter && project.status !== statusFilter) return false;
    return true;
  });

  const filteredPayroll = payroll.filter(record => {
    if (employeeFilter && record.user_id?.toString() !== employeeFilter) return false;
    if (dateRange.from && record.payroll_month < dateRange.from) return false;
    if (dateRange.to && record.payroll_month > dateRange.to) return false;
    return true;
  });

  const filteredLeaveRequests = leaveRequests.filter(request => {
    if (statusFilter && request.status !== statusFilter) return false;
    if (dateRange.from && request.from_date < dateRange.from) return false;
    if (dateRange.to && request.to_date > dateRange.to) return false;
    return true;
  });

  const stats = {
    totalEmployees: users.length,
    activeEmployees: users.filter(u => u.status === "active").length,
    totalDepartments: departments.length,
    totalProjects: projects.length,
    ongoingProjects: projects.filter(p => p.status === "ongoing").length,
    totalPayroll: payroll.reduce((sum, p) => sum + (p.net_salary || 0), 0),
    totalLeaveRequests: leaveRequests.length,
  };

  if (loading) {
    return <ReportSkeleton />;
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
                Company-wide HR analytics and business intelligence
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
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            employeeFilter={employeeFilter}
            setEmployeeFilter={setEmployeeFilter}
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            departments={departments}
            users={users}
            projects={projects}
            onReset={handleResetFilters}
          />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="employee" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Employee
                </TabsTrigger>
                <TabsTrigger value="department" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Department
                </TabsTrigger>
                <TabsTrigger value="project" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Project
                </TabsTrigger>
                <TabsTrigger value="payroll" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Payroll
                </TabsTrigger>
                <TabsTrigger value="leave" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Leave
                </TabsTrigger>
                <TabsTrigger value="analytics" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="employee" className="space-y-4 sm:space-y-6">
              <EmployeeReports 
                users={filteredUsers} 
                departments={departments}
              />
            </TabsContent>

            <TabsContent value="department" className="space-y-4 sm:space-y-6">
              <DepartmentReports 
                departments={departments}
                users={users}
              />
            </TabsContent>

            <TabsContent value="project" className="space-y-4 sm:space-y-6">
              <ProjectReports 
                projects={filteredProjects}
              />
            </TabsContent>

            <TabsContent value="payroll" className="space-y-4 sm:space-y-6">
              <PayrollReports 
                payroll={filteredPayroll}
                users={users}
              />
            </TabsContent>

            <TabsContent value="leave" className="space-y-4 sm:space-y-6">
              <LeaveReports 
                leaveRequests={filteredLeaveRequests}
                users={users}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
              <AnalyticsDashboard 
                users={users}
                departments={departments}
                projects={projects}
                payroll={payroll}
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