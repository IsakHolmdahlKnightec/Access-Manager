// ============================================================================
// API TYPES - TypeScript interfaces for all request/response types
// ============================================================================

// ----------------------------------------------------------------------------
// Access Types
// ----------------------------------------------------------------------------

export type AccessType = "kubernetes" | "aws" | "web_service" | "database"

export interface Access {
  id: string
  name: string
  type: AccessType
  description: string
  requirements?: string
  dependencies?: string[]
  createdAt: string
  updatedAt: string
}

export interface AccessListItem {
  id: string
  name: string
  type: AccessType
  description: string
}

export interface GetAccessesResponse {
  accesses: AccessListItem[]
  total: number
  page: number
  pageSize: number
}

export interface GetAccessResponse {
  access: Access
}

export interface GetAccessesParams {
  type?: AccessType
  search?: string
  page?: number
  pageSize?: number
}

// ----------------------------------------------------------------------------
// Request Types
// ----------------------------------------------------------------------------

export type RequestStatus =
  | "pending"
  | "approved"
  | "declined"
  | "cancelled"
  | "more_info"

export type RequestDuration = "permanent" | "30_days" | "90_days"

export interface AccessRequest {
  id: string
  accessId: string
  accessName: string
  accessType: AccessType
  userId: string
  userName: string
  userEmail: string
  status: RequestStatus
  justification: string
  duration: RequestDuration
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolutionNote?: string
  requestedMoreInfoMessage?: string
}

export interface CreateRequestInput {
  accessId: string
  justification: string
  duration: RequestDuration
}

export interface GetRequestsResponse {
  requests: AccessRequest[]
  total: number
  page: number
  pageSize: number
}

export interface GetRequestResponse {
  request: AccessRequest
}

export interface CreateRequestResponse {
  request: AccessRequest
}

export interface CancelRequestResponse {
  request: AccessRequest
}

export interface UpdateRequestInput {
  status?: "cancelled" | "more_info"
  moreInfoMessage?: string
}

// ----------------------------------------------------------------------------
// Admin Request Types
// ----------------------------------------------------------------------------

export interface GetPendingRequestsResponse {
  requests: AccessRequest[]
  total: number
}

export interface GetAllRequestsResponse {
  requests: AccessRequest[]
  total: number
  page: number
  pageSize: number
}

export interface ApproveRequestResponse {
  request: AccessRequest
}

export interface DeclineRequestInput {
  reason: string
}

export interface DeclineRequestResponse {
  request: AccessRequest
}

export interface RequestMoreInfoInput {
  message: string
}

export interface RequestMoreInfoResponse {
  request: AccessRequest
}

export interface AddMoreInfoInput {
  message: string
}

export interface AddMoreInfoResponse {
  request: AccessRequest
}

// ----------------------------------------------------------------------------
// Notification Types
// ----------------------------------------------------------------------------

export type NotificationType =
  | "request_submitted"
  | "request_approved"
  | "request_declined"
  | "request_more_info"
  | "new_pending_request"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  requestId?: string
  accessName?: string
  isRead: boolean
  createdAt: string
}

export interface GetNotificationsResponse {
  notifications: Notification[]
  total: number
  unreadCount: number
}

export interface MarkNotificationReadResponse {
  notification: Notification
}

export interface MarkAllNotificationsReadResponse {
  success: boolean
}

// ----------------------------------------------------------------------------
// API Error Types
// ----------------------------------------------------------------------------

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

// ----------------------------------------------------------------------------
// Common Types
// ----------------------------------------------------------------------------

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface ApiResponse<T> {
  data: T
  error?: never
}

export interface ApiErrorResponse {
  data?: never
  error: ApiError
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse
