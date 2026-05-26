"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import EmployeePolicyHistoryModal from "../../../../../components/workspace/hr/attendance-policies/EmployeePolicyHistoryModal";
import PolicyDetailsModal from "../../../../../components/workspace/hr/attendance-policies/PolicyDetailsModal";
import AssignPolicyDialog from "../../../../../components/workspace/hr/attendance-policies/AssignPolicyDialog";
import EditPolicyDialog from "../../../../../components/workspace/hr/attendance-policies/EditPolicyDialog";
import CreatePolicyDialog from "../../../../../components/workspace/hr/attendance-policies/CreatePolicyDialog";
import PoliciesList from "../../../../../components/workspace/hr/attendance-policies/PoliciesList";
import PolicyFilters from "../../../../../components/workspace/hr/attendance-policies/PolicyFilters";
import PolicyStatsCards from "../../../../../components/workspace/hr/attendance-policies/PolicyStatsCards";
import PolicySkeleton from "../../../../../components/workspace/hr/attendance-policies/PolicySkeleton";


export default function HRAttendancePoliciesPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [policies, setPolicies] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  // Dialog states
  const [createPolicyOpen, setCreatePolicyOpen] = useState(false);
  const [editPolicyOpen, setEditPolicyOpen] = useState(false);
  const [assignPolicyOpen, setAssignPolicyOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeHistory, setEmployeeHistory] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [activeTab, setActiveTab] = useState("policies");

  const fetchData = useCallback(async (showRefreshToast = false) => {
    try {
      const [policiesRes, employeesRes] = await Promise.allSettled([
        apiRequest("/attendance/policies"),
        apiRequest("/users?per_page=200"),
      ]);

      if (policiesRes.status === "fulfilled" && policiesRes.value?.data) {
        setPolicies(policiesRes.value.data);
      }
      if (employeesRes.status === "fulfilled" && employeesRes.value?.data) {
        setEmployees(employeesRes.value.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Data Refreshed", {
          description: "Attendance policies have been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      gooeyToast.error("Failed to Load Data", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setEditPolicyOpen(true);
  };

  const handleViewDetails = (policy) => {
    setSelectedPolicy(policy);
    setDetailsModalOpen(true);
  };

  const handleViewEmployeeHistory = async (employee) => {
    try {
      const response = await apiRequest(`/attendance/policies/user/${employee.id}/history`);
      setSelectedEmployee(employee);
      setEmployeeHistory(response.data || []);
      setHistoryModalOpen(true);
    } catch (error) {
      gooeyToast.error("Failed to Load History", {
        description: error.message,
      });
    }
  };

  // Filter policies
  const filteredPolicies = policies.filter(policy => {
    if (searchTerm && !policy.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (statusFilter === "active" && !policy.is_active) return false;
    if (statusFilter === "inactive" && policy.is_active) return false;
    return true;
  });

  const stats = {
    totalPolicies: policies.length,
    activePolicies: policies.filter(p => p.is_active).length,
    inactivePolicies: policies.filter(p => !p.is_active).length,
  };

  if (loading) {
    return <PolicySkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Attendance Policies
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage attendance policies, rules, and employee assignments
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
          <PolicyStatsCards stats={stats} />

          {/* Filters */}
          <PolicyFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onReset={handleResetFilters}
          />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="policies" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Policies
                </TabsTrigger>
                <TabsTrigger value="assignments" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Employee Assignments
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Policies Tab */}
            <TabsContent value="policies" className="space-y-4 sm:space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setCreatePolicyOpen(true)} className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer text-sm">
                  <Plus size={14} className="mr-2" />
                  Create Policy
                </Button>
              </div>
              <PoliciesList
                policies={filteredPolicies}
                onEditPolicy={handleEditPolicy}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-4 sm:space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setAssignPolicyOpen(true)} className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer text-sm">
                  <Plus size={14} className="mr-2" />
                  Assign Policy
                </Button>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-sm font-medium">Employee Policy Assignments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="text-left p-3">Employee</th>
                        <th className="text-left p-3">Current Policy</th>
                        <th className="text-left p-3">Effective From</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.slice(0, 10).map((employee) => (
                        <tr key={employee.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-900/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{employee.full_name}</p>
                              <p className="text-xs text-gray-500">{employee.employee_code}</p>
                            </div>
                          </td>
                          <td className="p-3">—</td>
                          <td className="p-3">—</td>
                          <td className="p-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewEmployeeHistory(employee)}
                              className="cursor-pointer text-xs"
                            >
                              View History
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Policy Dialog */}
      <CreatePolicyDialog
        open={createPolicyOpen}
        onOpenChange={setCreatePolicyOpen}
        onSuccess={fetchData}
      />

      {/* Edit Policy Dialog */}
      <EditPolicyDialog
        open={editPolicyOpen}
        onOpenChange={setEditPolicyOpen}
        policy={selectedPolicy}
        onSuccess={fetchData}
      />

      {/* Assign Policy Dialog */}
      <AssignPolicyDialog
        open={assignPolicyOpen}
        onOpenChange={setAssignPolicyOpen}
        policies={policies}
        employees={employees}
        onSuccess={fetchData}
      />

      {/* Policy Details Modal */}
      <PolicyDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        policy={selectedPolicy}
      />

      {/* Employee Policy History Modal */}
      <EmployeePolicyHistoryModal
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        employee={selectedEmployee}
        history={employeeHistory}
      />
    </DashboardLayout>
  );
}