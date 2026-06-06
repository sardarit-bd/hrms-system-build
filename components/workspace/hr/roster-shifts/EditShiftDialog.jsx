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

export default function EditShiftDialog({ open, onOpenChange, shift, onSuccess }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    start_time: "09:00",
    end_time: "18:00",
    working_hours: 9,
    is_fixed: true,
    cross_midnight: false,
  });

  useEffect(() => {
    if (shift) {
      setFormData({
        name: shift.name,
        start_time: shift.start_time?.slice(0, 5) || "09:00",
        end_time: shift.end_time?.slice(0, 5) || "18:00",
        working_hours: shift.working_hours,
        is_fixed: shift.is_fixed,
        cross_midnight: shift.cross_midnight || false,
      });
    }
  }, [shift]);

  const handleSubmit = async () => {
    if (!formData.name) {
      gooeyToast.error("Missing Field", { description: "Shift name is required." });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(`/shifts/${shift.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (response.status) {
        gooeyToast.success("Shift Updated", {
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

  if (!shift) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Edit Shift</DialogTitle>
          <DialogDescription>Update shift details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Shift Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="cursor-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Working Hours</Label>
            <Input
              type="number"
              step="0.5"
              value={formData.working_hours}
              onChange={(e) => setFormData({ ...formData, working_hours: parseFloat(e.target.value) })}
              className="cursor-text"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Fixed Shift</Label>
            <Switch
              checked={formData.is_fixed}
              onCheckedChange={(checked) => setFormData({ ...formData, is_fixed: checked })}
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