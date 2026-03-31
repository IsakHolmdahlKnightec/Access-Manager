"use strict";
// ============================================================================
// getAccess - Get single access details by ID
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const shared_1 = require("../shared");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const response_1 = require("../shared/response");
const handler = async (event) => {
    try {
        // Extract access ID from path parameters
        const accessId = event.pathParameters?.id;
        if (!accessId) {
            return response_1.Errors.badRequest("Access ID is required");
        }
        const tableName = (0, shared_1.getTableName)();
        // Query the access using PK and SK
        const result = await shared_1.docClient.send(new lib_dynamodb_1.GetCommand({
            TableName: tableName,
            Key: {
                PK: `ACCESS#${accessId}`,
                SK: "METADATA",
            },
        }));
        if (!result.Item) {
            return response_1.Errors.notFound(`Access not found: ${accessId}`);
        }
        // Verify it's actually an access entity
        if (result.Item.entityType !== shared_1.EntityType.ACCESS) {
            return response_1.Errors.notFound(`Access not found: ${accessId}`);
        }
        const access = {
            id: result.Item.accessId,
            name: result.Item.name,
            type: result.Item.type,
            description: result.Item.description,
            requirements: result.Item.requirements,
            dependencies: result.Item.dependencies,
            createdAt: result.Item.createdAt,
            updatedAt: result.Item.updatedAt,
        };
        const response = {
            access,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error getting access:", error);
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to get access");
    }
};
exports.handler = handler;
//# sourceMappingURL=getAccess.js.map