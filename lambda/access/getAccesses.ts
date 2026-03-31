// ============================================================================
// getAccesses - List all accesses with optional filters and pagination
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { docClient, getTableName, parsePagination, AccessType } from "../shared"
import { QueryCommand } from "@aws/lib-dynamodb"
import { successResponse, Errors } from "../shared/response"
import type { AccessListItem, GetAccessesResponse } from "../shared/types"

// GSI2 for access type queries
const GSI2_NAME = "GSI2"
const GSI2PK_PREFIX = "ACCESS#TYPE#"
const GSI2SK_PREFIX = "ACCESS#"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse query parameters
    const type = event.queryStringParameters?.type as AccessListItem["type"] | undefined
    const search = event.queryStringParameters?.search
    const { page, pageSize } = parsePagination(
      event.queryStringParameters?.page,
      event.queryStringParameters?.pageSize
    )

    // Validate access type if provided
    if (type && !Object.values(AccessType).includes(type as AccessType)) {
      return Errors.validationError(`Invalid access type: ${type}`)
    }

    const tableName = getTableName()
    let accesses: AccessListItem[] = []
    let total = 0

    // If type filter is provided, use GSI2
    if (type) {
      const queryResult = await docClient.send(
        new QueryCommand({
          TableName: tableName,
          IndexName: GSI2_NAME,
          KeyConditionExpression: "GSI2PK = :pk",
          ExpressionAttributeValues: {
            ":pk": `${GSI2PK_PREFIX}${type}`,
          },
          Limit: pageSize,
        })
      )

      accesses = (queryResult.Items || []).map((item) => ({
        id: item.accessId,
        name: item.name,
        type: item.type,
        description: item.description,
      }))

      // Get total count using a separate query without limit
      const countResult = await docClient.send(
        new QueryCommand({
          TableName: tableName,
          IndexName: GSI2_NAME,
          KeyConditionExpression: "GSI2PK = :pk",
          ExpressionAttributeValues: {
            ":pk": `${GSI2PK_PREFIX}${type}`,
          },
          Select: "COUNT",
        })
      )
      total = countResult.Count || 0
    } else {
      // Scan all accesses (inefficient, but works for now)
      // In production, consider using a separate index for listing
      const scanResult = await docClient.send(
        new QueryCommand({
          TableName: tableName,
          FilterExpression: "entityType = :entityType",
          ExpressionAttributeValues: {
            ":entityType": "ACCESS",
          },
          Limit: pageSize,
        })
      )

      accesses = (scanResult.Items || []).map((item) => ({
        id: item.accessId,
        name: item.name,
        type: item.type,
        description: item.description,
      }))

      // Get total count
      const countResult = await docClient.send(
        new QueryCommand({
          TableName: tableName,
          FilterExpression: "entityType = :entityType",
          ExpressionAttributeValues: {
            ":entityType": "ACCESS",
          },
          Select: "COUNT",
        })
      )
      total = countResult.Count || 0
    }

    // Apply search filter if provided (case-insensitive name search)
    if (search) {
      const searchLower = search.toLowerCase()
      accesses = accesses.filter((access) =>
        access.name.toLowerCase().includes(searchLower)
      )
      total = accesses.length
    }

    // Sort by name
    accesses.sort((a, b) => a.name.localeCompare(b.name))

    // Apply pagination
    const startIndex = (page - 1) * pageSize
    const paginatedAccesses = accesses.slice(startIndex, startIndex + pageSize)

    const response: GetAccessesResponse = {
      accesses: paginatedAccesses,
      total,
      page,
      pageSize,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error listing accesses:", error)
    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to list accesses"
    )
  }
}
