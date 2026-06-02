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
import { MoreHorizontal, Eye, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";

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
  totalPages,
  projectManagers,
  onViewDetails,
}) {
  const getStatusBadge = (status) => {
    return (
      <Badge className={`${STATUS_COLORS[status]} cursor-default text-[10px] sm:text-xs`}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  const getPmName = (pmId) => {
    const pm = projectManagers.find(p => p.id === pmId);
    return pm?.full_name || "—";
  };

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <Briefcase size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-sm sm:text-base text-gray-500">No projects found</p>
        <p className="text-xs sm:text-sm text-gray-400">Try adjusting your filters.</p>
      </div>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {projects.map((project) => (
        <div key={project.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{project.name}</p>
            {getStatusBadge(project.status)}
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Client: {project.client_name || "—"}</p>
            <p>PM: {getPmName(project.project_manager_id)}</p>
            <p>Budget: {project.total_budget?.toLocaleString()} {project.currency}</p>
            <p>Deadline: {project.deadline}</p>
          </div>
          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(project)}
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <Eye size={12} className="mr-1" />
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop table view
  const DesktopTableView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900/50">
            <TableHead className="cursor-default text-xs sm:text-sm">Project Name</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Client Name</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Project Manager</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Type</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Budget</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Start Date</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Deadline</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-right cursor-default text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <TableCell className="font-medium cursor-default text-xs sm:text-sm">{project.name}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{project.client_name || "—"}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{getPmName(project.project_manager_id)}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{TYPE_LABELS[project.type] || project.type}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">
                {project.total_budget?.toLocaleString()} {project.currency}
              </TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{project.start_date}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">
                <span className={project.is_overdue ? "text-red-600 font-medium" : ""}>
                  {project.deadline}
                </span>
              </TableCell>
              <TableCell className="cursor-default">{getStatusBadge(project.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer">
                      <MoreHorizontal size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 sm:w-48">
                    <DropdownMenuLabel className="cursor-default text-xs sm:text-sm">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-xs sm:text-sm"
                      onClick={() => onViewDetails(project)}
                    >
                      <Eye size={12} className="sm:w-3.5 sm:h-3.5 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <DesktopTableView />
        <MobileCardView />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 border-t">
          <p className="text-[10px] sm:text-xs text-gray-500">
            Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, total)} of {total} projects
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer h-7 sm:h-8 text-xs"
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer h-7 sm:h-8 text-xs"
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}