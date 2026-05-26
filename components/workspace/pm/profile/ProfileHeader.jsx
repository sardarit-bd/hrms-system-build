"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Camera } from "lucide-react";

export default function ProfileHeader({ profileData, isEditing, setIsEditing, onUpdate }) {
  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      terminated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || colors.inactive;
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

  const getUserInitial = () => {
    const name = profileData?.full_name || profileData?.name || "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-[#1B2B4B] to-[#2A3D6B] dark:from-slate-800 dark:to-slate-900 px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white/20">
              <AvatarFallback className="bg-[#C9A84C] text-[#1B2B4B] text-xl sm:text-2xl font-bold">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-1 sm:p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <Camera size={12} className="sm:w-3.5 sm:h-3.5 text-[#1B2B4B]" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {profileData.full_name}
              </h2>
              <Badge className="bg-[#C9A84C] text-white text-xs sm:text-sm">
                Project Manager
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-start mt-1 sm:mt-2">
              <Badge className={getStatusColor(profileData.status)}>
                {profileData.status?.charAt(0).toUpperCase() + profileData.status?.slice(1)}
              </Badge>
              <span className="text-white/70 text-xs sm:text-sm">{getRoleLabel(profileData.role)}</span>
              <span className="text-white/50 text-xs sm:text-sm font-mono">
                {profileData.employee_code || "No code"}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-1 sm:gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer text-xs sm:text-sm"
            >
              <Edit2 size={14} className="sm:w-4 sm:h-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}