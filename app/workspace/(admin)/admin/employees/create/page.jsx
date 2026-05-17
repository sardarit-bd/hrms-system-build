"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import Link from "next/link";

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
  { value: "pending", label: "Pending" },
];

// Function to generate employee code preview
const generatePreviewCode = (existingCodes) => {
  if (!existingCodes || existingCodes.length === 0) {
    return "EMP-0001";
  }

  // Extract numbers from existing codes
  const numbers = existingCodes
    .map((code) => {
      const match = code.match(/EMP-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((num) => num > 0);

  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNumber = maxNumber + 1;

  return `EMP-${nextNumber.toString().padStart(4, "0")}`;
};

export default function CreateEmployeePage() {
  const router = useRouter();
  const { apiRequest } = useAuth();

  const [loading, setLoading] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [existingCodes, setExistingCodes] = useState([]);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const [codeCheckMessage, setCodeCheckMessage] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    employee_code: "",
    department_id: "",
    designation: "",
    role: "employee",
    joining_date: new Date().toISOString().split("T")[0],
    status: "inactive",
  });

  // Fetch existing employee codes on component mount
  useEffect(() => {
    fetchExistingCodes();
    fetchDepartments();
  }, []);

  const fetchExistingCodes = async () => {
    try {
      const response = await apiRequest("/users?per_page=500");
      if (response.status && response.data) {
        const codes = response.data
          .map((user) => user.employee_code)
          .filter((code) => code && code.startsWith("EMP-"));
        setExistingCodes(codes);

        // Generate initial preview code
        const previewCode = generatePreviewCode(codes);
        setFormData((prev) => ({ ...prev, employee_code: previewCode }));
      }
    } catch (error) {
      console.error("Failed to fetch existing codes:", error);
      // Fallback: generate EMP-0001
      setFormData((prev) => ({ ...prev, employee_code: "EMP-0001" }));
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await apiRequest("/departments");
      if (response.status && response.data) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const handleGenerateCode = () => {
    const newCode = generatePreviewCode(existingCodes);
    setFormData((prev) => ({ ...prev, employee_code: newCode }));
    setIsCodeValid(true);
    setCodeCheckMessage("");

    gooeyToast.info("Code Generated", {
      description: `New employee code: ${newCode}`,
      duration: 2000,
    });
  };

  const checkEmployeeCode = async (code) => {
    if (!code || !code.startsWith("EMP-")) return true;

    setCheckingCode(true);
    try {
      // Check if code already exists
      const exists = existingCodes.includes(code);

      if (exists) {
        setIsCodeValid(false);
        setCodeCheckMessage(
          "This employee code already exists. Please generate a new one.",
        );
        return false;
      } else {
        setIsCodeValid(true);
        setCodeCheckMessage("");
        return true;
      }
    } catch (error) {
      console.error("Error checking code:", error);
      return true;
    } finally {
      setCheckingCode(false);
    }
  };

  const handleCodeChange = async (e) => {
    const newCode = e.target.value.toUpperCase();
    setFormData((prev) => ({ ...prev, employee_code: newCode }));

    if (newCode && newCode.match(/^EMP-\d{4}$/)) {
      await checkEmployeeCode(newCode);
    } else if (newCode && !newCode.match(/^EMP-\d{4}$/)) {
      setIsCodeValid(false);
      setCodeCheckMessage(
        "Format should be EMP-0001 (EMP- followed by 4 digits)",
      );
    } else {
      setIsCodeValid(true);
      setCodeCheckMessage("");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.full_name) {
      gooeyToast.error("Missing Field", {
        description: "Full name is required.",
      });
      return false;
    }

    if (!formData.email) {
      gooeyToast.error("Missing Field", { description: "Email is required." });
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      gooeyToast.error("Invalid Email", {
        description: "Please enter a valid email address.",
      });
      return false;
    }

    if (!formData.password) {
      gooeyToast.error("Missing Field", {
        description: "Password is required.",
      });
      return false;
    }

    // Password validation: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      gooeyToast.error("Weak Password", {
        description:
          "Password must contain uppercase, lowercase, number and be at least 8 characters.",
      });
      return false;
    }

    // 🔥 Bangladesh phone number validation (11 digits starting with 01)
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!formData.phone) {
      gooeyToast.error("Missing Field", {
        description: "Phone number is required.",
      });
      return false;
    }
    if (!bdPhoneRegex.test(formData.phone)) {
      gooeyToast.error("Invalid Phone Number", {
        description:
          "Phone number must be a valid Bangladesh number (01XXXXXXXXX, 11 digits).",
      });
      return false;
    }

    if (!formData.department_id) {
      gooeyToast.error("Missing Field", {
        description: "Department is required.",
      });
      return false;
    }

    if (!formData.employee_code) {
      gooeyToast.error("Missing Field", {
        description: "Employee code is required.",
      });
      return false;
    }

    if (!isCodeValid) {
      gooeyToast.error("Invalid Employee Code", {
        description: codeCheckMessage || "Please use a valid employee code.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Double check code uniqueness with backend
      const checkResponse = await apiRequest(
        `/users?employee_code=${formData.employee_code}`,
      );

      const exactDuplicate = checkResponse.data?.some(
        (user) => user.employee_code === formData.employee_code,
      );

      if (exactDuplicate) {
        gooeyToast.error("Duplicate Code", {
          description:
            "This employee code already exists. Please generate a new one.",
        });
        handleGenerateCode();
        setLoading(false);
        return;
      }

      // 🔥 IMPORTANT: Fix payload according to API documentation
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        employee_code: formData.employee_code,
        department_id: formData.department_id
          ? Number(formData.department_id)
          : null, // 🔥 Convert to number or null
        designation: formData.designation || "Employee",
        role: formData.role,
        joining_date: formData.joining_date,
        status: formData.status,
      };

      // 🔥 Remove undefined/null values
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || payload[key] === null) {
          delete payload[key];
        }
      });

      console.log("CREATE USER PAYLOAD (FIXED):", payload);

      const response = await apiRequest("/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.status) {
        gooeyToast.success("Employee Created", {
          description: `${formData.full_name} (${formData.employee_code}) has been added successfully.`,
        });
        router.push("/workspace/admin/employees");
      }
    } catch (error) {
      console.error("Create error:", error);

      // 🔥 Better error message from API response
      const errorMessage = error.errors
        ? Object.values(error.errors).flat().join(", ")
        : error.message;

      gooeyToast.error("Creation Failed", {
        description: errorMessage || "Something went wrong. Please try again.",
      });

      // If error indicates duplicate code, generate new code
      if (error.message && error.message.toLowerCase().includes("duplicate")) {
        handleGenerateCode();
      }
    } finally {
      setLoading(false);
    }
  };

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
              Add New Employee
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Create a new employee account
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
                <div className="space-y-2 ">
                  <Label htmlFor="full_name" className="cursor-default">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    placeholder="John Doe"
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
                    placeholder="john@company.com"
                    required
                    className="cursor-text border border-gray-200"
                  />
                </div>

                {/* Phone */}
                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="cursor-default">
                    Phone <span className="text-red-500">*</span>
                  </Label>

                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
                      +88
                    </div>

                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 11) {
                          handleChange("phone", value);
                        }
                      }}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className="rounded-l-none cursor-text border border-gray-200"
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    Enter 11 digit phone number
                  </p>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="cursor-default">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      className="pr-10 cursor-text border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Minimum 8 characters</p>
                </div>

                {/* Employee Code - Readonly with Generate Button */}
                <div className="space-y-2">
                  <Label htmlFor="employee_code" className="cursor-default">
                    Employee Code <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="employee_code"
                        value={formData.employee_code}
                        onChange={handleCodeChange}
                        placeholder="EMP-0001"
                        className={`font-mono cursor-text border border-gray-200 ${!isCodeValid ? "border-red-500 focus:ring-red-500" : ""}`}
                        readOnly={false}
                      />
                      {isCodeValid && formData.employee_code && (
                        <CheckCircle
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateCode}
                      disabled={checkingCode}
                      className="gap-2 cursor-pointer"
                    >
                      <RefreshCw
                        size={14}
                        className={checkingCode ? "animate-spin" : ""}
                      />
                      Generate
                    </Button>
                  </div>
                  {!isCodeValid && (
                    <p className="text-xs text-red-500">{codeCheckMessage}</p>
                  )}
                  {isCodeValid && formData.employee_code && (
                    <p className="text-xs text-green-600">
                      ✓ Format: EMP-XXXX (unique employee identifier)
                    </p>
                  )}
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
                      <SelectItem value="none" className="cursor-pointer">
                        None
                      </SelectItem>

                      {departments.map((dept) => (
                        <SelectItem
                          key={dept.id}
                          value={String(dept.id)}
                          className="cursor-pointer"
                        >
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
                    placeholder="Senior Developer"
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

              {/* Info Notice */}
              {/* <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  ℹ️ Employee Code follows format: <strong>EMP-XXXX</strong>{" "}
                  (4-digit number). It will be auto-generated and must be
                  unique. Click "Generate" for a new code.
                </p>
              </div> */}

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
                  disabled={loading || checkingCode || !isCodeValid}
                  className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Employee"
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
