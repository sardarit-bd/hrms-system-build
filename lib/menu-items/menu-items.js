import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  FileText,
  BarChart3,
  CheckCircle,
  Settings,
  UserCog,
  DollarSign,
  BellRing,
  UserCircle,
  CalendarDays,
  FolderKanban,
  Clock,
  User,
  CalendarClock,
  Clock3,
} from "lucide-react";

export const getMenuItemsByRole = (role) => {
  if (role === "super_admin" || role === "admin") {
    return [
      {
        label: "Dashboard",
        href: "/workspace/admin/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Employees", href: "/workspace/admin/employees", icon: Users },
      {
        label: "Attendance",
        href: "/workspace/admin/attendance",
        icon: Calendar,
      },
      { label: "Leave", href: "/workspace/admin/leave", icon: Briefcase },
      { label: "Projects", href: "/workspace/admin/projects", icon: Briefcase },
      {
        label: "Documents",
        href: "/workspace/admin/documents",
        icon: FileText,
      },
      { label: "Reports", href: "/workspace/admin/reports", icon: BarChart3 },
      {
        label: "Approvals",
        href: "/workspace/admin/approvals",
        icon: CheckCircle,
      },
      {
        label: "Settings",
        href: "/workspace/employee/settings",
        icon: Settings,
      },
      { label: "Profile", href: "/workspace/admin/profile", icon: UserCog },
    ];
  }

  if (role === "hr_manager") {
    return [
      {
        label: "Dashboard",
        href: "/workspace/hr/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Employees", href: "/workspace/hr/employees", icon: Users },
      { label: "Attendance", href: "/workspace/hr/attendance", icon: Calendar },
      { label: "Leave", href: "/workspace/hr/leave", icon: Briefcase },
      { label: "Documents", href: "/workspace/hr/documents", icon: FileText },
      { label: "Reports", href: "/workspace/hr/reports", icon: BarChart3 },
      {
        label: "Approvals",
        href: "/workspace/hr/approvals",
        icon: CheckCircle,
      },
      {
        label: "Settings",
        href: "/workspace/employee/settings",
        icon: Settings,
      },
    ];
  }

  if (role === "project_manager" || role === "manager") {
    return [
      {
        label: "Dashboard",
        href: "/workspace/manager/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "My Projects",
        href: "/workspace/manager/projects",
        icon: FolderKanban,
      },

      {
        label: "Project Teams",
        href: "/workspace/manager/team",
        icon: Users,
      },

      {
        label: "Attendance",
        href: "/workspace/manager/attendance",
        icon: Calendar,
      },

      {
        label: "Leave Requests",
        href: "/workspace/manager/leave-requests",
        icon: CalendarClock,
      },

      {
        label: "Hour Logs",
        href: "/workspace/manager/hour-logs",
        icon: Clock3,
      },

      {
        label: "Reports",
        href: "/workspace/manager/reports",
        icon: BarChart3,
      },

      {
        label: "Notifications",
        href: "/workspace/manager/notifications",
        icon: BellRing,
      },

      {
        label: "Holidays",
        href: "/workspace/manager/holidays",
        icon: CalendarDays,
      },

      {
        label: "My Profile",
        href: "/workspace/manager/profile",
        icon: UserCircle,
      },
    ];
  }

  if (role === "team_leader" || role === "dept_head") {
    return [
      {
        label: "Dashboard",
        href: "/workspace/leader/dashboard",
        icon: LayoutDashboard,
      },
      { label: "My Team", href: "/workspace/leader/my-team", icon: Users },
      {
        label: "Team Attendance",
        href: "/workspace/leader/team-attendance",
        icon: Calendar,
      },
      {
        label: "Leave Requests",
        href: "/workspace/leader/team-leave-requests",
        icon: Briefcase,
      },
      {
        label: "Hour Logs Approval",
        href: "/workspace/leader/hour-logs-approval",
        icon: Clock,
      },
      {
        label: "Team Projects",
        href: "/workspace/leader/team-projects",
        icon: FolderKanban,
      },
      {
        label: "Holidays",
        href: "/workspace/leader/holidays",
        icon: CalendarDays,
      },
      {
        label: "Notifications",
        href: "/workspace/leader/notifications",
        icon: BellRing,
      },
      { label: "My Profile", href: "/workspace/leader/my-profile", icon: User },
    ];
  }

  return [
    {
      label: "Dashboard",
      href: "/workspace/employee/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Attendance",
      href: "/workspace/employee/my-attendance",
      icon: Calendar,
    },
    { label: "Leave", href: "/workspace/employee/my-leave", icon: Briefcase },
    {
      label: "My Projects",
      href: "/workspace/employee/my-projects",
      icon: FolderKanban,
    },
    {
      label: "My Payroll",
      href: "/workspace/employee/my-payroll",
      icon: DollarSign,
    },
    {
      label: "Notifications",
      href: "/workspace/employee/notifications",
      icon: BellRing,
    },
    {
      label: "Holidays",
      href: "/workspace/employee/holidays",
      icon: CalendarDays,
    },
    {
      label: "My Profile",
      href: "/workspace/employee/my-profile",
      icon: UserCircle,
    },
  ];
};
