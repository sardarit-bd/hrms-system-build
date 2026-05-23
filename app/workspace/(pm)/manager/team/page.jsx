"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Users, Briefcase } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import MemberDetailsModal from "../../../../../components/workspace/pm/team/MemberDetailsModal";
import TeamDetailsModal from "../../../../../components/workspace/pm/team/TeamDetailsModal";
import TeamCard from "../../../../../components/workspace/pm/team/TeamCard";
import TeamMembersTable from "../../../../../components/workspace/pm/team/TeamMembersTable";
import TeamSkeleton from "../../../../../components/workspace/pm/team/TeamSkeleton";


export default function ProjectManagerTeamPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamDetailsModalOpen, setTeamDetailsModalOpen] = useState(false);
  const [memberDetailsModalOpen, setMemberDetailsModalOpen] = useState(false);
  const [teamMembersMap, setTeamMembersMap] = useState({});

  const fetchTeams = useCallback(async (showRefreshToast = false) => {
    try {
      const [teamsRes, projectsRes] = await Promise.allSettled([
        apiRequest("/teams/my"),
        apiRequest("/projects/my?per_page=100"),
      ]);

      let teamsData = [];
      if (teamsRes.status === "fulfilled" && teamsRes.value?.data) {
        teamsData = Array.isArray(teamsRes.value.data) 
          ? teamsRes.value.data 
          : [teamsRes.value.data];
        setTeams(teamsData);
      }
      
      if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
        setProjects(projectsRes.value.data);
      }

      // Fetch members for each team
      for (const team of teamsData) {
        await fetchTeamMembers(team.id);
      }

      if (showRefreshToast) {
        gooeyToast.success("Team Data Refreshed", {
          description: "Your team information has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      gooeyToast.error("Failed to Load Team Data", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest]);

  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await apiRequest(`/teams/${teamId}`);
      if (response.status && response.data) {
        setTeamMembersMap(prev => ({
          ...prev,
          [teamId]: response.data.members || []
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch members for team ${teamId}:`, error);
      setTeamMembersMap(prev => ({ ...prev, [teamId]: [] }));
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTeams(true);
  };

  const handleViewTeamDetails = (team) => {
    setSelectedTeam(team);
    setTeamDetailsModalOpen(true);
  };

  const handleViewMemberDetails = (member, team) => {
    setSelectedMember({ ...member, team });
    setMemberDetailsModalOpen(true);
  };

  // Get project name by ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || "—";
  };

  // Flatten all team members for the table view
  const allTeamMembers = [];
  teams.forEach(team => {
    const members = teamMembersMap[team.id] || [];
    members.forEach(member => {
      allTeamMembers.push({
        ...member,
        teamName: team.name,
        teamId: team.id,
      });
    });
  });

  // Stats
  const stats = {
    totalTeams: teams.length,
    totalMembers: allTeamMembers.length,
    activeMembers: allTeamMembers.filter(m => m.status === "active").length,
    totalProjects: projects.length,
  };

  if (loading) {
    return <TeamSkeleton />;
  }

  if (teams.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
          <div className="space-y-6 p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  My Team
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  View and manage your project teams
                </p>
              </div>
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
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
              <Users size={48} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No teams assigned</p>
              <p className="text-sm text-gray-400 mt-1">You are not managing any teams yet.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                My Team
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                View and manage your project teams and members
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Teams</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalTeams}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users size={18} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Team Members</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalMembers}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Users size={18} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Active Members</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.activeMembers}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Users size={18} className="text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalProjects}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Briefcase size={18} className="text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="members" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="members" className="cursor-pointer">
                <Users size={14} className="mr-2" />
                Team Members
              </TabsTrigger>
              <TabsTrigger value="teams" className="cursor-pointer">
                <Briefcase size={14} className="mr-2" />
                My Teams
              </TabsTrigger>
            </TabsList>

            {/* Team Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <TeamMembersTable
                members={allTeamMembers}
                projects={projects}
                onViewMemberDetails={handleViewMemberDetails}
                onViewTeamDetails={handleViewTeamDetails}
                getProjectName={getProjectName}
              />
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    members={teamMembersMap[team.id] || []}
                    onViewDetails={handleViewTeamDetails}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Team Details Modal */}
      <TeamDetailsModal
        open={teamDetailsModalOpen}
        onOpenChange={setTeamDetailsModalOpen}
        team={selectedTeam}
        members={selectedTeam ? teamMembersMap[selectedTeam.id] || [] : []}
        projects={projects}
      />

      {/* Member Details Modal */}
      <MemberDetailsModal
        open={memberDetailsModalOpen}
        onOpenChange={setMemberDetailsModalOpen}
        member={selectedMember}
        projects={projects}
      />
    </DashboardLayout>
  );
}