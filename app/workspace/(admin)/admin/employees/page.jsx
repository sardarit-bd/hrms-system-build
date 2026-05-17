"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  UserCog,
  CheckCircle,
  Trash2,
  Calendar,
  Shield,
  RefreshCw,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

const STATUS_COLORS = {
  active:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  terminated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const ROLE_LABELS = {
  super_admin: "Super Admin",
  general_manager: "General Manager",
  hr: "HR Manager",
  project_manager: "Project Manager",
  team_leader: "Team Leader",
  employee: "Employee",
};

export default function EmployeesPage() {
  const router = useRouter();
  const { apiRequest } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [attendancePolicies, setAttendancePolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [total, setTotal] = useState(0);

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Status Change Dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState({
    user: null,
    newStatus: "",
  });

  // Assign Role Dialog
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [assigningRole, setAssigningRole] = useState(false);

  // Assign Roster Dialog
  const [assignRosterDialogOpen, setAssignRosterDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [assigningRoster, setAssigningRoster] = useState(false);

  // Assign Policy Dialog
  const [assignPolicyDialogOpen, setAssignPolicyDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [assigningPolicy, setAssigningPolicy] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("per_page", perPage);
      params.append("page", currentPage);
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (roleFilter) params.append("role", roleFilter);
      if (departmentFilter) params.append("department", departmentFilter);

      const response = await apiRequest(`/users?${params.toString()}`);

      if (response.status && response.data) {
        setEmployees(response.data);
        setTotal(response.meta?.total || response.data.length);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      gooeyToast.error("Failed to Load Employees", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [
    apiRequest,
    perPage,
    currentPage,
    searchTerm,
    statusFilter,
    roleFilter,
    departmentFilter,
  ]);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [deptRes, shiftsRes, policiesRes] = await Promise.allSettled([
        apiRequest("/departments"),
        apiRequest("/shifts"),
        apiRequest("/attendance/policies"),
      ]);

      if (deptRes.status === "fulfilled" && deptRes.value?.data) {
        setDepartments(deptRes.value.data);
      }
      if (shiftsRes.status === "fulfilled" && shiftsRes.value?.status) {
        setShifts(shiftsRes.value.data || []);
      } else {
        console.error("SHIFT API FAILED:", shiftsRes);
        setShifts([]);
      }
      if (policiesRes.status === "fulfilled" && policiesRes.value?.data) {
        setAttendancePolicies(policiesRes.value.data);
      }
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchEmployees();
    fetchDropdownData();
  }, [fetchEmployees, fetchDropdownData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    setDeleting(true);
    try {
      await apiRequest(`/users/${selectedEmployee.id}`, { method: "DELETE" });

      gooeyToast.success("Employee Deleted", {
        description: `${selectedEmployee.full_name} has been removed.`,
      });

      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      gooeyToast.error("Delete Failed", {
        description: error.message,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!statusChangeData.user) return;

    try {
      await apiRequest(`/users/${statusChangeData.user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: statusChangeData.newStatus }),
      });

      gooeyToast.success("Status Updated", {
        description: `${statusChangeData.user.full_name} status changed to ${statusChangeData.newStatus}.`,
      });

      setStatusDialogOpen(false);
      setStatusChangeData({ user: null, newStatus: "" });
      fetchEmployees();
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    }
  };

  const handleAssignRole = async () => {
    if (!selectedRole || !selectedEmployee) {
      gooeyToast.error("Missing Field", {
        description: "Please select a role.",
      });
      return;
    }

    setAssigningRole(true);
    try {
      await apiRequest("/roles/assign", {
        method: "POST",
        body: JSON.stringify({
          user_id: selectedEmployee.id,
          role: selectedRole,
        }),
      });

      gooeyToast.success("Role Assigned", {
        description: `${selectedEmployee.full_name} role updated to ${ROLE_LABELS[selectedRole]}.`,
      });

      setAssignRoleDialogOpen(false);
      setSelectedRole("");
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      gooeyToast.error("Assignment Failed", {
        description: error.message,
      });
    } finally {
      setAssigningRole(false);
    }
  };

  const handleAssignRoster = async () => {
    if (!selectedShift || !selectedEmployee) {
      gooeyToast.error("Missing Field", {
        description: "Please select a shift.",
      });
      return;
    }

    setAssigningRoster(true);
    try {
      await apiRequest("/roster", {
        method: "POST",
        body: JSON.stringify({
          user_id: selectedEmployee.id,
          shift_id: parseInt(selectedShift),
          weekend_days: ["friday", "saturday"],
          effective_from: effectiveDate,
        }),
      });

      gooeyToast.success("Roster Assigned", {
        description: `Roster assigned to ${selectedEmployee.full_name}.`,
      });

      setAssignRosterDialogOpen(false);
      setSelectedShift("");
      setSelectedEmployee(null);
      setEffectiveDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      gooeyToast.error("Assignment Failed", {
        description: error.message,
      });
    } finally {
      setAssigningRoster(false);
    }
  };

  const handleAssignPolicy = async () => {
    if (!selectedPolicy || !selectedEmployee) {
      gooeyToast.error("Missing Field", {
        description: "Please select a policy.",
      });
      return;
    }

    setAssigningPolicy(true);
    try {
      await apiRequest("/attendance/policies/assign", {
        method: "POST",
        body: JSON.stringify({
          user_id: selectedEmployee.id,
          attendance_policy_id: parseInt(selectedPolicy),
          effective_from: effectiveDate,
        }),
      });

      gooeyToast.success("Policy Assigned", {
        description: `Attendance policy assigned to ${selectedEmployee.full_name}.`,
      });

      setAssignPolicyDialogOpen(false);
      setSelectedPolicy("");
      setSelectedEmployee(null);
      setEffectiveDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      gooeyToast.error("Assignment Failed", {
        description: error.message,
      });
    } finally {
      setAssigningPolicy(false);
    }
  };

  const handleApproveEmployee = async (employee) => {
    try {
      await apiRequest(`/users/${employee.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "active" }),
      });

      gooeyToast.success("Employee Approved", {
        description: `${employee.full_name} has been approved and can now login.`,
      });

      fetchEmployees();
    } catch (error) {
      gooeyToast.error("Approval Failed", {
        description: error.message,
      });
    }
  };

  const getStatusBadge = (status) => {
    return (
      <Badge
        className={`${STATUS_COLORS[status] || STATUS_COLORS.inactive} cursor-default`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </Badge>
    );
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(
      (dept) => Number(dept.id) === Number(departmentId),
    );
    return department?.name || "—";
  };

  const totalPages = Math.ceil(total / perPage);

  if (loading) {
    return <EmployeesListSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Employees
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your organization's workforce
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
            <Button
              size="sm"
              className="gap-2 bg-[#1D3A88] hover:bg-[#142558] cursor-pointer"
              onClick={() => router.push("/workspace/admin/employees/create")}
            >
              <Plus size={14} />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              placeholder="Search by name, email, or employee code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 cursor-text border border-gray-200"
            />
          </div>

          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="cursor-pointer border border-gray-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                All Status
              </SelectItem>
              <SelectItem value="active" className="cursor-pointer">
                Active
              </SelectItem>
              <SelectItem value="inactive" className="cursor-pointer">
                Inactive
              </SelectItem>
              <SelectItem value="terminated" className="cursor-pointer">
                Terminated
              </SelectItem>
              <SelectItem value="pending" className="cursor-pointer">
                Pending
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={roleFilter || "all"}
            onValueChange={(value) =>
              setRoleFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="cursor-pointer border border-gray-200">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                All Roles
              </SelectItem>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="cursor-pointer"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={departmentFilter || "all"}
            onValueChange={(value) =>
              setDepartmentFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="cursor-pointer border border-gray-200">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                All Departments
              </SelectItem>
              {departments.map((dept) => (
                <SelectItem
                  key={dept.id}
                  value={dept.name}
                  className="cursor-pointer"
                >
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employees Table */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                  <TableHead className="cursor-default">
                    Employee Code
                  </TableHead>
                  <TableHead className="cursor-default">Full Name</TableHead>
                  <TableHead className="cursor-default">Email</TableHead>
                  <TableHead className="cursor-default">Phone</TableHead>
                  <TableHead className="cursor-default">Role</TableHead>
                  <TableHead className="cursor-default">Department</TableHead>
                  <TableHead className="cursor-default">Status</TableHead>
                  <TableHead className="cursor-default">Joining Date</TableHead>
                  <TableHead className="text-right cursor-default">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users size={48} className="text-gray-400" />
                        <p className="text-gray-500">No employees found</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push("/workspace/admin/employees/create")
                          }
                          className="cursor-pointer"
                        >
                          Add your first employee
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/30"
                    >
                      <TableCell className="font-mono text-xs cursor-default">
                        {employee.employee_code || "—"}
                      </TableCell>
                      <TableCell className="font-medium cursor-default">
                        {employee.full_name}
                      </TableCell>
                      <TableCell className="cursor-default">
                        {employee.email}
                      </TableCell>
                      <TableCell className="cursor-default">
                        {employee.phone || "—"}
                      </TableCell>
                      <TableCell className="cursor-default">
                        {ROLE_LABELS[employee.role] || employee.role}
                      </TableCell>
                      <TableCell className="cursor-default">
                        {getDepartmentName(employee.department_id)}
                      </TableCell>
                      <TableCell className="cursor-default">
                        {getStatusBadge(employee.status)}
                      </TableCell>
                      <TableCell className="cursor-default">
                        {employee.joining_date
                          ? new Date(employee.joining_date).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                            >
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="cursor-default">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* View Details */}
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/workspace/admin/employees/${employee.id}`,
                                )
                              }
                            >
                              <Eye size={14} className="mr-2" />
                              View Details
                            </DropdownMenuItem>

                            {/* Edit Employee */}
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/workspace/admin/employees/${employee.id}/edit`,
                                )
                              }
                            >
                              <Edit size={14} className="mr-2" />
                              Edit Employee
                            </DropdownMenuItem>

                            {/* Change Status */}
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setStatusChangeData({
                                  user: employee,
                                  newStatus:
                                    employee.status === "active"
                                      ? "inactive"
                                      : "active",
                                });
                                setStatusDialogOpen(true);
                              }}
                            >
                              <UserCog size={14} className="mr-2" />
                              {employee.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </DropdownMenuItem>

                            {/* Assign Role */}
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setSelectedRole("");
                                setAssignRoleDialogOpen(true);
                              }}
                            >
                              <Shield size={14} className="mr-2" />
                              Assign Role
                            </DropdownMenuItem>

                            {/* Assign Roster */}
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setSelectedShift("");
                                setAssignRosterDialogOpen(true);
                              }}
                            >
                              <Calendar size={14} className="mr-2" />
                              Assign Roster
                            </DropdownMenuItem>

                            {/* Assign Attendance Policy */}
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setSelectedPolicy("");
                                setAssignPolicyDialogOpen(true);
                              }}
                            >
                              <Shield size={14} className="mr-2" />
                              Assign Attendance Policy
                            </DropdownMenuItem>

                            {/* Approve Employee (only for inactive/pending) */}
                            {(employee.status === "inactive" ||
                              employee.status === "pending") && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-emerald-600 focus:text-emerald-600"
                                  onClick={() =>
                                    handleApproveEmployee(employee)
                                  }
                                >
                                  <CheckCircle size={14} className="mr-2" />
                                  Approve Employee
                                </DropdownMenuItem>
                              </>
                            )}

                            <DropdownMenuSeparator />

                            {/* Delete Employee */}
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete Employee
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * perPage + 1} to{" "}
              {Math.min(currentPage * perPage, total)} of {total} employees
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                <ChevronLeft size={14} />
                Previous
              </Button>
              <span className="text-sm px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                Next
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.full_name}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteEmployee}
              disabled={deleting}
              className="cursor-pointer"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to change {statusChangeData.user?.full_name}
              's status to {statusChangeData.newStatus}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handleStatusChange} className="cursor-pointer">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog
        open={assignRoleDialogOpen}
        onOpenChange={setAssignRoleDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Select a new role for {selectedEmployee?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="cursor-pointer"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignRoleDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignRole}
              disabled={assigningRole}
              className="cursor-pointer"
            >
              {assigningRole ? "Assigning..." : "Assign Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Roster Dialog */}
      <Dialog
        open={assignRosterDialogOpen}
        onOpenChange={setAssignRosterDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Roster</DialogTitle>
            <DialogDescription>
              Set shift schedule for {selectedEmployee?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Shift</Label>
              <Select value={selectedShift} onValueChange={setSelectedShift}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem
                      key={shift.id}
                      value={shift.id.toString()}
                      className="cursor-pointer"
                    >
                      {shift.name} ({shift.start_time} - {shift.end_time})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Effective From</Label>
              <Input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignRosterDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignRoster}
              disabled={assigningRoster}
              className="cursor-pointer"
            >
              {assigningRoster ? "Assigning..." : "Assign Roster"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Policy Dialog */}
      <Dialog
        open={assignPolicyDialogOpen}
        onOpenChange={setAssignPolicyDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Attendance Policy</DialogTitle>
            <DialogDescription>
              Apply attendance policy for {selectedEmployee?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Attendance Policy</Label>
              <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  {attendancePolicies.map((policy) => (
                    <SelectItem
                      key={policy.id}
                      value={policy.id.toString()}
                      className="cursor-pointer"
                    >
                      {policy.name} (Grace: {policy.grace_period_minutes} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Effective From</Label>
              <Input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignPolicyDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignPolicy}
              disabled={assigningPolicy}
              className="cursor-pointer"
            >
              {assigningPolicy ? "Assigning..." : "Assign Policy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// Loading Skeleton
function EmployeesListSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Skeleton className="h-10 col-span-2" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <div className="rounded-lg border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-48 flex-1" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-8" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
