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
import { Users, Calendar, User, Briefcase, Mail } from "lucide-react";

export default function TeamDetailsModal({ open, onOpenChange, team, members, projects }) {
  if (!team) return null;

  const memberCount = members.length;
  const leader = team.leader;
  
  // Find projects associated with this team
  const teamProjects = projects.filter(p => p.team_id === team.id || p.project_manager_id === leader?.id);

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{team.name}</DialogTitle>
          <DialogDescription>
            Team details and member information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Team Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-center">
              <Users size={18} className="mx-auto mb-1 text-[#C9A84C]" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {memberCount}
              </p>
              <p className="text-xs text-gray-500">Total Members</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-center">
              <Briefcase size={18} className="mx-auto mb-1 text-[#C9A84C]" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {teamProjects.length}
              </p>
              <p className="text-xs text-gray-500">Associated Projects</p>
            </div>
          </div>

          <Separator />

          {/* Team Leader Info */}
          {leader && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Team Leader</p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C]">
                    {getInitials(leader.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {leader.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{leader.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Members List */}
          {members.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Team Members ({members.length})
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-xs">
                          {getInitials(member.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.full_name}
                        </p>
                        <p className="text-xs text-gray-500">{member.designation || "Employee"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={member.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Associated Projects */}
          {teamProjects.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Associated Projects
                </p>
                <div className="space-y-2">
                  {teamProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-500">{project.client_name || "No client"}</p>
                      </div>
                      <Badge className={
                        project.status === "ongoing" ? "bg-blue-100 text-blue-700" :
                        project.status === "delivered" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Created Info */}
          <div className="pt-2">
            <p className="text-xs text-gray-400">
              Created: {team.created_at ? new Date(team.created_at).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}