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
import { Mail, Phone, Briefcase, Calendar, Shield, Clock } from "lucide-react";

export default function AttendanceDetailsModal({ open, onOpenChange, member }) {
  if (!member) return null;

  const getInitials = () => {
    return member.full_name?.charAt(0).toUpperCase() || "U";
  };

  const getShiftInfo = () => {
    const roster = member.roster;
    if (!roster || !roster.shift) return "Not assigned";
    return {
      name: roster.shift.name,
      timing: `${roster.shift.start_time?.slice(0, 5)} - ${roster.shift.end_time?.slice(0, 5)}`,
      weekend: roster.weekend_days?.join(", ") || "None",
    };
  };

  const getPolicyInfo = () => {
    const policy = member.policy;
    if (!policy) return null;
    return {
      name: policy.name,
      gracePeriod: policy.grace_period_minutes,
      lateThreshold: policy.late_count_threshold,
      halfDayThreshold: policy.half_day_threshold_hours,
    };
  };

  const shift = getShiftInfo();
  const policy = getPolicyInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{member.full_name}</DialogTitle>
              <DialogDescription>
                {member.designation || "Employee"} • {member.role}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm">{member.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Designation</p>
                <p className="text-sm">{member.designation || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Joining Date</p>
                <p className="text-sm">
                  {member.joining_date ? new Date(member.joining_date).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shift & Roster Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock size={14} />
              Shift & Roster
            </h4>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              {shift === "Not assigned" ? (
                <p className="text-sm text-gray-500">No shift assigned</p>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">{shift.name}</p>
                  <p className="text-sm text-gray-500">Timing: {shift.timing}</p>
                  <p className="text-sm text-gray-500">Weekend: {shift.weekend}</p>
                  <Badge className={member.roster?.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {member.roster?.is_active ? "Active Roster" : "Inactive Roster"}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Policy Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Shield size={14} />
              Attendance Policy
            </h4>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              {!policy ? (
                <p className="text-sm text-gray-500">No policy assigned</p>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">{policy.name}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Grace Period</p>
                      <p>{policy.gracePeriod} minutes</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Late Threshold</p>
                      <p>{policy.lateThreshold} times</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Half Day Threshold</p>
                      <p>{policy.halfDayThreshold} hours</p>
                    </div>
                  </div>
                  <Badge className={member.policy?.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {member.policy?.is_active ? "Active Policy" : "Inactive Policy"}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-500">Account Status</span>
            <Badge className={member.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}