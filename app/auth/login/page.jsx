"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { CreepyButton } from "@/components/ui/creepy-button";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

// Demo credentials - only in development
const DEMO_CREDENTIALS = process.env.NODE_ENV === "development" ? [
  {
    email: "superadmin@company.com",
    password: "password",
    role: "super_admin",
    name: "Super Admin",
  },
  {
    email: "admin@hrms.com",
    password: "admin123",
    role: "admin",
    name: "Admin User",
  },
  {
    email: "hr@hrms.com",
    password: "hr123",
    role: "hr_manager",
    name: "HR Manager",
  },
  {
    email: "head@hrms.com",
    password: "head123",
    role: "dept_head",
    name: "Department Head",
  },
  {
    email: "manager@hrms.com",
    password: "manager123",
    role: "manager",
    name: "Team Manager",
  },
  {
    email: "employee@hrms.com",
    password: "emp123",
    role: "employee",
    name: "Employee",
  },
] : [];

// Role based redirects
const ROLE_ROUTES = {
  super_admin: "/workspace/admin/dashboard",
  admin: "/workspace/admin/dashboard",
  general_manager: "/workspace/gm/dashboard",
  project_manager: "/workspace/manager/dashboard",
  team_leader: "/workspace/leader/dashboard",
  employee: "/workspace/employee/dashboard",
  hr_manager: "/workspace/hr/dashboard",
  manager: "/workspace/manager/dashboard",
  dept_head: "/workspace/leader/dashboard",
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      gooeyToast.error("Missing Fields", {
        description: "Please enter both email and password.",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success && result.user) {
        const userRole = result.user.role;
        const redirectPath = ROLE_ROUTES[userRole] || "/workspace/employee/dashboard";
        
        gooeyToast.success("Login Successful!", {
          description: `Welcome back, ${result.user.full_name || result.user.name || "User"}!`,
          duration: 2500,
        });

        setTimeout(() => {
          router.push(redirectPath);
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (credentials) => {
    setEmail(credentials.email);
    setPassword(credentials.password);

    gooeyToast.info("Demo Credentials Loaded", {
      description: `You can now login as ${credentials.role.replace(/_/g, " ")}`,
      duration: 2000,
    });
  };

  const showDemoCredentials = isMounted && DEMO_CREDENTIALS.length > 0;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Left Panel - Login Form (Improved UI) */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header with icon */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Sign in to access your HRMS dashboard
            </p>
          </div>

          {/* Main Card - Modern with glass effect */}
          <Card className="border border-gray-200 shadow-2xl shadow-primary/5 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1D3A88] via-accent to-[#1D3A88]"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail size={14} className="text-muted-foreground" />
                    Email Address
                  </Label>
                  <div className={`relative transition-all duration-200 ${emailFocused ? 'scale-[1.01]' : ''}`}>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="admin@company.com"
                      autoComplete="email"
                      disabled={loading}
                      className="h-12 pl-4 pr-4 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock size={14} className="text-muted-foreground" />
                    Password
                  </Label>
                  <div className={`relative transition-all duration-200 ${passwordFocused ? 'scale-[1.01]' : ''}`}>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-12 pl-4 pr-12 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent/10"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1 group"
                  >
                    Forgot password?
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Submit Button - Matching Signup Page */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 cursor-pointer bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent transition-all duration-300 group"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2 group-hover:gap-3 transition-all">
                      Sign In <ArrowRight size={18} />
                    </span>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white/90 dark:bg-slate-900/90 text-muted-foreground">
                      Secure Login
                    </span>
                  </div>
                </div>

                {/* Signup Link */}
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-accent hover:text-accent/80 font-semibold hover:underline transition-all inline-flex items-center gap-1 group"
                  >
                    Create account
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Demo Credentials - Development Only (Improved styling) */}
          {showDemoCredentials && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/90 dark:bg-slate-900/90 text-muted-foreground">
                    🧪 Demo Access
                  </span>
                </div>
              </div>
              
              <Card className="mt-4 border-2 border-dashed border-blue-200 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 rounded-xl">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                    <Sparkles size={12} />
                    Quick Demo Login (Development Only)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_CREDENTIALS.map((cred, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDemoCredentials(cred)}
                        className="text-left px-3 py-2 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                      >
                        <span className="font-semibold">
                          {cred.role.replace(/_/g, " ")}
                        </span>
                        <br />
                        <span className="text-[10px] opacity-75">{cred.email}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Branding (COMPLETELY UNCHANGED - Exactly as original) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary/90 to-blue-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content - Keep original layout */}
        <div className="relative z-10 text-center max-w-md">
          {/* Creepy Logo - Exactly as original */}
          <div className="mb-8 flex items-center justify-center">
            <CreepyButton
              className="bg-[#242424] hover:bg-[#000000] px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:rotate-[-8deg]"
            >
              <Image
                src={logo}
                alt="Sardar IT Logo"
                width={180}
                height={80}
                className="select-none"
                priority
              />
            </CreepyButton>
          </div>

          {/* Description - Exactly as original */}
          <p className="text-blue-100 text-lg leading-relaxed">
            Streamline your HR operations with our comprehensive employee
            management platform. Track attendance, manage leaves, and grow your
            team efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}