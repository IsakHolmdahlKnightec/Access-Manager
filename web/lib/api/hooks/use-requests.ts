"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  GetRequestsResponse,
  GetRequestResponse,
  CreateRequestInput,
  CreateRequestResponse,
  CancelRequestResponse,
  AddMoreInfoInput,
  AddMoreInfoResponse,
} from "../types"

// ----------------------------------------------------------------------------
// Request Hooks
// ----------------------------------------------------------------------------

/**
 * Hook to fetch paginated list of user's requests
 */
export function useRequests(params: { page?: number; pageSize?: number } = {}) {
  return useQuery({
    queryKey: ["requests", params],
    queryFn: async (): Promise<GetRequestsResponse> => {
      const { getRequestsAction } = await import("../actions")
      return getRequestsAction(params)
    },
  })
}

/**
 * Hook to fetch a single request by ID
 */
export function useRequest(requestId: string | null) {
  return useQuery({
    queryKey: ["request", requestId],
    queryFn: async (): Promise<GetRequestResponse> => {
      if (!requestId) throw new Error("Request ID is required")
      const { getRequestAction } = await import("../actions")
      return getRequestAction(requestId)
    },
    enabled: !!requestId,
  })
}

/**
 * Hook to create a new access request
 */
export function useCreateRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      input: CreateRequestInput
    ): Promise<CreateRequestResponse> => {
      const { createRequestAction } = await import("../actions")
      return createRequestAction(input)
    },
    onSuccess: () => {
      // Invalidate requests list to refetch
      queryClient.invalidateQueries({ queryKey: ["requests"] })
    },
  })
}

/**
 * Hook to cancel a pending request
 */
export function useCancelRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      requestId: string
    ): Promise<CancelRequestResponse> => {
      const { cancelRequestAction } = await import("../actions")
      return cancelRequestAction(requestId)
    },
    onSuccess: (_, requestId) => {
      // Invalidate the specific request and the list
      queryClient.invalidateQueries({ queryKey: ["requests"] })
      queryClient.invalidateQueries({ queryKey: ["request", requestId] })
    },
  })
}

/**
 * Hook to add more information to a request
 */
export function useAddMoreInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      requestId,
      input,
    }: {
      requestId: string
      input: AddMoreInfoInput
    }): Promise<AddMoreInfoResponse> => {
      const { addMoreInfoAction } = await import("../actions")
      return addMoreInfoAction(requestId, input)
    },
    onSuccess: (_, { requestId }) => {
      // Invalidate the specific request and the list
      queryClient.invalidateQueries({ queryKey: ["requests"] })
      queryClient.invalidateQueries({ queryKey: ["request", requestId] })
    },
  })
}
