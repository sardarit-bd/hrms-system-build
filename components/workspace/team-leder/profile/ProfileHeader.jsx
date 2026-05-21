"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Camera, Users } from "lucide-react";

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
      <div className="bg-gradient-to-r from-[#1B2B4B] to-[#2A3D6B] dark:from-slate-800 dark:to-slate-900 px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-white/20">
              <AvatarFallback className="bg-[#C9A84C] text-[#1B2B4B] text-2xl font-bold">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <Camera size={14} className="text-[#1B2B4B]" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
              <h2 className="text-2xl font-bold text-white">
                {profileData.full_name}
              </h2>
              <Badge className="bg-[#C9A84C] text-white">
                Team Leader
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mt-2">
              <Badge className={getStatusColor(profileData.status)}>
                {profileData.status?.charAt(0).toUpperCase() + profileData.status?.slice(1)}
              </Badge>
              <span className="text-white/70 text-sm">{getRoleLabel(profileData.role)}</span>
              <span className="text-white/50 text-sm font-mono">
                {profileData.employee_code || "No code"}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer"
            >
              <Edit2 size={14} />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}