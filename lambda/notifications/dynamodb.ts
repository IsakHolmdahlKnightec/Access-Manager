// ============================================================================
// Notification DynamoDB Operations
// ============================================================================

import { docClient, getTableName, EntityType, generateId, getCurrentTimestamp } from "../shared"
import { PutCommand, GetCommand, UpdateCommand, QueryCommand } from "@aws/lib-dynamodb"
import type { Notification } from "../shared/types"

/**
 * Get notifications for a user
 */
export const getNotificationsByUser = async (
  userId: string,
  limit: number = 20
): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> => {
  const tableName = getTableName()

  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":skPrefix": "#",
      },
      ScanIndexForward: false, // Newest first
      Limit: limit,
    })
  )

  const notifications = (result.Items || [])
    .filter((item) => item.entityType === EntityType.NOTIFICATION)
    .map(mapToNotification)

  // Get total count
  const countResult = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":skPrefix": "#",
      },
      Select: "COUNT",
    })
  )

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return {
    notifications,
    total: countResult.Count || 0,
    unreadCount,
  }
}

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (
  userId: string,
  notificationId: string
): Promise<Notification | null> => {
  const tableName = getTableName()
  const timestamp = getCurrentTimestamp()

  // First, find the notification to get its SK
  // In a real scenario, we might store notificationId in the item
  // For now, we'll need to query and find it

  // This is a simplified approach - in production you'd have a GSI on notificationId
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":skPrefix": "#",
      },
      FilterExpression: "notificationId = :nid",
      ExpressionAttributeValues: {
        ":nid": notificationId,
      },
    })
  )

  if (!result.Items || result.Items.length === 0) {
    return null
  }

  const notificationItem = result.Items[0]

  // Update the notification
  const updateResult = await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        PK: notificationItem.PK,
        SK: notificationItem.SK,
      },
      UpdateExpression: "SET isRead = :isRead",
      ExpressionAttributeValues: {
        ":isRead": true,
      },
      ReturnValues: "ALL_NEW",
    })
  )

  return updateResult.Attributes ? mapToNotification(updateResult.Attributes) : null
}

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (
  userId: string
): Promise<boolean> => {
  const tableName = getTableName()
  const timestamp = getCurrentTimestamp()

  // Query all unread notifications
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":skPrefix": "#",
      },
      FilterExpression: "isRead = :isRead",
      ExpressionAttributeValues: {
        ":isRead": false,
      },
    })
  )

  if (!result.Items || result.Items.length === 0) {
    return true
  }

  // Update each notification to mark as read
  // In production, you'd use BatchWriteItem for efficiency
  for (const item of result.Items) {
    await docClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
        UpdateExpression: "SET isRead = :isRead",
        ExpressionAttributeValues: {
          ":isRead": true,
        },
      })
    )
  }

  return true
}

/**
 * Create a notification for a user
 */
export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  requestId?: string,
  accessName?: string
): Promise<Notification> => {
  const tableName = getTableName()
  const notificationId = generateId()
  const timestamp = getCurrentTimestamp()

  const notification: Notification = {
    id: notificationId,
    userId,
    type,
    title,
    message,
    requestId,
    accessName,
    isRead: false,
    createdAt: timestamp,
  }

  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        PK: `USER#${userId}`,
        SK: `#${timestamp}#${notificationId}`,
        entityType: EntityType.NOTIFICATION,
        notificationId,
        ...notification,
      },
    })
  )

  return notification
}

/**
 * Helper to map DynamoDB item to Notification
 */
const mapToNotification = (item: Record<string, unknown>): Notification => ({
  id: item.notificationId as string,
  userId: item.userId as string,
  type: item.type as string,
  title: item.title as string,
  message: item.message as string,
  requestId: item.requestId as string | undefined,
  accessName: item.accessName as string | undefined,
  isRead: item.isRead as boolean,
  createdAt: item.createdAt as string,
})
