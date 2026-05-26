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
import { Shield, Timer, AlertCircle, Calendar, Clock } from "lucide-react";

export default function PolicyDetailsModal({ open, onOpenChange, policy }) {
  if (!policy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} className="text-[#C9A84C]" />
            <DialogTitle className="text-base sm:text-lg">{policy.name}</DialogTitle>
            <Badge className={policy.is_active ? "bg-green-100 text-green-700 ml-auto" : "bg-gray-100 text-gray-700"}>
              {policy.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <DialogDescription>Attendance policy details and rules</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-center">
              <Timer size={16} className="mx-auto mb-1 text-blue-600" />
              <p className="text-xs text-gray-500">Grace Period</p>
              <p className="text-lg font-semibold">{policy.grace_period_minutes} minutes</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-center">
              <AlertCircle size={16} className="mx-auto mb-1 text-yellow-600" />
              <p className="text-xs text-gray-500">Late Threshold</p>
              <p className="text-lg font-semibold">{policy.late_count_threshold} times</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-center">
              <Clock size={16} className="mx-auto mb-1 text-orange-600" />
              <p className="text-xs text-gray-500">Half Day Threshold</p>
              <p className="text-lg font-semibold">{policy.half_day_threshold_hours} hours</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-center">
              <Calendar size={16} className="mx-auto mb-1 text-purple-600" />
              <p className="text-xs text-gray-500">Effective From</p>
              <p className="text-sm font-semibold">{policy.effective_from}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Deduction Rules</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Late Threshold Deduction:</span>
                <span className="font-medium">{policy.late_threshold_deduction_days} day(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Absent Deduction per Day:</span>
                <span className="font-medium">{policy.absent_deduction_per_day} day(s)</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}