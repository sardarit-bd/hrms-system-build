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
import { Loader2, CheckCircle, XCircle } from "lucide-react";

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

  const isApprove = action === "approved";

  const handleConfirm = () => {
    onConfirm(request.id, action, remarks);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <XCircle size={20} className="text-red-600" />
            )}
            <DialogTitle className="text-base sm:text-lg">
              {isApprove ? "Approve Leave Request" : "Reject Leave Request"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm">
            {isApprove
              ? "Are you sure you want to approve this leave request?"
              : "Are you sure you want to reject this leave request?"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Request Summary */}
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
            {request.project && (
              <p className="text-sm mt-1">
                <span className="font-medium">Project:</span> {request.project.name}
              </p>
            )}
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks" className="text-xs sm:text-sm">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder={
                isApprove
                  ? "Add approval notes..."
                  : "Provide reason for rejection..."
              }
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="cursor-text text-sm"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer w-full sm:w-auto text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`cursor-pointer w-full sm:w-auto text-sm ${
              isApprove
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            {isApprove ? "Approve" : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}