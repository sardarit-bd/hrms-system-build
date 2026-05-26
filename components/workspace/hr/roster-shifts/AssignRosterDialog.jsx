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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function AssignRosterDialog({ open, onOpenChange, shifts, employees, onSuccess }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    shift_id: "",
    weekend_days: ["friday", "saturday"],
    effective_from: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async () => {
    if (!formData.user_id || !formData.shift_id) {
      gooeyToast.error("Missing Fields", { description: "Please select employee and shift." });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/roster", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.status) {
        gooeyToast.success("Roster Assigned", { description: "Roster has been assigned successfully." });
        onOpenChange(false);
        setFormData({
          user_id: "",
          shift_id: "",
          weekend_days: ["friday", "saturday"],
          effective_from: new Date().toISOString().split("T")[0],
        });
        onSuccess();
      }
    } catch (error) {
      gooeyToast.error("Assignment Failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Assign Roster</DialogTitle>
          <DialogDescription>Assign a shift roster to an employee</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Employee</Label>
            <Select onValueChange={(v) => setFormData({ ...formData, user_id: v })}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()} className="cursor-pointer">
                    {emp.full_name} ({emp.employee_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Shift</Label>
            <Select onValueChange={(v) => setFormData({ ...formData, shift_id: v })}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map((shift) => (
                  <SelectItem key={shift.id} value={shift.id.toString()} className="cursor-pointer">
                    {shift.name} ({shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="space-y-2">
            <Label>Weekend Days</Label>
            <div className="flex flex-wrap gap-2">
              {["friday", "saturday", "sunday"].map((day) => (
                <label key={day} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.weekend_days.includes(day)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, weekend_days: [...formData.weekend_days, day] });
                      } else {
                        setFormData({ ...formData, weekend_days: formData.weekend_days.filter(d => d !== day) });
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <span className="text-sm capitalize">{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer">
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Assign Roster
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}