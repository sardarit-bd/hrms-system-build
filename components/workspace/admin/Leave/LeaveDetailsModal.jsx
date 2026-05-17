"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Clock } from "lucide-react";

const STATUS_COLORS = {
  pending_pm: "bg-yellow-100 text-yellow-700",
  pending_gm: "bg-orange-100 text-orange-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  pending_pm: "Pending PM",
  pending_gm: "Pending GM",
  approved: "Approved",
  rejected: "Rejected",
};

export default function LeaveDetailsModal({ open, onOpenChange, request }) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
          <DialogDescription>
            Detailed information about the leave request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Info */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <User size={18} className="text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{request.user?.full_name || "N/A"}</p>
              <p className="text-xs text-gray-500">{request.user?.employee_code || ""}</p>
              <p className="text-xs text-gray-500">{request.user?.email || ""}</p>
            </div>
          </div>

          {/* Leave Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Leave Type</p>
              <p className="text-sm font-medium">{request.leave_type?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <Badge className={`${STATUS_COLORS[request.status]} mt-1 cursor-default`}>
                {STATUS_LABELS[request.status] || request.status}
              </Badge>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={12} /> From Date
              </p>
              <p className="text-sm">{request.from_date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={12} /> To Date
              </p>
              <p className="text-sm">{request.to_date}</p>
            </div>
          </div>

          {/* Total Days */}
          <div>
            <p className="text-xs text-gray-500">Total Days</p>
            <p className="text-sm font-medium">{request.total_days} day(s)</p>
          </div>

          {/* Reason */}
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FileText size={12} /> Reason
            </p>
            <p className="text-sm">{request.reason || "No reason provided"}</p>
          </div>

          {/* Project Info */}
          {request.project && (
            <div>
              <p className="text-xs text-gray-500">Project</p>
              <p className="text-sm">{request.project.name}</p>
            </div>
          )}

          {/* Approval History */}
          {request.approvals && request.approvals.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} /> Approval History
              </p>
              <div className="space-y-2 mt-2">
                {request.approvals.map((approval, idx) => (
                  <div key={idx} className="text-sm p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                    <p className="font-medium">{approval.approver_role?.replace("_", " ")}</p>
                    <p className="text-xs">Action: {approval.action}</p>
                    <p className="text-xs text-gray-500">
                      {approval.acted_at && new Date(approval.acted_at).toLocaleString()}
                    </p>
                    {approval.remarks && <p className="text-xs mt-1">Note: {approval.remarks}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}