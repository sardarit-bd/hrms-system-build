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
import { Users, Calendar, User, Briefcase } from "lucide-react";

export default function TeamDetailsModal({ open, onOpenChange, team }) {
  if (!team) return null;

  const memberCount = team.members_count || team.members?.length || 0;
  const leader = team.leader;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{team.name}</DialogTitle>
          <DialogDescription>
            Team details and information
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
                {team.projects_count || "—"}
              </p>
              <p className="text-xs text-gray-500">Projects</p>
            </div>
          </div>

          <Separator />

          {/* Team Leader Info */}
          {leader && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Team Leader</p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
                  <User size={18} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {leader.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{leader.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Created Info */}
          <div>
            <p className="text-xs text-gray-500">Created At</p>
            <p className="text-sm text-gray-900 dark:text-white">
              {team.created_at ? new Date(team.created_at).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}