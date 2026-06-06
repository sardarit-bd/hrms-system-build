"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import PolicyHistoryModal from "../../../../../components/workspace/hr/attendance/PolicyHistoryModal";
import RosterHistoryModal from "../../../../../components/workspace/hr/attendance/RosterHistoryModal";
import EmployeeDetailsModal from "../../../../../components/workspace/hr/attendance/EmployeeDetailsModal";
import AssignPolicyDialog from "../../../../../components/workspace/hr/attendance/AssignPolicyDialog";
import AssignRosterDialog from "../../../../../components/workspace/hr/attendance/AssignRosterDialog";
import AttendancePolicies from "../../../../../components/workspace/hr/attendance/AttendancePolicies";
import ShiftInfo from "../../../../../components/workspace/hr/attendance/ShiftInfo";
import RosterAssignments from "../../../../../components/workspace/hr/attendance/RosterAssignments";
import AttendanceFilters from "../../../../../components/workspace/hr/attendance/AttendanceFilters";
import AttendanceStatsCards from "../../../../../components/workspace/hr/attendance/AttendanceStatsCards";
import AttendanceSkeleton from "../../../../../components/workspace/hr/attendance/AttendanceSkeleton";

export default function HRAttendancePage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [rosters, setRosters] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [fixedShifts, setFixedShifts] = useState([]);
  const [rotatingShifts, setRotatingShifts] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  // Dialog states
  const [assignRosterOpen, setAssignRosterOpen] = useState(false);
  const [assignPolicyOpen, setAssignPolicyOpen] = useState(false);
  const [employeeDetailsOpen, setEmployeeDetailsOpen] = useState(false);
  const [rosterHistoryOpen, setRosterHistoryOpen] = useState(false);
  const [policyHistoryOpen, setPolicyHistoryOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRoster, setSelectedRoster] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("rosters");

  const fetchData = useCallback(async (showRefreshToast = false) => {
    try {
      const [rostersRes, shiftsRes, fixedShiftsRes, rotatingShiftsRes, policiesRes, employeesRes] = await Promise.allSettled([
        apiRequest("/roster?per_page=200"),
        apiRequest("/shifts"),
        apiRequest("/shifts/list/fixed"),
        apiRequest("/shifts/list/rotating"),
        apiRequest("/attendance/policies"),
        apiRequest("/users?per_page=200"),
      ]);

      if (rostersRes.status === "fulfilled" && rostersRes.value?.data) {
        setRosters(rostersRes.value.data);
      }
      if (shiftsRes.status === "fulfilled" && shiftsRes.value?.data) {
        setShifts(shiftsRes.value.data);
      }
      if (fixedShiftsRes.status === "fulfilled" && fixedShiftsRes.value?.data) {
        setFixedShifts(fixedShiftsRes.value.data);
      }
      if (rotatingShiftsRes.status === "fulfilled" && rotatingShiftsRes.value?.data) {
        setRotatingShifts(rotatingShiftsRes.value.data);
      }
      if (policiesRes.status === "fulfilled" && policiesRes.value?.data) {
        setPolicies(policiesRes.value.data);
      }
      if (employeesRes.status === "fulfilled" && employeesRes.value?.data) {
        setEmployees(employeesRes.value.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Attendance Data Refreshed", {
          description: "Attendance data has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      gooeyToast.error("Failed to Load Data", {
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
    setSearchTerm("");
    setShiftFilter("");
    setEmployeeFilter("");
    setStatusFilter("");
  };

  const handleViewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeDetailsOpen(true);
  };

  const handleViewRosterHistory = async (employee) => {
    try {
      const response = await apiRequest(`/roster/user/${employee.id}/history`);
      setSelectedEmployee(employee);
      setSelectedRoster(response.data);
      setRosterHistoryOpen(true);
    } catch (error) {
      gooeyToast.error("Failed to Load Roster History", {
        description: error.message,
      });
    }
  };

  const handleViewPolicyHistory = async (employee) => {
    try {
      const response = await apiRequest(`/attendance/policies/user/${employee.id}/history`);
      setSelectedEmployee(employee);
      setSelectedPolicy(response.data);
      setPolicyHistoryOpen(true);
    } catch (error) {
      gooeyToast.error("Failed to Load Policy History", {
        description: error.message,
      });
    }
  };

  // Filter rosters
  const filteredRosters = rosters.filter(roster => {
    if (searchTerm && !roster.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (shiftFilter && roster.shift?.id.toString() !== shiftFilter) return false;
    if (employeeFilter && roster.user?.id.toString() !== employeeFilter) return false;
    if (statusFilter && statusFilter === "active" && !roster.is_active) return false;
    if (statusFilter === "inactive" && roster.is_active) return false;
    return true;
  });

  const stats = {
    totalRosters: rosters.length,
    activeRosters: rosters.filter(r => r.is_active).length,
    totalShifts: shifts.length,
    totalPolicies: policies.length,
    activePolicies: policies.filter(p => p.is_active).length,
  };

  if (loading) {
    return <AttendanceSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Attendance Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage rosters, shifts, and attendance policies
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

          {/* Info Alert */}
          <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2 sm:gap-3">
              <Info size={16} className="sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300">
                  Live Attendance Records Information
                </p>
                <p className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-400 mt-0.5 sm:mt-1">
                  Daily check-in/out records API is not available yet. Currently connected: 
                  Rosters, Shifts, and Attendance policies.
                </p>
                <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-500 mt-1 sm:mt-2">
                  ✅ You can manage employee rosters, shift assignments, and attendance policies.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <AttendanceStatsCards stats={stats} />

          {/* Filters */}
          {/* <AttendanceFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            shiftFilter={shiftFilter}
            setShiftFilter={setShiftFilter}
            employeeFilter={employeeFilter}
            setEmployeeFilter={setEmployeeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            shifts={shifts}
            employees={employees}
            onReset={handleResetFilters}
          /> */}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="rosters" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Roster Assignments
                </TabsTrigger>
                <TabsTrigger value="shifts" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Shifts
                </TabsTrigger>
                <TabsTrigger value="policies" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Attendance Policies
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="rosters" className="space-y-4 sm:space-y-6">
              <RosterAssignments
                rosters={filteredRosters}
                shifts={shifts}
                employees={employees}
                onViewEmployeeDetails={handleViewEmployeeDetails}
                onViewRosterHistory={handleViewRosterHistory}
                onAssignRoster={() => setAssignRosterOpen(true)}
              />
            </TabsContent>

            <TabsContent value="shifts" className="space-y-4 sm:space-y-6">
              <ShiftInfo
                shifts={shifts}
                fixedShifts={fixedShifts}
                rotatingShifts={rotatingShifts}
              />
            </TabsContent>

            <TabsContent value="policies" className="space-y-4 sm:space-y-6">
              <AttendancePolicies
                policies={policies}
                employees={employees}
                onViewEmployeeDetails={handleViewEmployeeDetails}
                onViewPolicyHistory={handleViewPolicyHistory}
                onAssignPolicy={() => setAssignPolicyOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Assign Roster Dialog */}
      <AssignRosterDialog
        open={assignRosterOpen}
        onOpenChange={setAssignRosterOpen}
        shifts={shifts}
        employees={employees}
        onSuccess={fetchData}
      />

      {/* Assign Policy Dialog */}
      <AssignPolicyDialog
        open={assignPolicyOpen}
        onOpenChange={setAssignPolicyOpen}
        policies={policies}
        employees={employees}
        onSuccess={fetchData}
      />

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        open={employeeDetailsOpen}
        onOpenChange={setEmployeeDetailsOpen}
        employee={selectedEmployee}
      />

      {/* Roster History Modal */}
      <RosterHistoryModal
        open={rosterHistoryOpen}
        onOpenChange={setRosterHistoryOpen}
        employee={selectedEmployee}
        history={selectedRoster}
      />

      {/* Policy History Modal */}
      <PolicyHistoryModal
        open={policyHistoryOpen}
        onOpenChange={setPolicyHistoryOpen}
        employee={selectedEmployee}
        history={selectedPolicy}
      />
    </DashboardLayout>
  );
}