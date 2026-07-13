"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
  Shield,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import Link from "next/link";
import { EmployeeDetailsSkeleton } from "../../../../../../components/workspace/admin/employees/EmployeeDetailsSkeleton";
import { InfoCard } from "../../../../../../components/workspace/admin/employees/InfoCard";
import { ActionCard } from "../../../../../../components/workspace/admin/employees/ActionCard";
import { CardContent } from "../../../../../../components/ui/card";
import { ReviewItem } from "../../../../../../components/workspace/admin/employees/ReviewItem";

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
  admin: "Admin",
  general_manager: "General Manager",
  hr_manager: "HR Manager",
  project_manager: "Project Manager",
  team_leader: "Team Leader",
  employee: "Employee",
};

export default function EmployeeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { apiRequest } = useAuth();

  const employeeId = params.id;
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [attendancePolicies, setAttendancePolicies] = useState([]);

  // Dialogs
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false);
  const [assignRosterDialogOpen, setAssignRosterDialogOpen] = useState(false);
  const [assignPolicyDialogOpen, setAssignPolicyDialogOpen] = useState(false);

  // Form states
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [weekendDays, setWeekendDays] = useState(["friday", "saturday"]);
  const [actionLoading, setActionLoading] = useState(false);

  const activeTab = searchParams.get("tab") || "details";

  const fetchEmployee = useCallback(async () => {
    try {
      const response = await apiRequest(`/users/${employeeId}`);
      if (response.status && response.data) {
        setEmployee(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch employee:", error);
      gooeyToast.error("Failed to Load Employee", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [apiRequest, employeeId]);

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
      if (shiftsRes.status === "fulfilled" && shiftsRes.value?.data) {
        setShifts(shiftsRes.value.data);
      }
      if (policiesRes.status === "fulfilled" && policiesRes.value?.data) {
        setAttendancePolicies(policiesRes.value.data);
      }
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchEmployee();
    fetchDropdownData();
  }, [fetchEmployee, fetchDropdownData]);

  const handleStatusChange = async (newStatus) => {
    try {
      await apiRequest(`/users/${employeeId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      gooeyToast.success("Status Updated", {
        description: `Employee status changed to ${newStatus}.`,
      });
      fetchEmployee();
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    }
  };

  const handleApproveEmployee = async () => {
    setActionLoading(true);
    try {
      // First activate the user
      await apiRequest(`/users/${employeeId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "active" }),
      });

      gooeyToast.success("Employee Approved", {
        description: `${employee?.full_name} has been approved and can now login.`,
      });

      setApproveDialogOpen(false);
      fetchEmployee();
    } catch (error) {
      gooeyToast.error("Approval Failed", {
        description: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedRole) {
      gooeyToast.error("Missing Field", {
        description: "Please select a role.",
      });
      return;
    }

    setActionLoading(true);
    try {
      await apiRequest("/roles/assign", {
        method: "POST",
        body: JSON.stringify({
          user_id: parseInt(employeeId),
          role: selectedRole,
        }),
      });

      gooeyToast.success("Role Assigned", {
        description: `${employee?.full_name} role updated to ${ROLE_LABELS[selectedRole]}.`,
      });

      setAssignRoleDialogOpen(false);
      fetchEmployee();
    } catch (error) {
      gooeyToast.error("Assignment Failed", {
        description: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignRoster = async () => {
    if (!selectedShift) {
      gooeyToast.error("Missing Field", {
        description: "Please select a shift.",
      });
      return;
    }

    setActionLoading(true);
    try {
      await apiRequest("/roster", {
        method: "POST",
        body: JSON.stringify({
          user_id: parseInt(employeeId),
          shift_id: parseInt(selectedShift),
          weekend_days: weekendDays,
          effective_from: effectiveDate,
        }),
      });

      gooeyToast.success("Roster Assigned", {
        description: `Roster assigned to ${employee?.full_name}.`,
      });

      setAssignRosterDialogOpen(false);
    } catch (error) {
      gooeyToast.error("Assignment Failed", {
        description: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignPolicy = async () => {
    if (!selectedPolicy) {
      gooeyToast.error("Missing Field", {
        description: "Please select a policy.",
      });
      return;
    }

    setActionLoading(true);
    try {
      await apiRequest("/attendance/policies/assign", {
        method: "POST",
        body: JSON.stringify({
          user_id: parseInt(employeeId),
          attendance_policy_id: parseInt(selectedPolicy),
          effective_from: effectiveDate,
        }),
      });

      gooeyToast.success("Policy Assigned", {
        description: `Attendance policy assigned to ${employee?.full_name}.`,
      });

      setAssignPolicyDialogOpen(false);
    } catch (error) {
      gooeyToast.error("Assignment Failed", {
        description: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <EmployeeDetailsSkeleton />;
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500">Employee not found</p>
          <Button
            variant="outline"
            onClick={() => router.push("/workspace/admin/employees")}
            className="mt-4 cursor-pointer"
          >
            Back to Employees
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isPending =
    employee.status === "inactive" || employee.status === "pending";
  const getDepartmentName = (employee) => {
    if (employee?.department?.name) return employee.department.name;
    if (employee?.department_name) return employee.department_name;

    const departmentId =
      employee?.department_id ||
      employee?.department?.id ||
      employee?.department;

    const department = departments.find(
      (dept) => Number(dept.id) === Number(departmentId),
    );

    return department?.name || "Not assigned";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/workspace/admin/employees")}
              className="cursor-pointer"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {employee.full_name}
              </h1>
              <p className="text-sm text-gray-500">
                {employee.employee_code || "No employee code"} •{" "}
                {ROLE_LABELS[employee.role] || employee.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPending && (
              <Button
                onClick={() => setApproveDialogOpen(true)}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              >
                <CheckCircle size={14} />
                Approve Employee
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/workspace/admin/employees/${employeeId}/edit`)
              }
              className="cursor-pointer"
            >
              Edit Employee
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={activeTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="details" className="cursor-pointer">
              Details
            </TabsTrigger>
            <TabsTrigger value="actions" className="cursor-pointer">
              Actions
            </TabsTrigger>
            <TabsTrigger value="approval" className="cursor-pointer">
              Approval
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoCard icon={Mail} label="Email" value={employee.email} />
              <InfoCard
                icon={Phone}
                label="Phone"
                value={employee.phone || "Not provided"}
              />
              <InfoCard
                icon={Calendar}
                label="Joining Date"
                value={
                  employee.joining_date
                    ? new Date(employee.joining_date).toLocaleDateString()
                    : "Not set"
                }
              />
              <InfoCard
                icon={Building2}
                label="Department"
                value={getDepartmentName(employee)}
              />
              <InfoCard
                icon={Briefcase}
                label="Designation"
                value={employee.designation || "Not set"}
              />
              <InfoCard
                icon={Shield}
                label="Role"
                value={ROLE_LABELS[employee.role] || employee.role}
              />
            </div>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${STATUS_COLORS[employee.status]} text-sm px-3 py-1 cursor-default`}
                  >
                    {employee.status?.charAt(0).toUpperCase() +
                      employee.status?.slice(1)}
                  </Badge>
                  <p className="text-sm text-gray-500">
                    {employee.status === "active"
                      ? "Employee can login and access the system."
                      : employee.status === "pending"
                        ? "Awaiting admin approval."
                        : "Account is currently disabled."}
                  </p>
                </div>
                <div className="flex gap-2">
                  {employee.status !== "active" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange("active")}
                      className="cursor-pointer"
                    >
                      <UserCheck size={14} className="mr-2" />
                      Activate
                    </Button>
                  )}
                  {employee.status !== "inactive" &&
                    employee.status !== "terminated" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange("inactive")}
                        className="cursor-pointer"
                      >
                        <UserX size={14} className="mr-2" />
                        Deactivate
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-4">
            <ActionCard
              title="Change Role"
              description="Assign a different role to this employee"
              buttonText="Change Role"
              onClick={() => setAssignRoleDialogOpen(true)}
              icon={Shield}
            />
            <ActionCard
              title="Assign Roster"
              description="Set shift and weekend schedule for this employee"
              buttonText="Assign Roster"
              onClick={() => setAssignRosterDialogOpen(true)}
              icon={Calendar}
            />
            <ActionCard
              title="Assign Attendance Policy"
              description="Apply attendance rules and policies"
              buttonText="Assign Policy"
              onClick={() => setAssignPolicyDialogOpen(true)}
              icon={UserCheck}
            />
          </TabsContent>

          {/* Approval Tab - for pending employees */}
          <TabsContent value="approval" className="space-y-6">
            {isPending ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Pending Approval
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      This employee account is pending approval. Review the
                      information below and approve to activate.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReviewItem label="Full Name" value={employee.full_name} />
                    <ReviewItem label="Email" value={employee.email} />
                    <ReviewItem label="Phone" value={employee.phone || "—"} />
                    <ReviewItem
                      label="Department"
                      value={
                        employee.department?.name ||
                        employee.department ||
                        getDepartmentName(employee.department_id)
                      }
                    />
                    <ReviewItem
                      label="Designation"
                      value={employee.designation || "Not set"}
                    />
                    <ReviewItem
                      label="Role"
                      value={ROLE_LABELS[employee.role] || employee.role}
                    />
                    <ReviewItem
                      label="Joining Date"
                      value={employee.joining_date || "Not set"}
                    />
                    <ReviewItem
                      label="Employee Code"
                      value={employee.employee_code || "Auto-generated"}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/workspace/admin/employees/${employeeId}/edit`,
                        )
                      }
                      className="cursor-pointer"
                    >
                      Edit Information
                    </Button>
                    <Button
                      onClick={() => setApproveDialogOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                    >
                      <CheckCircle size={14} className="mr-2" />
                      Approve & Activate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle
                    size={48}
                    className="text-emerald-500 mx-auto mb-4"
                  />
                  <p className="text-gray-500">
                    This employee account is already active.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    No pending approvals needed.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {employee?.full_name}? They will
              be able to login immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveEmployee}
              disabled={actionLoading}
              className="cursor-pointer"
            >
              {actionLoading ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog
        open={assignRoleDialogOpen}
        onOpenChange={setAssignRoleDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Select a new role for {employee?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
              disabled={actionLoading}
              className="cursor-pointer"
            >
              {actionLoading ? "Assigning..." : "Assign Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Roster Dialog */}
      <Dialog
        open={assignRosterDialogOpen}
        onOpenChange={setAssignRosterDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Roster</DialogTitle>
            <DialogDescription>
              Set shift schedule for {employee?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
              disabled={actionLoading}
              className="cursor-pointer"
            >
              {actionLoading ? "Assigning..." : "Assign Roster"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Policy Dialog */}
      <Dialog
        open={assignPolicyDialogOpen}
        onOpenChange={setAssignPolicyDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Attendance Policy</DialogTitle>
            <DialogDescription>
              Apply attendance policy for {employee?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
              disabled={actionLoading}
              className="cursor-pointer"
            >
              {actionLoading ? "Assigning..." : "Assign Policy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
