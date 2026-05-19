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
import {
  DollarSign,
  Calendar,
  User,
  Briefcase,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const STATUS_COLORS = {
  draft: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
};

export default function PayrollDetailsModal({ open, onOpenChange, record }) {
  if (!record) return null;

  const getStatusBadge = () => {
    return (
      <Badge className={`${STATUS_COLORS[record.payroll_status]} px-3 py-1`}>
        {record.payroll_status?.charAt(0).toUpperCase() + record.payroll_status?.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Payroll Details - {record.payroll_month}</span>
            {getStatusBadge()}
          </DialogTitle>
          <DialogDescription>
            Detailed salary breakdown and deduction information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Information */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Employee Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-500" />
                <span className="text-sm">{record.user?.full_name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-gray-500" />
                <span className="text-sm">{record.user?.designation || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-500" />
                <span className="text-sm">Month: {record.payroll_month}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-sm">
                  Status: {record.payroll_status?.charAt(0).toUpperCase() + record.payroll_status?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Salary Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
              <p className="text-xs text-gray-500">Basic Salary</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ৳{record.basic_salary?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
              <p className="text-xs text-gray-500">Gross Salary</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ৳{record.gross_salary?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-center">
              <p className="text-xs text-gray-500">Net Salary</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                ৳{record.net_salary?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Attendance Summary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">Working Days</p>
                <p className="text-lg font-semibold">{record.total_working_days || "—"}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Present</p>
                <p className="text-lg font-semibold text-green-600">{record.days_present || "—"}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Absent</p>
                <p className="text-lg font-semibold text-red-600">{record.days_absent || "—"}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Late</p>
                <p className="text-lg font-semibold text-yellow-600">{record.late_count || "—"}</p>
              </div>
            </div>
          </div>

          {/* Deduction Details */}
          {(record.total_deductions > 0 || record.deduction_logs?.length > 0) && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30">
              <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                <TrendingDown size={14} />
                Deduction Details
              </h4>
              <div className="space-y-2">
                {record.deduction_logs?.map((log, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {log.deduction_type?.replace("_", " ")} ({log.reference_date})
                    </span>
                    <span className="font-semibold text-red-600">
                      ৳{log.deduction_amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
                {record.total_deductions > 0 && (
                  <Separator className="my-2" />
                )}
                <div className="flex justify-between font-bold">
                  <span>Total Deductions</span>
                  <span className="text-red-600">৳{record.total_deductions?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Late Carry Forward Info */}
          {record.late_carry_forward_out > 0 && (
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 flex items-center gap-2">
              <AlertCircle size={16} className="text-yellow-600" />
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                {record.late_carry_forward_out} late occurrence(s) carried forward to next month
              </p>
            </div>
          )}

          {/* Payment Status */}
          {record.payroll_status === "paid" && record.paid_at && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <p className="text-xs text-green-700 dark:text-green-300">
                Payment completed on {new Date(record.paid_at).toLocaleString()}
              </p>
            </div>
          )}

          {/* Remarks */}
          {record.remarks && (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <p className="text-xs text-gray-500">Remarks</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{record.remarks}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}