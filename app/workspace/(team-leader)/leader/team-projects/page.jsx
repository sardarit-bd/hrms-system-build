"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ProjectDetailsModal from "../../../../../components/workspace/team-leder/projects/ProjectDetailsModal";
import ProjectsTable from "../../../../../components/workspace/team-leder/projects/ProjectsTable";
import ProjectsSkeleton from "../../../../../components/workspace/team-leder/projects/ProjectsSkeleton";

export default function TeamLeaderProjectsPage() {
  const { apiRequest } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchProjects = useCallback(
    async (showRefreshToast = false) => {
      try {
        const response = await apiRequest("/projects/my?per_page=100");

        if (response.status && response.data) {
          setProjects(Array.isArray(response.data) ? response.data : []);
        }

        if (showRefreshToast) {
          gooeyToast.success("Projects Refreshed", {
            description: "Your assigned projects have been updated.",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch projects:", {
          status: error.status,
          data: error.data,
          message: error.message,
        });

        setProjects([]);

        gooeyToast.error("Failed to Load Projects", {
          description:
            error.data?.message ||
            error.message ||
            "Backend projects API error.",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiRequest]
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProjects(true);
  };

  const handleViewDetails = async (project) => {
    try {
      const response = await apiRequest(`/projects/${project.id}`);

      if (response.status && response.data) {
        setSelectedProject(response.data);
        setDetailsModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to load project details:", {
        status: error.status,
        data: error.data,
        message: error.message,
      });

      gooeyToast.error("Failed to Load Project Details", {
        description:
          error.data?.message ||
          error.message ||
          "Backend project details API error.",
      });
    }
  };

  const stats = {
    total: projects.length,
    ongoing: projects.filter((project) => project.status === "ongoing").length,
    delivered: projects.filter((project) => project.status === "delivered")
      .length,
    cancelled: projects.filter((project) => project.status === "cancelled")
      .length,
  };

  if (loading) {
    return <ProjectsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                My Projects
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                View your assigned team projects
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2 cursor-pointer"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Briefcase size={18} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Ongoing</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.ongoing}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Clock size={18} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Delivered</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.delivered}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <CheckCircle size={18} className="text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Cancelled</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.cancelled}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <XCircle size={18} className="text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <ProjectsTable projects={projects} onViewDetails={handleViewDetails} />
        </div>
      </div>

      <ProjectDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        project={selectedProject}
      />
    </DashboardLayout>
  );
}