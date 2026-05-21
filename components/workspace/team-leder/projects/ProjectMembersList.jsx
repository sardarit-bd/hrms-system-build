"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Mail, Phone } from "lucide-react";

export default function ProjectMembersList({ assignmentId, projectName }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (assignmentId) {
      fetchMembers();
    } else {
      setLoading(false);
    }
  }, [assignmentId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`/teams/project-assignments/${assignmentId}/members`);
      if (response.status && response.data) {
        setMembers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch project members:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!assignmentId) {
    return (
      <div className="text-center py-8">
        <Users size={40} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No team assignment found</p>
        <p className="text-xs text-gray-400 mt-1">
          This project may not have a team assigned yet.
        </p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <Users size={40} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No members assigned</p>
        <p className="text-xs text-gray-400 mt-1">
          No team members have been assigned to {projectName}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
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
                <span className="text-xs text-gray-500">{member.role}</span>
                {member.designation && (
                  <Badge variant="outline" className="text-xs">
                    {member.designation}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Mail size={12} />
              <span>{member.email}</span>
            </div>
            {member.phone && (
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <Phone size={12} />
                <span>{member.phone}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}