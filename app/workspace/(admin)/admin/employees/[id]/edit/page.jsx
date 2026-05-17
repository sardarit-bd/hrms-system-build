"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

const ROLES = [
  { value: "employee", label: "Employee" },
  { value: "team_leader", label: "Team Leader" },
  { value: "project_manager", label: "Project Manager" },
  { value: "hr_manager", label: "HR Manager" },
  { value: "general_manager", label: "General Manager" },
  { value: "admin", label: "Admin" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "terminated", label: "Terminated" },
];

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const { apiRequest } = useAuth();

  const employeeId = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    employee_code: "",
    department_id: "",
    designation: "",
    role: "employee",
    joining_date: "",
    status: "active",
  });

  const fetchEmployee = useCallback(async () => {
    try {
      const response = await apiRequest(`/users/${employeeId}`);
      if (response.status && response.data) {
        const emp = response.data;
        setFormData({
          full_name: emp.full_name || "",
          email: emp.email || "",
          phone: emp.phone || "",
          employee_code: emp.employee_code || "",
          department_id: emp.department_id ? String(emp.department_id) : "",
          designation: emp.designation || "",
          role: emp.role || "employee",
          joining_date: emp.joining_date || "",
          status: emp.status || "active",
        });
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

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await apiRequest("/departments");
      if (response.status && response.data) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchEmployee();
    fetchDepartments();
  }, [fetchEmployee, fetchDepartments]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email) {
      gooeyToast.error("Missing Fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        employee_code: formData.employee_code,
        department_id: Number(formData.department_id),
        designation: formData.designation,
        role: formData.role,
        joining_date: formData.joining_date,
        status: formData.status,
      };
      delete updateData.password_confirmation;

      const response = await apiRequest(`/users/${employeeId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      if (response.status) {
        gooeyToast.success("Employee Updated", {
          description: `${formData.full_name} has been updated successfully.`,
        });
        router.push(`/workspace/admin/employees/${employeeId}`);
      }
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-7 w-48" />
          </div>
          <Skeleton className="h-[600px] rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Edit Employee
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Update employee information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="cursor-default">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    required
                    className="cursor-text border border-gray-200"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="cursor-default">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="cursor-text border border-gray-200"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="cursor-default">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="cursor-text border border-gray-200"
                  />
                </div>

                {/* Employee Code */}
                <div className="space-y-2">
                  <Label htmlFor="employee_code" className="cursor-default">
                    Employee Code
                  </Label>
                  <Input
                    id="employee_code"
                    value={formData.employee_code}
                    onChange={(e) =>
                      handleChange("employee_code", e.target.value)
                    }
                    className="cursor-text border border-gray-200"
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label className="cursor-default">Department</Label>
                  <Select
                    value={formData.department_id || "none"}
                    onValueChange={(v) =>
                      handleChange("department_id", v === "none" ? "" : v)
                    }
                  >
                    <SelectTrigger className="cursor-pointer border border-gray-200">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Designation */}
                <div className="space-y-2">
                  <Label htmlFor="designation" className="cursor-default">
                    Designation
                  </Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) =>
                      handleChange("designation", e.target.value)
                    }
                    className="cursor-text border border-gray-200"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label className="cursor-default">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) => handleChange("role", v)}
                  >
                    <SelectTrigger className="cursor-pointer border border-gray-200">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem
                          key={role.value}
                          value={role.value}
                          className="cursor-pointer"
                        >
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Joining Date */}
                <div className="space-y-2">
                  <Label htmlFor="joining_date" className="cursor-default">
                    Joining Date
                  </Label>
                  <Input
                    id="joining_date"
                    type="date"
                    value={formData.joining_date}
                    onChange={(e) =>
                      handleChange("joining_date", e.target.value)
                    }
                    className="cursor-pointer border border-gray-200"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="cursor-default">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => handleChange("status", v)}
                  >
                    <SelectTrigger className="cursor-pointer border border-gray-200">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="cursor-pointer"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
