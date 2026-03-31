// ============================================================================
// addMoreInfo - Add additional information to a request in more_info status
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAuth } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import { getRequestById, updateRequestStatus } from "./dynamodb"
import { canAddMoreInfo } from "./statusValidation"
import { RequestStatus } from "../shared/dynamodb"
import type { AddMoreInfoResponse } from "../shared/types"

const MIN_JUSTIFICATION_LENGTH = 10

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user = requireAuth(event)

    const requestId = event.pathParameters?.id

    if (!requestId) {
      return Errors.badRequest("Request ID is required")
    }

    // Parse request body
    if (!event.body) {
      return Errors.badRequest("Request body is required")
    }

    const body = JSON.parse(event.body)
    const { message } = body

    if (!message || message.length < MIN_JUSTIFICATION_LENGTH) {
      return Errors.validationError(
        `Message must be at least ${MIN_JUSTIFICATION_LENGTH} characters`
      )
    }

    // Get the existing request
    const existingRequest = await getRequestById(user.userId, requestId)

    if (!existingRequest) {
      return Errors.notFound(`Request not found: ${requestId}`)
    }

    // Check if request is in more_info status
    if (!canAddMoreInfo(existingRequest.status as "more_info")) {
      return Errors.conflict(
        `Cannot add more info to request with status: ${existingRequest.status}`
      )
    }

    // Append the new justification to existing
    const updatedJustification = `${existingRequest.justification}\n\n[Additional Info]: ${message}`

    // Update the request status back to pending
    const updatedRequest = await updateRequestStatus(
      user.userId,
      requestId,
      RequestStatus.PENDING,
      {
        justification: updatedJustification,
        requestedMoreInfoMessage: "", // Clear the more info request message
      }
    )

    if (!updatedRequest) {
      return Errors.internalError("Failed to add more info")
    }

    const response: AddMoreInfoResponse = {
      request: updatedRequest,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error adding more info:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to add more info"
    )
  }
}
