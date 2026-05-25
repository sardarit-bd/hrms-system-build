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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User, FileText, Clock, Briefcase } from "lucide-react";

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

  const getInitials = () => {
    const name = request.user?.full_name || "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Leave Request Details</span>
            <Badge className={STATUS_COLORS[request.status]}>
              {STATUS_LABELS[request.status] || request.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed information about the leave request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C]">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {request.user?.full_name}
              </p>
              <p className="text-xs text-gray-500">{request.user?.email}</p>
              <p className="text-xs text-gray-400">{request.user?.employee_code}</p>
            </div>
          </div>

          <Separator />

          {/* Leave Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Leave Type</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {request.leave_type?.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">From Date</p>
                <p className="text-sm font-medium">{request.from_date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">To Date</p>
                <p className="text-sm font-medium">{request.to_date}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Days</p>
              <p className="text-lg font-semibold text-[#C9A84C]">
                {request.total_days} day{request.total_days !== 1 ? "s" : ""}
              </p>
            </div>

            {request.project && (
              <div className="flex items-start gap-3">
                <Briefcase size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Project</p>
                  <p className="text-sm font-medium">{request.project.name}</p>
                </div>
              </div>
            )}

            {request.reason && (
              <div className="flex items-start gap-3">
                <FileText size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Reason</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {request.reason}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Applied Info */}
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Applied On</p>
              <p className="text-sm">
                {request.applied_on
                  ? new Date(request.applied_on).toLocaleString()
                  : request.created_at
                  ? new Date(request.created_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>

          {/* Approval History */}
          {request.approvals && request.approvals.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Approval History</p>
                <div className="space-y-2">
                  {request.approvals.map((approval, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {approval.approver_role?.replace("_", " ")}
                        </span>
                        <Badge
                          className={
                            approval.action === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {approval.action}
                        </Badge>
                      </div>
                      {approval.remarks && (
                        <p className="text-xs text-gray-500 mt-1">
                          Note: {approval.remarks}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {approval.acted_at && new Date(approval.acted_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}