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
  pending_pm: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  pending_gm: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS = {
  pending_pm: "Pending PM",
  pending_gm: "Pending GM",
  approved: "Approved",
  rejected: "Rejected",
};

export default function LeaveRequestsTable({ leaveRequests, onViewDetails, onApprove, onReject, statusFilter }) {
  const getStatusBadge = (status) => {
    return (
      <Badge className={`${STATUS_COLORS[status]} cursor-default`}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  if (leaveRequests.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <Calendar size={48} className="text-gray-400" />
          <p className="text-gray-500">No leave requests found</p>
          <p className="text-sm text-gray-400">
            {statusFilter === "pending_pm" 
              ? "No pending leave requests require approval."
              : statusFilter === "approved"
              ? "No approved leave requests found."
              : "No rejected leave requests found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              <TableHead className="cursor-default">Employee</TableHead>
              <TableHead className="cursor-default">Leave Type</TableHead>
              <TableHead className="cursor-default">Project</TableHead>
              <TableHead className="cursor-default">From Date</TableHead>
              <TableHead className="cursor-default">To Date</TableHead>
              <TableHead className="cursor-default">Total Days</TableHead>
              <TableHead className="cursor-default">Reason</TableHead>
              <TableHead className="cursor-default">Status</TableHead>
              <TableHead className="text-right cursor-default">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.map((request) => (
              <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <TableCell className="font-medium cursor-default">
                  {request.user?.full_name || "N/A"}
                  <br />
                  <span className="text-xs text-gray-500">{request.user?.employee_code || ""}</span>
                </TableCell>
                <TableCell className="cursor-default">
                  {request.leave_type?.name || "N/A"}
                </TableCell>
                <TableCell className="cursor-default">
                  {request.project?.name || "—"}
                </TableCell>
                <TableCell className="cursor-default">{request.from_date}</TableCell>
                <TableCell className="cursor-default">{request.to_date}</TableCell>
                <TableCell className="cursor-default font-semibold">
                  {request.total_days}
                </TableCell>
                <TableCell className="cursor-default max-w-[200px] truncate">
                  {request.reason || "—"}
                </TableCell>
                <TableCell className="cursor-default">{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="cursor-default">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onViewDetails(request)}
                      >
                        <Eye size={14} className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {request.status === "pending_pm" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-green-600 focus:text-green-600"
                            onClick={() => onApprove(request)}
                          >
                            <CheckCircle size={14} className="mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => onReject(request)}
                          >
                            <XCircle size={14} className="mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}