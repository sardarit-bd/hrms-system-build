"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import AttendanceSkeleton from "../../../../../components/workspace/team-leder/attendance/AttendanceSkeleton";
import AttendanceDetailsModal from "../../../../../components/workspace/team-leder/attendance/AttendanceDetailsModal";
import AttendancePolicyInfo from "../../../../../components/workspace/team-leder/attendance/AttendancePolicyInfo";
import TeamShiftInfo from "../../../../../components/workspace/team-leder/attendance/TeamShiftInfo";
import TeamRosterInfo from "../../../../../components/workspace/team-leder/attendance/TeamRosterInfo";
import TeamAttendanceTable from "../../../../../components/workspace/team-leder/attendance/TeamAttendanceTable";
import AttendanceFilters from "../../../../../components/workspace/team-leder/attendance/AttendanceFilters";
import AttendanceStatsCards from "../../../../../components/workspace/team-leder/attendance/AttendanceStatsCards";


export default function TeamLeaderAttendancePage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [team, setTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [fixedShifts, setFixedShifts] = useState([]);
  const [rotatingShifts, setRotatingShifts] = useState([]);
  const [rosters, setRosters] = useState({});
  const [attendancePolicies, setAttendancePolicies] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  const fetchTeamData = useCallback(async (showRefreshToast = false) => {
    try {
      // Fetch team info
      const teamRes = await apiRequest("/teams/my");
      let teamData = null;
      let members = [];
      
      if (teamRes.status && teamRes.data) {
        teamData = teamRes.data;
        members = teamRes.data.members || [];
        setTeam(teamData);
        setTeamMembers(members);
      }

      // Fetch shifts
      const [shiftsRes, fixedShiftsRes, rotatingShiftsRes] = await Promise.allSettled([
        apiRequest("/shifts"),
        apiRequest("/shifts/list/fixed"),
        apiRequest("/shifts/list/rotating"),
      ]);

      if (shiftsRes.status === "fulfilled" && shiftsRes.value?.data) {
        setShifts(shiftsRes.value.data);
      }
      if (fixedShiftsRes.status === "fulfilled" && fixedShiftsRes.value?.data) {
        setFixedShifts(fixedShiftsRes.value.data);
      }
      if (rotatingShiftsRes.status === "fulfilled" && rotatingShiftsRes.value?.data) {
        setRotatingShifts(rotatingShiftsRes.value.data);
      }

      // Fetch roster and policy for each team member
      const rosterPromises = members.map(member => 
        apiRequest(`/roster/user/${member.id}`).catch(() => ({ data: null }))
      );
      const policyPromises = members.map(member => 
        apiRequest(`/attendance/policies/user/${member.id}`).catch(() => ({ data: null }))
      );

      const rosterResults = await Promise.all(rosterPromises);
      const policyResults = await Promise.all(policyPromises);

      const rosterMap = {};
      const policyMap = {};
      
      members.forEach((member, index) => {
        if (rosterResults[index]?.data) {
          rosterMap[member.id] = rosterResults[index].data;
        }
        if (policyResults[index]?.data) {
          policyMap[member.id] = policyResults[index].data;
        }
      });

      setRosters(rosterMap);
      setAttendancePolicies(policyMap);

      if (showRefreshToast) {
        gooeyToast.success("Attendance Data Refreshed", {
          description: "Team attendance information has been updated.",
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
  }, [apiRequest]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTeamData(true);
  };

  const handleViewDetails = (member) => {
    setSelectedMember({
      ...member,
      roster: rosters[member.id],
      policy: attendancePolicies[member.id],
    });
    setDetailsModalOpen(true);
  };

  // Filter team members
  const filteredMembers = teamMembers.filter((member) => {
    if (searchTerm && !member.full_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (employeeFilter && member.id.toString() !== employeeFilter) {
      return false;
    }
    if (shiftFilter) {
      const roster = rosters[member.id];
      if (!roster || roster.shift?.id.toString() !== shiftFilter) {
        return false;
      }
    }
    return true;
  });

  const stats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === "active").length,
    onLeave: 0, // This would come from leave API
    rosterAssigned: Object.keys(rosters).length,
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
                Team Attendance
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Monitor attendance, shifts, and rosters for your team
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

          {/* Info Alert */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Attendance Records API Information
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  Daily check-in/out records API is not available yet. Currently connected: 
                  Team members, Shifts, Roster assignments, and Attendance policies.
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                  ✅ You can view your team members' shift schedules, roster assignments, and attendance policies.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <AttendanceStatsCards stats={stats} />

          {/* Tabs */}
          <Tabs defaultValue="members" className="space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="members" className="cursor-pointer">
                Team Members
              </TabsTrigger>
              <TabsTrigger value="rosters" className="cursor-pointer">
                Rosters
              </TabsTrigger>
              <TabsTrigger value="shifts" className="cursor-pointer">
                Shifts
              </TabsTrigger>
              <TabsTrigger value="policies" className="cursor-pointer">
                Policies
              </TabsTrigger>
            </TabsList>

            {/* Team Members Tab */}
            <TabsContent value="members" className="space-y-6">
              {/* Filters */}
              <AttendanceFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                shiftFilter={shiftFilter}
                setShiftFilter={setShiftFilter}
                employeeFilter={employeeFilter}
                setEmployeeFilter={setEmployeeFilter}
                shifts={shifts}
                teamMembers={teamMembers}
                onReset={() => {
                  setSearchTerm("");
                  setShiftFilter("");
                  setEmployeeFilter("");
                }}
              />

              {/* Team Members Table */}
              <TeamAttendanceTable
                members={filteredMembers}
                rosters={rosters}
                attendancePolicies={attendancePolicies}
                shifts={shifts}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            {/* Rosters Tab */}
            <TabsContent value="rosters" className="space-y-6">
              <TeamRosterInfo
                teamMembers={teamMembers}
                rosters={rosters}
                shifts={shifts}
              />
            </TabsContent>

            {/* Shifts Tab */}
            <TabsContent value="shifts" className="space-y-6">
              <TeamShiftInfo
                shifts={shifts}
                fixedShifts={fixedShifts}
                rotatingShifts={rotatingShifts}
              />
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies" className="space-y-6">
              <AttendancePolicyInfo
                teamMembers={teamMembers}
                attendancePolicies={attendancePolicies}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Attendance Details Modal */}
      <AttendanceDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        member={selectedMember}
      />
    </DashboardLayout>
  );
}