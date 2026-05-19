"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase } from "lucide-react";

export default function WelcomeHeader({ profile }) {
  const getUserInitial = () => {
    const name = profile?.full_name || profile?.name || "U";
    return name.charAt(0).toUpperCase();
  };

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

  if (!profile) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500">Welcome back!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#1B2B4B] to-[#2A3D6B] dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-4 ring-white/20">
            <AvatarFallback className="bg-[#C9A84C] text-[#1B2B4B] text-xl font-bold">
              {getUserInitial()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile.full_name?.split(" ")[0]}!
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                {getRoleLabel(profile.role)}
              </Badge>
              <span className="text-white/60 text-sm">
                {profile.employee_code || "No code"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-white/80">
            <Calendar size={14} />
            <span className="text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {profile.department && (
            <div className="flex items-center gap-2 text-white/60 text-sm mt-1">
              <Briefcase size={14} />
              <span>{profile.department?.name || profile.department}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}