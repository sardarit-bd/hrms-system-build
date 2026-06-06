"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, CheckCircle, XCircle, Calendar } from "lucide-react";

const STATUS_COLORS = {
  pending_gm: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS = {
  pending_gm: "Pending GM",
  approved: "Approved",
  rejected: "Rejected",
};

export default function LeaveRequestsTable({ leaveRequests, onViewDetails, onApprove, onReject, statusFilter }) {
  const getStatusBadge = (status) => {
    return (
      <Badge className={`${STATUS_COLORS[status]} cursor-default text-[10px] sm:text-xs`}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  if (leaveRequests.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <Calendar size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-sm sm:text-base text-gray-500">No leave requests found</p>
        <p className="text-xs sm:text-sm text-gray-400">
          {statusFilter === "pending" 
            ? "No pending GM leave requests require approval."
            : statusFilter === "approved"
            ? "No approved leave requests found."
            : "No rejected leave requests found."}
        </p>
      </div>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {leaveRequests.map((request) => (
        <div key={request.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium">{request.user?.full_name || "N/A"}</p>
              <p className="text-xs text-gray-500">{request.leave_type?.name}</p>
            </div>
            {getStatusBadge(request.status)}
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Duration: {request.from_date} to {request.to_date}</p>
            <p>Days: {request.total_days} day(s)</p>
            {request.reason && <p className="truncate">Reason: {request.reason}</p>}
          </div>
          {request.status === "pending_gm" && (
            <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Button
                onClick={() => onApprove(request)}
                className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer text-xs h-8"
              >
                <CheckCircle size={12} className="mr-1" />
                Approve
              </Button>
              <Button
                onClick={() => onReject(request)}
                className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer text-xs h-8"
              >
                <XCircle size={12} className="mr-1" />
                Reject
              </Button>
            </div>
          )}
          {request.status !== "pending_gm" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(request)}
              className="w-full mt-3 cursor-pointer text-xs h-8"
            >
              <Eye size={12} className="mr-1" />
              View Details
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  // Desktop table view
  const DesktopTableView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900/50">
            <TableHead className="cursor-default text-xs sm:text-sm">Employee</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Leave Type</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Project</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">From Date</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">To Date</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Total Days</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Reason</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-right cursor-default text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.map((request) => (
            <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <TableCell className="font-medium cursor-default text-xs sm:text-sm">
                {request.user?.full_name || "N/A"}
                <br />
                <span className="text-[10px] text-gray-500">{request.user?.employee_code || ""}</span>
              </TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{request.leave_type?.name || "N/A"}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{request.project?.name || "—"}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{request.from_date}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{request.to_date}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm font-semibold">{request.total_days}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm max-w-[150px] truncate">
                {request.reason || "—"}
              </TableCell>
              <TableCell className="cursor-default">{getStatusBadge(request.status)}</TableCell>
              <TableCell className="text-right">
                {request.status === "pending_gm" ? (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      onClick={() => onApprove(request)}
                      className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700 cursor-pointer"
                      title="Approve"
                    >
                      <CheckCircle size={14} />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onReject(request)}
                      className="h-7 w-7 p-0 bg-red-600 hover:bg-red-700 cursor-pointer"
                      title="Reject"
                    >
                      <XCircle size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(request)}
                      className="h-7 w-7 p-0 cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(request)}
                    className="h-7 w-7 p-0 cursor-pointer"
                    title="View Details"
                  >
                    <Eye size={14} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <DesktopTableView />
      <MobileCardView />
    </div>
  );
}