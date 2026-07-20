import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const tagTypes = [
  "User",
  "Auth",
  "Project",
  "Task",
  "Invoice",
  "Department",
  "Dashboard",
];

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: tagTypes,
  endpoints: () => ({}),
});
