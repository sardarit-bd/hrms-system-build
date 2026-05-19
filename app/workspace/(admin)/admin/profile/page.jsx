"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  Shield,
  Save,
  X,
  Camera,
  Edit2,
} from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { ProfileHeader } from "../../../../../components/workspace/admin/profile/ProfileHeader";
import { ProfileSkeleton } from "./ProfileSkeleton";

// Validation Schema
const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  designation: z.string().optional(),
});

export default function ProfilePage() {
  const { user, apiRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await apiRequest("/auth/me");
      if (response.status && response.data) {
        setProfileData(response.data);
        reset({
          full_name: response.data.full_name,
          email: response.data.email,
          phone: response.data.phone || "",
          designation: response.data.designation || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      gooeyToast.error("Failed to Load Profile", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [apiRequest, reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (data) => {
    if (!profileData) return;

    setSaving(true);

    try {
      const payload = {
        ...data,
        department_id:
          profileData.department_id ||
          profileData.department?.id ||
          profileData.department?.department_id,
      };

      const response = await apiRequest(`/users/${profileData.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (response.status) {
        gooeyToast.success("Profile Updated", {
          description: "Your profile has been updated successfully.",
        });

        setIsEditing(false);
        fetchProfile();
      }
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !profileData) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const response = await apiRequest(
        `/users/${profileData.id}/profile-image`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.status) {
        gooeyToast.success("Profile Image Updated", {
          description: "Your profile image has been updated successfully.",
        });

        fetchProfile();
      }
    } catch (error) {
      gooeyToast.error("Upload Failed", {
        description: error.message,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      full_name: profileData?.full_name,
      email: profileData?.email,
      phone: profileData?.phone || "",
      designation: profileData?.designation || "",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      terminated:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || colors.inactive;
  };

  const getRoleLabel = (role) => {
    const labels = {
      super_admin: "Super Admin",
      admin: "Admin",
      general_manager: "General Manager",
      hr_manager: "HR Manager",
      project_manager: "Project Manager",
      team_leader: "Team Leader",
      employee: "Employee",
    };
    return labels[role] || role;
  };

  const getUserInitial = () => {
    const name = profileData?.full_name || user?.full_name || user?.name || "U";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profileData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500">Profile not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6 max-w-5xl mx-auto">
          {/* Profile Header */}
          <ProfileHeader
            profileData={profileData}
            getUserInitial={getUserInitial}
            getStatusColor={getStatusColor}
            getRoleLabel={getRoleLabel}
            onImageChange={handleImageChange}
          />

          {/* Main Content */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="personal" className="cursor-pointer">
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="work" className="cursor-pointer">
                Work Information
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    Personal Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-2 cursor-pointer"
                    >
                      <Edit2 size={14} />
                      Edit Profile
                    </Button>
                  ) : (
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
                        <Save size={14} />
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="full_name"
                          className="flex items-center gap-2"
                        >
                          <User size={14} className="text-gray-500" />
                          Full Name
                        </Label>
                        {isEditing ? (
                          <>
                            <Input
                              id="full_name"
                              {...register("full_name")}
                              className="cursor-text"
                            />
                            {errors.full_name && (
                              <p className="text-xs text-red-500">
                                {errors.full_name.message}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white py-2">
                            {profileData.full_name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-2"
                        >
                          <Mail size={14} className="text-gray-500" />
                          Email Address
                        </Label>
                        {isEditing ? (
                          <>
                            <Input
                              id="email"
                              type="email"
                              {...register("email")}
                              className="cursor-text"
                            />
                            {errors.email && (
                              <p className="text-xs text-red-500">
                                {errors.email.message}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white py-2">
                            {profileData.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="flex items-center gap-2"
                        >
                          <Phone size={14} className="text-gray-500" />
                          Phone Number
                        </Label>
                        {isEditing ? (
                          <>
                            <Input
                              id="phone"
                              {...register("phone")}
                              placeholder="Not provided"
                              className="cursor-text"
                            />
                            {errors.phone && (
                              <p className="text-xs text-red-500">
                                {errors.phone.message}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white py-2">
                            {profileData.phone || "Not provided"}
                          </p>
                        )}
                      </div>

                      {/* Employee Code */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Briefcase size={14} className="text-gray-500" />
                          Employee Code
                        </Label>
                        <p className="text-sm font-mono text-gray-900 dark:text-white py-2">
                          {profileData.employee_code || "Not assigned"}
                        </p>
                      </div>

                      {/* Designation */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="designation"
                          className="flex items-center gap-2"
                        >
                          <Briefcase size={14} className="text-gray-500" />
                          Designation
                        </Label>
                        {isEditing ? (
                          <>
                            <Input
                              id="designation"
                              {...register("designation")}
                              placeholder="Not set"
                              className="cursor-text"
                            />
                            {errors.designation && (
                              <p className="text-xs text-red-500">
                                {errors.designation.message}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white py-2">
                            {profileData.designation || "Not set"}
                          </p>
                        )}
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Change Password Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Change your password to keep your account secure.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters with uppercase,
                        lowercase, and numbers.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setChangePasswordOpen(true)}
                      className="cursor-pointer"
                    >
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Work Information Tab */}
            <TabsContent value="work" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Work Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Shield size={14} className="text-gray-500" />
                        Role
                      </Label>
                      <Badge className="bg-[#1D3A88] text-white cursor-default">
                        {getRoleLabel(profileData.role)}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Building2 size={14} className="text-gray-500" />
                        Department
                      </Label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {profileData.department?.name ||
                          profileData.department ||
                          "Not assigned"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        Joining Date
                      </Label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {profileData.joining_date
                          ? new Date(
                              profileData.joining_date,
                            ).toLocaleDateString()
                          : "Not set"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Shield size={14} className="text-gray-500" />
                        Account Status
                      </Label>
                      <Badge className={getStatusColor(profileData.status)}>
                        {profileData.status?.charAt(0).toUpperCase() +
                          profileData.status?.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        userId={profileData.id}
      />
    </DashboardLayout>
  );
}
