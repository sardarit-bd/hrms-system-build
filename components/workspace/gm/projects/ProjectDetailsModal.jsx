"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, User, Calendar, DollarSign, Clock, FileText, TrendingUp } from "lucide-react";

const STATUS_COLORS = {
  ongoing: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const TYPE_LABELS = {
  single: "Single Payment",
  milestone: "Milestone Based",
  hourly: "Hourly",
};

export default function ProjectDetailsModal({ open, onOpenChange, project, projectManagers, channels }) {
  if (!project) return null;

  const isOverdue = project.is_overdue || (new Date(project.deadline) < new Date() && project.status === "ongoing");
  const pmName = projectManagers?.find(p => p.id === project.project_manager_id)?.full_name || "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-base sm:text-lg">{project.name}</DialogTitle>
            <Badge className={STATUS_COLORS[project.status]}>
              {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
            </Badge>
          </div>
          <DialogDescription className="text-xs sm:text-sm">
            {project.client_name || "No client"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Project Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Building2 size={14} className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500">Client</p>
                <p className="text-xs sm:text-sm font-medium">{project.client_name || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User size={14} className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500">Project Manager</p>
                <p className="text-xs sm:text-sm font-medium">{pmName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <DollarSign size={14} className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500">Budget</p>
                <p className="text-xs sm:text-sm font-medium">
                  {project.total_budget?.toLocaleString()} {project.currency}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp size={14} className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500">Type</p>
                <p className="text-xs sm:text-sm font-medium">{TYPE_LABELS[project.type] || project.type}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500">Start Date</p>
                <p className="text-xs sm:text-sm">{project.start_date}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500">Deadline</p>
                <p className={`text-xs sm:text-sm ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                  {project.deadline}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <>
              <Separator />
              <div className="flex items-start gap-2">
                <FileText size={14} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-500">Description</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {project.description}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Delivered Date */}
          {project.delivered_date && (
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500">Delivered Date</p>
                <p className="text-xs sm:text-sm">{project.delivered_date}</p>
              </div>
            </div>
          )}

          {/* Channel Info */}
          {project.channel_id && channels && (
            <>
              <Separator />
              <div className="flex items-start gap-2">
                <Building2 size={14} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-500">Channel</p>
                  <p className="text-xs sm:text-sm font-medium">
                    {channels.find(c => c.id === project.channel_id)?.name || "—"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}