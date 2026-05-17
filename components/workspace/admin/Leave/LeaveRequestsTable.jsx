"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import LeaveDetailsModal from "./LeaveDetailsModal";
import ApproveRejectDialog from "./ApproveRejectDialog";

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

export default function LeaveRequestsTable({
  leaveRequests,
  currentPage,
  setCurrentPage,
  total,
  perPage,
  onRefresh,
}) {
  const { apiRequest } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const totalPages = Math.ceil(total / perPage);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const handleOpenAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleApproveReject = async (requestId, action, remarks) => {
    setActionLoading(true);
    try {
      const endpoint = `/leave/requests/${requestId}/${
        selectedRequest?.status === "pending_pm" ? "pm-action" : "gm-action"
      }`;
      
      await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify({ action, remarks }),
      });

      gooeyToast.success(`${action === "approved" ? "Approved" : "Rejected"} Successfully`, {
        description: `Leave request has been ${action}.`,
      });

      setActionDialogOpen(false);
      setSelectedRequest(null);
      onRefresh();
    } catch (error) {
      gooeyToast.error("Action Failed", {
        description: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

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
        <p className="text-gray-500">No leave requests found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                <TableHead className="cursor-default">Employee</TableHead>
                <TableHead className="cursor-default">Leave Type</TableHead>
                <TableHead className="cursor-default">From Date</TableHead>
                <TableHead className="cursor-default">To Date</TableHead>
                <TableHead className="cursor-default">Total Days</TableHead>
                <TableHead className="cursor-default">Status</TableHead>
                <TableHead className="cursor-default">Reason</TableHead>
                <TableHead className="text-right cursor-default">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                  <TableCell className="font-medium cursor-default">
                    {request.user?.full_name || "N/A"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {request.user?.employee_code || ""}
                    </span>
                  </TableCell>
                  <TableCell className="cursor-default">
                    {request.leave_type?.name || "N/A"}
                  </TableCell>
                  <TableCell className="cursor-default">{request.from_date}</TableCell>
                  <TableCell className="cursor-default">{request.to_date}</TableCell>
                  <TableCell className="cursor-default">{request.total_days}</TableCell>
                  <TableCell className="cursor-default">{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="cursor-default max-w-[200px] truncate">
                    {request.reason || "—"}
                  </TableCell>
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
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>
                        
                        {(request.status === "pending_pm" || request.status === "pending_gm") && (
                          <>
                            <DropdownMenuItem
                              className="cursor-pointer text-green-600 focus:text-green-600"
                              onClick={() => handleOpenAction(request, "approved")}
                            >
                              <CheckCircle size={14} className="mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => handleOpenAction(request, "rejected")}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 flex-wrap p-4 border-t">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * perPage + 1} to{" "}
              {Math.min(currentPage * perPage, total)} of {total} requests
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                <ChevronLeft size={14} />
                Previous
              </Button>
              <span className="text-sm px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                Next
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <LeaveDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        request={selectedRequest}
      />

      {/* Approve/Reject Dialog */}
      <ApproveRejectDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        request={selectedRequest}
        action={actionType}
        onConfirm={handleApproveReject}
        loading={actionLoading}
      />
    </>
  );
}