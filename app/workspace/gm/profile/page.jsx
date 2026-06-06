"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, User, Briefcase, Star, Mail, Phone, Calendar, Building2, Hash } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { EditProfileForm } from "../../../../components/workspace/gm/profile/edit-profile-form";
import { GMInfo } from "../../../../components/workspace/gm/profile/gm-info";
import { WorkInfo } from "../../../../components/workspace/gm/profile/work-info";
import { PersonalInfo } from "../../../../components/workspace/gm/profile/personal-info";
import { ProfileOverview } from "../../../../components/workspace/gm/profile/profile-overview";
import { ProfileSkeleton } from "../../../../components/workspace/gm/profile/profile-skeleton";


export default function GMProfilePage() {
  const { apiRequest, user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchProfile = useCallback(async () => {
    try {
      const response = await apiRequest("/auth/me");
      if (response.status && response.data) {
        setProfile(response.data);
      } else {
        throw new Error("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      gooeyToast.error("Failed to Load Profile", {
        description: error.message || "Could not load your profile information",
      });
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await apiRequest(`/users/${profile.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      if (response.status && response.data) {
        setProfile(response.data);
        setIsEditing(false);
        gooeyToast.success("Profile Updated", {
          description: "Your profile has been successfully updated",
        });
        return { success: true };
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      gooeyToast.error("Update Failed", {
        description: error.message || "Could not update your profile",
      });
      return { success: false, error: error.message };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <ProfileSkeleton />
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50 p-6">
          <Card className="max-w-md mx-auto p-8 text-center">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Profile Data Not Available
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unable to load your profile information. Please try again later.
            </p>
            <Button onClick={fetchProfile} className="mt-4 cursor-pointer">
              Retry
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
      suspended: { label: "Suspended", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    };
    return statusConfig[status] || statusConfig.inactive;
  };

  const statusBadge = getStatusBadge(profile.status);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                General Manager Profile
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View and manage your personal and work information
              </p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="gap-2 cursor-pointer bg-[#1D3A88] hover:bg-[#152e6b]"
              >
                <Pencil size={16} />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Profile Header Card */}
          <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#1D3A88] to-[#2a4ab0] h-24 sm:h-32" />
            <div className="relative px-4 sm:px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white dark:border-slate-900 bg-white">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="bg-[#1D3A88] text-white text-xl sm:text-2xl">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {profile.full_name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {profile.designation || "General Manager"}
                      </p>
                    </div>
                    <Badge className={`${statusBadge.className} text-xs px-3 py-1 cursor-default`}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <span>{profile.email}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-1">
                        <Phone size={14} />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile.employee_code && (
                      <div className="flex items-center gap-1">
                        <Hash size={14} />
                        <span>ID: {profile.employee_code}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs Section */}
          {!isEditing ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-white dark:bg-slate-900 border rounded-lg p-1">
                <TabsTrigger value="overview" className="cursor-pointer gap-2">
                  <User size={14} />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="personal" className="cursor-pointer gap-2">
                  <User size={14} />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="work" className="cursor-pointer gap-2">
                  <Briefcase size={14} />
                  Work Info
                </TabsTrigger>
                <TabsTrigger value="gm" className="cursor-pointer gap-2">
                  <Star size={14} />
                  GM Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <ProfileOverview profile={profile} />
              </TabsContent>

              <TabsContent value="personal">
                <PersonalInfo profile={profile} />
              </TabsContent>

              <TabsContent value="work">
                <WorkInfo profile={profile} />
              </TabsContent>

              <TabsContent value="gm">
                <GMInfo profile={profile} />
              </TabsContent>
            </Tabs>
          ) : (
            <EditProfileForm
              profile={profile}
              onSave={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}