"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";

import logo from "../../../public/logo.png";

import { cn } from "@/lib/utils";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { HexagonPattern } from "@/components/ui/hexagon-pattern";
import { BorderBeam } from "@/components/ui/border-beam";

import {
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Loader2,
} from "lucide-react";
import { HiOutlineShieldCheck } from "react-icons/hi2";

const signupSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long")
      .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    const payload = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: "employee",
      status: "inactive",
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok && result.status) {
        gooeyToast.success("Registration Successful!", {
          description:
            "Your account has been created. Please wait for admin approval to login.",
          duration: 5000,
          action: {
            label: "Go to Login",
            onClick: () => router.push("/auth/login"),
            successLabel: "Redirecting...",
          },
        });

        reset();

        setTimeout(() => {
          router.push("/auth/login?pending=true");
        }, 3000);
      } else {
        throw new Error(
          result.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      gooeyToast.error("Registration Failed", {
        description: error.message || "Something went wrong. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Left Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Create your HRMS account to get started
            </p>
          </div>

          <Card className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-primary/10">
            <BorderBeam
              size={260}
              duration={10}
              colorFrom="#2563EB"
              colorTo="#38BDF8"
            />

            <BorderBeam
              size={260}
              duration={10}
              delay={5}
              colorFrom="#38BDF8"
              colorTo="#2563EB"
            />

            <CardContent className="relative z-10 p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="full_name"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <User size={14} className="text-muted-foreground" />
                    Full Name <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    {...register("full_name")}
                    disabled={isLoading}
                    className="h-12 border border-gray-200 rounded-xl bg-white/70 dark:bg-slate-800/70 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                  />

                  {errors.full_name && (
                    <p className="text-xs text-red-500">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Mail size={14} className="text-muted-foreground" />
                    Email Address <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    {...register("email")}
                    disabled={isLoading}
                    className="h-12 border border-gray-200 rounded-xl bg-white/70 dark:bg-slate-800/70 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                  />

                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Phone size={14} className="text-muted-foreground" />
                    Phone Number <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="phone"
                    placeholder="017XXXXXXXX"
                    {...register("phone")}
                    disabled={isLoading}
                    className="h-12 border border-gray-200 rounded-xl bg-white/70 dark:bg-slate-800/70 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                  />

                  {errors.phone && (
                    <p className="text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Lock size={14} className="text-muted-foreground" />
                    Password <span className="text-red-500">*</span>
                  </Label>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...register("password")}
                      disabled={isLoading}
                      className="h-12 pr-12 border border-gray-200 rounded-xl bg-white/70 dark:bg-slate-800/70 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent/10 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Must contain uppercase, lowercase, and number
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Lock size={14} className="text-muted-foreground" />
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...register("confirmPassword")}
                      disabled={isLoading}
                      className="h-12 pr-12 border border-gray-200 rounded-xl bg-white/70 dark:bg-slate-800/70 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent/10 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 mt-2 cursor-pointer bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent transition-all duration-300 group disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2 group-hover:gap-3 transition-all">
                      Sign Up <ArrowRight size={18} />
                    </span>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white/90 dark:bg-slate-900/90 text-muted-foreground">
                      HR Approval Required
                    </span>
                  </div>
                </div>

                {/* Login Link */}
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-accent hover:text-accent/80 font-semibold hover:underline transition-all inline-flex items-center gap-1 group"
                  >
                    Sign in
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary/90 to-blue-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 items-center justify-center p-12 relative overflow-hidden">
        <HexagonPattern
          hexagons={[
            [1, 1],
            [4, 4],
            [2, 2],
            [3, 4],
            [5, 4],
            [8, 2],
            [6, 3],
            [8, 5],
            [10, 10],
            [11, 3],
            [12, 6],
            [14, 4],
          ]}
          className={cn(
            "absolute inset-0 z-0 text-white/10",
            "[mask-image:radial-gradient(520px_circle_at_center,white,transparent)]",
            "skew-y-6"
          )}
        />

        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div
            className="mb-4 flex items-center justify-center"
            onContextMenu={(e) => e.preventDefault()}
          >
            <Image
              src={logo}
              alt="Sardar IT Logo"
              width={250}
              height={80}
              className="select-none pointer-events-none"
              draggable={false}
              priority
            />
          </div>

          <h2 className="text-2xl font-semibold text-white mb-2 select-none pointer-events-none">
            Join Our HRMS Platform
          </h2>

          <p className="text-blue-100 text-sm select-none pointer-events-none">
            Create your account to continue
          </p>

          <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 select-none pointer-events-none">
            <p className="text-white/90 text-sm">
              <HiOutlineShieldCheck className="inline text-cyan-300 text-lg mr-1" />
              Your account will be reviewed by HR before activation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}