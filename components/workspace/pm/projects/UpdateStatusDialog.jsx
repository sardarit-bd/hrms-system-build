"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const STATUS_CONFIG = {
  delivered: {
    title: "Mark as Delivered",
    description: "Are you sure you want to mark this project as delivered?",
    icon: CheckCircle,
    iconColor: "text-green-600",
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
  cancelled: {
    title: "Mark as Cancelled",
    description: "Are you sure you want to mark this project as cancelled?",
    icon: XCircle,
    iconColor: "text-red-600",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
};

export default function UpdateStatusDialog({ open, onOpenChange, project, newStatus, onConfirm, loading }) {
  if (!project || !newStatus) return null;

  const config = STATUS_CONFIG[newStatus];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {config && <config.icon size={24} className={config.iconColor} />}
            <DialogTitle>{config?.title}</DialogTitle>
          </div>
          <DialogDescription>
            {config?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <p className="text-sm">
            <span className="font-medium">Project:</span> {project.name}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">Client:</span> {project.client_name || "—"}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">Current Status:</span> {project.status}
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`cursor-pointer ${config?.buttonColor}`}
          >
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            {newStatus === "delivered" ? "Mark Delivered" : "Mark Cancelled"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}