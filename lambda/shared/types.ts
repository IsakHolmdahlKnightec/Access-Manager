// ============================================================================
// Lambda Function Types
// ============================================================================

import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda"

// ----------------------------------------------------------------------------
// Access Types
// ----------------------------------------------------------------------------

export interface Access {
  id: string
  name: string
  type: string
  description: string
  requirements?: string
  dependencies?: string[]
  createdAt: string
  updatedAt: string
}

export interface AccessListItem {
  id: string
  name: string
  type: string
  description: string
}

// ----------------------------------------------------------------------------
// Request Types
// ----------------------------------------------------------------------------

export interface AccessRequest {
  id: string
  accessId: string
  accessName: string
  accessType: string
  userId: string
  userName: string
  userEmail: string
  status: string
  justification: string
  duration: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolutionNote?: string
  requestedMoreInfoMessage?: string
}

export interface Approval {
  id: string
  requestId: string
  adminId: string
  adminEmail: string
  action: string
  reason?: string
  timestamp: string
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  requestId?: string
  accessName?: string
  isRead: boolean
  createdAt: string
}

// ----------------------------------------------------------------------------
// API Response Types
// ----------------------------------------------------------------------------

export interface GetAccessesResponse {
  accesses: AccessListItem[]
  total: number
  page: number
  pageSize: number
}

export interface GetAccessResponse {
  access: Access
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

export interface DeclineRequestResponse {
  request: AccessRequest
}

export interface RequestMoreInfoResponse {
  request: AccessRequest
}

export interface AddMoreInfoResponse {
  request: AccessRequest
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
// Error Response
// ----------------------------------------------------------------------------

export interface ErrorResponse {
  error: string
  message: string
  statusCode: number
}

// ----------------------------------------------------------------------------
// Lambda Handler Types
// ----------------------------------------------------------------------------

export type LambdaHandler<T = unknown> = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>

export interface AuthenticatedUser {
  userId: string
  email: string
  name: string
  role?: string
}

// ----------------------------------------------------------------------------
// Cognito User Payload (from JWT)
// ----------------------------------------------------------------------------

export interface CognitoUser {
  sub: string
  email?: string
  name?: string
  "custom:access-manager-role"?: string
  [key: string]: unknown
}
