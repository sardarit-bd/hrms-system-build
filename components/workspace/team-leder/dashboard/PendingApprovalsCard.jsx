"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function PendingApprovalsCard({ pendingLeaveRequests, pendingHourLogs, onRefresh }) {
  const { apiRequest } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApproveReject = async (request, type, action) => {
    setSelectedRequest(request);
    setActionType({ type, action });
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedRequest || !actionType) return;
    
    setLoading(true);
    try {
      const endpoint = actionType.type === "leave"
        ? `/leave/requests/${selectedRequest.id}/pm-action`
        : `/hour-logs/${selectedRequest.id}/${actionType.action}`;
      
      await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify({ action: actionType.action, remarks }),
      });

      gooeyToast.success(`${actionType.action === "approved" ? "Approved" : "Rejected"} Successfully`, {
        description: `${actionType.type === "leave" ? "Leave request" : "Hour log"} has been ${actionType.action}.`,
      });

      setDialogOpen(false);
      setRemarks("");
      onRefresh();
    } catch (error) {
      gooeyToast.error("Action Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPending = pendingLeaveRequests.length + pendingHourLogs.length;

  if (totalPending === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Clock size={16} />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <CheckCircle size={40} className="text-green-500 mx-auto mb-2" />
          <p className="text-gray-500">No pending approvals</p>
          <p className="text-xs text-gray-400 mt-1">All requests have been reviewed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Clock size={16} />
            Pending Approvals
            <Badge className="ml-2 bg-yellow-100 text-yellow-700">
              {totalPending}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pending Leave Requests */}
          {pendingLeaveRequests.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Leave Requests</p>
              {pendingLeaveRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="mb-3 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.user?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {request.leave_type?.name} • {request.from_date} to {request.to_date}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleApproveReject(request, "leave", "approved")}
                        className="p-1 rounded hover:bg-green-100 transition-colors cursor-pointer"
                        title="Approve"
                      >
                        <CheckCircle size={16} className="text-green-600" />
                      </button>
                      <button
                        onClick={() => handleApproveReject(request, "leave", "rejected")}
                        className="p-1 rounded hover:bg-red-100 transition-colors cursor-pointer"
                        title="Reject"
                      >
                        <XCircle size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending Hour Logs */}
          {pendingHourLogs.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Hour Logs</p>
              {pendingHourLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="mb-3 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.user?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {log.project?.name} • {log.log_date} • {log.hours_logged} hrs
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleApproveReject(log, "hourlog", "approve")}
                        className="p-1 rounded hover:bg-green-100 transition-colors cursor-pointer"
                        title="Approve"
                      >
                        <CheckCircle size={16} className="text-green-600" />
                      </button>
                      <button
                        onClick={() => handleApproveReject(log, "hourlog", "reject")}
                        className="p-1 rounded hover:bg-red-100 transition-colors cursor-pointer"
                        title="Reject"
                      >
                        <XCircle size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(pendingLeaveRequests.length > 3 || pendingHourLogs.length > 3) && (
            <Button variant="link" size="sm" className="w-full text-[#C9A84C] cursor-pointer">
              View all pending requests →
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Approve/Reject Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType?.action === "approved" ? "Approve" : "Reject"} {actionType?.type === "leave" ? "Leave Request" : "Hour Log"}
            </DialogTitle>
            <DialogDescription>
              {actionType?.action === "approved"
                ? "Are you sure you want to approve this request?"
                : "Are you sure you want to reject this request?"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              {actionType?.type === "leave" && selectedRequest && (
                <>
                  <p className="text-sm">
                    <span className="font-medium">Employee:</span> {selectedRequest.user?.full_name}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Leave Type:</span> {selectedRequest.leave_type?.name}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Duration:</span> {selectedRequest.from_date} to {selectedRequest.to_date}
                  </p>
                </>
              )}
              {actionType?.type === "hourlog" && selectedRequest && (
                <>
                  <p className="text-sm">
                    <span className="font-medium">Employee:</span> {selectedRequest.user?.full_name}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Project:</span> {selectedRequest.project?.name}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Hours:</span> {selectedRequest.hours_logged} hrs on {selectedRequest.log_date}
                  </p>
                </>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                placeholder="Add your remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className="cursor-text"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className={`cursor-pointer ${actionType?.action === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {actionType?.action === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}