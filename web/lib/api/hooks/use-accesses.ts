"use client"

import { useQuery } from "@tanstack/react-query"
import type {
  GetAccessesParams,
  GetAccessesResponse,
  GetAccessResponse,
} from "../types"

// ----------------------------------------------------------------------------
// Access Hooks
// ----------------------------------------------------------------------------

/**
 * Hook to fetch paginated list of accesses with optional filters
 */
export function useAccesses(params: GetAccessesParams = {}) {
  return useQuery({
    queryKey: ["accesses", params],
    queryFn: async (): Promise<GetAccessesResponse> => {
      const { getAccessesAction } = await import("../actions")
      return getAccessesAction(params)
    },
  })
}

/**
 * Hook to fetch a single access by ID
 */
export function useAccess(accessId: string | null) {
  return useQuery({
    queryKey: ["access", accessId],
    queryFn: async (): Promise<GetAccessResponse> => {
      if (!accessId) throw new Error("Access ID is required")
      const { getAccessAction } = await import("../actions")
      return getAccessAction(accessId)
    },
    enabled: !!accessId,
  })
}
