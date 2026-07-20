"use client";

import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "@/store/modules/authApi";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { ROLE_ROUTES } from "@/lib/_mock/redirect_point";
export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { data, isSuccess, isError, isLoading } = useGetMeQuery(undefined);
  const router = useRouter();
  const isAuth = hasCookie("is_authenticated");
  console.log("is_authenticated cookie:", isAuth);

  useLayoutEffect(() => {
    if (data) {
      // console.log("User data:", data.data);
      const destination =
        ROLE_ROUTES[data?.data?.role] || "/workspace/admin/dashboard";
      router.push(destination);
    } else {
      router.push("/auth/login");
    }
  }, [isSuccess, isError, data, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
