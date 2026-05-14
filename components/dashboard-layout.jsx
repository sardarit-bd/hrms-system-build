'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import logo from "../public/logo.png";
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  FileText,
  BarChart3,
  CheckCircle,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  // ✅ Loading state while user is not loaded
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const getRoleLabel = (role) => {
    const labels = {
      super_admin: 'Super Admin',
      admin: 'Administrator',
      general_manager: 'General Manager',
      hr_manager: 'HR Manager',
      dept_head: 'Department Head',
      project_manager: 'Project Manager',
      team_leader: 'Team Leader',
      manager: 'Team Manager',
      employee: 'Employee',
    };
    return labels[role] || role;
  };

  // Get user display name safely
  const getUserDisplayName = () => {
    return user?.name || user?.full_name || user?.email?.split('@')[0] || 'User';
  };

  // Get user initial safely
  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  // Role based menu items
  const getMenuItemsByRole = () => {
    const role = user?.role;
    
    // Super Admin / Admin Menu
    if (role === 'super_admin' || role === 'admin') {
      return [
        { label: 'Dashboard', href: '/workspace/admin/dashboard', icon: LayoutDashboard },
        { label: 'Employees', href: '/workspace/admin/employees', icon: Users },
        { label: 'Attendance', href: '/workspace/admin/attendance', icon: Calendar },
        { label: 'Leave', href: '/workspace/admin/leave', icon: Briefcase },
        { label: 'Projects', href: '/workspace/admin/projects', icon: Briefcase },
        { label: 'Documents', href: '/workspace/admin/documents', icon: FileText },
        { label: 'Reports', href: '/workspace/admin/reports', icon: BarChart3 },
        { label: 'Approvals', href: '/workspace/admin/approvals', icon: CheckCircle },
        { label: 'Settings', href: '/workspace/employee/settings', icon: Settings }
      ];
    }
    
    // HR Manager Menu
    if (role === 'hr_manager') {
      return [
        { label: 'Dashboard', href: '/workspace/hr/dashboard', icon: LayoutDashboard },
        { label: 'Employees', href: '/workspace/hr/employees', icon: Users },
        { label: 'Attendance', href: '/workspace/hr/attendance', icon: Calendar },
        { label: 'Leave', href: '/workspace/hr/leave', icon: Briefcase },
        { label: 'Documents', href: '/workspace/hr/documents', icon: FileText },
        { label: 'Reports', href: '/workspace/hr/reports', icon: BarChart3 },
        { label: 'Approvals', href: '/workspace/hr/approvals', icon: CheckCircle },
        { label: 'Settings', href: '/workspace/employee/settings', icon: Settings }
      ];
    }
    
    // Project Manager Menu
    if (role === 'project_manager' || role === 'manager') {
      return [
        { label: 'Dashboard', href: '/workspace/manager/dashboard', icon: LayoutDashboard },
        { label: 'Team', href: '/workspace/manager/team', icon: Users },
        { label: 'Attendance', href: '/workspace/manager/attendance', icon: Calendar },
        { label: 'Leave', href: '/workspace/manager/leave', icon: Briefcase },
        { label: 'Projects', href: '/workspace/manager/projects', icon: Briefcase },
        { label: 'Documents', href: '/workspace/manager/documents', icon: FileText },
        { label: 'Reports', href: '/workspace/manager/reports', icon: BarChart3 },
        { label: 'Approvals', href: '/workspace/manager/approvals', icon: CheckCircle },
        { label: 'Settings', href: '/workspace/employee/settings', icon: Settings }
      ];
    }
    
    // Team Leader Menu
    if (role === 'team_leader' || role === 'dept_head') {
      return [
        { label: 'Dashboard', href: '/workspace/leader/dashboard', icon: LayoutDashboard },
        { label: 'Team', href: '/workspace/leader/team', icon: Users },
        { label: 'Attendance', href: '/workspace/leader/attendance', icon: Calendar },
        { label: 'Leave', href: '/workspace/leader/leave', icon: Briefcase },
        { label: 'Projects', href: '/workspace/leader/projects', icon: Briefcase },
        { label: 'Documents', href: '/workspace/leader/documents', icon: FileText },
        { label: 'Settings', href: '/workspace/employee/settings', icon: Settings }
      ];
    }
    
    // Employee Menu (Default)
    return [
      { label: 'Dashboard', href: '/workspace/employee/dashboard', icon: LayoutDashboard },
      { label: 'My Team', href: '/workspace/employee/team', icon: Users },
      { label: 'Attendance', href: '/workspace/employee/attendance', icon: Calendar },
      { label: 'Leave', href: '/workspace/employee/leave', icon: Briefcase },
      { label: 'My Projects', href: '/workspace/employee/projects', icon: Briefcase },
      { label: 'Documents', href: '/workspace/employee/documents', icon: FileText },
      { label: 'Settings', href: '/workspace/employee/settings', icon: Settings }
    ];
  };

  const menuItems = getMenuItemsByRole();

  return (
    <div className="flex h-screen bg-background dark:bg-slate-950 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 h-full w-64 bg-[#1d3a88] dark:bg-slate-900 border-r border-sidebar-border dark:border-slate-800 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-4 sm:p-5 border-b border-sidebar-border dark:border-slate-800 flex items-center justify-between">
          <Image src={logo} alt="Logo" width={200} height={150} />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-sidebar-accent dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setSidebarOpen(false)}
                className="text-white flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sidebar-accent-foreground dark:text-gray-300 dark:hover:bg-slate-800 transition-colors group min-h-[44px] sm:min-h-auto hover:bg-sidebar-accent"
              >
                <Icon size={20} className="flex-shrink-0 group-hover:text-sidebar-primary" />
                <span className="text-sm font-medium group-hover:text-sidebar-primary">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-3 sm:p-4 border-t border-sidebar-border dark:border-slate-800 space-y-2">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md hover:bg-sidebar-accent dark:hover:bg-slate-800 transition-colors text-sidebar-accent-foreground dark:text-gray-300 min-h-[44px] sm:min-h-auto"
          >
            <div className="w-8 h-8 bg-sidebar-primary dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {getUserInitial()}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-foreground dark:text-white">
                {getUserDisplayName()}
              </p>
              <p className="text-xs truncate text-gray-300 dark:text-gray-400">
                {getRoleLabel(user.role)}
              </p>
            </div>
            <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="space-y-1">
              <Link
                href="/workspace/employee/profile"
                className="w-full block text-left px-3 sm:px-4 py-2 text-sm text-gray-300 hover:bg-sidebar-accent dark:hover:bg-slate-800 rounded transition-colors"
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 sm:px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Navbar */}
        <header className="bg-white dark:bg-slate-900 border-b border-border dark:border-slate-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-white truncate">
              Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mt-1 truncate">
              {getRoleLabel(user.role)} Panel
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 sm:p-2.5 hover:bg-secondary dark:hover:bg-slate-800 rounded-md transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center">
              <Bell size={20} className="text-foreground dark:text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 sm:p-2.5 hover:bg-secondary dark:hover:bg-slate-800 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 w-full max-w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}