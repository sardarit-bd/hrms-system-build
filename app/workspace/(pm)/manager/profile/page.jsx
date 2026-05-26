"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ChangePasswordDialog from "../../../../../components/workspace/pm/profile/ChangePasswordDialog";
import ProjectManagerInfoCard from "../../../../../components/workspace/pm/profile/ProjectManagerInfoCard";
import WorkInfoCard from "../../../../../components/workspace/pm/profile/WorkInfoCard";
import PersonalInfoForm from "../../../../../components/workspace/pm/profile/PersonalInfoForm";
import ProfileHeader from "../../../../../components/workspace/pm/profile/ProfileHeader";
import ProfileSkeleton from "../../../../../components/workspace/pm/profile/ProfileSkeleton";


export default function ProjectManagerProfilePage() {
  const { user, apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const fetchProfile = useCallback(async (showRefreshToast = false) => {
    try {
      const response = await apiRequest("/auth/me");
      if (response.status && response.data) {
        setProfileData(response.data);
      }
      if (showRefreshToast) {
        gooeyToast.success("Profile Refreshed", {
          description: "Your profile has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      gooeyToast.error("Failed to Load Profile", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile(true);
  };

  const handleProfileUpdate = (updatedData) => {
    setProfileData(updatedData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <ProfileSkeleton />
      </DashboardLayout>
    );
  }

  if (!profileData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <p className="text-sm sm:text-base text-gray-500">Profile data not available</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header with Refresh */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {/* Profile Header */}
          <ProfileHeader 
            profileData={profileData} 
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onUpdate={handleProfileUpdate}
          />

          {/* Tabs */}
          <Tabs defaultValue="personal" className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="personal" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Personal
                </TabsTrigger>
                <TabsTrigger value="work" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Work
                </TabsTrigger>
                <TabsTrigger value="pm" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Project Manager Info
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="personal" className="space-y-4 sm:space-y-6">
              <PersonalInfoForm 
                profileData={profileData}
                isEditing={isEditing}
                onUpdate={handleProfileUpdate}
              />
              
              {/* Change Password Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-800 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Security</p>
                  <p className="text-xs text-gray-500 mt-1">Change your password to keep your account secure.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setChangePasswordOpen(true)}
                  className="cursor-pointer w-full sm:w-auto text-xs sm:text-sm"
                >
                  Change Password
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="work" className="space-y-4 sm:space-y-6">
              <WorkInfoCard profileData={profileData} />
            </TabsContent>

            <TabsContent value="pm" className="space-y-4 sm:space-y-6">
              <ProjectManagerInfoCard profileData={profileData} />
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