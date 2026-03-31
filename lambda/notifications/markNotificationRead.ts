// ============================================================================
// markNotificationRead - Mark a single notification as read
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { requireAuth } from "../shared/auth"
import { successResponse, Errors } from "../shared/response"
import { markNotificationAsRead } from "./dynamodb"
import type { MarkNotificationReadResponse } from "../shared/types"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user = requireAuth(event)

    const notificationId = event.pathParameters?.id

    if (!notificationId) {
      return Errors.badRequest("Notification ID is required")
    }

    const notification = await markNotificationAsRead(user.userId, notificationId)

    if (!notification) {
      return Errors.notFound(`Notification not found: ${notificationId}`)
    }

    const response: MarkNotificationReadResponse = {
      notification,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error marking notification as read:", error)

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Errors.unauthorized()
      }
    }

    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to mark notification as read"
    )
  }
}
