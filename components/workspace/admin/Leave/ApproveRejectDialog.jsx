"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ApproveRejectDialog({
  open,
  onOpenChange,
  request,
  action,
  onConfirm,
  loading,
}) {
  const [remarks, setRemarks] = useState("");

  if (!request) return null;

  const handleConfirm = () => {
    onConfirm(request.id, action, remarks);
  };

  const isApprove = action === "approved";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isApprove ? "Approve" : "Reject"} Leave Request</DialogTitle>
          <DialogDescription>
            {isApprove
              ? "Are you sure you want to approve this leave request?"
              : "Are you sure you want to reject this leave request?"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <p className="text-sm">
              <span className="font-medium">Employee:</span> {request.user?.full_name}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Leave Type:</span> {request.leave_type?.name}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Duration:</span> {request.from_date} to {request.to_date}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Total Days:</span> {request.total_days} day(s)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder={isApprove ? "Add approval notes..." : "Provide rejection reason..."}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="cursor-text"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`cursor-pointer ${isApprove ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            {loading ? (isApprove ? "Approving..." : "Rejecting...") : (isApprove ? "Approve" : "Reject")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}