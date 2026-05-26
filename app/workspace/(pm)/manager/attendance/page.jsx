"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import AttendanceDetailsModal from "../../../../../components/workspace/pm/attendance/AttendanceDetailsModal";
import AttendancePolicyInfo from "../../../../../components/workspace/pm/attendance/AttendancePolicyInfo";
import TeamShiftInfo from "../../../../../components/workspace/pm/attendance/TeamShiftInfo";
import TeamRosterInfo from "../../../../../components/workspace/pm/attendance/TeamRosterInfo";
import TeamAttendanceTable from "../../../../../components/workspace/pm/attendance/TeamAttendanceTable";
import AttendanceFilters from "../../../../../components/workspace/pm/attendance/AttendanceFilters";
import AttendanceStatsCards from "../../../../../components/workspace/pm/attendance/AttendanceStatsCards";
import AttendanceSkeleton from "../../../../../components/workspace/pm/attendance/AttendanceSkeleton";


export default function ProjectManagerAttendancePage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [fixedShifts, setFixedShifts] = useState([]);
  const [rotatingShifts, setRotatingShifts] = useState([]);
  const [rosters, setRosters] = useState({});
  const [attendancePolicies, setAttendancePolicies] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  // Filters
  const [projectFilter, setProjectFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchData = useCallback(async (showRefreshToast = false) => {
    try {
      const [projectsRes, teamsRes, shiftsRes, fixedShiftsRes, rotatingShiftsRes] = await Promise.allSettled([
        apiRequest("/projects/my?per_page=100"),
        apiRequest("/teams/my"),
        apiRequest("/shifts"),
        apiRequest("/shifts/list/fixed"),
        apiRequest("/shifts/list/rotating"),
      ]);

      // Process Projects
      if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
        setProjects(projectsRes.value.data);
      }

      // Process Teams
      if (teamsRes.status === "fulfilled" && teamsRes.value?.data) {
        const teamData = teamsRes.value.data;
        setTeams(teamData);
        const members = teamData.members || [];
        setTeamMembers(members);
      }

      // Process Shifts
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
      const rosterPromises = teamMembers.map(member => 
        apiRequest(`/roster/user/${member.id}`).catch(() => ({ data: null }))
      );
      const policyPromises = teamMembers.map(member => 
        apiRequest(`/attendance/policies/user/${member.id}`).catch(() => ({ data: null }))
      );

      const rosterResults = await Promise.all(rosterPromises);
      const policyResults = await Promise.all(policyPromises);

      const rosterMap = {};
      const policyMap = {};
      
      teamMembers.forEach((member, index) => {
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
  }, [apiRequest, teamMembers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const handleViewDetails = (member) => {
    setSelectedMember({
      ...member,
      roster: rosters[member.id],
      policy: attendancePolicies[member.id],
    });
    setDetailsModalOpen(true);
  };

  // Filter team members based on selections
  const filteredMembers = teamMembers.filter((member) => {
    if (projectFilter && member.project_id?.toString() !== projectFilter) return false;
    if (teamFilter && member.team_id?.toString() !== teamFilter) return false;
    if (employeeFilter && member.id.toString() !== employeeFilter) return false;
    if (shiftFilter) {
      const roster = rosters[member.id];
      if (!roster || roster.shift?.id.toString() !== shiftFilter) return false;
    }
    return true;
  });

  const stats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === "active").length,
    rosterAssigned: Object.keys(rosters).length,
    policyAssigned: Object.keys(attendancePolicies).length,
    totalProjects: projects.length,
  };

  if (loading) {
    return <AttendanceSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Team Attendance
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Monitor attendance, shifts, and rosters for your team
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
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
          </div>

          {/* Info Alert */}
          <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2 sm:gap-3">
              <Info size={16} className="sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300">
                  Live Attendance Records Information
                </p>
                <p className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-400 mt-0.5 sm:mt-1">
                  Daily check-in/out records API is not available yet. Currently connected: 
                  Team members, Shifts, Roster assignments, and Attendance policies.
                </p>
                <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-500 mt-1 sm:mt-2">
                  ✅ You can view your team members' shift schedules, roster assignments, and attendance policies.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <AttendanceStatsCards stats={stats} />

          {/* Filters */}
          {/* <AttendanceFilters
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            teamFilter={teamFilter}
            setTeamFilter={setTeamFilter}
            shiftFilter={shiftFilter}
            setShiftFilter={setShiftFilter}
            employeeFilter={employeeFilter}
            setEmployeeFilter={setEmployeeFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            projects={projects}
            teams={teams}
            shifts={shifts}
            teamMembers={teamMembers}
            onReset={() => {
              setProjectFilter("");
              setTeamFilter("");
              setShiftFilter("");
              setEmployeeFilter("");
              setDateFilter("");
            }}
          /> */}

          {/* Tabs */}
          <Tabs defaultValue="members" className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="members" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Team Members
                </TabsTrigger>
                <TabsTrigger value="rosters" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Rosters
                </TabsTrigger>
                <TabsTrigger value="shifts" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Shifts
                </TabsTrigger>
                <TabsTrigger value="policies" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Policies
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Team Members Tab */}
            <TabsContent value="members" className="space-y-4 sm:space-y-6">
              <TeamAttendanceTable
                members={filteredMembers}
                projects={projects}
                rosters={rosters}
                attendancePolicies={attendancePolicies}
                shifts={shifts}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            {/* Rosters Tab */}
            <TabsContent value="rosters" className="space-y-4 sm:space-y-6">
              <TeamRosterInfo
                teamMembers={teamMembers}
                rosters={rosters}
                shifts={shifts}
              />
            </TabsContent>

            {/* Shifts Tab */}
            <TabsContent value="shifts" className="space-y-4 sm:space-y-6">
              <TeamShiftInfo
                shifts={shifts}
                fixedShifts={fixedShifts}
                rotatingShifts={rotatingShifts}
              />
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies" className="space-y-4 sm:space-y-6">
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