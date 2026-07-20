import { baseApi } from "../baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query({
      query: () => "/dashboard/admin/stats",
      providesTags: ["Dashboard"],
    }),
    getDepartmentDistribution: builder.query({
      query: () => "/dashboard/admin/departments",
      providesTags: ["Dashboard"],
    }),
    getProjectStatus: builder.query({
      query: () => "/dashboard/admin/projects",
      providesTags: ["Dashboard"],
    }),
    getLeaveStatus: builder.query({
      query: () => "/dashboard/admin/leave",
      providesTags: ["Dashboard"],
    }),
    getRecentActivities: builder.query({
      query: () => "/dashboard/admin/activities",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetAdminDashboardStatsQuery,
  useGetDepartmentDistributionQuery,
  useGetProjectStatusQuery,
  useGetLeaveStatusQuery,
  useGetRecentActivitiesQuery,
} = dashboardApi;
