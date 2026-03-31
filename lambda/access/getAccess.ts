// ============================================================================
// getAccess - Get single access details by ID
// ============================================================================

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { docClient, getTableName, EntityType } from "../shared"
import { GetCommand } from "@aws/lib-dynamodb"
import { successResponse, Errors } from "../shared/response"
import type { Access, GetAccessResponse } from "../shared/types"

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract access ID from path parameters
    const accessId = event.pathParameters?.id

    if (!accessId) {
      return Errors.badRequest("Access ID is required")
    }

    const tableName = getTableName()

    // Query the access using PK and SK
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          PK: `ACCESS#${accessId}`,
          SK: "METADATA",
        },
      })
    )

    if (!result.Item) {
      return Errors.notFound(`Access not found: ${accessId}`)
    }

    // Verify it's actually an access entity
    if (result.Item.entityType !== EntityType.ACCESS) {
      return Errors.notFound(`Access not found: ${accessId}`)
    }

    const access: Access = {
      id: result.Item.accessId,
      name: result.Item.name,
      type: result.Item.type,
      description: result.Item.description,
      requirements: result.Item.requirements,
      dependencies: result.Item.dependencies,
      createdAt: result.Item.createdAt,
      updatedAt: result.Item.updatedAt,
    }

    const response: GetAccessResponse = {
      access,
    }

    return successResponse(response)
  } catch (error) {
    console.error("Error getting access:", error)
    return Errors.internalError(
      error instanceof Error ? error.message : "Failed to get access"
    )
  }
}
