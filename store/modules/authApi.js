import { baseApi } from "../baseApi";
import { loginSuccess } from "../authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data.data.user);
          dispatch(
            loginSuccess({
              token: data.data.access_token,
              user: data.data.user,
            }),
          );
        } catch (error) {}
      },
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
  }),

  overrideExisting: false,
});

export const { useLoginMutation, useGetMeQuery, useSignupMutation } = authApi;
