"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { gooeyToast } from "@/components/ui/goey-toaster";

const AuthContext = createContext(null);

// API Base URL from env
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://hrm.sardarit.cloud/api/v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Token management
  const setAuthToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("access_token", newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("access_token");
      setToken(null);
    }
  };

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return token;
  };

  // API request helper
  const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const authToken = getAuthToken();

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (
      authToken &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/refresh")
    ) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && authToken) {
        setAuthToken(null);
        setUser(null);

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/auth/login")
        ) {
          window.location.href = "/auth/login";
        }
      }

      const error = new Error(data.message || data.error || "Request failed");
      error.status = response.status;
      error.errors = data.errors;
      error.data = data;

      throw error;
    }

    return data;
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = getAuthToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/auth/me");
        if (data.status && data.data) {
          const userData = data.data;

          // Check if user is active
          if (userData.status !== "active") {
            setAuthToken(null);
            setUser(null);
            gooeyToast.warning("Account Pending", {
              description:
                "Your account is pending admin approval. Please wait.",
              duration: 5000,
            });
          } else {
            setUser(userData);
          }
        } else {
          setAuthToken(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.status && data.data) {
        const { access_token, user: userData } = data.data;

        setAuthToken(access_token);

        if (userData.status !== "active") {
          setAuthToken(null);
          gooeyToast.warning("Account Pending", {
            description: "Your account is pending admin approval.",
            duration: 5000,
          });
          return { success: false, error: "Account pending approval" };
        }

        const transformedUser = {
          id: userData.id,
          name: userData.full_name || userData.name,
          email: userData.email,
          role: userData.role,
          department: userData.department,
          designation: userData.designation,
          status: userData.status,
          employee_code: userData.employee_code,
          phone: userData.phone,
        };

        setUser(transformedUser);

        // gooeyToast.success('Login Successful!', {
        //   description: `Welcome back, ${transformedUser.name}!`,
        //   duration: 3000,
        // });

        return { success: true, user: transformedUser };
      }

      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      gooeyToast.error("Login Failed", {
        description: error.message,
        duration: 4000,
      });
      return { success: false, error: error.message };
    }
  };

  // Signup function - creates user as employee with inactive status
  const signup = async (userData) => {
    try {
      // Prepare data according to API documentation
      const payload = {
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone || "",
        password: userData.password,
        role: "employee",
        status: "inactive",
        department: userData.department || "General",
        designation: userData.designation || "Employee",
        joining_date:
          userData.joining_date || new Date().toISOString().split("T")[0],
      };

      // If employee_code is provided, add it
      if (userData.employee_code) {
        payload.employee_code = userData.employee_code;
      }

      const data = await apiRequest("/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (data.status) {
        gooeyToast.success("Registration Submitted!", {
          description:
            "Your account has been created. Admin will review and activate it soon.",
          duration: 5000,
          action: {
            label: "Go to Login",
            onClick: () => {},
            successLabel: "Redirecting...",
          },
        });

        return { success: true, user: data.data };
      }

      return { success: false, error: data.message || "Signup failed" };
    } catch (error) {
      gooeyToast.error("Registration Failed", {
        description: error.message,
        duration: 4000,
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (getAuthToken()) {
        await apiRequest("/auth/logout", { method: "POST" }).catch(() => {});
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthToken(null);
      setUser(null);
      gooeyToast.success("Logged Out", {
        description: "You have been successfully logged out.",
        duration: 3000,
      });
    }
    return { success: true };
  };

  // Update user (for admin approval)
  const updateUser = async (userId, userData) => {
    try {
      const data = await apiRequest(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });

      if (data.status) {
        // If updating current user, refresh user data
        if (user && user.id === userId) {
          const meData = await apiRequest("/auth/me");
          if (meData.status && meData.data) {
            setUser(meData.data);
          }
        }

        gooeyToast.success("User Updated", {
          description: "User information has been updated successfully.",
        });

        return { success: true, user: data.data };
      }

      return { success: false, error: data.message };
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  // Update user status (activate/inactivate)
  const updateUserStatus = async (userId, status) => {
    try {
      const data = await apiRequest(`/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      if (data.status) {
        gooeyToast.success("Status Updated", {
          description: `User status has been changed to ${status}.`,
        });
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      gooeyToast.error("Status Update Failed", {
        description: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  // Assign role to user
  const assignRole = async (userId, role) => {
    try {
      const data = await apiRequest("/roles/assign", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, role }),
      });

      if (data.status) {
        gooeyToast.success("Role Assigned", {
          description: `Role "${role}" has been assigned successfully.`,
        });
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      gooeyToast.error("Role Assignment Failed", {
        description: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  // Get all users (for admin)
  const getUsers = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const queryString = params.toString();
      const data = await apiRequest(
        `/users${queryString ? `?${queryString}` : ""}`,
      );

      return { success: true, users: data.data || [], meta: data.meta };
    } catch (error) {
      return { success: false, error: error.message, users: [] };
    }
  };

  // Get pending users (status = inactive)
  const getPendingUsers = async () => {
    return getUsers({ status: "inactive", role: "employee" });
  };

  // Approve user (activate + assign role)
  const approveUser = async (userId, role, additionalData = {}) => {
    try {
      // First activate the user
      await updateUserStatus(userId, "active");

      // Then assign role
      await assignRole(userId, role);

      // If additional data (department, designation, etc.) provided, update user
      if (Object.keys(additionalData).length > 0) {
        await updateUser(userId, additionalData);
      }

      gooeyToast.success("User Approved", {
        description: "User has been approved and can now login.",
      });

      return { success: true };
    } catch (error) {
      gooeyToast.error("Approval Failed", {
        description: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    signup,
    logout,
    updateUser,
    updateUserStatus,
    assignRole,
    getUsers,
    getPendingUsers,
    approveUser,
    apiRequest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
