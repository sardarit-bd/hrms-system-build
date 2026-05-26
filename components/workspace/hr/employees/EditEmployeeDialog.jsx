"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

const NONE_VALUE = "none";

const editEmployeeSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  department_id: z.string().optional(),
  designation: z.string().optional(),
  role: z.string().optional(),
  joining_date: z.string().optional(),
});

export default function EditEmployeeDialog({
  open,
  onOpenChange,
  employee,
  departments = [],
  roles = [],
  onSuccess,
}) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      department_id: "",
      designation: "",
      role: "",
      joining_date: "",
    },
  });

  const departmentId = watch("department_id");
  const roleValue = watch("role");

  useEffect(() => {
    if (employee && open) {
      reset({
        full_name: employee.full_name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department_id: employee.department_id?.toString() || "",
        designation: employee.designation || "",
        role: employee.role || "",
        joining_date: employee.joining_date || "",
      });
    }
  }, [employee, open, reset]);

  const onSubmit = async (data) => {
    if (!employee) return;

    setLoading(true);

    try {
      const payload = {
        ...data,
        department_id: data.department_id
          ? parseInt(data.department_id)
          : null,
      };

      const response = await apiRequest(`/users/${employee.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (response.status) {
        gooeyToast.success("Employee Updated", {
          description: `${data.full_name} has been updated.`,
        });

        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Edit Employee Information
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm">
            Update HR information for {employee.full_name}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Full Name</Label>
              <Input
                {...register("full_name")}
                className="cursor-text text-sm"
              />

              {errors.full_name && (
                <p className="text-xs text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Email</Label>
              <Input
                type="email"
                {...register("email")}
                className="cursor-text text-sm"
              />

              {errors.email && (
                <p className="text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Phone</Label>
              <Input
                {...register("phone")}
                placeholder="Not provided"
                className="cursor-text text-sm"
              />
            </div>

            {/* Department */}
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Department</Label>

              <Select
                value={departmentId || NONE_VALUE}
                onValueChange={(value) =>
                  setValue(
                    "department_id",
                    value === NONE_VALUE ? "" : value,
                    { shouldValidate: true }
                  )
                }
              >
                <SelectTrigger className="cursor-pointer h-9 text-sm">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem
                    value={NONE_VALUE}
                    className="cursor-pointer text-sm"
                  >
                    None
                  </SelectItem>

                  {departments.map((dept) => (
                    <SelectItem
                      key={dept.id}
                      value={dept.id.toString()}
                      className="cursor-pointer text-sm"
                    >
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Designation */}
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Designation</Label>
              <Input
                {...register("designation")}
                placeholder="Not set"
                className="cursor-text text-sm"
              />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Role</Label>

              <Select
                value={roleValue || undefined}
                onValueChange={(value) =>
                  setValue("role", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className="cursor-pointer h-9 text-sm">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem
                      key={role.id}
                      value={role.name}
                      className="cursor-pointer text-sm"
                    >
                      {role.name
                        ?.replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Joining Date */}
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Joining Date</Label>
              <Input
                type="date"
                {...register("joining_date")}
                className="cursor-pointer text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer w-full sm:w-auto text-sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer w-full sm:w-auto text-sm"
            >
              {loading && <Loader2 size={16} className="animate-spin mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}