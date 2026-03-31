// ============================================================================
// approveRequest - Approve a pending request (admin only)
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAdmin } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import {
  getRequestById,
  updateRequestStatus,
  addApproval,
  createNotification,
} from "../requests/dynamodb"
import { canApproveRequest, RequestStatus } from "../shared/dynamodb"
import type { ApproveRequestResponse } from "../shared/types"

// Notification type for request approval
const NOTIFICATION_TYPE_APPROVED = "request_approved"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const admin = requireAdmin(event)

    const requestId = event.pathParameters?.id

    if (!requestId) {
      return Errors.badRequest("Request ID is required")
    }

    // Get the existing request - we need to find it first
    // Since admin doesn't have USER# prefix, we need to search
    // In production, we'd have a GSI for this
    const { getAllRequests } = await import("../requests/dynamodb")
    const { requests } = await getAllRequests(1, 100)

    const existingRequest = requests.find((r) => r.id === requestId)

    if (!existingRequest) {
      return Errors.notFound(`Request not found: ${requestId}`)
    }

    // Check if request can be approved
    if (!canApproveRequest(existingRequest.status as "pending")) {
      return Errors.conflict(
        `Cannot approve request with status: ${existingRequest.status}`
      )
    }

    // Update the request status to approved
    const updatedRequest = await updateRequestStatus(
      existingRequest.userId,
      requestId,
      RequestStatus.APPROVED,
      {
        resolvedBy: admin.userId,
        resolutionNote: "Approved by admin",
      }
    )

    if (!updatedRequest) {
      return Errors.internalError("Failed to approve request")
    }

    // Add approval record
    await addApproval(
      requestId,
      admin.userId,
      admin.email,
      "approved"
    )

    // Create notification for the requester
    await createNotification(
      existingRequest.userId,
      NOTIFICATION_TYPE_APPROVED,
      "Request Approved",
      `Your request for ${existingRequest.accessName} has been approved.`,
      requestId,
      existingRequest.accessName
    )

    const response: ApproveRequestResponse = {
      request: updatedRequest,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error approving request:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
      if (error.message === "Forbidden") {
        return Errors.forbidden()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to approve request"
    )
  }
}
