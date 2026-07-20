// Dashboard utility functions and configurations

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--warning)",
];

export const KPI_CONFIG = [
  {
    key: "totalEmployees",
    title: "Total Employees",
    icon: "Users",
    color: "blue",
    format: (value) => value.toLocaleString(),
  },
  {
    key: "activeEmployees",
    title: "Active Employees",
    icon: "UserCheck",
    color: "green",
    format: (value) => value.toLocaleString(),
  },
  {
    key: "departments",
    title: "Departments",
    icon: "Building2",
    color: "purple",
    format: (value) => value,
  },
  {
    key: "ongoingProjects",
    title: "Ongoing Projects",
    icon: "Briefcase",
    color: "cyan",
    format: (value) => value,
  },
  {
    key: "pendingLeaveRequests",
    title: "Pending Leaves",
    icon: "CalendarDays",
    color: "orange",
    format: (value) => value,
  },
  {
    key: "totalPayroll",
    title: "Total Payroll",
    icon: "DollarSign",
    color: "emerald",
    format: (value) => `$${value.toLocaleString()}`,
  },
];

export const TREND_DATA = {
  totalEmployees: { trend: "up", value: 12 },
  activeEmployees: { trend: "up", value: 8 },
  departments: { trend: "up", value: 5 },
  ongoingProjects: { trend: "up", value: 15 },
  pendingLeaveRequests: { trend: "down", value: 3 },
  totalPayroll: { trend: "up", value: 10 },
};

export const transformDepartmentData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  return data.map((dept, index) => ({
    name: dept.name,
    employees: dept.employee_count,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));
};

export const transformProjectStatusData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  return data.map((status, index) => ({
    name: status.status,
    value: status.count,
    color: status.color || CHART_COLORS[index % CHART_COLORS.length],
  }));
};

export const transformLeaveStatusData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  return data.map((status, index) => ({
    name: status.status,
    value: status.count,
    color: status.color || CHART_COLORS[index % CHART_COLORS.length],
  }));
};

export const getChartData = (statsData) => ({
  unreadNotifications: statsData?.unread_notifications || 0,
  activePolicies: statsData?.active_policies || 0,
  monthlyPayroll: statsData?.monthly_payroll || 0,
});

export const chartConfig = {
  responsive: true,
  margin: { top: 20, right: 30, left: 0, bottom: 5 },
  gridProps: {
    strokeDasharray: "3 3",
    stroke: "var(--border)",
    vertical: false,
  },
  axisProps: {
    stroke: "var(--muted-foreground)",
    fontSize: 12,
    tickLine: false,
    axisLine: false,
  },
  tooltipProps: {
    contentStyle: {
      backgroundColor: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "8px",
    },
  },
  animationDuration: 1500,
};
