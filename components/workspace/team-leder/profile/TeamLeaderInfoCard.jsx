"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

export default function TeamLeaderInfoCard({ profileData }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchTeamInfo();
  }, []);

  const fetchTeamInfo = async () => {
    setLoading(true);

    try {
      const response = await apiRequest("/teams/my");

      if (response.status && response.data) {
        const teamData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        setTeam(teamData || null);
        setTeamMembers(teamData?.members || []);
      }
    } catch (error) {
      console.error("Failed to fetch team info:", {
        status: error.status,
        data: error.data,
        message: error.message,
      });

      setTeam(null);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Users size={16} />
            Team Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!team) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Users size={16} />
            Team Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Users size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No team information found</p>
          <p className="text-xs text-gray-400 mt-1">
            Backend /teams/my endpoint is not returning team data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Users size={16} />
          Team Information - {team.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {teamMembers.length}
            </p>
            <p className="text-xs text-gray-500">Team Members</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {team.projects_count || "—"}
            </p>
            <p className="text-xs text-gray-500">Active Projects</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {team.created_at
                ? new Date(team.created_at).toLocaleDateString()
                : "—"}
            </p>
            <p className="text-xs text-gray-500">Team Since</p>
          </div>
        </div>

        {teamMembers.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Team Members
            </h4>

            <div className="space-y-3">
              {teamMembers.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800"
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
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">
                          {member.designation || "Employee"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">{member.email}</p>
                    <p className="text-xs text-gray-400">
                      {member.joining_date
                        ? new Date(member.joining_date).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {teamMembers.length > 5 && (
              <p className="text-xs text-center text-gray-500 mt-3">
                +{teamMembers.length - 5} more members
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}