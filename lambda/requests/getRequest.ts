// ============================================================================
// getRequest - Get single request details
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAuth } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import { getRequestById } from "./dynamodb"
import type { GetRequestResponse } from "../shared/types"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user = requireAuth(event)

    const requestId = event.pathParameters?.id

    if (!requestId) {
      return Errors.badRequest("Request ID is required")
    }

    const request = await getRequestById(user.userId, requestId)

    if (!request) {
      return Errors.notFound(`Request not found: ${requestId}`)
    }

    const response: GetRequestResponse = {
      request,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error getting request:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to get request"
    )
  }
}
