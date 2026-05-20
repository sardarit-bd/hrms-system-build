"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function AccountInfoCard({ profileData }) {
  const { apiRequest } = useAuth();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
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

  const handlePasswordChange = async () => {
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
          user_id: profileData?.id,
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
      setChangePasswordOpen(false);
    } catch (error) {
      gooeyToast.error("Change Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Mail size={16} />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Mail size={12} />
              Email Address
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {profileData?.email || "—"}
            </p>
          </div>

          {/* Account Status */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Lock size={12} />
              Account Status
            </p>
            <Badge className={profileData?.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {profileData?.status?.charAt(0).toUpperCase() + profileData?.status?.slice(1) || "Active"}
            </Badge>
          </div>

          {/* Password Change */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Security</p>
                <p className="text-xs text-gray-500 mt-1">Change your password to keep your account secure.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setChangePasswordOpen(true)}
                className="cursor-pointer"
              >
                <Lock size={14} className="mr-2" />
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.current_password}
                  onChange={(e) => handleChange("current_password", e.target.value)}
                  className="pr-10 cursor-text"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pr-10 cursor-text"
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.password_confirmation}
                  onChange={(e) => handleChange("password_confirmation", e.target.value)}
                  className="pr-10 cursor-text"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setChangePasswordOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={loading}
              className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}