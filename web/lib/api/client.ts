// ============================================================================
// API CLIENT - Client-side fetch wrapper (used by server actions internally)
// ============================================================================
// Note: This client is primarily used by server actions (lib/api/actions.ts).
// For client components, use the hooks from lib/api/hooks/

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

// ----------------------------------------------------------------------------
// API Client Class
// ----------------------------------------------------------------------------

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "") {
    this.baseUrl = baseUrl
  }

  // --------------------------------------------------------------------------
  // Access Endpoints
  // --------------------------------------------------------------------------

  async getAccesses(params: GetAccessesParams = {}): Promise<GetAccessesResponse> {
    const searchParams = new URLSearchParams()

    if (params.type) searchParams.set("type", params.type)
    if (params.search) searchParams.set("search", params.search)
    if (params.page) searchParams.set("page", String(params.page))
    if (params.pageSize) searchParams.set("pageSize", String(params.pageSize))

    const queryString = searchParams.toString()
    const endpoint = `/accesses${queryString ? `?${queryString}` : ""}`

    return this.get<GetAccessesResponse>(endpoint)
  }

  async getAccess(id: string): Promise<GetAccessResponse> {
    return this.get<GetAccessResponse>(`/accesses/${id}`)
  }

  // --------------------------------------------------------------------------
  // Request Endpoints
  // --------------------------------------------------------------------------

  async getRequests(
    params: { page?: number; pageSize?: number } = {}
  ): Promise<GetRequestsResponse> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.set("page", String(params.page))
    if (params.pageSize) searchParams.set("pageSize", String(params.pageSize))

    const queryString = searchParams.toString()
    const endpoint = `/requests${queryString ? `?${queryString}` : ""}`

    return this.get<GetRequestsResponse>(endpoint)
  }

  async getRequest(id: string): Promise<GetRequestResponse> {
    return this.get<GetRequestResponse>(`/requests/${id}`)
  }

  async createRequest(input: CreateRequestInput): Promise<CreateRequestResponse> {
    return this.post<CreateRequestResponse>("/requests", input)
  }

  async cancelRequest(id: string): Promise<CancelRequestResponse> {
    return this.patch<CancelRequestResponse>(`/requests/${id}`, { status: "cancelled" })
  }

  async addMoreInfo(id: string, input: AddMoreInfoInput): Promise<AddMoreInfoResponse> {
    return this.patch<AddMoreInfoResponse>(`/requests/${id}`, {
      status: "more_info",
      moreInfoMessage: input.message,
    })
  }

  // --------------------------------------------------------------------------
  // Admin Endpoints
  // --------------------------------------------------------------------------

  async getPendingRequests(): Promise<GetPendingRequestsResponse> {
    return this.get<GetPendingRequestsResponse>("/admin/pending")
  }

  async getAllRequests(
    params: { page?: number; pageSize?: number } = {}
  ): Promise<GetAllRequestsResponse> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.set("page", String(params.page))
    if (params.pageSize) searchParams.set("pageSize", String(params.pageSize))

    const queryString = searchParams.toString()
    const endpoint = `/admin/requests${queryString ? `?${queryString}` : ""}`

    return this.get<GetAllRequestsResponse>(endpoint)
  }

  async approveRequest(id: string): Promise<ApproveRequestResponse> {
    return this.post<ApproveRequestResponse>(`/requests/${id}/approve`, {})
  }

  async declineRequest(id: string, input: DeclineRequestInput): Promise<DeclineRequestResponse> {
    return this.post<DeclineRequestResponse>(`/requests/${id}/decline`, input)
  }

  async requestMoreInfo(
    id: string,
    input: RequestMoreInfoInput
  ): Promise<RequestMoreInfoResponse> {
    return this.post<RequestMoreInfoResponse>(`/requests/${id}/request-more-info`, input)
  }

  // --------------------------------------------------------------------------
  // Notification Endpoints
  // --------------------------------------------------------------------------

  async getNotifications(): Promise<GetNotificationsResponse> {
    return this.get<GetNotificationsResponse>("/notifications")
  }

  async markNotificationRead(id: string): Promise<MarkNotificationReadResponse> {
    return this.patch<MarkNotificationReadResponse>(`/notifications/${id}/read`, {})
  }

  async markAllNotificationsRead(): Promise<MarkAllNotificationsReadResponse> {
    return this.patch<MarkAllNotificationsReadResponse>("/notifications/read-all", {})
  }

  // --------------------------------------------------------------------------
  // Private HTTP Methods
  // --------------------------------------------------------------------------

  private async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  private async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  private async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    })
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
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
}

// Singleton instance
export const apiClient = new ApiClient()

// Named exports for convenience
export const {
  getAccesses,
  getAccess,
  getRequests,
  getRequest,
  createRequest,
  cancelRequest,
  addMoreInfo,
  getPendingRequests,
  getAllRequests,
  approveRequest,
  declineRequest,
  requestMoreInfo,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = apiClient
