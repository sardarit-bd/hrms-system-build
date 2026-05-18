"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import CreateProjectDialog from "../../../../../components/workspace/admin/project/CreateProjectDialog";
import ProjectsTable from "../../../../../components/workspace/admin/project/ProjectsTable";
import ProjectFilters from "../../../../../components/workspace/admin/project/ProjectFilters";


export default function ProjectsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Active tab
  const [activeTab, setActiveTab] = useState("all");

  const fetchProjects = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("per_page", perPage);
      params.append("page", currentPage);
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (typeFilter) params.append("type", typeFilter);
      if (managerFilter) params.append("project_manager_id", managerFilter);
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      
      let response;
      if (activeTab === "ongoing") {
        response = await apiRequest(`/projects/ongoing?${params.toString()}`);
      } else if (activeTab === "overdue") {
        response = await apiRequest(`/projects/overdue?${params.toString()}`);
      } else {
        response = await apiRequest(`/projects?${params.toString()}`);
      }
      
      if (response.status && response.data) {
        setProjects(response.data);
        setTotal(response.meta?.total || response.data.length);
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
  }, [apiRequest, perPage, currentPage, searchTerm, statusFilter, typeFilter, managerFilter, fromDate, toDate, activeTab]);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [managersRes, channelsRes] = await Promise.allSettled([
        apiRequest("/users/list/project-managers"),
        apiRequest("/channels/active"),
      ]);

      if (managersRes.status === "fulfilled" && managersRes.value?.data) {
        setProjectManagers(managersRes.value.data);
      }
      if (channelsRes.status === "fulfilled" && channelsRes.value?.data) {
        setChannels(channelsRes.value.data);
      }
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchProjects();
    fetchDropdownData();
  }, [fetchProjects, fetchDropdownData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
    setManagerFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
    resetFilters();
  };

  if (loading) {
    return <ProjectsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Projects
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage and track all company projects
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
              <Button
                size="sm"
                onClick={() => setCreateDialogOpen(true)}
                className="gap-2 bg-[#1D3A88] hover:bg-[#142558] cursor-pointer"
              >
                <Plus size={14} />
                New Project
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all" className="cursor-pointer">All Projects</TabsTrigger>
              <TabsTrigger value="ongoing" className="cursor-pointer">Ongoing</TabsTrigger>
              <TabsTrigger value="overdue" className="cursor-pointer">Overdue</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {/* Filters */}
              <ProjectFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                managerFilter={managerFilter}
                setManagerFilter={setManagerFilter}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                projectManagers={projectManagers}
                onReset={resetFilters}
              />

              {/* Projects Table */}
              <ProjectsTable
                projects={projects}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                total={total}
                perPage={perPage}
                onRefresh={fetchProjects}
                projectManagers={projectManagers}
                channels={channels}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchProjects}
        projectManagers={projectManagers}
        channels={channels}
      />
    </DashboardLayout>
  );
}

// Loading Skeleton
function ProjectsSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="rounded-lg border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}