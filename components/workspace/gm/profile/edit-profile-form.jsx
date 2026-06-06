// components/gm/edit-profile-form.jsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Save } from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  bank_account: z.string().optional(),
});

export function EditProfileForm({ profile, onSave, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name || "",
      phone: profile.phone || "",
      date_of_birth: profile.date_of_birth || "",
      address: profile.address || "",
      emergency_contact: profile.emergency_contact || "",
      bank_account: profile.bank_account || "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await onSave(data);
    setIsSubmitting(false);
  };

  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal information. Fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                {...register("full_name")}
                className="cursor-text"
                placeholder="Enter your full name"
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone")}
                className="cursor-text"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register("date_of_birth")}
                className="cursor-text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                {...register("emergency_contact")}
                className="cursor-text"
                placeholder="Emergency contact number"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                className="cursor-text"
                placeholder="Your full address"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bank_account">Bank Account Details</Label>
              <Input
                id="bank_account"
                {...register("bank_account")}
                className="cursor-text"
                placeholder="Bank account information"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 cursor-pointer bg-[#1D3A88] hover:bg-[#152e6b]"
            >
              <Save size={16} />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="gap-2 cursor-pointer"
            >
              <X size={16} />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}