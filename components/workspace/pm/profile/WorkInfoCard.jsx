"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  Calendar,
  Shield,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

export default function WorkInfoCard({ profileData }) {
  const getRoleLabel = (role) => {
    const labels = {
      super_admin: "Super Admin",
      admin: "Admin",
      general_manager: "General Manager",
      hr_manager: "HR Manager",
      project_manager: "Project Manager",
      team_leader: "Team Leader",
      employee: "Employee",
    };

    return labels[role] || role || "—";
  };

  // Department ID → Name Map
  const departmentMap = {
    1: "Management",
    2: "Engineering",
    3: "HR",
    4: "QA",
    5: "DevOps",
  };

  // Get Department ID safely
  const departmentId = Number(
    profileData?.department_id ||
      profileData?.department?.id ||
      profileData?.department
  );

  // Department Name
  const departmentName = departmentMap[departmentId] || "—";

  const workInfo = [
    {
      label: "Employee Code",
      value: profileData?.employee_code || "—",
      icon: Shield,
    },

    {
      label: "Joining Date",
      value: profileData?.joining_date
        ? new Date(profileData.joining_date).toLocaleDateString()
        : "—",
      icon: Calendar,
    },

    {
      label: "Department",
      value: departmentName,
      icon: Building2,
    },

    {
      label: "Designation",
      value: profileData?.designation || "—",
      icon: Briefcase,
    },

    {
      label: "Role",
      value: getRoleLabel(profileData?.role),
      icon: Shield,
    },

    {
      label: "Employment Type",
      value: profileData?.employment_type || "Full-time",
      icon: Clock,
    },

    {
      label: "Work Location",
      value: profileData?.work_location || "Dhaka, Bangladesh",
      icon: MapPin,
    },

    {
      label: "Reporting Manager",
      value:
        profileData?.reporting_manager?.full_name ||
        profileData?.reporting_manager ||
        "Not assigned",
      icon: Users,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium sm:text-lg">
          <Briefcase size={16} className="sm:h-5 sm:w-5" />
          Work Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {workInfo.map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="flex items-center gap-1 text-[10px] text-gray-500 sm:text-xs">
                <item.icon size={10} className="sm:h-3 sm:w-3" />
                {item.label}
              </p>

              <p className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}