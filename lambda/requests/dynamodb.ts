// ============================================================================
// DynamoDB Operations for Requests
// ============================================================================

import { docClient, getTableName, EntityType, generateId, getCurrentTimestamp } from "../shared"
import { PutCommand, GetCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import type { AccessRequest, Approval, Notification } from "../shared/types"

// GSI1 for status-based queries
const GSI1_NAME = "GSI1"

/**
 * Create a new access request
 */
export const createRequest = async (
  userId: string,
  userName: string,
  userEmail: string,
  accessId: string,
  accessName: string,
  accessType: string,
  justification: string,
  duration: string
): Promise<AccessRequest> => {
  const tableName = getTableName()
  const requestId = generateId()
  const timestamp = getCurrentTimestamp()

  const request: AccessRequest = {
    id: requestId,
    accessId,
    accessName,
    accessType,
    userId,
    userName,
    userEmail,
    status: "pending",
    justification,
    duration,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        PK: `USER#${userId}`,
        SK: `REQUEST#${requestId}`,
        entityType: EntityType.REQUEST,
        ...request,
      },
    })
  )

  // Also add to GSI1 for status-based queries
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        PK: `REQUEST#pending`,
        SK: timestamp,
        GSI1PK: `REQUEST#pending`,
        GSI1SK: timestamp,
        entityType: EntityType.REQUEST,
        ...request,
      },
    })
  )

  return request
}

/**
 * Get a single request by user ID and request ID
 */
export const getRequestById = async (
  userId: string,
  requestId: string
): Promise<AccessRequest | null> => {
  const tableName = getTableName()

  const result = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `REQUEST#${requestId}`,
      },
    })
  )

  if (!result.Item || result.Item.entityType !== EntityType.REQUEST) {
    return null
  }

  return mapToRequest(result.Item)
}

/**
 * Get all requests for a user with pagination
 */
export const getRequestsByUser = async (
  userId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{ requests: AccessRequest[]; total: number }> => {
  const tableName = getTableName()

  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":skPrefix": "REQUEST#",
      },
      ScanIndexForward: false, // Newest first
      Limit: pageSize,
    })
  )

  const requests = (result.Items || [])
    .filter((item) => item.entityType === EntityType.REQUEST)
    .map(mapToRequest)

  // Get total count
  const countResult = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":skPrefix": "REQUEST#",
      },
      Select: "COUNT",
    })
  )

  return {
    requests,
    total: countResult.Count || 0,
  }
}

/**
 * Update request status
 */
export const updateRequestStatus = async (
  userId: string,
  requestId: string,
  newStatus: string,
  additionalFields: Record<string, unknown> = {}
): Promise<AccessRequest | null> => {
  const tableName = getTableName()
  const timestamp = getCurrentTimestamp()

  const result = await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `REQUEST#${requestId}`,
      },
      UpdateExpression:
        "SET #status = :newStatus, updatedAt = :timestamp, #resolvedAt = :resolvedAt, :additionalFields",
      ExpressionAttributeNames: {
        "#status": "status",
        "#resolvedAt": "resolvedAt",
      },
      ExpressionAttributeValues: {
        ":newStatus": newStatus,
        ":timestamp": timestamp,
        ":resolvedAt": timestamp,
        ...additionalFields,
      },
      ReturnValues: "ALL_NEW",
    })
  )

  return result.Attributes ? mapToRequest(result.Attributes) : null
}

/**
 * Add approval record to a request
 */
export const addApproval = async (
  requestId: string,
  adminId: string,
  adminEmail: string,
  action: string,
  reason?: string
): Promise<Approval> => {
  const tableName = getTableName()
  const approvalId = generateId()
  const timestamp = getCurrentTimestamp()

  const approval: Approval = {
    id: approvalId,
    requestId,
    adminId,
    adminEmail,
    action,
    reason,
    timestamp,
  }

  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        PK: `REQUEST#${requestId}`,
        SK: `APPROVAL#${approvalId}`,
        entityType: EntityType.APPROVAL,
        ...approval,
      },
    })
  )

  return approval
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

  // Use timestamp-based SK for chronological ordering
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        PK: `USER#${userId}`,
        SK: `#${timestamp}#${notificationId}`,
        entityType: EntityType.NOTIFICATION,
        ...notification,
      },
    })
  )

  return notification
}

/**
 * Get all pending requests (admin use)
 */
export const getPendingRequests = async (): Promise<{
  requests: AccessRequest[]
  total: number
}> => {
  const tableName = getTableName()

  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: GSI1_NAME,
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: {
        ":pk": "REQUEST#pending",
      },
      ScanIndexForward: true, // Oldest first for admin queue
    })
  )

  const requests = (result.Items || [])
    .filter((item) => item.entityType === EntityType.REQUEST)
    .map(mapToRequest)

  return {
    requests,
    total: requests.length,
  }
}

/**
 * Get all requests with optional status filter (admin use)
 */
export const getAllRequests = async (
  page: number = 1,
  pageSize: number = 20,
  statusFilter?: string
): Promise<{ requests: AccessRequest[]; total: number }> => {
  const tableName = getTableName()

  // For admin view, we need to scan with filter
  // In production, consider using GSI1 with different approach
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      FilterExpression: "entityType = :entityType",
      ExpressionAttributeValues: {
        ":entityType": EntityType.REQUEST,
        ...(statusFilter ? { ":status": statusFilter } : {}),
      },
      Limit: pageSize * page, // Get enough for pagination
    })
  )

  let requests = (result.Items || []).map(mapToRequest)

  if (statusFilter) {
    requests = requests.filter((r) => r.status === statusFilter)
  }

  // Sort by createdAt descending
  requests.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const total = requests.length
  const startIndex = (page - 1) * pageSize
  const paginatedRequests = requests.slice(startIndex, startIndex + pageSize)

  return {
    requests: paginatedRequests,
    total,
  }
}

/**
 * Helper to map DynamoDB item to AccessRequest
 */
const mapToRequest = (item: Record<string, unknown>): AccessRequest => ({
  id: item.requestId as string,
  accessId: item.accessId as string,
  accessName: item.accessName as string,
  accessType: item.accessType as string,
  userId: item.userId as string,
  userName: item.userName as string,
  userEmail: item.userEmail as string,
  status: item.status as string,
  justification: item.justification as string,
  duration: item.duration as string,
  createdAt: item.createdAt as string,
  updatedAt: item.updatedAt as string,
  resolvedAt: item.resolvedAt as string | undefined,
  resolvedBy: item.resolvedBy as string | undefined,
  resolutionNote: item.resolutionNote as string | undefined,
  requestedMoreInfoMessage: item.requestedMoreInfoMessage as string | undefined,
})
