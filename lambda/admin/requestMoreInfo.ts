// ============================================================================
// requestMoreInfo - Request additional information from requester (admin only)
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAdmin } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import {
  getRequestById,
  updateRequestStatus,
  createNotification,
  getAllRequests,
} from "../requests/dynamodb"
import { canRequestMoreInfo } from "../requests/statusValidation"
import { RequestStatus } from "../shared/dynamodb"
import type { RequestMoreInfoResponse } from "../shared/types"

// Notification type for more info request
const NOTIFICATION_TYPE_MORE_INFO = "request_more_info"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const admin = requireAdmin(event)

    const requestId = event.pathParameters?.id

    if (!requestId) {
      return Errors.badRequest("Request ID is required")
    }

    // Parse request body for the info request message
    if (!event.body) {
      return Errors.validationError("Message is required")
    }

    const body = JSON.parse(event.body)
    const { message } = body

    if (!message || message.trim().length === 0) {
      return Errors.validationError("Message is required")
    }

    // Get the existing request
    const { requests } = await getAllRequests(1, 100)
    const existingRequest = requests.find((r) => r.id === requestId)

    if (!existingRequest) {
      return Errors.notFound(`Request not found: ${requestId}`)
    }

    // Check if more info can be requested
    if (!canRequestMoreInfo(existingRequest.status as "pending")) {
      return Errors.conflict(
        `Cannot request more info for request with status: ${existingRequest.status}`
      )
    }

    // Update the request status to more_info
    const updatedRequest = await updateRequestStatus(
      existingRequest.userId,
      requestId,
      RequestStatus.MORE_INFO,
      {
        requestedMoreInfoMessage: message,
      }
    )

    if (!updatedRequest) {
      return Errors.internalError("Failed to request more info")
    }

    // Create notification for the requester
    await createNotification(
      existingRequest.userId,
      NOTIFICATION_TYPE_MORE_INFO,
      "More Information Needed",
      `Additional information is needed for your ${existingRequest.accessName} request. ${message}`,
      requestId,
      existingRequest.accessName
    )

    const response: RequestMoreInfoResponse = {
      request: updatedRequest,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error requesting more info:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
      if (error.message === "Forbidden") {
        return Errors.forbidden()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to request more info"
    )
  }
}
