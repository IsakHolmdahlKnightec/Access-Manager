"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  GetPendingRequestsResponse,
  GetAllRequestsResponse,
  ApproveRequestResponse,
  DeclineRequestInput,
  DeclineRequestResponse,
  RequestMoreInfoInput,
  RequestMoreInfoResponse,
} from "../types"

// ----------------------------------------------------------------------------
// Admin Hooks
// ----------------------------------------------------------------------------

/**
 * Hook to fetch list of pending requests for admin
 */
export function usePendingRequests() {
  return useQuery({
    queryKey: ["admin", "pendingRequests"],
    queryFn: async (): Promise<GetPendingRequestsResponse> => {
      const { getPendingRequestsAction } = await import("../actions")
      return getPendingRequestsAction()
    },
  })
}

/**
 * Hook to fetch all requests for admin (with pagination)
 */
export function useAllRequests(params: { page?: number; pageSize?: number } = {}) {
  return useQuery({
    queryKey: ["admin", "allRequests", params],
    queryFn: async (): Promise<GetAllRequestsResponse> => {
      const { getAllRequestsAction } = await import("../actions")
      return getAllRequestsAction(params)
    },
  })
}

/**
 * Hook to approve a request
 */
export function useApproveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      requestId: string
    ): Promise<ApproveRequestResponse> => {
      const { approveRequestAction } = await import("../actions")
      return approveRequestAction(requestId)
    },
    onSuccess: () => {
      // Invalidate admin queries and user requests
      queryClient.invalidateQueries({ queryKey: ["admin"] })
      queryClient.invalidateQueries({ queryKey: ["requests"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

/**
 * Hook to decline a request
 */
export function useDeclineRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      requestId,
      input,
    }: {
      requestId: string
      input: DeclineRequestInput
    }): Promise<DeclineRequestResponse> => {
      const { declineRequestAction } = await import("../actions")
      return declineRequestAction(requestId, input)
    },
    onSuccess: () => {
      // Invalidate admin queries and user requests
      queryClient.invalidateQueries({ queryKey: ["admin"] })
      queryClient.invalidateQueries({ queryKey: ["requests"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

/**
 * Hook to request more info from a requester
 */
export function useRequestMoreInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      requestId,
      input,
    }: {
      requestId: string
      input: RequestMoreInfoInput
    }): Promise<RequestMoreInfoResponse> => {
      const { requestMoreInfoAction } = await import("../actions")
      return requestMoreInfoAction(requestId, input)
    },
    onSuccess: () => {
      // Invalidate admin queries and user requests
      queryClient.invalidateQueries({ queryKey: ["admin"] })
      queryClient.invalidateQueries({ queryKey: ["requests"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
