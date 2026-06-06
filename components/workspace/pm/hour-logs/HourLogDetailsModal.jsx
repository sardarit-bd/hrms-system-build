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
import { User, Briefcase, Calendar, Clock, FileText, CheckCircle, XCircle } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function HourLogDetailsModal({ open, onOpenChange, hourLog }) {
  if (!hourLog) return null;

  const getInitials = () => {
    const name = hourLog.user?.full_name || "U";
    return name.charAt(0).toUpperCase();
  };

  const getStatusIcon = () => {
    switch (hourLog.status) {
      case "approved":
        return <CheckCircle size={18} className="text-green-600" />;
      case "rejected":
        return <XCircle size={18} className="text-red-600" />;
      default:
        return <Clock size={18} className="text-yellow-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center justify-between gap-2 text-lg sm:text-xl">
            <span>Hour Log Details</span>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Badge className={STATUS_COLORS[hourLog.status]}>
                {STATUS_LABELS[hourLog.status] || hourLog.status}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Detailed information about the hour log
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {hourLog.user?.full_name}
              </p>
              <p className="text-xs text-gray-500">{hourLog.user?.email}</p>
              <p className="text-xs text-gray-400">{hourLog.user?.employee_code}</p>
            </div>
          </div>

          <Separator />

          {/* Hour Log Details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-start gap-3">
              <Briefcase size={16} className="text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Project</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {hourLog.project?.name || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <Calendar size={14} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Log Date</p>
                  <p className="text-sm font-medium">{hourLog.log_date}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Hours Worked</p>
                  <p className="text-base sm:text-lg font-semibold text-[#C9A84C]">
                    {hourLog.hours_logged} hrs
                  </p>
                </div>
              </div>
            </div>

            {hourLog.description && (
              <div className="flex items-start gap-2">
                <FileText size={14} className="text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {hourLog.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Submitted Info */}
          <div className="flex items-start gap-2">
            <Clock size={14} className="text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Submitted On</p>
              <p className="text-sm">
                {hourLog.created_at
                  ? new Date(hourLog.created_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>

          {/* Approval Info */}
          {hourLog.approved_by && (
            <div className="flex items-start gap-2">
              <User size={14} className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">
                  {hourLog.status === "approved" ? "Approved By" : "Rejected By"}
                </p>
                <p className="text-sm font-medium">
                  {hourLog.approved_by?.full_name || "N/A"}
                </p>
                <p className="text-xs text-gray-400">
                  {hourLog.approved_at && new Date(hourLog.approved_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}