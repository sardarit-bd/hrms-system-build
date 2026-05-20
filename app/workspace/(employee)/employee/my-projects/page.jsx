"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Briefcase, Clock } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ProjectDetailsModal from "../../../../../components/workspace/employee/project/ProjectDetailsModal";
import HourLogsTable from "../../../../../components/workspace/employee/project/HourLogsTable";
import SubmitHourLogForm from "../../../../../components/workspace/employee/project/SubmitHourLogForm";
import ProjectsTable from "../../../../../components/workspace/employee/project/ProjectsTable";
import ProjectStatusCard from "../../../../../components/workspace/employee/project/ProjectStatusCard";


export default function EmployeeProjectsPage() {
  const { user, apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [hourLogs, setHourLogs] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchProjectsData = useCallback(async (showRefreshToast = false) => {
    if (!user?.id) return;
    
    try {
      const [projectsRes, hourLogsRes] = await Promise.allSettled([
        apiRequest("/projects/my?per_page=50"),
        apiRequest("/hour-logs/my?per_page=50"),
      ]);

      if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
        setProjects(projectsRes.value.data);
      }
      if (hourLogsRes.status === "fulfilled" && hourLogsRes.value?.data) {
        setHourLogs(hourLogsRes.value.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Projects Data Refreshed", {
          description: "Your projects and hour logs have been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch projects data:", error);
      gooeyToast.error("Failed to Load Data", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest, user?.id]);

  useEffect(() => {
    fetchProjectsData();
  }, [fetchProjectsData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProjectsData(true);
  };

  const handleViewDetails = async (project) => {
    try {
      const response = await apiRequest(`/projects/${project.id}`);
      if (response.status && response.data) {
        setSelectedProject(response.data);
        setDetailsModalOpen(true);
      }
    } catch (error) {
      gooeyToast.error("Failed to Load Project Details", {
        description: error.message,
      });
    }
  };

  const handleHourLogSuccess = () => {
    fetchProjectsData();
  };

  if (loading) {
    return <ProjectsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                My Projects
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                View your assigned projects and submit hour logs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2 cursor-pointer"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Project Status Overview */}
          <ProjectStatusCard projects={projects} />

          {/* Tabs */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="projects" className="cursor-pointer">
                <Briefcase size={14} className="mr-2" />
                My Projects
              </TabsTrigger>
              <TabsTrigger value="hourlogs" className="cursor-pointer">
                <Clock size={14} className="mr-2" />
                My Hour Logs
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <ProjectsTable
                projects={projects}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            {/* Hour Logs Tab */}
            <TabsContent value="hourlogs" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Submit Hour Log Form */}
                <SubmitHourLogForm
                  projects={projects}
                  onSuccess={handleHourLogSuccess}
                />
                
                {/* Hour Logs Table */}
                <HourLogsTable
                  hourLogs={hourLogs}
                  projects={projects}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        project={selectedProject}
      />
    </DashboardLayout>
  );
}

// Loading Skeleton
function ProjectsSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </DashboardLayout>
  );
}