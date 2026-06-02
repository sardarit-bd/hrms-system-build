"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";

export default function PendingGMApprovals({ pendingLeaves, onRefresh }) {
  const { apiRequest } = useAuth();
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApproveReject = (leave, action) => {
    setSelectedLeave(leave);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedLeave) return;

    setLoading(true);
    try {
      const response = await apiRequest(`/leave/requests/${selectedLeave.id}/gm-action`, {
        method: "POST",
        body: JSON.stringify({ action: actionType, remarks }),
      });

      if (response.status) {
        gooeyToast.success(`${actionType === "approved" ? "Approved" : "Rejected"} Successfully`, {
          description: `Leave request has been ${actionType}.`,
        });
        setDialogOpen(false);
        setRemarks("");
        onRefresh();
      }
    } catch (error) {
      gooeyToast.error("Action Failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (pendingLeaves.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Clock size={18} className="sm:w-5 sm:h-5" />
            Pending GM Approvals
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <CheckCircle size={40} className="text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No pending GM approvals</p>
          <p className="text-xs text-gray-400 mt-1">All leave requests have been reviewed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Clock size={18} className="sm:w-5 sm:h-5" />
            Pending GM Approvals
            <Badge className="ml-2 bg-yellow-100 text-yellow-700">{pendingLeaves.length}</Badge>
          </CardTitle>
          <Link href="/workspace/gm/leave-requests" className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
            View All →
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingLeaves.slice(0, 3).map((leave) => (
            <div key={leave.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {leave.user?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {leave.leave_type?.name} • {leave.from_date} to {leave.to_date}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleApproveReject(leave, "approved")}
                    className="p-1 rounded hover:bg-green-100 transition-colors cursor-pointer"
                    title="Approve"
                  >
                    <CheckCircle size={16} className="text-green-600" />
                  </button>
                  <button
                    onClick={() => handleApproveReject(leave, "rejected")}
                    className="p-1 rounded hover:bg-red-100 transition-colors cursor-pointer"
                    title="Reject"
                  >
                    <XCircle size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Approve/Reject Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>{actionType === "approved" ? "Approve" : "Reject"} Leave Request</DialogTitle>
            <DialogDescription>
              {actionType === "approved"
                ? "Are you sure you want to approve this leave request?"
                : "Are you sure you want to reject this leave request?"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <p className="text-sm">
                <span className="font-medium">Employee:</span> {selectedLeave?.user?.full_name}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Leave Type:</span> {selectedLeave?.leave_type?.name}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Duration:</span> {selectedLeave?.from_date} to {selectedLeave?.to_date}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Total Days:</span> {selectedLeave?.total_days} day(s)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                placeholder={actionType === "approved" ? "Add approval notes..." : "Provide reason for rejection..."}
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
              className={`cursor-pointer ${actionType === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {actionType === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}