// ============================================================================
// declineRequest - Decline a pending request (admin only)
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAdmin } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import {
  getRequestById,
  updateRequestStatus,
  addApproval,
  createNotification,
  getAllRequests,
} from "../requests/dynamodb"
import { canDeclineRequest } from "../requests/statusValidation"
import { RequestStatus } from "../shared/dynamodb"
import type { DeclineRequestResponse } from "../shared/types"

// Notification type for request decline
const NOTIFICATION_TYPE_DECLINED = "request_declined"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const admin = requireAdmin(event)

    const requestId = event.pathParameters?.id

    if (!requestId) {
      return Errors.badRequest("Request ID is required")
    }

    // Parse request body for decline reason
    if (!event.body) {
      return Errors.validationError("Decline reason is required")
    }

    const body = JSON.parse(event.body)
    const { reason } = body

    if (!reason || reason.trim().length === 0) {
      return Errors.validationError("Decline reason is required")
    }

    // Get the existing request
    const { requests } = await getAllRequests(1, 100)
    const existingRequest = requests.find((r) => r.id === requestId)

    if (!existingRequest) {
      return Errors.notFound(`Request not found: ${requestId}`)
    }

    // Check if request can be declined
    if (!canDeclineRequest(existingRequest.status as "pending")) {
      return Errors.conflict(
        `Cannot decline request with status: ${existingRequest.status}`
      )
    }

    // Update the request status to declined
    const updatedRequest = await updateRequestStatus(
      existingRequest.userId,
      requestId,
      RequestStatus.DECLINED,
      {
        resolvedBy: admin.userId,
        resolutionNote: reason,
      }
    )

    if (!updatedRequest) {
      return Errors.internalError("Failed to decline request")
    }

    // Add approval record
    await addApproval(
      requestId,
      admin.userId,
      admin.email,
      "declined",
      reason
    )

    // Create notification for the requester
    await createNotification(
      existingRequest.userId,
      NOTIFICATION_TYPE_DECLINED,
      "Request Declined",
      `Your request for ${existingRequest.accessName} has been declined. Reason: ${reason}`,
      requestId,
      existingRequest.accessName
    )

    const response: DeclineRequestResponse = {
      request: updatedRequest,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error declining request:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
      if (error.message === "Forbidden") {
        return Errors.forbidden()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to decline request"
    )
  }
}
