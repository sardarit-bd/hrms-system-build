"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ExportSection from "../../../../../components/workspace/hr/report/ExportSection";
import AttendancePolicyReports from "../../../../../components/workspace/hr/report/AttendancePolicyReports";
import RosterShiftReports from "../../../../../components/workspace/hr/report/RosterShiftReports";
import DepartmentReports from "../../../../../components/workspace/hr/report/DepartmentReports";
import LeaveReports from "../../../../../components/workspace/hr/report/LeaveReports";
import EmployeeReports from "../../../../../components/workspace/hr/report/EmployeeReports";
import ReportFilters from "../../../../../components/workspace/hr/report/ReportFilters";
import ReportStatsCards from "../../../../../components/workspace/hr/report/ReportStatsCards";
import ReportSkeleton from "../../../../../components/workspace/hr/report/ReportSkeleton";


export default function HRReportsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [rosters, setRosters] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [holidays, setHolidays] = useState([]);
  
  // Filters
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("employee");

  const fetchData = useCallback(async (showRefreshToast = false) => {
    try {
      const [
        usersRes,
        deptRes,
        leaveRes,
        rostersRes,
        shiftsRes,
        policiesRes,
        holidaysRes,
      ] = await Promise.allSettled([
        apiRequest("/users?per_page=500"),
        apiRequest("/departments"),
        apiRequest("/leave/requests?per_page=500"),
        apiRequest("/roster?per_page=500"),
        apiRequest("/shifts"),
        apiRequest("/attendance/policies"),
        apiRequest("/holidays?year=2024"),
      ]);

      if (usersRes.status === "fulfilled" && usersRes.value?.data) {
        setUsers(usersRes.value.data);
      }
      if (deptRes.status === "fulfilled" && deptRes.value?.data) {
        setDepartments(deptRes.value.data);
      }
      if (leaveRes.status === "fulfilled" && leaveRes.value?.data) {
        setLeaveRequests(leaveRes.value.data);
      }
      if (rostersRes.status === "fulfilled" && rostersRes.value?.data) {
        setRosters(rostersRes.value.data);
      }
      if (shiftsRes.status === "fulfilled" && shiftsRes.value?.data) {
        setShifts(shiftsRes.value.data);
      }
      if (policiesRes.status === "fulfilled" && policiesRes.value?.data) {
        setPolicies(policiesRes.value.data);
      }
      if (holidaysRes.status === "fulfilled" && holidaysRes.value?.data) {
        setHolidays(holidaysRes.value.data);
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
    setDateRange({ from: "", to: "" });
    setDepartmentFilter("");
    setStatusFilter("");
  };

  // Filter data
  const filteredUsers = users.filter(user => {
    if (departmentFilter && user.department !== departmentFilter) return false;
    if (statusFilter && user.status !== statusFilter) return false;
    return true;
  });

  const filteredLeaveRequests = leaveRequests.filter(request => {
    if (dateRange.from && request.from_date < dateRange.from) return false;
    if (dateRange.to && request.to_date > dateRange.to) return false;
    if (statusFilter && request.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    totalEmployees: users.length,
    activeEmployees: users.filter(u => u.status === "active").length,
    totalDepartments: departments.length,
    totalLeaveRequests: leaveRequests.length,
    totalRosters: rosters.length,
    totalShifts: shifts.length,
    totalPolicies: policies.length,
    activePolicies: policies.filter(p => p.is_active).length,
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
                HR Reports & Analytics
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Comprehensive HR analytics and workforce insights
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
            dateRange={dateRange}
            setDateRange={setDateRange}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            departments={departments}
            onReset={handleResetFilters}
          />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="employee" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Employee
                </TabsTrigger>
                <TabsTrigger value="leave" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Leave
                </TabsTrigger>
                <TabsTrigger value="department" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Department
                </TabsTrigger>
                <TabsTrigger value="roster" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Roster & Shift
                </TabsTrigger>
                <TabsTrigger value="policy" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Policies
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="employee" className="space-y-4 sm:space-y-6">
              <EmployeeReports 
                users={filteredUsers} 
                departments={departments}
              />
            </TabsContent>

            <TabsContent value="leave" className="space-y-4 sm:space-y-6">
              <LeaveReports 
                leaveRequests={filteredLeaveRequests}
              />
            </TabsContent>

            <TabsContent value="department" className="space-y-4 sm:space-y-6">
              <DepartmentReports 
                departments={departments}
                users={users}
              />
            </TabsContent>

            <TabsContent value="roster" className="space-y-4 sm:space-y-6">
              <RosterShiftReports 
                rosters={rosters}
                shifts={shifts}
              />
            </TabsContent>

            <TabsContent value="policy" className="space-y-4 sm:space-y-6">
              <AttendancePolicyReports 
                policies={policies}
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