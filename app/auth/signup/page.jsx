"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Building2,
  Users,
  Clock,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { HiOutlineShieldCheck } from "react-icons/hi2";

// Validation Schema
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
        },
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
          result.message || "Registration failed. Please try again.",
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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Left Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Form Card */}
          <Card className="border border-gray-200 shadow-2xl shadow-primary/5 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    {...register("full_name")}
                    className="border border-gray-200 h-11 transition-all duration-200 focus:ring-2 focus:ring-accent/20"
                    disabled={isLoading}
                  />
                  {errors.full_name && (
                    <p className="text-xs text-red-500">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    {...register("email")}
                    className="border border-gray-200 h-11 transition-all duration-200 focus:ring-2 focus:ring-accent/20"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1 234 567 8900"
                    {...register("phone")}
                    className="border border-gray-200 h-11 transition-all duration-200 focus:ring-2 focus:ring-accent/20"
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...register("password")}
                      className="border border-gray-200 h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-accent/20"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                    className="text-sm font-medium"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...register("confirmPassword")}
                      className="border border-gray-200 h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-accent/20"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                  className="w-full h-11 mt-2 cursor-pointer bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent transition-all duration-300 group"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2 group-hover:gap-3 transition-all">
                      Sign Up <ArrowRight size={18} />
                    </span>
                  )}
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-accent hover:text-accent/80 font-medium hover:underline transition-all"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Branding Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary/90 to-blue-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

          {/* Floating Elements */}
          <div
            className="absolute top-20 left-10"
            style={{ animation: "float 6s ease-in-out infinite" }}
          >
            <div className="w-12 h-12 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <Users className="text-white/60" size={24} />
            </div>
          </div>
          <div
            className="absolute bottom-20 right-10"
            style={{ animation: "float-delayed 8s ease-in-out infinite" }}
          >
            <div className="w-12 h-12 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <Clock className="text-white/60" size={24} />
            </div>
          </div>
          <div
            className="absolute top-1/2 left-10"
            style={{ animation: "float-slow 10s ease-in-out infinite" }}
          >
            <div className="w-10 h-10 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <Shield className="text-white/60" size={20} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={160}
                className="relative brightness-0 invert"
              />
            </div>
          </div>

          {/* <h2 className="text-4xl font-bold text-white mb-4">
            Streamline Your<br />HR Operations
          </h2> */}

          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Join Sardar IT HRMS and experience the future of workforce
            management. Smart, efficient, and built for modern organizations.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
              <Building2 className="text-white/70 mx-auto mb-2" size={24} />
              <p className="text-white text-sm font-medium">Enterprise Ready</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
              <Users className="text-white/70 mx-auto mb-2" size={24} />
              <p className="text-white text-sm font-medium">Team Management</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
              <Clock className="text-white/70 mx-auto mb-2" size={24} />
              <p className="text-white text-sm font-medium">Smart Attendance</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
              <Shield className="text-white/70 mx-auto mb-2" size={24} />
              <p className="text-white text-sm font-medium">Secure Platform</p>
            </div>
          </div>

          {/* Approval Notice */}
          <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <p className="text-white/90 text-sm">
              <HiOutlineShieldCheck className="inline text-cyan-300 text-lg mr-1" />
              After registration, your account will be reviewed by HR.
              <br />
              <span className="text-white/60 text-xs">
                You'll receive an email once approved.
              </span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
