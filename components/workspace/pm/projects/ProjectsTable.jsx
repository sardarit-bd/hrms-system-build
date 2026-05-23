"use client";

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
import { Eye, Edit, MoreHorizontal, Flag, Calendar, CheckCircle, XCircle } from "lucide-react";

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

export default function ProjectsTable({ projects, onViewDetails, onEditProject, onUpdateStatus, onManageMilestones }) {
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
        <div className="flex flex-col items-center gap-2">
          <Flag size={48} className="text-gray-400" />
          <p className="text-gray-500">No projects assigned</p>
          <p className="text-sm text-gray-400">You are not assigned to any projects yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              <TableHead className="cursor-default">Project Name</TableHead>
              <TableHead className="cursor-default">Client Name</TableHead>
              <TableHead className="cursor-default">Type</TableHead>
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
                <TableCell className="font-medium cursor-default">{project.name}</TableCell>
                <TableCell className="cursor-default">{project.client_name || "—"}</TableCell>
                <TableCell className="cursor-default">
                  {TYPE_LABELS[project.type] || project.type}
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
                        onClick={() => onViewDetails(project)}
                      >
                        <Eye size={14} className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEditProject(project)}
                      >
                        <Edit size={14} className="mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onManageMilestones(project)}
                      >
                        <Flag size={14} className="mr-2" />
                        Manage Milestones
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {project.status === "ongoing" && (
                        <>
                          <DropdownMenuItem
                            className="cursor-pointer text-green-600 focus:text-green-600"
                            onClick={() => onUpdateStatus(project, "delivered")}
                          >
                            <CheckCircle size={14} className="mr-2" />
                            Mark as Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => onUpdateStatus(project, "cancelled")}
                          >
                            <XCircle size={14} className="mr-2" />
                            Mark as Cancelled
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}