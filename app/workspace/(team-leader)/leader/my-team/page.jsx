"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import MemberDetailsModal from "../../../../../components/workspace/team-leder/team/MemberDetailsModal";
import TeamDetailsModal from "../../../../../components/workspace/team-leder/team/TeamDetailsModal";
import TeamMembersTable from "../../../../../components/workspace/team-leder/team/TeamMembersTable";
import TeamSkeleton from "../../../../../components/workspace/team-leder/team/TeamSkeleton";


export default function MyTeamPage() {
  const { apiRequest, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamDetailsModalOpen, setTeamDetailsModalOpen] = useState(false);
  const [memberDetailsModalOpen, setMemberDetailsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState({});

  const fetchTeams = useCallback(async (showRefreshToast = false) => {
    try {
      let response;
      let teamsData = [];
      
      // Try multiple possible endpoints
      try {
        response = await apiRequest("/teams/my");
        console.log("Response from /teams/my:", response);
        
        if (response.status && response.data) {
          teamsData = Array.isArray(response.data) ? response.data : [response.data];
        }
      } catch (error1) {
        console.log("First endpoint failed, trying /teams");
        
        try {
          response = await apiRequest("/teams");
          console.log("Response from /teams:", response);
          
          if (response.status && response.data) {
            const allTeams = Array.isArray(response.data) ? response.data : [];
            // Filter teams where current user is leader
            teamsData = allTeams.filter(team => 
              team.leader_id === user?.id || team.leader?.id === user?.id
            );
          }
        } catch (error2) {
          console.log("Second endpoint failed, trying /user/teams");
          
          try {
            response = await apiRequest(`/users/${user?.id}/teams`);
            console.log("Response from /users/${userId}/teams:", response);
            
            if (response.status && response.data) {
              teamsData = Array.isArray(response.data) ? response.data : [response.data];
            }
          } catch (error3) {
            console.error("All endpoints failed:", error3);
            throw error3;
          }
        }
      }
      
      setTeams(teamsData);
      
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
      
      let errorMessage = error.message;
      if (error.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.status === 403) {
        errorMessage = "You don't have permission to view this data.";
      } else if (error.status === 404) {
        errorMessage = "Team API endpoint not found. Please check API configuration.";
      }
      
      gooeyToast.error("Failed to Load Team Data", {
        description: errorMessage,
        duration: 5000,
      });
      
      setTeams([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest, user?.id]);

  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await apiRequest(`/teams/${teamId}`);
      if (response.status && response.data) {
        setTeamMembers(prev => ({
          ...prev,
          [teamId]: response.data.members || []
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch members for team ${teamId}:`, error);
      setTeamMembers(prev => ({ ...prev, [teamId]: [] }));
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
                  View and manage your team members
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
              <p className="text-gray-500">No team assigned</p>
              <p className="text-sm text-gray-400 mt-1">You are not leading any team yet.</p>
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
                View and manage your team members
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

          {/* Teams List */}
          {teams.length === 1 ? (
            // Single team - show directly
            <>
              <TeamCard team={teams[0]} onViewDetails={handleViewTeamDetails} />
              <TeamMembersTable
                team={teams[0]}
                members={teamMembers[teams[0].id] || []}
                onViewTeamDetails={handleViewTeamDetails}
                onViewMemberDetails={handleViewMemberDetails}
              />
            </>
          ) : (
            // Multiple teams - show tabs
            <Tabs defaultValue={teams[0]?.id?.toString()} className="space-y-6">
              <TabsList className="flex flex-wrap h-auto gap-2">
                {teams.map((team) => (
                  <TabsTrigger
                    key={team.id}
                    value={team.id.toString()}
                    className="cursor-pointer"
                  >
                    {team.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {teams.map((team) => (
                <TabsContent key={team.id} value={team.id.toString()} className="space-y-6">
                  <TeamCard team={team} onViewDetails={handleViewTeamDetails} />
                  <TeamMembersTable
                    team={team}
                    members={teamMembers[team.id] || []}
                    onViewTeamDetails={handleViewTeamDetails}
                    onViewMemberDetails={handleViewMemberDetails}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>

      {/* Team Details Modal */}
      <TeamDetailsModal
        open={teamDetailsModalOpen}
        onOpenChange={setTeamDetailsModalOpen}
        team={selectedTeam}
      />

      {/* Member Details Modal */}
      <MemberDetailsModal
        open={memberDetailsModalOpen}
        onOpenChange={setMemberDetailsModalOpen}
        member={selectedMember}
      />
    </DashboardLayout>
  );
}