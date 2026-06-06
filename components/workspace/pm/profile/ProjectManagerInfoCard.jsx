"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Briefcase, Calendar, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function ProjectManagerInfoCard({ profileData }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchProjectsAndTeam();
  }, []);

  const fetchProjectsAndTeam = async () => {
    setLoading(true);
    try {
      const [projectsRes, teamsRes] = await Promise.allSettled([
        apiRequest("/projects/my?per_page=10"),
        apiRequest("/teams/my"),
      ]);

      if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
        setProjects(projectsRes.value.data);
      }
      if (teamsRes.status === "fulfilled" && teamsRes.value?.data) {
        const members = teamsRes.value.data.members || [];
        setTeamMembers(members);
      }
    } catch (error) {
      console.error("Failed to fetch PM data:", error);
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
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Users size={16} className="sm:w-5 sm:h-5" />
            Project Manager Information
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

  const activeProjects = projects.filter(p => p.status === "ongoing").length;
  const completedProjects = projects.filter(p => p.status === "delivered").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Users size={16} className="sm:w-5 sm:h-5" />
          Project Manager Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 sm:space-y-6">
        {/* Projects Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Briefcase size={16} className="mx-auto mb-1 text-[#C9A84C]" />
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {projects.length}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">Total Projects</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Clock size={16} className="mx-auto mb-1 text-blue-600" />
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {activeProjects}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">Active Projects</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <CheckCircle size={16} className="mx-auto mb-1 text-green-600" />
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {completedProjects}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">Completed</p>
          </div>
        </div>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Recent Projects
            </h4>
            <div className="space-y-2">
              {projects.slice(0, 3).map((project) => (
                <Link
                  key={project.id}
                  href={`/workspace/manager/projects/${project.id}`}
                  className="block p-2 sm:p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </p>
                    <Badge className={
                      project.status === "ongoing" ? "bg-blue-100 text-blue-700" :
                      project.status === "delivered" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{project.client_name || "No client"}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Team Members Summary */}
        {teamMembers.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Team Members ({teamMembers.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {teamMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-[10px] sm:text-xs">
                      {getInitials(member.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {member.full_name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">{member.designation || "Employee"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}