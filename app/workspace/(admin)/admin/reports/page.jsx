"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileText, Calendar, Users, Briefcase, DollarSign } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ExportSection from "../../../../../components/workspace/admin/report/ExportSection";
import DepartmentReports from "../../../../../components/workspace/admin/report/DepartmentReports";
import ProjectReports from "../../../../../components/workspace/admin/report/ProjectReports";
import PayrollReports from "../../../../../components/workspace/admin/report/PayrollReports";
import LeaveReports from "../../../../../components/workspace/admin/report/LeaveReports";
import EmployeeReports from "../../../../../components/workspace/admin/report/EmployeeReports";
import ReportFilters from "../../../../../components/workspace/admin/report/ReportFilters";
import AnalyticsCharts from "../../../../../components/workspace/admin/report/AnalyticsCharts";


export default function ReportsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payroll, setPayroll] = useState([]);
  
  // Filters
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  
  const [activeTab, setActiveTab] = useState("employee");

  const fetchAllData = useCallback(async (showRefreshToast = false) => {
    try {
      const [usersRes, deptRes, projectsRes, leaveRes, payrollRes] = await Promise.allSettled([
        apiRequest("/users?per_page=500"),
        apiRequest("/departments"),
        apiRequest("/projects?per_page=200"),
        apiRequest("/leave/requests?per_page=500"),
        apiRequest("/payroll?per_page=200"),
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
      if (leaveRes.status === "fulfilled" && leaveRes.value?.data) {
        setLeaveRequests(leaveRes.value.data);
      }
      if (payrollRes.status === "fulfilled" && payrollRes.value?.data) {
        setPayroll(payrollRes.value.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Reports Refreshed", {
          description: "All report data has been updated.",
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
    fetchAllData();
  }, [fetchAllData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllData(true);
  };

  const resetFilters = () => {
    setDateRange({ from: "", to: "" });
    setSelectedDepartment("");
    setSelectedEmployee("");
    setSelectedStatus("");
    setSelectedProject("");
  };

  if (loading) {
    return <ReportsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Reports & Analytics
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Comprehensive HR analytics and reporting dashboard
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

          {/* Filters */}
          <ReportFilters
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            departments={departments}
            users={users}
            projects={projects}
            onReset={resetFilters}
          />

          {/* Analytics Charts */}
          <AnalyticsCharts
            users={users}
            departments={departments}
            projects={projects}
            leaveRequests={leaveRequests}
            payroll={payroll}
          />

          {/* Tabs for different reports */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="employee" className="cursor-pointer">
                <Users size={14} className="mr-2" />
                Employee
              </TabsTrigger>
              <TabsTrigger value="leave" className="cursor-pointer">
                <FileText size={14} className="mr-2" />
                Leave
              </TabsTrigger>
              <TabsTrigger value="payroll" className="cursor-pointer">
                <DollarSign size={14} className="mr-2" />
                Payroll
              </TabsTrigger>
              <TabsTrigger value="project" className="cursor-pointer">
                <Briefcase size={14} className="mr-2" />
                Project
              </TabsTrigger>
              <TabsTrigger value="department" className="cursor-pointer">
                <Calendar size={14} className="mr-2" />
                Department
              </TabsTrigger>
            </TabsList>

            <TabsContent value="employee" className="space-y-6">
              <EmployeeReports
                users={users}
                departments={departments}
                selectedDepartment={selectedDepartment}
              />
            </TabsContent>

            <TabsContent value="leave" className="space-y-6">
              <LeaveReports
                leaveRequests={leaveRequests}
                dateRange={dateRange}
                selectedStatus={selectedStatus}
              />
            </TabsContent>

            <TabsContent value="payroll" className="space-y-6">
              <PayrollReports
                payroll={payroll}
                users={users}
                dateRange={dateRange}
              />
            </TabsContent>

            <TabsContent value="project" className="space-y-6">
              <ProjectReports
                projects={projects}
                selectedStatus={selectedStatus}
                selectedProject={selectedProject}
              />
            </TabsContent>

            <TabsContent value="department" className="space-y-6">
              <DepartmentReports
                departments={departments}
                users={users}
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

// Loading Skeleton
function ReportsSkeleton() {
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
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </DashboardLayout>
  );
}