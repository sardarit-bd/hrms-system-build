// components/gm/work-info.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building2, Hash, Calendar, TrendingUp, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function WorkInfo({ profile }) {
  const workFields = [
    { label: "Employee Code", value: profile.employee_code || "N/A", icon: Hash },
    { label: "Department", value: profile.department || "Not assigned", icon: Building2 },
    { label: "Designation", value: profile.designation || "General Manager", icon: Briefcase },
    { label: "Role", value: profile.role?.replace(/_/g, " ") || "General Manager", icon: TrendingUp },
    { label: "Joining Date", value: profile.joining_date || "Not available", icon: Calendar },
    { label: "Experience", value: profile.experience_years ? `${profile.experience_years} years` : "Not specified", icon: Award },
  ];

  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase size={18} className="text-[#1D3A88]" />
          Work Information
        </CardTitle>
        <CardDescription>
          Your employment and role details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workFields.map((field, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <field.icon size={18} className="text-[#1D3A88] mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">{field.label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {field.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Skills & Competencies</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="cursor-default">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}