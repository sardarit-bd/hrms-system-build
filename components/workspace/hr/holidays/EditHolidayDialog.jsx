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

export default function EditHolidayDialog({ open, onOpenChange, holiday, onSuccess }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    is_recurring: false,
  });

  useEffect(() => {
    if (holiday) {
      setFormData({
        name: holiday.name,
        date: holiday.date,
        is_recurring: holiday.is_recurring,
      });
    }
  }, [holiday]);

  const handleSubmit = async () => {
    if (!formData.name) {
      gooeyToast.error("Missing Field", { description: "Holiday name is required." });
      return;
    }
    if (!formData.date) {
      gooeyToast.error("Missing Field", { description: "Holiday date is required." });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(`/holidays/${holiday.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (response.status) {
        gooeyToast.success("Holiday Updated", {
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

  if (!holiday) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Edit Holiday</DialogTitle>
          <DialogDescription>Update holiday details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Holiday Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="cursor-text"
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Recurring Holiday</Label>
              <p className="text-[10px] text-gray-500">Observed every year on this date</p>
            </div>
            <Switch
              checked={formData.is_recurring}
              onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
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