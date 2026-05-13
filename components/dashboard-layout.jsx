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
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrator',
      hr_manager: 'HR Manager',
      dept_head: 'Department Head',
      manager: 'Team Manager',
      employee: 'Employee',
    };
    return labels[role] || role;
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Employees', href: '/employees', icon: Users },
    { label: 'Attendance', href: '/attendance', icon: Calendar },
    { label: 'Leave', href: '/leave', icon: Briefcase },
    { label: 'Projects', href: '/projects', icon: Briefcase },
    { label: 'Documents', href: '/documents', icon: FileText },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    ...(user.role === 'admin' || user.role === 'hr_manager' || user.role === 'manager' || user.role === 'dept_head'
      ? [{ label: 'Approvals', href: '/approvals', icon: CheckCircle }]
      : []),
    ...(user.role === 'admin' || user.role === 'hr_manager'
      ? [{ label: 'Settings', href: '/settings', icon: Settings }]
      : []),
  ];

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
        className={`fixed md:relative z-50 h-full w-64 bg-sidebar dark:bg-slate-900 border-r border-sidebar-border dark:border-slate-800 transition-all duration-300 flex flex-col ${
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
                className="text-white flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sidebar-accent-foreground dark:text-gray-300 hover:bg-sidebar-accent dark:hover:bg-slate-800 transition-colors group min-h-[44px] sm:min-h-auto"
              >
                <Icon size={20} className="flex-shrink-0 group-hover:text-sidebar-primary" />
                <span className="text-sm font-medium">{item.label}</span>
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
              {user.name.charAt(0)}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-foreground dark:text-white">
                {user.name}
              </p>
              <p className="text-xs truncate text-gray-300 dark:text-gray-400">
                {getRoleLabel(user.role)}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center gap-2 min-h-[44px] sm:min-h-auto"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Navbar */}
        <header className="bg-white dark:bg-slate-900 border-b border-border dark:border-slate-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-white truncate">
              {typeof children === 'function' ? 'Dashboard' : 'Welcome'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mt-1 truncate">
              {getRoleLabel(user.role)}
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
