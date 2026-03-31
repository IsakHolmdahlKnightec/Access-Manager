// ============================================================================
// markAllNotificationsRead - Mark all notifications as read for a user
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAuth } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import { markAllNotificationsAsRead } from "./dynamodb"
import type { MarkAllNotificationsReadResponse } from "../shared/types"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user = requireAuth(event)

    const success = await markAllNotificationsAsRead(user.userId)

    const response: MarkAllNotificationsReadResponse = {
      success,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error marking all notifications as read:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
    }

    return Errors.internalError(
      error instanceof Error
        ? error.message
        : "Failed to mark all notifications as read"
    )
  }
}
