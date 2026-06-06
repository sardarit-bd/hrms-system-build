"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, UserCheck } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import ApproveEmployeeDialog from "../../../../../components/workspace/hr/employees/ApproveEmployeeDialog";
import StatusChangeDialog from "../../../../../components/workspace/hr/employees/StatusChangeDialog";
import EditEmployeeDialog from "../../../../../components/workspace/hr/employees/EditEmployeeDialog";
import EmployeeDetailsModal from "../../../../../components/workspace/hr/employees/EmployeeDetailsModal";
import EmployeesTable from "../../../../../components/workspace/hr/employees/EmployeesTable";
import EmployeeFilters from "../../../../../components/workspace/hr/employees/EmployeeFilters";
import EmployeeStatsCards from "../../../../../components/workspace/hr/employees/EmployeeStatsCards";
import EmployeesSkeleton from "../../../../../components/workspace/hr/employees/EmployeesSkeleton";


export default function HREmployeesPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchEmployees = useCallback(async (showRefreshToast = false) => {
    try {
      const params = new URLSearchParams();
      params.append("per_page", perPage);
      params.append("page", currentPage);
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (roleFilter) params.append("role", roleFilter);
      if (departmentFilter) params.append("department", departmentFilter);
      
      const response = await apiRequest(`/users?${params.toString()}`);
      
      if (response.status && response.data) {
        setEmployees(response.data);
        setTotal(response.meta?.total || response.data.length);
      }

      if (showRefreshToast) {
        gooeyToast.success("Employees Refreshed", {
          description: "Employee data has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      gooeyToast.error("Failed to Load Employees", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest, perPage, currentPage, searchTerm, statusFilter, roleFilter, departmentFilter]);

  const fetchFilterData = useCallback(async () => {
    try {
      const [deptRes, rolesRes] = await Promise.allSettled([
        apiRequest("/departments"),
        apiRequest("/roles"),
      ]);

      if (deptRes.status === "fulfilled" && deptRes.value?.data) {
        setDepartments(deptRes.value.data);
      }
      if (rolesRes.status === "fulfilled" && rolesRes.value?.data) {
        setRoles(rolesRes.value.data);
      }
    } catch (error) {
      console.error("Failed to fetch filter data:", error);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchEmployees();
    fetchFilterData();
  }, [fetchEmployees, fetchFilterData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEmployees(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setRoleFilter("");
    setDepartmentFilter("");
    setCurrentPage(1);
  };

  const handleViewDetails = async (employee) => {
    try {
      const response = await apiRequest(`/users/${employee.id}`);
      if (response.status && response.data) {
        setSelectedEmployee(response.data);
        setDetailsModalOpen(true);
      }
    } catch (error) {
      gooeyToast.error("Failed to Load Details", {
        description: error.message,
      });
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleStatusChange = (employee, status) => {
    setSelectedEmployee(employee);
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  const handleApproveEmployee = (employee) => {
    setSelectedEmployee(employee);
    setApproveDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!selectedEmployee || !newStatus) return;
    
    try {
      const response = await apiRequest(`/users/${selectedEmployee.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status) {
        gooeyToast.success("Status Updated", {
          description: `${selectedEmployee.full_name} status changed to ${newStatus}.`,
        });
        setStatusDialogOpen(false);
        fetchEmployees(true);
      }
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    }
  };

  const handleApproveConfirm = async () => {
    if (!selectedEmployee) return;
    
    try {
      const response = await apiRequest(`/users/${selectedEmployee.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "active" }),
      });

      if (response.status) {
        gooeyToast.success("Employee Approved", {
          description: `${selectedEmployee.full_name} has been approved.`,
        });
        setApproveDialogOpen(false);
        fetchEmployees(true);
      }
    } catch (error) {
      gooeyToast.error("Approval Failed", {
        description: error.message,
      });
    }
  };

  // Filter employees for pending tab
  const pendingEmployees = employees.filter(e => e.status === "pending");
  const activeEmployees = employees.filter(e => e.status === "active");
  const inactiveEmployees = employees.filter(e => e.status === "inactive");

  const stats = {
    total: employees.length,
    active: activeEmployees.length,
    inactive: inactiveEmployees.length,
    pending: pendingEmployees.length,
  };

  const totalPages = Math.ceil(total / perPage);

  if (loading) {
    return <EmployeesSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Employee Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage employee information, status, and approvals
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
          <EmployeeStatsCards stats={stats} />

          {/* Filters */}
          {/* <EmployeeFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            departments={departments}
            roles={roles}
            onReset={handleResetFilters}
          /> */}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="all" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  All Employees
                  <span className="ml-1 sm:ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                    {stats.total}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="pending" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Pending Approvals
                  {stats.pending > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-full">
                      {stats.pending}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="active" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Active
                </TabsTrigger>
                <TabsTrigger value="inactive" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Inactive
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="space-y-4 sm:space-y-6">
              <EmployeesTable
                employees={activeTab === "all" ? employees : 
                          activeTab === "pending" ? pendingEmployees :
                          activeTab === "active" ? activeEmployees : inactiveEmployees}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                total={total}
                perPage={perPage}
                totalPages={totalPages}
                departments={departments}
                roles={roles}
                onViewDetails={handleViewDetails}
                onEditEmployee={handleEditEmployee}
                onStatusChange={handleStatusChange}
                onApproveEmployee={handleApproveEmployee}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        employee={selectedEmployee}
        departments={departments}
        roles={roles}
      />

      {/* Edit Employee Dialog */}
      <EditEmployeeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        employee={selectedEmployee}
        departments={departments}
        roles={roles}
        onSuccess={fetchEmployees}
      />

      {/* Status Change Dialog */}
      <StatusChangeDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        employee={selectedEmployee}
        newStatus={newStatus}
        onConfirm={handleStatusConfirm}
      />

      {/* Approve Employee Dialog */}
      <ApproveEmployeeDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        employee={selectedEmployee}
        onConfirm={handleApproveConfirm}
      />
    </DashboardLayout>
  );
}