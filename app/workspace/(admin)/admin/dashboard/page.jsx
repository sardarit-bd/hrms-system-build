"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { gooeyToast } from "@/components/ui/goey-toaster";
import {
  Users,
  UserCheck,
  Building2,
  Briefcase,
  CalendarDays,
  DollarSign,
  Bell,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

// Professional color palette
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ef4444"];

export default function AdminDashboard() {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for real API data
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [attendancePolicies, setAttendancePolicies] = useState([]);
  
  // Computed stats
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departments: 0,
    ongoingProjects: 0,
    pendingLeaveRequests: 0,
    totalPayroll: 0,
  });
  
  // Chart data
  const [departmentChartData, setDepartmentChartData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [leaveStatusData, setLeaveStatusData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchDashboardData = async (showRefreshToast = false) => {
    setLoading(true);
    
    try {
      // Fetch all real API data in parallel
      const [
        usersRes,
        departmentsRes,
        projectsRes,
        leaveRequestsRes,
        payrollRes,
        notificationsRes,
        policiesRes,
      ] = await Promise.allSettled([
        apiRequest("/users?per_page=100"),
        apiRequest("/departments"),
        apiRequest("/projects?per_page=100"),
        apiRequest("/leave/requests?per_page=100"),
        apiRequest("/payroll?per_page=100"),
        apiRequest("/notifications?per_page=20"),
        apiRequest("/attendance/policies"),
      ]);

      // Process Users
      const usersData = usersRes.status === "fulfilled" && usersRes.value?.data 
        ? usersRes.value.data 
        : [];
      setUsers(usersData);
      
      // Calculate user stats
      const totalEmployees = usersData.filter(u => u.role === "employee" || u.role === "team_leader" || u.role === "project_manager").length;
      const activeEmployees = usersData.filter(u => u.status === "active").length;

      // Process Departments
      const departmentsData = departmentsRes.status === "fulfilled" && departmentsRes.value?.data 
        ? departmentsRes.value.data 
        : [];
      setDepartments(departmentsData);

      // Process Projects
      const projectsData = projectsRes.status === "fulfilled" && projectsRes.value?.data 
        ? projectsRes.value.data 
        : [];
      setProjects(projectsData);
      
      const ongoingProjects = projectsData.filter(p => p.status === "ongoing").length;

      // Process Leave Requests
      const leaveData = leaveRequestsRes.status === "fulfilled" && leaveRequestsRes.value?.data 
        ? leaveRequestsRes.value.data 
        : [];
      setLeaveRequests(leaveData);
      
      const pendingLeaveRequests = leaveData.filter(l => l.status === "pending_pm" || l.status === "pending_gm").length;

      // Process Payroll
      const payrollData = payrollRes.status === "fulfilled" && payrollRes.value?.data 
        ? payrollRes.value.data 
        : [];
      setPayroll(payrollData);
      
      const totalPayroll = payrollData.reduce((sum, p) => sum + (p.net_salary || 0), 0);

      // Process Notifications
      const notificationsData = notificationsRes.status === "fulfilled" && notificationsRes.value?.data 
        ? notificationsRes.value.data 
        : [];
      setNotifications(notificationsData);

      // Process Policies
      const policiesData = policiesRes.status === "fulfilled" && policiesRes.value?.data 
        ? policiesRes.value.data 
        : [];
      setAttendancePolicies(policiesData);

      // Build Department Chart Data
      const deptChartData = departmentsData.map(dept => ({
        name: dept.name,
        employees: usersData.filter(u => u.department === dept.name).length,
      }));
      setDepartmentChartData(deptChartData);

      // Build Project Status Chart Data
      const projectStatusMap = {
        ongoing: { name: "Ongoing", value: 0, color: COLORS[0] },
        delivered: { name: "Delivered", value: 0, color: COLORS[1] },
        cancelled: { name: "Cancelled", value: 0, color: COLORS[5] },
        planning: { name: "Planning", value: 0, color: COLORS[2] },
      };
      
      projectsData.forEach(project => {
        if (projectStatusMap[project.status]) {
          projectStatusMap[project.status].value++;
        }
      });
      
      const projectChartData = Object.values(projectStatusMap).filter(item => item.value > 0);
      setProjectStatusData(projectChartData);

      // Build Leave Status Chart Data
      const leaveStatusMap = {
        approved: { name: "Approved", value: 0, color: COLORS[1] },
        rejected: { name: "Rejected", value: 0, color: COLORS[5] },
        pending_pm: { name: "Pending PM", value: 0, color: COLORS[2] },
        pending_gm: { name: "Pending GM", value: 0, color: COLORS[0] },
      };
      
      leaveData.forEach(leave => {
        if (leaveStatusMap[leave.status]) {
          leaveStatusMap[leave.status].value++;
        }
      });
      
      const leaveChartData = Object.values(leaveStatusMap).filter(item => item.value > 0);
      setLeaveStatusData(leaveChartData);

      // Build Recent Activities from real data
      const activities = [];
      
      // Add recent leave requests
      leaveData.slice(0, 3).forEach(leave => {
        activities.push({
          id: `leave-${leave.id}`,
          type: "leave",
          title: "Leave Request",
          description: `${leave.user?.full_name || "Employee"} requested ${leave.leave_type?.name || "leave"}`,
          time: leave.created_at ? new Date(leave.created_at).toLocaleDateString() : "Recently",
          status: leave.status,
        });
      });
      
      // Add recent user joins
      usersData.slice(0, 3).forEach(user => {
        if (user.created_at) {
          activities.push({
            id: `user-${user.id}`,
            type: "user",
            title: "New Employee Joined",
            description: `${user.full_name} joined as ${user.designation || "Employee"}`,
            time: new Date(user.created_at).toLocaleDateString(),
            status: "active",
          });
        }
      });
      
      // Add recent projects
      projectsData.slice(0, 2).forEach(project => {
        activities.push({
          id: `project-${project.id}`,
          type: "project",
          title: "Project Update",
          description: `${project.name} - ${project.status}`,
          time: project.updated_at ? new Date(project.updated_at).toLocaleDateString() : "Recently",
          status: project.status,
        });
      });
      
      // Sort by time (most recent first) and limit to 5
      const sortedActivities = activities.sort((a, b) => {
        if (a.time === "Recently") return -1;
        if (b.time === "Recently") return 1;
        return new Date(b.time) - new Date(a.time);
      }).slice(0, 5);
      
      setRecentActivities(sortedActivities);

      // Set stats
      setStats({
        totalEmployees,
        activeEmployees,
        departments: departmentsData.length,
        ongoingProjects,
        pendingLeaveRequests,
        totalPayroll,
      });

      if (showRefreshToast) {
        gooeyToast.success("Dashboard Updated", {
          description: "Latest data has been loaded.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      gooeyToast.error("Failed to Load Data", {
        description: error.message || "Unable to fetch dashboard data.",
        duration: 4000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(true);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Organization overview and key metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KpiCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={Users}
              color="blue"
            />
            <KpiCard
              title="Active Employees"
              value={stats.activeEmployees}
              icon={UserCheck}
              color="green"
            />
            <KpiCard
              title="Departments"
              value={stats.departments}
              icon={Building2}
              color="purple"
            />
            <KpiCard
              title="Ongoing Projects"
              value={stats.ongoingProjects}
              icon={Briefcase}
              color="cyan"
            />
            <KpiCard
              title="Pending Leave Requests"
              value={stats.pendingLeaveRequests}
              icon={CalendarDays}
              color="orange"
            />
            <KpiCard
              title="Total Payroll"
              value={`$${stats.totalPayroll.toLocaleString()}`}
              icon={DollarSign}
              color="emerald"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <BarChart3 size={16} className="text-gray-500" />
                  Employees by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                {departmentChartData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="employees" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState message="No department data available" />
                )}
              </CardContent>
            </Card>

            {/* Project Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <PieChartIcon size={16} className="text-gray-500" />
                  Project Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projectStatusData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {projectStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState message="No project data available" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Leave Status Chart & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leave Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <CalendarDays size={16} className="text-gray-500" />
                  Leave Request Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaveStatusData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leaveStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {leaveStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState message="No leave request data available" />
                )}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Bell size={16} className="text-gray-500" />
                  Recent Activities
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs gap-1" asChild>
                  <Link href="/workspace/admin/notifications">
                    View All <ArrowRight size={12} />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className={`p-2 rounded-lg bg-${getActivityColor(activity.type)}-50 dark:bg-${getActivityColor(activity.type)}-950/30`}>
                        {getActivityIcon(activity.type, activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                      {activity.status && (
                        <Badge variant="outline" className="text-xs">
                          {activity.status.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <EmptyState message="No recent activities" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Cards (conditional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notifications.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                      <Bell size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unread Notifications</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {notifications.filter(n => !n.is_read).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {attendancePolicies.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                      <Clock size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Policies</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {attendancePolicies.filter(p => p.is_active).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {payroll.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                      <DollarSign size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">This Month's Payroll</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        ${payroll.filter(p => p.payroll_month === new Date().toISOString().slice(0, 7))
                          .reduce((sum, p) => sum + (p.net_salary || 0), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper Functions
function getActivityColor(type) {
  const colors = {
    leave: "orange",
    user: "emerald",
    project: "blue",
  };
  return colors[type] || "gray";
}

function getActivityIcon(type, status) {
  if (type === "leave") {
    return <CalendarDays size={14} className="text-orange-600" />;
  }
  if (type === "user") {
    return <UserCheck size={14} className="text-emerald-600" />;
  }
  if (type === "project") {
    return <Briefcase size={14} className="text-blue-600" />;
  }
  return <Bell size={14} className="text-gray-600" />;
}

// KPI Card Component
function KpiCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-600",
    green: "bg-green-50 dark:bg-green-950/30 text-green-600",
    purple: "bg-purple-50 dark:bg-purple-950/30 text-purple-600",
    cyan: "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600",
    orange: "bg-orange-50 dark:bg-orange-950/30 text-orange-600",
    emerald: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon size={18} />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{title}</p>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle size={32} className="text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}