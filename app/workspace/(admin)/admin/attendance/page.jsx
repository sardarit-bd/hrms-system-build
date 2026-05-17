"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Calendar,
  Users,
  FileText,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Building2,
  UserCheck,
  CalendarDays,
  Timer,
  Shield,
} from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function AttendancePage() {
  const { apiRequest } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State for API data
  const [shifts, setShifts] = useState([]);
  const [fixedShifts, setFixedShifts] = useState([]);
  const [rotatingShifts, setRotatingShifts] = useState([]);
  const [rosterAssignments, setRosterAssignments] = useState([]);
  const [attendancePolicies, setAttendancePolicies] = useState([]);

  // Filters
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedShiftId, setSelectedShiftId] = useState("");
  const [employees, setEmployees] = useState([]);

  // Dialog states
  const [selectedRoster, setSelectedRoster] = useState(null);
  const [rosterDialogOpen, setRosterDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);

  // Fetch all attendance-related data
  const fetchAttendanceData = useCallback(
    async (showRefreshToast = false) => {
      try {
        const [
          shiftsRes,
          fixedShiftsRes,
          rotatingShiftsRes,
          rosterRes,
          policiesRes,
          usersRes,
        ] = await Promise.allSettled([
          apiRequest("/shifts"),
          apiRequest("/shifts/list/fixed"),
          apiRequest("/shifts/list/rotating"),
          apiRequest("/roster?per_page=100"),
          apiRequest("/attendance/policies"),
          apiRequest("/users?per_page=100"),
        ]);

        // Process Shifts
        if (shiftsRes.status === "fulfilled" && shiftsRes.value?.data) {
          setShifts(shiftsRes.value.data);
        }

        // Process Fixed Shifts
        if (
          fixedShiftsRes.status === "fulfilled" &&
          fixedShiftsRes.value?.data
        ) {
          setFixedShifts(fixedShiftsRes.value.data);
        }

        // Process Rotating Shifts
        if (
          rotatingShiftsRes.status === "fulfilled" &&
          rotatingShiftsRes.value?.data
        ) {
          setRotatingShifts(rotatingShiftsRes.value.data);
        }

        // Process Roster Assignments
        if (rosterRes.status === "fulfilled" && rosterRes.value?.data) {
          setRosterAssignments(rosterRes.value.data);
        }

        // Process Attendance Policies
        if (policiesRes.status === "fulfilled" && policiesRes.value?.data) {
          setAttendancePolicies(policiesRes.value.data);
        }

        // Process Users for filters
        if (usersRes.status === "fulfilled" && usersRes.value?.data) {
          setEmployees(usersRes.value.data);
        }

        if (showRefreshToast) {
          gooeyToast.success("Data Refreshed", {
            description: "Attendance data has been updated.",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
        gooeyToast.error("Failed to Load Data", {
          description: error.message || "Unable to fetch attendance data.",
          duration: 4000,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiRequest],
  );

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAttendanceData(true);
  };

  const handleViewRosterDetails = (roster) => {
    setSelectedRoster(roster);
    setRosterDialogOpen(true);
  };

  const handleViewPolicyDetails = (policy) => {
    setSelectedPolicy(policy);
    setPolicyDialogOpen(true);
  };

  // Filter rosters based on selections
  const filteredRosters = rosterAssignments.filter((roster) => {
    if (
      selectedEmployeeId &&
      roster.user?.id !== parseInt(selectedEmployeeId)
    ) {
      return false;
    }
    if (selectedShiftId && roster.shift?.id !== parseInt(selectedShiftId)) {
      return false;
    }
    return true;
  });

  if (loading) {
    return <AttendanceSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Attendance Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage shifts, rosters, and attendance policies
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
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Info Alert - No attendance records API */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                  Attendance Records API Information
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  Attendance records API is not available yet. Currently
                  connected: Shifts, Roster assignments, and Attendance
                  Policies. Daily check-in/out records will appear when the
                  attendance tracking API is implemented.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Shifts"
              value={shifts.length}
              icon={Clock}
              color="blue"
            />
            <StatCard
              title="Active Rosters"
              value={rosterAssignments.filter((r) => r.is_active).length}
              icon={Calendar}
              color="green"
            />
            <StatCard
              title="Fixed Shifts"
              value={fixedShifts.length}
              icon={Timer}
              color="purple"
            />
            <StatCard
              title="Attendance Policies"
              value={attendancePolicies.length}
              icon={Shield}
              color="orange"
            />
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="rosters" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="rosters" className="cursor-pointer">
                Rosters
              </TabsTrigger>
              <TabsTrigger value="shifts" className="cursor-pointer">
                Shifts
              </TabsTrigger>
              <TabsTrigger value="policies" className="cursor-pointer">
                Policies
              </TabsTrigger>
            </TabsList>

            {/* Rosters Tab */}
            <TabsContent value="rosters" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium mb-2 block">
                    Filter by Employee
                  </Label>
                  <Select
                    value={selectedEmployeeId}
                    onValueChange={(value) =>
                      setSelectedEmployeeId(value === "all" ? "" : value)
                    }
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="All Employees" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all" className="cursor-pointer">
                        All Employees
                      </SelectItem>

                      {employees.map((emp) => (
                        <SelectItem
                          key={emp.id}
                          value={String(emp.id)}
                          className="cursor-pointer"
                        >
                          {emp.full_name} ({emp.employee_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium mb-2 block">
                    Filter by Shift
                  </Label>
                  <Select
                    value={selectedShiftId}
                    onValueChange={(value) =>
                      setSelectedShiftId(value === "all" ? "" : value)
                    }
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="All Shifts" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all" className="cursor-pointer">
                        All Shifts
                      </SelectItem>

                      {shifts.map((shift) => (
                        <SelectItem
                          key={shift.id}
                          value={String(shift.id)}
                          className="cursor-pointer"
                        >
                          {shift.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedEmployeeId("");
                      setSelectedShiftId("");
                    }}
                    className="cursor-pointer"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Rosters Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Roster Assignments
                  </CardTitle>
                  <CardDescription>
                    Current and historical shift assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredRosters.length === 0 ? (
                    <EmptyState
                      message="No roster assignments found"
                      description="Try adjusting your filters or create a new roster assignment."
                    />
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Shift</TableHead>
                            <TableHead>Weekend Days</TableHead>
                            <TableHead>Effective From</TableHead>
                            <TableHead>Effective To</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRosters.map((roster) => (
                            <TableRow key={roster.id}>
                              <TableCell className="font-medium">
                                {roster.user?.full_name || "N/A"}
                                <br />
                                <span className="text-xs text-gray-500">
                                  {roster.user?.employee_code || ""}
                                </span>
                              </TableCell>
                              <TableCell>
                                {roster.shift?.name || "N/A"}
                                <br />
                                <span className="text-xs text-gray-500">
                                  {roster.shift?.start_time} -{" "}
                                  {roster.shift?.end_time}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {roster.weekend_days?.map((day) => (
                                    <Badge
                                      key={day}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {day}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                {roster.effective_from || "—"}
                              </TableCell>
                              <TableCell>
                                {roster.effective_to || "Current"}
                              </TableCell>
                              <TableCell>
                                {roster.is_active ? (
                                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default">
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="cursor-default"
                                  >
                                    Inactive
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleViewRosterDetails(roster)
                                  }
                                  className="cursor-pointer"
                                >
                                  <Eye size={16} className="mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shifts Tab */}
            <TabsContent value="shifts" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fixed Shifts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Timer size={18} />
                      Fixed Shifts
                    </CardTitle>
                    <CardDescription>Permanent shift schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {fixedShifts.length === 0 ? (
                      <EmptyState message="No fixed shifts found" />
                    ) : (
                      <div className="space-y-3">
                        {fixedShifts.map((shift) => (
                          <div
                            key={shift.id}
                            className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {shift.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {shift.start_time} - {shift.end_time}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Working Hours: {shift.working_hours}h
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="cursor-default"
                              >
                                Fixed
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Rotating Shifts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <CalendarDays size={18} />
                      Rotating Shifts
                    </CardTitle>
                    <CardDescription>Rotating shift schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {rotatingShifts.length === 0 ? (
                      <EmptyState message="No rotating shifts found" />
                    ) : (
                      <div className="space-y-3">
                        {rotatingShifts.map((shift) => (
                          <div
                            key={shift.id}
                            className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {shift.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {shift.start_time} - {shift.end_time}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Working Hours: {shift.working_hours}h
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 cursor-default"
                              >
                                Rotating
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Attendance Policies
                  </CardTitle>
                  <CardDescription>
                    Rules and policies for attendance tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {attendancePolicies.length === 0 ? (
                    <EmptyState message="No attendance policies found" />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {attendancePolicies.map((policy) => (
                        <div
                          key={policy.id}
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => handleViewPolicyDetails(policy)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {policy.name}
                              </h3>
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-gray-500">
                                  Grace Period: {policy.grace_period_minutes}{" "}
                                  minutes
                                </p>
                                <p className="text-xs text-gray-500">
                                  Late Threshold: {policy.late_count_threshold}{" "}
                                  occurrences
                                </p>
                                <p className="text-xs text-gray-500">
                                  Half Day Threshold:{" "}
                                  {policy.half_day_threshold_hours} hours
                                </p>
                              </div>
                            </div>
                            {policy.is_active ? (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default">
                                Active
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="cursor-default"
                              >
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Roster Details Dialog */}
      <Dialog open={rosterDialogOpen} onOpenChange={setRosterDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Roster Details</DialogTitle>
            <DialogDescription>
              Detailed assignment information
            </DialogDescription>
          </DialogHeader>
          {selectedRoster && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Employee</p>
                  <p className="text-sm font-medium">
                    {selectedRoster.user?.full_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedRoster.user?.employee_code}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shift</p>
                  <p className="text-sm font-medium">
                    {selectedRoster.shift?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedRoster.shift?.start_time} -{" "}
                    {selectedRoster.shift?.end_time}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Weekend Days</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRoster.weekend_days?.map((day) => (
                      <Badge key={day} variant="outline" className="text-xs">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge
                    className={
                      selectedRoster.is_active
                        ? "bg-green-100 text-green-700"
                        : ""
                    }
                  >
                    {selectedRoster.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Effective From</p>
                  <p className="text-sm">
                    {selectedRoster.effective_from || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Effective To</p>
                  <p className="text-sm">
                    {selectedRoster.effective_to || "Current"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Policy Details Dialog */}
      <Dialog open={policyDialogOpen} onOpenChange={setPolicyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Policy Details</DialogTitle>
            <DialogDescription>
              Attendance policy configuration
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Policy Name</p>
                <p className="text-sm font-medium">{selectedPolicy.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Grace Period</p>
                  <p className="text-sm">
                    {selectedPolicy.grace_period_minutes} minutes
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Late Threshold</p>
                  <p className="text-sm">
                    {selectedPolicy.late_count_threshold} occurrences
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Late Deduction</p>
                  <p className="text-sm">
                    {selectedPolicy.late_threshold_deduction_days} days
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Absent Deduction</p>
                  <p className="text-sm">
                    {selectedPolicy.absent_deduction_per_day} day(s)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Half Day Threshold</p>
                  <p className="text-sm">
                    {selectedPolicy.half_day_threshold_hours} hours
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Effective From</p>
                  <p className="text-sm">{selectedPolicy.effective_from}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <Badge
                  className={
                    selectedPolicy.is_active
                      ? "bg-green-100 text-green-700"
                      : ""
                  }
                >
                  {selectedPolicy.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-600",
    green: "bg-green-50 dark:bg-green-950/30 text-green-600",
    purple: "bg-purple-50 dark:bg-purple-950/30 text-purple-600",
    orange: "bg-orange-50 dark:bg-orange-950/30 text-orange-600",
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState({ message, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle size={48} className="text-gray-400 mb-4" />
      <p className="text-gray-500 font-medium">{message}</p>
      {description && (
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      )}
    </div>
  );
}

// Loading Skeleton
function AttendanceSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </DashboardLayout>
  );
}
