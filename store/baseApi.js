import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const tagTypes = ["User", "Auth", "Project", "Task", "Invoice", "Department"];

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: tagTypes,
  endpoints: () => ({}),
});
