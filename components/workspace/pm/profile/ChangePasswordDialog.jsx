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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function ChangePasswordDialog({ open, onOpenChange, userId }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.current_password) {
      gooeyToast.error("Missing Field", {
        description: "Please enter your current password.",
      });
      return;
    }
    if (!formData.password) {
      gooeyToast.error("Missing Field", {
        description: "Please enter a new password.",
      });
      return;
    }
    if (formData.password.length < 8) {
      gooeyToast.error("Weak Password", {
        description: "Password must be at least 8 characters.",
      });
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      gooeyToast.error("Password Mismatch", {
        description: "New password and confirmation do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          current_password: formData.current_password,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });

      gooeyToast.success("Password Changed", {
        description: "Your password has been updated successfully.",
      });

      setFormData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      onOpenChange(false);
    } catch (error) {
      gooeyToast.error("Change Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Change Password</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
          {/* Current Password */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="current_password" className="text-xs sm:text-sm">Current Password</Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.current_password}
                onChange={(e) => handleChange("current_password", e.target.value)}
                className="pr-8 sm:pr-10 cursor-text text-sm"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showCurrentPassword ? <EyeOff size={14} className="sm:w-4 sm:h-4" /> : <Eye size={14} className="sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="password" className="text-xs sm:text-sm">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showNewPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="pr-8 sm:pr-10 cursor-text text-sm"
                placeholder="Min 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showNewPassword ? <EyeOff size={14} className="sm:w-4 sm:h-4" /> : <Eye size={14} className="sm:w-4 sm:h-4" />}
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">
              Password must be at least 8 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="password_confirmation" className="text-xs sm:text-sm">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.password_confirmation}
                onChange={(e) => handleChange("password_confirmation", e.target.value)}
                className="pr-8 sm:pr-10 cursor-text text-sm"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={14} className="sm:w-4 sm:h-4" /> : <Eye size={14} className="sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer w-full sm:w-auto text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer w-full sm:w-auto text-xs sm:text-sm"
          >
            {loading ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}