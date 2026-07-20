"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Bell, Menu, X, ChevronDown } from "lucide-react";
import { getMenuItemsByRole } from "@/lib/menu-items/menu-items";
import { useSelector } from "react-redux";
import logo from "../public/logo.png";

export function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);

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
    // await logout(); // Uncomment when auth service is ready
    router.push("/auth/login");
  };

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

  const menuItems = getMenuItemsByRole(user?.role);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 shrink-0 overflow-hidden rounded-r-[38px] bg-gradient-to-b from-primary via-primary/90 to-primary transition-transform duration-300 ease-out md:relative md:translate-x-0 md:transition-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* Logo Fixed Top */}
          <div className="flex shrink-0 items-center justify-between px-6 py-7 shadow-2xl">
            <Image src={logo} alt="Logo" width={170} height={90} priority />
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl p-2 text-primary-foreground transition hover:bg-primary-foreground/10 md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Menu */}
          <nav className="sidebar-scroll min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden py-4 pr-1">
            {menuItems?.map((item, index) => {
              const Icon = item?.icon;
              const isActive =
                pathname === item?.href ||
                pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={`${item?.href}-${index}`}
                  href={item?.href}
                  onClick={() => {
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`group relative ml-5 flex h-[58px] items-center gap-4 rounded-l-full px-6 mt-6 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-background text-primary"
                      : "text-primary-foreground/75 hover:text-primary-foreground"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-primary-foreground/70"
                    }`}
                  />
                  <span className="truncate text-[15px] font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Section Fixed Bottom */}
          <div className="shrink-0 px-4 pb-5 pt-3">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex w-full items-center gap-3 rounded-3xl border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-3 text-primary-foreground backdrop-blur-md transition hover:bg-primary-foreground/15"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-sm font-bold text-primary">
                {getUserInitial()}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold">
                  {getUserDisplayName()}
                </p>
                <p className="truncate text-xs text-primary-foreground/70">
                  {getRoleLabel(user?.role)}
                </p>
              </div>
              <ChevronDown
                size={18}
                className={`shrink-0 transition-transform duration-200 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showUserMenu && (
              <div className="mt-3 space-y-1 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-2 backdrop-blur-md">
                <Link
                  href="/workspace/employee/profile"
                  className="block rounded-xl px-3 py-2 text-sm text-primary-foreground/80 transition hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-destructive transition hover:bg-destructive/10"
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
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {getRoleLabel(user?.role)} Panel
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl transition hover:bg-muted">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl transition hover:bg-muted md:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
