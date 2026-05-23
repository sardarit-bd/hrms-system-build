"use client";

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
import { Mail, Phone, Briefcase, Building2, Calendar, Shield, Users } from "lucide-react";

export default function MemberDetailsModal({ open, onOpenChange, member, projects }) {
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

  // Find member's assigned project
  const assignedProject = member.project_id ? projects.find(p => p.id === member.project_id) : null;

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

          {/* Assigned Project Info */}
          {assignedProject && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Assigned Project
              </h4>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <p className="font-medium text-gray-900 dark:text-white">
                  {assignedProject.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Client: {assignedProject.client_name || "—"}
                </p>
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                  <span>Status: {assignedProject.status}</span>
                  <span>Deadline: {assignedProject.deadline}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}