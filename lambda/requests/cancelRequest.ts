// ============================================================================
// cancelRequest - Cancel a pending request
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAuth } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import { getRequestById, updateRequestStatus } from "./dynamodb"
import { canCancelRequest, RequestStatus } from "../shared/dynamodb"
import type { CancelRequestResponse } from "../shared/types"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user = requireAuth(event)

    const requestId = event.pathParameters?.id

    if (!requestId) {
      return Errors.badRequest("Request ID is required")
    }

    // Get the existing request
    const existingRequest = await getRequestById(user.userId, requestId)

    if (!existingRequest) {
      return Errors.notFound(`Request not found: ${requestId}`)
    }

    // Check if request can be cancelled
    if (!canCancelRequest(existingRequest.status as "pending" | "more_info")) {
      return Errors.conflict(
        `Cannot cancel request with status: ${existingRequest.status}`
      )
    }

    // Update the request status
    const updatedRequest = await updateRequestStatus(
      user.userId,
      requestId,
      RequestStatus.CANCELLED
    )

    if (!updatedRequest) {
      return Errors.internalError("Failed to cancel request")
    }

    const response: CancelRequestResponse = {
      request: updatedRequest,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error cancelling request:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to cancel request"
    )
  }
}
