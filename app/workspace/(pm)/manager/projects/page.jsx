"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Briefcase } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ProjectsTable from "./components/ProjectsTable";
import ProjectDetailsModal from "./components/ProjectDetailsModal";
import EditProjectDialog from "./components/EditProjectDialog";
import UpdateStatusDialog from "./components/UpdateStatusDialog";
import MilestonesManager from "./components/MilestonesManager";
import ProjectsSkeleton from "./components/ProjectsSkeleton";

export default function ProjectManagerProjectsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [milestonesDialogOpen, setMilestonesDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const fetchProjects = useCallback(async (showRefreshToast = false) => {
    try {
      const response = await apiRequest("/projects/my?per_page=100");
      
      if (response.status && response.data) {
        setProjects(response.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Projects Refreshed", {
          description: "Your projects have been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      gooeyToast.error("Failed to Load Projects", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest]);

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
      gooeyToast.error("Failed to Load Project Details", {
        description: error.message,
      });
    }
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };

  const handleUpdateStatus = (project, status) => {
    setSelectedProject(project);
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  const handleManageMilestones = (project) => {
    setSelectedProject(project);
    setMilestonesDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!selectedProject || !newStatus) return;
    
    try {
      const response = await apiRequest(`/projects/${selectedProject.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status) {
        gooeyToast.success("Status Updated", {
          description: `${selectedProject.name} has been marked as ${newStatus}.`,
        });
        setStatusDialogOpen(false);
        fetchProjects(true);
      }
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    }
  };

  const stats = {
    total: projects.length,
    ongoing: projects.filter(p => p.status === "ongoing").length,
    delivered: projects.filter(p => p.status === "delivered").length,
    cancelled: projects.filter(p => p.status === "cancelled").length,
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
                Manage and track your assigned projects
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

          {/* Stats Cards */}
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
                    <Briefcase size={18} className="text-green-600" />
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
                    <Briefcase size={18} className="text-purple-600" />
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
                    <Briefcase size={18} className="text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Table */}
          <ProjectsTable
            projects={projects}
            onViewDetails={handleViewDetails}
            onEditProject={handleEditProject}
            onUpdateStatus={handleUpdateStatus}
            onManageMilestones={handleManageMilestones}
          />
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        project={selectedProject}
      />

      {/* Edit Project Dialog */}
      <EditProjectDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        project={selectedProject}
        onSuccess={fetchProjects}
      />

      {/* Update Status Dialog */}
      <UpdateStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        project={selectedProject}
        newStatus={newStatus}
        onConfirm={handleStatusConfirm}
      />

      {/* Milestones Manager Dialog */}
      <MilestonesManager
        open={milestonesDialogOpen}
        onOpenChange={setMilestonesDialogOpen}
        project={selectedProject}
        onSuccess={fetchProjects}
      />
    </DashboardLayout>
  );
}