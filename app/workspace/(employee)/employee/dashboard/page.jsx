'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardMetrics, departmentStats, attendanceStats, leaveStats, projectStats } from '@/lib/demo-data/dashboards';
import {
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const metrics = dashboardMetrics?.admin ?? {};
  const metricItems = Array.isArray(metrics?.metrics) ? metrics.metrics : [];
  const departmentItems = Array.isArray(departmentStats?.departments) ? departmentStats.departments : [];
  const attendanceItems = Array.isArray(attendanceStats) ? attendanceStats : [];
  const leaveItems = Array.isArray(leaveStats) ? leaveStats : [];
  const projectItems = Array.isArray(projectStats) ? projectStats : [];

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
            System overview and key performance indicators
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {metricItems.map((metric, idx) => {
            const metricChange = metric?.change ?? '';
            const colorMap = {
              blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
              green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
              orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
              red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
              purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
            };

            const icons = {
              blue: <Users size={24} />,
              green: <CheckCircle size={24} />,
              orange: <AlertCircle size={24} />,
              red: <AlertCircle size={24} />,
              purple: <Briefcase size={24} />,
            };

            return (
              <Card key={idx} className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg ${colorMap[metric.color]}`}>
                    {icons[metric.color]}
                  </div>
                  <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                    metricChange.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {metricChange.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {metricChange}
                  </div>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm mb-2">
                  {metric.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
                  {metric.value}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Charts and Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Department Stats */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-foreground dark:text-white flex items-center gap-2">
                  <BarChart3 size={20} />
                  Department Overview
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {departmentItems.map((dept, idx) => (
                  <div key={idx}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground dark:text-white text-sm">
                          {dept.name}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          Head: {dept.head}
                        </p>
                      </div>
                      <div className="text-right text-xs sm:text-sm">
                        <p className="font-bold text-foreground dark:text-white">
                          {dept.employees} employees
                        </p>
                        <p className="text-muted-foreground dark:text-gray-400">
                          {dept.projects} projects
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{
                          width: `${(dept.employees / 50) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Attendance Chart */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-foreground dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <Activity size={20} />
                Weekly Attendance
              </h3>
              <div className="space-y-3">
                {attendanceItems.map((day, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                        {day.date}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-foreground dark:text-white">
                        {day.present}/{(day.present ?? 0) + (day.absent ?? 0) + (day.late ?? 0)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(((day.present ?? 0) / (((day.present ?? 0) + (day.absent ?? 0) + (day.late ?? 0)) || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-4 sm:space-y-6">
            {/* Leave Stats */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-foreground dark:text-white mb-4 flex items-center gap-2">
                <Briefcase size={20} />
                Leave Requests
              </h3>
              <div className="space-y-3">
                {leaveItems.map((leave, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                      {leave.type}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                      {leave.used}/{leave.total}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Project Stats */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-foreground dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Project Status
              </h3>
              <div className="space-y-3">
                {projectItems.map((project, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                      {project.status?.replace('_', ' ')}
                    </span>
                    <span className={`text-xs sm:text-sm font-bold ${
                      project.status === 'in_progress'
                        ? 'text-blue-600 dark:text-blue-400'
                        : project.status === 'completed'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-orange-600 dark:text-orange-400'
                    }`}>
                      {project.count}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-foreground dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button variant="primary" className="w-full text-xs sm:text-sm py-2 min-h-[44px] sm:min-h-auto">
                  + New Employee
                </Button>
                <Button variant="secondary" className="w-full text-xs sm:text-sm py-2 min-h-[44px] sm:min-h-auto">
                  + New Project
                </Button>
                <Button variant="secondary" className="w-full text-xs sm:text-sm py-2 min-h-[44px] sm:min-h-auto">
                  View Reports
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const HRManagerDashboard = () => {
  const metrics = dashboardMetrics.hr_manager;
  return (
    <AdminDashboard />
  );
};

const DeptHeadDashboard = () => {
  const metrics = dashboardMetrics.dept_head;
  return (
    <AdminDashboard />
  );
};

const ManagerDashboard = () => {
  const metrics = dashboardMetrics.manager;
  return (
    <AdminDashboard />
  );
};

const EmployeeDashboard = () => {
  const metrics = dashboardMetrics.employee;
  return (
    <AdminDashboard />
  );
};

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'hr_manager':
      return <HRManagerDashboard />;
    case 'dept_head':
      return <DeptHeadDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    default:
      return <AdminDashboard />;
  }
}
