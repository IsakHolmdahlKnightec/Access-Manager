// ============================================================================
// createRequest - Create a new access request
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAuth } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import { createRequest, createNotification } from "./dynamodb"
import type { CreateRequestResponse } from "../shared/types"

// Minimum justification length
const MIN_JUSTIFICATION_LENGTH = 10

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user = requireAuth(event)

    // Parse request body
    if (!event.body) {
      return Errors.badRequest("Request body is required")
    }

    const body = JSON.parse(event.body)
    const { accessId, accessName, accessType, justification, duration } = body

    // Validate required fields
    if (!accessId) {
      return Errors.validationError("accessId is required")
    }
    if (!accessName) {
      return Errors.validationError("accessName is required")
    }
    if (!accessType) {
      return Errors.validationError("accessType is required")
    }
    if (!justification || justification.length < MIN_JUSTIFICATION_LENGTH) {
      return Errors.validationError(
        `Justification must be at least ${MIN_JUSTIFICATION_LENGTH} characters`
      )
    }
    if (!duration) {
      return Errors.validationError("duration is required")
    }

    // Create the request
    const request = await createRequest(
      user.userId,
      user.name || user.email,
      user.email,
      accessId,
      accessName,
      accessType,
      justification,
      duration
    )

    // Create notification for admins (in production, query all admins)
    // For now, we'll create a notification that can be looked up
    // This would typically be done via a batch process or separate admin notification system
    console.log(`New access request created: ${request.id} by user ${user.userId}`)

    const response: CreateRequestResponse = {
      request,
    }

    return successResponse(response, 201)
  } catch (error) {
    console.error("Error creating request:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to create request"
    )
  }
}
