"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import AccountInfoCard from "../../../../../components/workspace/employee/profile/AccountInfoCard";
import WorkInfoCard from "../../../../../components/workspace/employee/profile/WorkInfoCard";
import PersonalInfoForm from "../../../../../components/workspace/employee/profile/PersonalInfoForm";
import ProfileHeader from "../../../../../components/workspace/employee/profile/ProfileHeader";
import ProfileSkeleton from "../../../../../components/workspace/employee/profile/ProfileSkeleton";


export default function EmployeeProfilePage() {
  const { user, apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500">Profile data not available</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6 max-w-6xl mx-auto">
          {/* Header with Refresh */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2 cursor-pointer"
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
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="personal" className="cursor-pointer">
                Personal
              </TabsTrigger>
              <TabsTrigger value="work" className="cursor-pointer">
                Work
              </TabsTrigger>
              <TabsTrigger value="account" className="cursor-pointer">
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <PersonalInfoForm 
                profileData={profileData}
                isEditing={isEditing}
                onUpdate={handleProfileUpdate}
              />
            </TabsContent>

            <TabsContent value="work" className="space-y-6">
              <WorkInfoCard profileData={profileData} />
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <AccountInfoCard profileData={profileData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}