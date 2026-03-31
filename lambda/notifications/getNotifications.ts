// ============================================================================
// getNotifications - List user notifications
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAuth } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import { getNotificationsByUser } from "./dynamodb"
import type { GetNotificationsResponse } from "../shared/types"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user = requireAuth(event)

    // Parse limit parameter
    const limitParam = event.queryStringParameters?.limit
    const limit = limitParam ? parseInt(limitParam, 10) : 20
    const safeLimit = Math.min(Math.max(limit, 1), 100)

    const { notifications, total, unreadCount } = await getNotificationsByUser(
      user.userId,
      safeLimit
    )

    const response: GetNotificationsResponse = {
      notifications,
      total,
      unreadCount,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error getting notifications:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to get notifications"
    )
  }
}
