import React from "react";
import { cookies } from "next/headers";
export default function CookieCheaker({ children }) {
      const cookieStore = await cookies();
  const token = cookieStore().has("auth_token");
  console.log("token", token);
  return <div>{children}</div>;
}
