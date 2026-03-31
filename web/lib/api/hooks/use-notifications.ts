"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  GetNotificationsResponse,
  MarkNotificationReadResponse,
  MarkAllNotificationsReadResponse,
} from "../types"

// ----------------------------------------------------------------------------
// Notification Hooks
// ----------------------------------------------------------------------------

/**
 * Hook to fetch user's notifications
 */
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<GetNotificationsResponse> => {
      const { getNotificationsAction } = await import("../actions")
      return getNotificationsAction()
    },
    refetchInterval: 5000, // Poll every 5 seconds as per spec
  })
}

/**
 * Hook to mark a single notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      notificationId: string
    ): Promise<MarkNotificationReadResponse> => {
      const { markNotificationReadAction } = await import("../actions")
      return markNotificationReadAction(notificationId)
    },
    onSuccess: () => {
      // Invalidate notifications to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<MarkAllNotificationsReadResponse> => {
      const { markAllNotificationsReadAction } = await import("../actions")
      return markAllNotificationsReadAction()
    },
    onSuccess: () => {
      // Invalidate notifications to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
