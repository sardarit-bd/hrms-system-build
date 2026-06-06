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
import { User, Calendar, DollarSign, TrendingDown, Clock, CheckCircle } from "lucide-react";

const STATUS_COLORS = {
  draft: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
};

export default function PayrollDetailsModal({ open, onOpenChange, record }) {
  if (!record) return null;

  const getInitials = () => {
    const name = record.user?.full_name || "U";
    return name.charAt(0).toUpperCase();
  };

  const getStatusBadge = () => {
    return (
      <Badge className={`${STATUS_COLORS[record.payroll_status]} px-3 py-1`}>
        {record.payroll_status?.charAt(0).toUpperCase() + record.payroll_status?.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-base sm:text-lg">Payroll Details</DialogTitle>
            {getStatusBadge()}
          </div>
          <DialogDescription className="text-xs sm:text-sm">
            {record.user?.full_name} • {record.payroll_month}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Employee Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {record.user?.full_name}
              </p>
              <p className="text-xs text-gray-500">{record.user?.email}</p>
              <p className="text-xs text-gray-400">{record.user?.employee_code}</p>
            </div>
          </div>

          <Separator />

          {/* Salary Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
              <DollarSign size={14} className="mx-auto mb-1 text-green-600" />
              <p className="text-xs text-gray-500">Basic Salary</p>
              <p className="text-sm font-semibold">৳{record.basic_salary?.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
              <DollarSign size={14} className="mx-auto mb-1 text-blue-600" />
              <p className="text-xs text-gray-500">Gross Salary</p>
              <p className="text-sm font-semibold">৳{record.gross_salary?.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-center">
              <DollarSign size={14} className="mx-auto mb-1 text-purple-600" />
              <p className="text-xs text-gray-500">Net Salary</p>
              <p className="text-sm font-semibold text-green-600">৳{record.net_salary?.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-center">
              <TrendingDown size={14} className="mx-auto mb-1 text-red-600" />
              <p className="text-xs text-gray-500">Total Deductions</p>
              <p className="text-sm font-semibold">৳{record.total_deductions?.toLocaleString()}</p>
            </div>
          </div>

          <Separator />

          {/* Attendance Summary */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Attendance Summary</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <p className="text-lg font-bold">{record.total_working_days || "—"}</p>
                <p className="text-[10px] text-gray-500">Working Days</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                <p className="text-lg font-bold text-green-600">{record.days_present || "—"}</p>
                <p className="text-[10px] text-gray-500">Present</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
                <p className="text-lg font-bold text-red-600">{record.days_absent || "—"}</p>
                <p className="text-[10px] text-gray-500">Absent</p>
              </div>
            </div>
          </div>

          {/* Late Info */}
          {record.late_count > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-xs text-gray-600">Late Count</span>
              </div>
              <span className="text-sm font-medium">{record.late_count} times</span>
            </div>
          )}

          {/* Deduction Logs */}
          {record.deduction_logs && record.deduction_logs.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">Deduction Details</h4>
                <div className="space-y-2">
                  {record.deduction_logs.map((log, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">
                        {log.deduction_type?.replace(/_/g, " ")} ({log.reference_date})
                      </span>
                      <span className="font-medium text-red-600">৳{log.deduction_amount?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Late Carry Forward */}
          {record.late_carry_forward_out > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-xs text-gray-600">Late Carry Forward</span>
              </div>
              <span className="text-sm font-medium text-yellow-600">{record.late_carry_forward_out} to next month</span>
            </div>
          )}

          {/* Payment Status */}
          {record.payroll_status === "paid" && record.paid_at && (
            <div className="flex items-center gap-2 pt-2">
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-xs text-gray-500">
                Paid on {new Date(record.paid_at).toLocaleString()}
              </span>
            </div>
          )}

          {/* Remarks */}
          {record.remarks && (
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500">Remarks</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{record.remarks}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}