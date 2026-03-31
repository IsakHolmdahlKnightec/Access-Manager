// ============================================================================
// getRequests - List user's requests with pagination
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAuth } from "../shared/auth"
import { parsePagination } from "../shared"
import { successResponse, Errors } from "../shared/response"
import { getRequestsByUser } from "./dynamodb"
import type { GetRequestsResponse } from "../shared/types"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user = requireAuth(event)

    const { page, pageSize } = parsePagination(
      event.queryStringParameters?.page,
      event.queryStringParameters?.pageSize
    )

    const { requests, total } = await getRequestsByUser(user.userId, page, pageSize)

    const response: GetRequestsResponse = {
      requests,
      total,
      page,
      pageSize,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error getting requests:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to get requests"
    )
  }
}
