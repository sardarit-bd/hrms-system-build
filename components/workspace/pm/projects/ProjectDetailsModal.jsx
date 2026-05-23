"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  User,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  TrendingUp,
  Flag,
} from "lucide-react";
import MilestonesManager from "./MilestonesManager";

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

export default function ProjectDetailsModal({ open, onOpenChange, project }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (project && open && project.type === "milestone") {
      fetchMilestones();
    }
  }, [project, open]);

  const fetchMilestones = async () => {
    if (!project) return;
    setLoading(true);
    try {
      const response = await apiRequest(`/milestones?project_id=${project.id}`);
      if (response.status && response.data) {
        setMilestones(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch milestones:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  const isOverdue = project.is_overdue || (new Date(project.deadline) < new Date() && project.status === "ongoing");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{project.name}</DialogTitle>
          <DialogDescription>
            Detailed project information
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="details" className="cursor-pointer">Details</TabsTrigger>
            {project.type === "milestone" && (
              <TabsTrigger value="milestones" className="cursor-pointer">
                Milestones ({milestones.length})
              </TabsTrigger>
            )}
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <Badge className={`${STATUS_COLORS[project.status]} px-3 py-1`}>
                {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
              </Badge>
              {isOverdue && (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Overdue
                </Badge>
              )}
            </div>

            <Separator />

            {/* Project Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Client Name</p>
                  <p className="text-sm font-medium">{project.client_name || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Project Manager</p>
                  <p className="text-sm font-medium">{project.project_manager?.full_name || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-sm font-medium">
                    {project.total_budget?.toLocaleString()} {project.currency}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Project Type</p>
                  <p className="text-sm font-medium">{TYPE_LABELS[project.type] || project.type}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm">{project.start_date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p className={`text-sm ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                    {project.deadline}
                  </p>
                </div>
              </div>

              {project.delivered_date && (
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Delivered Date</p>
                    <p className="text-sm">{project.delivered_date}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="text-sm">{project.description}</p>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Milestones Tab */}
          {project.type === "milestone" && (
            <TabsContent value="milestones" className="space-y-4">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <MilestonesManager
                  project={project}
                  milestones={milestones}
                  onMilestoneUpdate={fetchMilestones}
                  inline
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}