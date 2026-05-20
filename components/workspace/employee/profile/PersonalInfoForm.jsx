"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Briefcase, Save, X, Loader2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  designation: z.string().optional(),
});

export default function PersonalInfoForm({ profileData, isEditing, onUpdate }) {
  const { apiRequest } = useAuth();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profileData?.full_name || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      designation: profileData?.designation || "",
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const response = await apiRequest(`/users/${profileData.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (response.status) {
        gooeyToast.success("Profile Updated", {
          description: "Your profile has been updated successfully.",
        });
        onUpdate({ ...profileData, ...data });
      }
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    reset({
      full_name: profileData?.full_name || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      designation: profileData?.designation || "",
    });
    onUpdate(profileData);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <User size={16} />
          Personal Information
        </CardTitle>
        {isEditing && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="gap-2 cursor-pointer"
            >
              <X size={14} />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="gap-2 bg-[#1D3A88] hover:bg-[#142558] cursor-pointer"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <User size={14} className="text-gray-500" />
              Full Name
            </Label>
            {isEditing ? (
              <>
                <Input id="full_name" {...register("full_name")} className="cursor-text" />
                {errors.full_name && (
                  <p className="text-xs text-red-500">{errors.full_name.message}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-900 dark:text-white py-2">
                {profileData?.full_name || "—"}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail size={14} className="text-gray-500" />
              Email Address
            </Label>
            {isEditing ? (
              <>
                <Input id="email" type="email" {...register("email")} className="cursor-text" />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-900 dark:text-white py-2">
                {profileData?.email || "—"}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone size={14} className="text-gray-500" />
              Phone Number
            </Label>
            {isEditing ? (
              <>
                <Input id="phone" {...register("phone")} placeholder="Not provided" className="cursor-text" />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-900 dark:text-white py-2">
                {profileData?.phone || "Not provided"}
              </p>
            )}
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <Label htmlFor="designation" className="flex items-center gap-2">
              <Briefcase size={14} className="text-gray-500" />
              Designation
            </Label>
            {isEditing ? (
              <>
                <Input id="designation" {...register("designation")} placeholder="Not set" className="cursor-text" />
                {errors.designation && (
                  <p className="text-xs text-red-500">{errors.designation.message}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-900 dark:text-white py-2">
                {profileData?.designation || "Not set"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}