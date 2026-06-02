"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ProjectSummary({ projects, ongoingProjects, overdueProjects }) {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "delivered").length;
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Briefcase size={18} className="sm:w-5 sm:h-5" />
          Project Summary
        </CardTitle>
        <Link href="/workspace/gm/projects" className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
          View All →
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
            <Clock size={16} className="text-blue-600" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{ongoingProjects.length}</p>
              <p className="text-[10px] text-gray-500">Ongoing</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
            <CheckCircle size={16} className="text-green-600" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{completedProjects}</p>
              <p className="text-[10px] text-gray-500">Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
            <AlertCircle size={16} className="text-red-600" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{overdueProjects.length}</p>
              <p className="text-[10px] text-gray-500">Overdue</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
            <Briefcase size={16} className="text-purple-600" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{completionRate}%</p>
              <p className="text-[10px] text-gray-500">Completion Rate</p>
            </div>
          </div>
        </div>

        {/* Top Projects */}
        {projects.slice(0, 3).map((project) => (
          <div key={project.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</p>
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
      </CardContent>
    </Card>
  );
}