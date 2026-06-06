"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function EditPolicyDialog({ open, onOpenChange, policy, onSuccess }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    grace_period_minutes: 10,
    late_count_threshold: 15,
    late_threshold_deduction_days: 1,
    absent_deduction_per_day: 1,
    half_day_threshold_hours: 4,
    effective_from: "",
    is_active: true,
  });

  useEffect(() => {
    if (policy) {
      setFormData({
        name: policy.name,
        grace_period_minutes: policy.grace_period_minutes,
        late_count_threshold: policy.late_count_threshold,
        late_threshold_deduction_days: policy.late_threshold_deduction_days,
        absent_deduction_per_day: policy.absent_deduction_per_day,
        half_day_threshold_hours: policy.half_day_threshold_hours,
        effective_from: policy.effective_from,
        is_active: policy.is_active,
      });
    }
  }, [policy]);

  const handleSubmit = async () => {
    if (!formData.name) {
      gooeyToast.error("Missing Field", { description: "Policy name is required." });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(`/attendance/policies/${policy.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (response.status) {
        gooeyToast.success("Policy Updated", {
          description: `${formData.name} has been updated.`,
        });
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      gooeyToast.error("Update Failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!policy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Edit Attendance Policy</DialogTitle>
          <DialogDescription>Update policy rules and settings</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Policy Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="cursor-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Grace Period (minutes)</Label>
              <Input
                type="number"
                value={formData.grace_period_minutes}
                onChange={(e) => setFormData({ ...formData, grace_period_minutes: parseInt(e.target.value) })}
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Late Count Threshold</Label>
              <Input
                type="number"
                value={formData.late_count_threshold}
                onChange={(e) => setFormData({ ...formData, late_count_threshold: parseInt(e.target.value) })}
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Late Deduction Days</Label>
              <Input
                type="number"
                step="0.5"
                value={formData.late_threshold_deduction_days}
                onChange={(e) => setFormData({ ...formData, late_threshold_deduction_days: parseFloat(e.target.value) })}
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Absent Deduction Days</Label>
              <Input
                type="number"
                step="0.5"
                value={formData.absent_deduction_per_day}
                onChange={(e) => setFormData({ ...formData, absent_deduction_per_day: parseFloat(e.target.value) })}
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Half Day Threshold (hours)</Label>
              <Input
                type="number"
                step="0.5"
                value={formData.half_day_threshold_hours}
                onChange={(e) => setFormData({ ...formData, half_day_threshold_hours: parseFloat(e.target.value) })}
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Effective From</Label>
              <Input
                type="date"
                value={formData.effective_from}
                onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Active Status</Label>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer">
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}