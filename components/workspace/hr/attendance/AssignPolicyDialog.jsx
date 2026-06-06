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

export default function AssignPolicyDialog({ open, onOpenChange, policies, employees, onSuccess }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    attendance_policy_id: "",
    effective_from: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async () => {
    if (!formData.user_id || !formData.attendance_policy_id) {
      gooeyToast.error("Missing Fields", {
        description: "Please select employee and policy.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/attendance/policies/assign", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.status) {
        gooeyToast.success("Policy Assigned", {
          description: "Attendance policy has been assigned successfully.",
        });
        onOpenChange(false);
        setFormData({
          user_id: "",
          attendance_policy_id: "",
          effective_from: new Date().toISOString().split("T")[0],
        });
        onSuccess();
      }
    } catch (error) {
      gooeyToast.error("Assignment Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Assign Attendance Policy</DialogTitle>
          <DialogDescription>Assign an attendance policy to an employee</DialogDescription>
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
            <Label>Attendance Policy</Label>
            <Select onValueChange={(v) => setFormData({ ...formData, attendance_policy_id: v })}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select policy" />
              </SelectTrigger>
              <SelectContent>
                {policies.map((policy) => (
                  <SelectItem key={policy.id} value={policy.id.toString()} className="cursor-pointer">
                    {policy.name}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer">
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Assign Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}