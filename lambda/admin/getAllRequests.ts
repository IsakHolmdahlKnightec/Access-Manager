// ============================================================================
// getAllRequests - List all requests with optional filters (admin only)
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAdmin } from "../shared/auth"
import { parsePagination } from "../shared"
import { successResponse, Errors } from "../shared/response"
import { getAllRequests } from "../requests/dynamodb"
import type { GetAllRequestsResponse } from "../shared/types"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    requireAdmin(event)

    const { page, pageSize } = parsePagination(
      event.queryStringParameters?.page,
      event.queryStringParameters?.pageSize
    )

    const statusFilter = event.queryStringParameters?.status

    const { requests, total } = await getAllRequests(
      page,
      pageSize,
      statusFilter
    )

    const response: GetAllRequestsResponse = {
      requests,
      total,
      page,
      pageSize,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error getting all requests:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
      if (error.message === "Forbidden") {
        return Errors.forbidden()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to get all requests"
    )
  }
}
