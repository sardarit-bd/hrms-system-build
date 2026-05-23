"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Mail } from "lucide-react";
import Link from "next/link";

export default function TeamSummary({ teams, teamMembers }) {
  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  if (teamMembers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Users size={16} />
            My Team
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Users size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No team members found</p>
          <p className="text-sm text-gray-400">Your team has no members yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Users size={16} />
          My Team
        </CardTitle>
        <Link
          href="/workspace/manager/team"
          className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {teamMembers.slice(0, 5).map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
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
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">{member.designation || "Employee"}</p>
                  <Badge variant="outline" className="text-xs">
                    {member.role}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Mail size={12} />
                <span className="hidden sm:inline">{member.email}</span>
              </div>
            </div>
          </div>
        ))}
        {teamMembers.length > 5 && (
          <p className="text-xs text-center text-gray-500 pt-2">
            +{teamMembers.length - 5} more members
          </p>
        )}
      </CardContent>
    </Card>
  );
}