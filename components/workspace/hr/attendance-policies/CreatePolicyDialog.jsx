"use client";

import { useState } from "react";
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

export default function CreatePolicyDialog({ open, onOpenChange, onSuccess }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    grace_period_minutes: 10,
    late_count_threshold: 15,
    late_threshold_deduction_days: 1,
    absent_deduction_per_day: 1,
    half_day_threshold_hours: 4,
    effective_from: new Date().toISOString().split("T")[0],
    is_active: true,
  });

  const handleSubmit = async () => {
    if (!formData.name) {
      gooeyToast.error("Missing Field", { description: "Policy name is required." });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/attendance/policies", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.status) {
        gooeyToast.success("Policy Created", {
          description: `${formData.name} has been created.`,
        });
        onOpenChange(false);
        setFormData({
          name: "",
          grace_period_minutes: 10,
          late_count_threshold: 15,
          late_threshold_deduction_days: 1,
          absent_deduction_per_day: 1,
          half_day_threshold_hours: 4,
          effective_from: new Date().toISOString().split("T")[0],
          is_active: true,
        });
        onSuccess();
      }
    } catch (error) {
      gooeyToast.error("Creation Failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Create Attendance Policy</DialogTitle>
          <DialogDescription>Add a new attendance policy with custom rules</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Policy Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Standard Policy"
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
            Create Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}