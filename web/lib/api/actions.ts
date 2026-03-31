"use server"

import { auth } from "@/auth"
import type {
  GetAccessesParams,
  GetAccessesResponse,
  GetAccessResponse,
  GetRequestsResponse,
  GetRequestResponse,
  CreateRequestInput,
  CreateRequestResponse,
  CancelRequestResponse,
  GetPendingRequestsResponse,
  GetAllRequestsResponse,
  ApproveRequestResponse,
  DeclineRequestInput,
  DeclineRequestResponse,
  RequestMoreInfoInput,
  RequestMoreInfoResponse,
  AddMoreInfoInput,
  AddMoreInfoResponse,
  GetNotificationsResponse,
  MarkNotificationReadResponse,
  MarkAllNotificationsReadResponse,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// ----------------------------------------------------------------------------
// Server-side API helper
// ----------------------------------------------------------------------------

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await auth()
  const token = session?.accessToken

  if (!token) {
    throw new Error("Not authenticated")
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw {
      error: errorData.error || "API Error",
      message: errorData.message || response.statusText,
      statusCode: response.status,
    }
  }

  return response.json()
}

// ----------------------------------------------------------------------------
// Access Actions
// ----------------------------------------------------------------------------

export async function getAccessesAction(
  params: GetAccessesParams = {}
): Promise<GetAccessesResponse> {
  const searchParams = new URLSearchParams()

  if (params.type) searchParams.set("type", params.type)
  if (params.search) searchParams.set("search", params.search)
  if (params.page) searchParams.set("page", String(params.page))
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize))

  const queryString = searchParams.toString()
  const endpoint = `/accesses${queryString ? `?${queryString}` : ""}`

  return fetchApi<GetAccessesResponse>(endpoint)
}

export async function getAccessAction(id: string): Promise<GetAccessResponse> {
  return fetchApi<GetAccessResponse>(`/accesses/${id}`)
}

// ----------------------------------------------------------------------------
// Request Actions
// ----------------------------------------------------------------------------

export async function getRequestsAction(
  params: { page?: number; pageSize?: number } = {}
): Promise<GetRequestsResponse> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set("page", String(params.page))
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize))

  const queryString = searchParams.toString()
  const endpoint = `/requests${queryString ? `?${queryString}` : ""}`

  return fetchApi<GetRequestsResponse>(endpoint)
}

export async function getRequestAction(id: string): Promise<GetRequestResponse> {
  return fetchApi<GetRequestResponse>(`/requests/${id}`)
}

export async function createRequestAction(
  input: CreateRequestInput
): Promise<CreateRequestResponse> {
  return fetchApi<CreateRequestResponse>("/requests", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function cancelRequestAction(
  id: string
): Promise<CancelRequestResponse> {
  return fetchApi<CancelRequestResponse>(`/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "cancelled" }),
  })
}

export async function addMoreInfoAction(
  id: string,
  input: AddMoreInfoInput
): Promise<AddMoreInfoResponse> {
  return fetchApi<AddMoreInfoResponse>(`/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "more_info", moreInfoMessage: input.message }),
  })
}

// ----------------------------------------------------------------------------
// Admin Actions
// ----------------------------------------------------------------------------

export async function getPendingRequestsAction(): Promise<GetPendingRequestsResponse> {
  return fetchApi<GetPendingRequestsResponse>("/admin/pending")
}

export async function getAllRequestsAction(
  params: { page?: number; pageSize?: number } = {}
): Promise<GetAllRequestsResponse> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set("page", String(params.page))
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize))

  const queryString = searchParams.toString()
  const endpoint = `/admin/requests${queryString ? `?${queryString}` : ""}`

  return fetchApi<GetAllRequestsResponse>(endpoint)
}

export async function approveRequestAction(
  id: string
): Promise<ApproveRequestResponse> {
  return fetchApi<ApproveRequestResponse>(`/requests/${id}/approve`, {
    method: "POST",
  })
}

export async function declineRequestAction(
  id: string,
  input: DeclineRequestInput
): Promise<DeclineRequestResponse> {
  return fetchApi<DeclineRequestResponse>(`/requests/${id}/decline`, {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function requestMoreInfoAction(
  id: string,
  input: RequestMoreInfoInput
): Promise<RequestMoreInfoResponse> {
  return fetchApi<RequestMoreInfoResponse>(`/requests/${id}/request-more-info`, {
    method: "POST",
    body: JSON.stringify(input),
  })
}

// ----------------------------------------------------------------------------
// Notification Actions
// ----------------------------------------------------------------------------

export async function getNotificationsAction(): Promise<GetNotificationsResponse> {
  return fetchApi<GetNotificationsResponse>("/notifications")
}

export async function markNotificationReadAction(
  id: string
): Promise<MarkNotificationReadResponse> {
  return fetchApi<MarkNotificationReadResponse>(`/notifications/${id}/read`, {
    method: "PATCH",
  })
}

export async function markAllNotificationsReadAction(): Promise<MarkAllNotificationsReadResponse> {
  return fetchApi<MarkAllNotificationsReadResponse>("/notifications/read-all", {
    method: "PATCH",
  })
}
