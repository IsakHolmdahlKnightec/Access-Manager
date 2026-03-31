// ============================================================================
// getPendingRequests - List all pending requests (admin only)
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAdmin } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import { getPendingRequests } from "../requests/dynamodb"
import type { GetPendingRequestsResponse } from "../shared/types"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    requireAdmin(event)

    const { requests, total } = await getPendingRequests()

    const response: GetPendingRequestsResponse = {
      requests,
      total,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error getting pending requests:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
      if (error.message === "Forbidden") {
        return Errors.forbidden()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to get pending requests"
    )
  }
}
