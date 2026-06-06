"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import EmployeeRosterHistoryModal from "../../../../../components/workspace/hr/roster-shifts/EmployeeRosterHistoryModal";
import AssignRosterDialog from "../../../../../components/workspace/hr/roster-shifts/AssignRosterDialog";
import EditShiftDialog from "../../../../../components/workspace/hr/roster-shifts/EditShiftDialog";
import CreateShiftDialog from "../../../../../components/workspace/hr/roster-shifts/CreateShiftDialog";
import RosterAssignments from "../../../../../components/workspace/hr/roster-shifts/RosterAssignments";
import RosterFilters from "../../../../../components/workspace/hr/roster-shifts/RosterFilters";
import ShiftsList from "../../../../../components/workspace/hr/roster-shifts/ShiftsList";
import RosterStatsCards from "../../../../../components/workspace/hr/roster-shifts/RosterStatsCards";
import RosterSkeleton from "../../../../../components/workspace/hr/roster-shifts/RosterSkeleton";


export default function HRRosterShiftsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [shifts, setShifts] = useState([]);
  const [fixedShifts, setFixedShifts] = useState([]);
  const [rotatingShifts, setRotatingShifts] = useState([]);
  const [rosters, setRosters] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  // Dialog states
  const [createShiftOpen, setCreateShiftOpen] = useState(false);
  const [editShiftOpen, setEditShiftOpen] = useState(false);
  const [assignRosterOpen, setAssignRosterOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeHistory, setEmployeeHistory] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [activeTab, setActiveTab] = useState("shifts");

  const fetchData = useCallback(async (showRefreshToast = false) => {
    try {
      const [shiftsRes, fixedShiftsRes, rotatingShiftsRes, rostersRes, employeesRes] = await Promise.allSettled([
        apiRequest("/shifts"),
        apiRequest("/shifts/list/fixed"),
        apiRequest("/shifts/list/rotating"),
        apiRequest("/roster?per_page=200"),
        apiRequest("/users?per_page=200"),
      ]);

      if (shiftsRes.status === "fulfilled" && shiftsRes.value?.data) {
        setShifts(shiftsRes.value.data);
      }
      if (fixedShiftsRes.status === "fulfilled" && fixedShiftsRes.value?.data) {
        setFixedShifts(fixedShiftsRes.value.data);
      }
      if (rotatingShiftsRes.status === "fulfilled" && rotatingShiftsRes.value?.data) {
        setRotatingShifts(rotatingShiftsRes.value.data);
      }
      if (rostersRes.status === "fulfilled" && rostersRes.value?.data) {
        setRosters(rostersRes.value.data);
      }
      if (employeesRes.status === "fulfilled" && employeesRes.value?.data) {
        setEmployees(employeesRes.value.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Data Refreshed", {
          description: "Roster and shift data has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
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

  const handleEditShift = (shift) => {
    setSelectedShift(shift);
    setEditShiftOpen(true);
  };

  const handleViewRosterHistory = async (employee) => {
    try {
      const response = await apiRequest(`/roster/user/${employee.id}/history`);
      setSelectedEmployee(employee);
      setEmployeeHistory(response.data || []);
      setHistoryModalOpen(true);
    } catch (error) {
      gooeyToast.error("Failed to Load History", {
        description: error.message,
      });
    }
  };

  // Filter rosters
  const filteredRosters = rosters.filter(roster => {
    if (searchTerm && !roster.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (shiftFilter && roster.shift?.id.toString() !== shiftFilter) return false;
    if (employeeFilter && roster.user?.id.toString() !== employeeFilter) return false;
    if (statusFilter === "active" && !roster.is_active) return false;
    if (statusFilter === "inactive" && roster.is_active) return false;
    return true;
  });

  const stats = {
    totalShifts: shifts.length,
    fixedShifts: fixedShifts.length,
    rotatingShifts: rotatingShifts.length,
    totalRosters: rosters.length,
    activeRosters: rosters.filter(r => r.is_active).length,
  };

  if (loading) {
    return <RosterSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Roster & Shifts Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage employee shifts, rosters, and schedules
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
          <RosterStatsCards stats={stats} />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="shifts" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Shifts
                </TabsTrigger>
                <TabsTrigger value="rosters" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Roster Assignments
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Shifts Tab */}
            <TabsContent value="shifts" className="space-y-4 sm:space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setCreateShiftOpen(true)} className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer text-sm">
                  <Plus size={14} className="mr-2" />
                  Create Shift
                </Button>
              </div>
              <ShiftsList
                shifts={shifts}
                fixedShifts={fixedShifts}
                rotatingShifts={rotatingShifts}
                onEditShift={handleEditShift}
              />
            </TabsContent>

            {/* Rosters Tab */}
            <TabsContent value="rosters" className="space-y-4 sm:space-y-6">
              {/* Filters */}
              <RosterFilters
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
              />

              {/* Roster Assignments */}
              <RosterAssignments
                rosters={filteredRosters}
                employees={employees}
                shifts={shifts}
                onAssignRoster={() => setAssignRosterOpen(true)}
                onViewHistory={handleViewRosterHistory}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Shift Dialog */}
      <CreateShiftDialog
        open={createShiftOpen}
        onOpenChange={setCreateShiftOpen}
        onSuccess={fetchData}
      />

      {/* Edit Shift Dialog */}
      <EditShiftDialog
        open={editShiftOpen}
        onOpenChange={setEditShiftOpen}
        shift={selectedShift}
        onSuccess={fetchData}
      />

      {/* Assign Roster Dialog */}
      <AssignRosterDialog
        open={assignRosterOpen}
        onOpenChange={setAssignRosterOpen}
        shifts={shifts}
        employees={employees}
        onSuccess={fetchData}
      />

      {/* Employee Roster History Modal */}
      <EmployeeRosterHistoryModal
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        employee={selectedEmployee}
        history={employeeHistory}
      />
    </DashboardLayout>
  );
}