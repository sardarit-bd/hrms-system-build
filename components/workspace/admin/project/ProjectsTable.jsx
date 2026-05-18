"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ProjectDetailsDialog from "./ProjectDetailsDialog";
import EditProjectDialog from "./EditProjectDialog";
import StatusUpdateDialog from "./StatusUpdateDialog";

const STATUS_COLORS = {
  ongoing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS = {
  ongoing: "Ongoing",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const TYPE_LABELS = {
  single: "Single Payment",
  milestone: "Milestone Based",
  hourly: "Hourly",
};

export default function ProjectsTable({
  projects,
  currentPage,
  setCurrentPage,
  total,
  perPage,
  onRefresh,
  projectManagers,
  channels,
}) {
  const { apiRequest } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const totalPages = Math.ceil(total / perPage);

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setDetailsDialogOpen(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedProject || !newStatus) return;
    
    setActionLoading(true);
    try {
      await apiRequest(`/projects/${selectedProject.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      gooeyToast.success("Status Updated", {
        description: `${selectedProject.name} has been marked as ${STATUS_LABELS[newStatus]}.`,
      });

      setStatusDialogOpen(false);
      setSelectedProject(null);
      setNewStatus("");
      onRefresh();
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (project) => {
    if (!confirm(`Are you sure you want to delete "${project.name}"?`)) return;
    
    try {
      await apiRequest(`/projects/${project.id}`, { method: "DELETE" });
      
      gooeyToast.success("Project Deleted", {
        description: `${project.name} has been removed.`,
      });
      
      onRefresh();
    } catch (error) {
      gooeyToast.error("Delete Failed", {
        description: error.message,
      });
    }
  };

  const getStatusBadge = (status) => {
    return (
      <Badge className={`${STATUS_COLORS[status]} cursor-default`}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500">No projects found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                <TableHead className="cursor-default">Project Name</TableHead>
                <TableHead className="cursor-default">Client Name</TableHead>
                <TableHead className="cursor-default">Type</TableHead>
                <TableHead className="cursor-default">Project Manager</TableHead>
                <TableHead className="cursor-default">Budget</TableHead>
                <TableHead className="cursor-default">Start Date</TableHead>
                <TableHead className="cursor-default">Deadline</TableHead>
                <TableHead className="cursor-default">Status</TableHead>
                <TableHead className="text-right cursor-default">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                  <TableCell className="font-medium cursor-default">
                    {project.name}
                  </TableCell>
                  <TableCell className="cursor-default">{project.client_name || "—"}</TableCell>
                  <TableCell className="cursor-default">
                    {TYPE_LABELS[project.type] || project.type}
                  </TableCell>
                  <TableCell className="cursor-default">
                    {project.project_manager?.full_name || "—"}
                  </TableCell>
                  <TableCell className="cursor-default">
                    {project.total_budget?.toLocaleString()} {project.currency}
                  </TableCell>
                  <TableCell className="cursor-default">{project.start_date}</TableCell>
                  <TableCell className="cursor-default">
                    <span className={project.is_overdue ? "text-red-600 font-medium" : ""}>
                      {project.deadline}
                    </span>
                  </TableCell>
                  <TableCell className="cursor-default">{getStatusBadge(project.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="cursor-default">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleViewDetails(project)}
                        >
                          <Eye size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit size={14} className="mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        
                        {project.status === "ongoing" && (
                          <DropdownMenuItem
                            className="cursor-pointer text-green-600 focus:text-green-600"
                            onClick={() => {
                              setSelectedProject(project);
                              setNewStatus("delivered");
                              setStatusDialogOpen(true);
                            }}
                          >
                            <CheckCircle size={14} className="mr-2" />
                            Mark Delivered
                          </DropdownMenuItem>
                        )}
                        
                        {project.status === "ongoing" && (
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => {
                              setSelectedProject(project);
                              setNewStatus("cancelled");
                              setStatusDialogOpen(true);
                            }}
                          >
                            <XCircle size={14} className="mr-2" />
                            Mark Cancelled
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(project)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 flex-wrap p-4 border-t">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * perPage + 1} to{" "}
              {Math.min(currentPage * perPage, total)} of {total} projects
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                <ChevronLeft size={14} />
                Previous
              </Button>
              <span className="text-sm px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                Next
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <ProjectDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        project={selectedProject}
      />

      {/* Edit Dialog */}
      <EditProjectDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        project={selectedProject}
        onSuccess={onRefresh}
        projectManagers={projectManagers}
        channels={channels}
      />

      {/* Status Update Dialog */}
      <StatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        project={selectedProject}
        newStatus={newStatus}
        onConfirm={handleStatusUpdate}
        loading={actionLoading}
      />
    </>
  );
}