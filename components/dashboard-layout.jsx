"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import logo from "../public/logo.png";
import Image from "next/image";
import { LogOut, Bell, Menu, X, ChevronDown } from "lucide-react";
import { getMenuItemsByRole } from "../lib/menu-items/menu-items";

export function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  const getRoleLabel = (role) => {
    const labels = {
      super_admin: "Super Admin",
      admin: "Administrator",
      general_manager: "General Manager",
      hr_manager: "HR Manager",
      dept_head: "Department Head",
      project_manager: "Project Manager",
      team_leader: "Team Leader",
      manager: "Team Manager",
      employee: "Employee",
    };

    return labels[role] || role;
  };

  const getUserDisplayName = () => {
    return (
      user?.name || user?.full_name || user?.email?.split("@")[0] || "User"
    );
  };

  const getUserInitial = () => {
    return getUserDisplayName().charAt(0).toUpperCase();
  };

  const menuItems = getMenuItemsByRole();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 h-full w-64 shrink-0 overflow-visible rounded-r-[38px] bg-gradient-to-b from-[#1F377E] via-[#1a48c7] to-[#1F377E]  transition-transform duration-300 ease-out md:translate-x-0 md:transition-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-7 shadow-2xl">
            <Image src={logo} alt="Logo" width={170} height={90} priority />

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl p-2 text-white transition hover:bg-white/10 md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`group relative ml-5 flex h-[58px] items-center gap-4 rounded-l-full px-6 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "active-menu-item bg-[#FFFFFF] text-[#0F52FF]"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-[#0F52FF]" : "text-white/70"
                    }`}
                  />

                  <span className="text-[15px] font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="px-4 pb-5">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-white backdrop-blur-md transition hover:bg-white/15"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0F52FF]">
                {getUserInitial()}
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold">
                  {getUserDisplayName()}
                </p>

                <p className="truncate text-xs text-white/70">
                  {getRoleLabel(user.role)}
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showUserMenu && (
              <div className="mt-3 space-y-1 rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur-md">
                <Link
                  href="/workspace/employee/profile"
                  className="block rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Profile Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-200 transition hover:bg-red-500/20"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden ml-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {getRoleLabel(user.role)} Panel
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl transition hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl transition hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </main>
    </div>
  );
}