"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ProjectsTable from "../../../../components/workspace/gm/projects/ProjectsTable";
import ProjectDetailsModal from "../../../../components/workspace/gm/projects/ProjectDetailsModal";
import ProjectFilters from "../../../../components/workspace/gm/projects/ProjectFilters";
import ProjectCharts from "../../../../components/workspace/gm/projects/ProjectCharts";
import ProjectStatsCards from "../../../../components/workspace/gm/projects/ProjectStatsCards";
import ProjectsSkeleton from "../../../../components/workspace/gm/projects/ProjectsSkeleton";


export default function GMProjectsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [overdueProjects, setOverdueProjects] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [pmFilter, setPmFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const [activeTab, setActiveTab] = useState("all");

  const fetchProjects = useCallback(async (showRefreshToast = false) => {
    try {
      let response;
      const params = new URLSearchParams();
      params.append("per_page", perPage);
      params.append("page", currentPage);
      if (searchTerm) params.append("search", searchTerm);
      if (typeFilter) params.append("type", typeFilter);
      if (pmFilter) params.append("project_manager_id", pmFilter);
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      
      if (activeTab === "ongoing") {
        response = await apiRequest(`/projects/ongoing?${params.toString()}`);
      } else if (activeTab === "overdue") {
        response = await apiRequest(`/projects/overdue?${params.toString()}`);
      } else {
        if (statusFilter) params.append("status", statusFilter);
        response = await apiRequest(`/projects?${params.toString()}`);
      }
      
      if (response.status && response.data) {
        setProjects(response.data);
        setTotal(response.meta?.total || response.data.length);
      }

      if (showRefreshToast) {
        gooeyToast.success("Projects Refreshed", {
          description: "Project data has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      gooeyToast.error("Failed to Load Projects", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest, perPage, currentPage, searchTerm, statusFilter, typeFilter, pmFilter, fromDate, toDate, activeTab]);

  const fetchOngoingOverdueProjects = useCallback(async () => {
    try {
      const [ongoingRes, overdueRes] = await Promise.allSettled([
        apiRequest("/projects/ongoing"),
        apiRequest("/projects/overdue"),
      ]);

      if (ongoingRes.status === "fulfilled" && ongoingRes.value?.data) {
        setOngoingProjects(ongoingRes.value.data);
      }
      if (overdueRes.status === "fulfilled" && overdueRes.value?.data) {
        setOverdueProjects(overdueRes.value.data);
      }
    } catch (error) {
      console.error("Failed to fetch ongoing/overdue projects:", error);
    }
  }, [apiRequest]);

  const fetchFilterData = useCallback(async () => {
    try {
      const [pmRes, channelsRes] = await Promise.allSettled([
        apiRequest("/users/list/project-managers"),
        apiRequest("/channels/active"),
      ]);

      if (pmRes.status === "fulfilled" && pmRes.value?.data) {
        setProjectManagers(pmRes.value.data);
      }
      if (channelsRes.status === "fulfilled" && channelsRes.value?.data) {
        setChannels(channelsRes.value.data);
      }
    } catch (error) {
      console.error("Failed to fetch filter data:", error);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchProjects();
    fetchOngoingOverdueProjects();
    fetchFilterData();
  }, [fetchProjects, fetchOngoingOverdueProjects, fetchFilterData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProjects(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
    setPmFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handleViewDetails = async (project) => {
    try {
      const response = await apiRequest(`/projects/${project.id}`);
      if (response.status && response.data) {
        setSelectedProject(response.data);
        setDetailsModalOpen(true);
      }
    } catch (error) {
      gooeyToast.error("Failed to Load Project Details", {
        description: error.message,
      });
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
    handleResetFilters();
  };

  // Calculate stats
  const stats = {
    total: projects.length,
    ongoing: ongoingProjects.length,
    overdue: overdueProjects.length,
    delivered: projects.filter(p => p.status === "delivered").length,
    cancelled: projects.filter(p => p.status === "cancelled").length,
  };

  const totalPages = Math.ceil(total / perPage);

  if (loading) {
    return <ProjectsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Projects Overview
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Monitor and track all company projects
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

          {/* Stats Cards */}
          <ProjectStatsCards stats={stats} />

          {/* Charts */}
          <ProjectCharts 
            projects={projects}
            projectManagers={projectManagers}
          />

          {/* Filters */}
          <ProjectFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            pmFilter={pmFilter}
            setPmFilter={setPmFilter}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            projectManagers={projectManagers}
            onReset={handleResetFilters}
          />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="all" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  All Projects
                  <span className="ml-1 sm:ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                    {stats.total}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="ongoing" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Ongoing
                  {stats.ongoing > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full">
                      {stats.ongoing}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="overdue" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Overdue
                  {stats.overdue > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded-full">
                      {stats.overdue}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="space-y-4 sm:space-y-6">
              <ProjectsTable
                projects={projects}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                total={total}
                perPage={perPage}
                totalPages={totalPages}
                projectManagers={projectManagers}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        project={selectedProject}
        projectManagers={projectManagers}
        channels={channels}
      />
    </DashboardLayout>
  );
}