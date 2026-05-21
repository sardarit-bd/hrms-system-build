"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function TeamMembersList({ members, teamName }) {
  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  const getRoleLabel = (role) => {
    const labels = {
      employee: "Employee",
      team_leader: "Team Leader",
      project_manager: "Project Manager",
    };
    return labels[role] || role;
  };

  if (members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Users size={16} />
            Team Members - {teamName}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No team members found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Users size={16} />
          Team Members - {teamName}
        </CardTitle>
        <Link
          href="/workspace/leader/team"
          className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.slice(0, 5).map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C]">
                  {getInitials(member.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {member.full_name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">{getRoleLabel(member.role)}</span>
                  <Badge variant="outline" className="text-xs">
                    {member.designation || "—"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{member.email}</p>
              <p className="text-xs text-gray-400">{member.phone || "No phone"}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}