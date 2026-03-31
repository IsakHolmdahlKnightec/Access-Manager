// ============================================================================
// DynamoDB Stream Handler for Request Status Changes
// ============================================================================
// This Lambda function is triggered by DynamoDB Streams on the access-manager-data table.
// It creates notifications when request statuses change.

// Notification types
const NOTIFICATION_TYPES = {
  REQUEST_APPROVED: "request_approved",
  REQUEST_DECLINED: "request_declined",
  REQUEST_MORE_INFO: "request_more_info",
  NEW_PENDING_REQUEST: "new_pending_request",
} as const

interface RequestStatusChange {
  requestId: string
  accessId: string
  accessName: string
  userId: string
  oldStatus: string
  newStatus: string
  timestamp: string
}

interface NotificationRecord {
  userId: string
  type: string
  title: string
  message: string
  requestId: string
  accessName: string
}

/**
 * Process DynamoDB Stream event
 */
export const handler = async (event: {
  Records: Array<{
    eventName: string
    dynamodb: {
      NewImage?: Record<string, { [key: string]: unknown }>
      OldImage?: Record<string, { [key: string]: unknown }>
    }
  }>
}): Promise<void> => {
  console.log("Processing DynamoDB Stream event:", JSON.stringify(event, null, 2))

  for (const record of event.Records) {
    try {
      // We're interested in MODIFY events (status changes)
      if (record.eventName !== "MODIFY") {
        continue
      }

      const newImage = record.dynamodb.NewImage
      const oldImage = record.dynamodb.OldImage

      if (!newImage || !oldImage) {
        continue
      }

      // Only process REQUEST entities
      if (newImage.entityType?.S !== "REQUEST") {
        continue
      }

      const oldStatus = oldImage.status?.S
      const newStatus = newImage.status?.S

      // Only proceed if status actually changed
      if (oldStatus === newStatus) {
        continue
      }

      const statusChange: RequestStatusChange = {
        requestId: newImage.requestId?.S || "",
        accessId: newImage.accessId?.S || "",
        accessName: newImage.accessName?.S || "",
        userId: newImage.userId?.S || "",
        oldStatus: oldStatus || "",
        newStatus: newStatus || "",
        timestamp: newImage.updatedAt?.S || new Date().toISOString(),
      }

      // Determine notification based on new status
      const notifications = determineNotifications(statusChange)

      // In a real implementation, you would create these notifications in DynamoDB
      // For now, we'll log them
      for (const notification of notifications) {
        console.log(
          `Would create notification for user ${notification.userId}:`,
          JSON.stringify(notification, null, 2)
        )
      }
    } catch (error) {
      console.error("Error processing stream record:", error)
    }
  }
}

/**
 * Determine which notifications to create based on status change
 */
const determineNotifications = (
  change: RequestStatusChange
): NotificationRecord[] => {
  const notifications: NotificationRecord[] = []

  switch (change.newStatus) {
    case "approved":
      notifications.push({
        userId: change.userId,
        type: NOTIFICATION_TYPES.REQUEST_APPROVED,
        title: "Request Approved",
        message: `Your request for ${change.accessName} has been approved.`,
        requestId: change.requestId,
        accessName: change.accessName,
      })
      break

    case "declined":
      notifications.push({
        userId: change.userId,
        type: NOTIFICATION_TYPES.REQUEST_DECLINED,
        title: "Request Declined",
        message: `Your request for ${change.accessName} has been declined.`,
        requestId: change.requestId,
        accessName: change.accessName,
      })
      break

    case "more_info":
      notifications.push({
        userId: change.userId,
        type: NOTIFICATION_TYPES.REQUEST_MORE_INFO,
        title: "More Information Needed",
        message: `Additional information is needed for your ${change.accessName} request.`,
        requestId: change.requestId,
        accessName: change.accessName,
      })
      break

    case "pending":
      // New pending request - notify admins
      // In production, this would query all admins and create notifications for each
      if (change.oldStatus === "more_info") {
        // User responded to info request
        notifications.push({
          userId: change.userId,
          type: "request_updated",
          title: "Request Updated",
          message: `Your response has been submitted for ${change.accessName}.`,
          requestId: change.requestId,
          accessName: change.accessName,
        })
      }
      break

    case "cancelled":
      // User cancelled - no notification to user needed
      // Could notify admins that the request was withdrawn
      break
  }

  return notifications
}
