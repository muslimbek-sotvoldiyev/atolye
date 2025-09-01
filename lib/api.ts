import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// API base configuration
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/",
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = localStorage.getItem("authToken")
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Material", "Transfer", "Workshop", "TimeTracking", "Notification", "History"],
  endpoints: (builder) => ({
    // Materials
    getMaterials: builder.query({
      query: () => "materials/",
      providesTags: ["Material"],
    }),

    // Transfers
    getTransfers: builder.query({
      query: (params) => ({
        url: "transfers/",
        params,
      }),
      providesTags: ["Transfer"],
    }),
    createTransfer: builder.mutation({
      query: (transfer) => ({
        url: "transfers/",
        method: "POST",
        body: transfer,
      }),
      invalidatesTags: ["Transfer", "Material"],
    }),
    confirmTransfer: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `transfers/${id}/confirm/`,
        method: "POST",
        body: patch,
      }),
      invalidatesTags: ["Transfer", "Notification"],
    }),
    getTransferHistory: builder.query({
      query: (params) => ({
        url: "transfers/history/",
        params: {
          ...params,
          page: params.page || 1,
          page_size: params.pageSize || 10,
        },
      }),
      providesTags: ["History"],
    }),
    getHistoryStats: builder.query({
      query: (params) => ({
        url: "transfers/history/stats/",
        params,
      }),
      providesTags: ["History"],
    }),
    exportTransferHistory: builder.mutation({
      query: (params) => ({
        url: "transfers/history/export/",
        method: "POST",
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Workshops
    getWorkshops: builder.query({
      query: () => "workshops/",
      providesTags: ["Workshop"],
    }),
    createWorkshop: builder.mutation({
      query: (workshop) => ({
        url: "workshops/",
        method: "POST",
        body: workshop,
      }),
      invalidatesTags: ["Workshop"],
    }),

    // Time Tracking
    getTimeTracking: builder.query({
      query: (params) => ({
        url: "time-tracking/",
        params,
      }),
      providesTags: ["TimeTracking"],
    }),
    startTimer: builder.mutation({
      query: (timer) => ({
        url: "time-tracking/start/",
        method: "POST",
        body: timer,
      }),
      invalidatesTags: ["TimeTracking"],
    }),
    stopTimer: builder.mutation({
      query: (id) => ({
        url: `time-tracking/${id}/stop/`,
        method: "POST",
      }),
      invalidatesTags: ["TimeTracking"],
    }),

    // Notifications
    getNotifications: builder.query({
      query: () => "notifications/",
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/read/`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Dashboard Stats
    getDashboardStats: builder.query({
      query: () => "dashboard/stats/",
    }),
  }),
})

export const {
  useGetMaterialsQuery,
  useGetTransfersQuery,
  useCreateTransferMutation,
  useConfirmTransferMutation,
  useGetWorkshopsQuery,
  useCreateWorkshopMutation,
  useGetTimeTrackingQuery,
  useStartTimerMutation,
  useStopTimerMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetDashboardStatsQuery,
  useGetTransferHistoryQuery,
  useGetHistoryStatsQuery,
  useExportTransferHistoryMutation,
} = api
