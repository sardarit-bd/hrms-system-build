"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, Calendar, Shield, Clock, MapPin, Users } from "lucide-react";

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
    return labels[role] || role;
  };

  const workInfo = [
    { label: "Employee Code", value: profileData?.employee_code || "—", icon: Shield },
    { label: "Joining Date", value: profileData?.joining_date ? new Date(profileData.joining_date).toLocaleDateString() : "—", icon: Calendar },
    { label: "Department", value: profileData?.department?.name || profileData?.department || "—", icon: Building2 },
    { label: "Designation", value: profileData?.designation || "—", icon: Briefcase },
    { label: "Role", value: getRoleLabel(profileData?.role), icon: Shield },
    { label: "Employment Type", value: "Full-time", icon: Clock },
    { label: "Work Location", value: profileData?.work_location || "Dhaka, Bangladesh", icon: MapPin },
    { label: "Reporting Manager", value: profileData?.reporting_manager || "Not assigned", icon: Users },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Briefcase size={16} className="sm:w-5 sm:h-5" />
          Work Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {workInfo.map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                <item.icon size={10} className="sm:w-3 sm:h-3" />
                {item.label}
              </p>
              <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}