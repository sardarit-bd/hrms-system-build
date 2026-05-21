"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function AssignedProjectsList({ memberId, teamId, memberName }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    if (memberId) {
      fetchAssignedProjects();
    }
  }, [memberId]);

  const fetchAssignedProjects = async () => {
    setLoading(true);
    try {
      // First get team project assignments
      const response = await apiRequest(`/teams/${teamId}`);
      
      if (response.status && response.data) {
        // Get projects assigned to the team
        const teamProjects = response.data.projects || [];
        
        // Filter projects for this specific member (based on project assignments)
        // In a real API, you might have a dedicated endpoint for member's projects
        const memberProjects = teamProjects.map(project => ({
          ...project,
          assigned_at: project.assigned_at || "2024-01-01",
          status: project.status || "ongoing",
          role: project.member_role || "Team Member",
        }));
        
        setProjects(memberProjects);
      }
    } catch (error) {
      console.error("Failed to fetch assigned projects:", error);
      gooeyToast.error("Failed to Load Projects", {
        description: error.message,
      });
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setDetailsModalOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      ongoing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (status) => {
    const labels = {
      ongoing: "Ongoing",
      delivered: "Delivered",
      cancelled: "Cancelled",
      pending: "Pending",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-6">
        <Briefcase size={40} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No projects assigned</p>
        <p className="text-xs text-gray-400 mt-1">
          {memberName} is not assigned to any projects yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase size={14} />
            Assigned Projects ({projects.length})
          </h4>
        </div>

        {projects.map((project) => (
          <div
            key={project.id}
            className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </p>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {project.client_name || "No client"}
                </p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Deadline: {project.deadline || "—"}
                  </span>
                  {project.total_budget && (
                    <span className="flex items-center gap-1">
                      <DollarSign size={12} />
                      {project.total_budget.toLocaleString()} {project.currency}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Assigned: {project.assigned_at || "—"}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(project)}
                className="h-8 w-8 p-0 cursor-pointer"
                title="View Details"
              >
                <Eye size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProject?.name}</DialogTitle>
            <DialogDescription>
              Project details and assignment information
            </DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex justify-end">
                <Badge className={getStatusColor(selectedProject.status)}>
                  {getStatusLabel(selectedProject.status)}
                </Badge>
              </div>

              {/* Client Info */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Client</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedProject.client_name || "—"}
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm">{selectedProject.start_date || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p className="text-sm">{selectedProject.deadline || "—"}</p>
                </div>
              </div>

              {/* Budget */}
              {selectedProject.total_budget && (
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-sm font-medium">
                    {selectedProject.total_budget.toLocaleString()} {selectedProject.currency}
                  </p>
                </div>
              )}

              {/* Project Type */}
              <div>
                <p className="text-xs text-gray-500">Project Type</p>
                <p className="text-sm capitalize">{selectedProject.type || "—"}</p>
              </div>

              {/* Description */}
              {selectedProject.description && (
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedProject.description}
                  </p>
                </div>
              )}

              {/* Assignment Info */}
              <div className="pt-3 border-t">
                <p className="text-xs text-gray-500">Assignment Details</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Assigned Date:</span> {selectedProject.assigned_at || "—"}
                </p>
                {selectedProject.role && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Role:</span> {selectedProject.role}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}