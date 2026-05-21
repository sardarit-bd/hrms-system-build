"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  Shield,
  Users,
  MapPin,
} from "lucide-react";

export default function MemberDetailsModal({ open, onOpenChange, member }) {
  const { apiRequest } = useAuth();
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    if (member && open && member.team) {
      fetchAssignedProjects();
    }
  }, [member, open]);

  const fetchAssignedProjects = async () => {
    setLoadingProjects(true);
    try {
      // This would need a proper API endpoint for member's assigned projects
      // For now, using placeholder data structure
      const response = await apiRequest(`/teams/project-assignments/${member.team?.id}/members`);
      if (response.status && response.data) {
        // Filter projects for this specific member
        const memberProjects = response.data.filter(p => p.user_id === member.id);
        setAssignedProjects(memberProjects);
      }
    } catch (error) {
      console.error("Failed to fetch assigned projects:", error);
      setAssignedProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  if (!member) return null;

  const getInitials = () => {
    return member.full_name?.charAt(0).toUpperCase() || "U";
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

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      pending: "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-[#C9A84C] text-white text-xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{member.full_name}</DialogTitle>
              <DialogDescription>
                {getRoleLabel(member.role)} • {member.designation || "No designation"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-900 dark:text-white">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm text-gray-900 dark:text-white">{member.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Designation</p>
                <p className="text-sm text-gray-900 dark:text-white">{member.designation || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {member.department?.name || member.department || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="text-sm text-gray-900 dark:text-white">{getRoleLabel(member.role)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {member.joining_date ? new Date(member.joining_date).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Team</p>
                <p className="text-sm text-gray-900 dark:text-white">{member.team?.name || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(member.status)}>
                {member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Assigned Projects */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Assigned Projects
            </h4>
            {loadingProjects ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : assignedProjects.length === 0 ? (
              <p className="text-sm text-gray-500">No projects assigned</p>
            ) : (
              <div className="space-y-2">
                {assignedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 rounded-lg border border-gray-100 dark:border-gray-800"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                      <span>Assigned: {project.assigned_at || "—"}</span>
                      {project.status && (
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}