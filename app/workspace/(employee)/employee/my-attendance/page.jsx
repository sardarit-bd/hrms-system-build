"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock, Shield, CalendarDays, History } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import PolicyHistoryTable from "../../../../../components/workspace/employee/attendance/PolicyHistoryTable";
import RosterHistoryTable from "../../../../../components/workspace/employee/attendance/RosterHistoryTable";
import CurrentPolicyCard from "../../../../../components/workspace/employee/attendance/CurrentPolicyCard";
import AttendanceInfoCard from "../../../../../components/workspace/employee/attendance/AttendanceInfoCard";
import CurrentShiftCard from "../../../../../components/workspace/employee/attendance/CurrentShiftCard";


export default function EmployeeAttendancePage() {
  const { user, apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [currentRoster, setCurrentRoster] = useState(null);
  const [rosterHistory, setRosterHistory] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [policyHistory, setPolicyHistory] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [fixedShifts, setFixedShifts] = useState([]);
  const [rotatingShifts, setRotatingShifts] = useState([]);

  const fetchAttendanceData = useCallback(async (showRefreshToast = false) => {
    if (!user?.id) return;
    
    try {
      const [
        profileRes,
        rosterRes,
        rosterHistoryRes,
        policyRes,
        policyHistoryRes,
        shiftsRes,
        fixedShiftsRes,
        rotatingShiftsRes,
      ] = await Promise.allSettled([
        apiRequest("/auth/me"),
        apiRequest(`/roster/user/${user.id}`),
        apiRequest(`/roster/user/${user.id}/history`),
        apiRequest(`/attendance/policies/user/${user.id}`),
        apiRequest(`/attendance/policies/user/${user.id}/history`),
        apiRequest("/shifts"),
        apiRequest("/shifts/list/fixed"),
        apiRequest("/shifts/list/rotating"),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value?.data) {
        setProfile(profileRes.value.data);
      }
      if (rosterRes.status === "fulfilled" && rosterRes.value?.data) {
        setCurrentRoster(rosterRes.value.data);
      }
      if (rosterHistoryRes.status === "fulfilled" && rosterHistoryRes.value?.data) {
        setRosterHistory(rosterHistoryRes.value.data);
      }
      if (policyRes.status === "fulfilled" && policyRes.value?.data) {
        setCurrentPolicy(policyRes.value.data);
      }
      if (policyHistoryRes.status === "fulfilled" && policyHistoryRes.value?.data) {
        setPolicyHistory(policyHistoryRes.value.data);
      }
      if (shiftsRes.status === "fulfilled" && shiftsRes.value?.data) {
        setShifts(shiftsRes.value.data);
      }
      if (fixedShiftsRes.status === "fulfilled" && fixedShiftsRes.value?.data) {
        setFixedShifts(fixedShiftsRes.value.data);
      }
      if (rotatingShiftsRes.status === "fulfilled" && rotatingShiftsRes.value?.data) {
        setRotatingShifts(rotatingShiftsRes.value.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Attendance Data Refreshed", {
          description: "Your attendance information has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      gooeyToast.error("Failed to Load Data", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest, user?.id]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAttendanceData(true);
  };

  if (loading) {
    return <AttendanceSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Attendance Overview
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                View your shift schedule, roster, and attendance policies
              </p>
            </div>
            <div className="flex items-center gap-3">
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
          </div>

          {/* Info Alert - No attendance records API */}
          <AttendanceInfoCard />

          {/* Current Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CurrentShiftCard 
              currentRoster={currentRoster} 
              shifts={shifts}
              fixedShifts={fixedShifts}
              rotatingShifts={rotatingShifts}
            />
            <CurrentPolicyCard currentPolicy={currentPolicy} />
          </div>

          {/* Tabs for History */}
          <Tabs defaultValue="roster" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="roster" className="cursor-pointer">
                <CalendarDays size={14} className="mr-2" />
                Roster History
              </TabsTrigger>
              <TabsTrigger value="policy" className="cursor-pointer">
                <History size={14} className="mr-2" />
                Policy History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roster" className="space-y-6">
              <RosterHistoryTable rosterHistory={rosterHistory} />
            </TabsContent>

            <TabsContent value="policy" className="space-y-6">
              <PolicyHistoryTable policyHistory={policyHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Loading Skeleton
function AttendanceSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-7 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </DashboardLayout>
  );
}