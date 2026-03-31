"use strict";
// ============================================================================
// getAccesses - List all accesses with optional filters and pagination
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const shared_1 = require("../shared");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const response_1 = require("../shared/response");
// GSI2 for access type queries
const GSI2_NAME = "GSI2";
const GSI2PK_PREFIX = "ACCESS#TYPE#";
const GSI2SK_PREFIX = "ACCESS#";
const handler = async (event) => {
    try {
        // Parse query parameters
        const type = event.queryStringParameters?.type;
        const search = event.queryStringParameters?.search;
        const { page, pageSize } = (0, shared_1.parsePagination)(event.queryStringParameters?.page, event.queryStringParameters?.pageSize);
        // Validate access type if provided
        if (type && !Object.values(shared_1.AccessType).includes(type)) {
            return response_1.Errors.validationError(`Invalid access type: ${type}`);
        }
        const tableName = (0, shared_1.getTableName)();
        let accesses = [];
        let total = 0;
        // If type filter is provided, use GSI2
        if (type) {
            const queryResult = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
                TableName: tableName,
                IndexName: GSI2_NAME,
                KeyConditionExpression: "GSI2PK = :pk",
                ExpressionAttributeValues: {
                    ":pk": `${GSI2PK_PREFIX}${type}`,
                },
                Limit: pageSize,
            }));
            accesses = (queryResult.Items || []).map((item) => ({
                id: item.accessId,
                name: item.name,
                type: item.type,
                description: item.description,
            }));
            // Get total count using a separate query without limit
            const countResult = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
                TableName: tableName,
                IndexName: GSI2_NAME,
                KeyConditionExpression: "GSI2PK = :pk",
                ExpressionAttributeValues: {
                    ":pk": `${GSI2PK_PREFIX}${type}`,
                },
                Select: "COUNT",
            }));
            total = countResult.Count || 0;
        }
        else {
            // Scan all accesses (inefficient, but works for now)
            // In production, consider using a separate index for listing
            const scanResult = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
                TableName: tableName,
                FilterExpression: "entityType = :entityType",
                ExpressionAttributeValues: {
                    ":entityType": "ACCESS",
                },
                Limit: pageSize,
            }));
            accesses = (scanResult.Items || []).map((item) => ({
                id: item.accessId,
                name: item.name,
                type: item.type,
                description: item.description,
            }));
            // Get total count
            const countResult = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
                TableName: tableName,
                FilterExpression: "entityType = :entityType",
                ExpressionAttributeValues: {
                    ":entityType": "ACCESS",
                },
                Select: "COUNT",
            }));
            total = countResult.Count || 0;
        }
        // Apply search filter if provided (case-insensitive name search)
        if (search) {
            const searchLower = search.toLowerCase();
            accesses = accesses.filter((access) => access.name.toLowerCase().includes(searchLower));
            total = accesses.length;
        }
        // Sort by name
        accesses.sort((a, b) => a.name.localeCompare(b.name));
        // Apply pagination
        const startIndex = (page - 1) * pageSize;
        const paginatedAccesses = accesses.slice(startIndex, startIndex + pageSize);
        const response = {
            accesses: paginatedAccesses,
            total,
            page,
            pageSize,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error listing accesses:", error);
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to list accesses");
    }
};
exports.handler = handler;
//# sourceMappingURL=getAccesses.js.map