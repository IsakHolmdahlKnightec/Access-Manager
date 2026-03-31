"use strict";
// ============================================================================
// DynamoDB Operations for Requests
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRequests = exports.getPendingRequests = exports.createNotification = exports.addApproval = exports.updateRequestStatus = exports.getRequestsByUser = exports.getRequestById = exports.createRequest = void 0;
const shared_1 = require("../shared");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// GSI1 for status-based queries
const GSI1_NAME = "GSI1";
/**
 * Create a new access request
 */
const createRequest = async (userId, userName, userEmail, accessId, accessName, accessType, justification, duration) => {
    const tableName = (0, shared_1.getTableName)();
    const requestId = (0, shared_1.generateId)();
    const timestamp = (0, shared_1.getCurrentTimestamp)();
    const request = {
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
    };
    await shared_1.docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: tableName,
        Item: {
            PK: `USER#${userId}`,
            SK: `REQUEST#${requestId}`,
            entityType: shared_1.EntityType.REQUEST,
            ...request,
        },
    }));
    // Also add to GSI1 for status-based queries
    await shared_1.docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: tableName,
        Item: {
            PK: `REQUEST#pending`,
            SK: timestamp,
            GSI1PK: `REQUEST#pending`,
            GSI1SK: timestamp,
            entityType: shared_1.EntityType.REQUEST,
            ...request,
        },
    }));
    return request;
};
exports.createRequest = createRequest;
/**
 * Get a single request by user ID and request ID
 */
const getRequestById = async (userId, requestId) => {
    const tableName = (0, shared_1.getTableName)();
    const result = await shared_1.docClient.send(new lib_dynamodb_1.GetCommand({
        TableName: tableName,
        Key: {
            PK: `USER#${userId}`,
            SK: `REQUEST#${requestId}`,
        },
    }));
    if (!result.Item || result.Item.entityType !== shared_1.EntityType.REQUEST) {
        return null;
    }
    return mapToRequest(result.Item);
};
exports.getRequestById = getRequestById;
/**
 * Get all requests for a user with pagination
 */
const getRequestsByUser = async (userId, page = 1, pageSize = 20) => {
    const tableName = (0, shared_1.getTableName)();
    const result = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":skPrefix": "REQUEST#",
        },
        ScanIndexForward: false, // Newest first
        Limit: pageSize,
    }));
    const requests = (result.Items || [])
        .filter((item) => item.entityType === shared_1.EntityType.REQUEST)
        .map(mapToRequest);
    // Get total count
    const countResult = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":skPrefix": "REQUEST#",
        },
        Select: "COUNT",
    }));
    return {
        requests,
        total: countResult.Count || 0,
    };
};
exports.getRequestsByUser = getRequestsByUser;
/**
 * Update request status
 */
const updateRequestStatus = async (userId, requestId, newStatus, additionalFields = {}) => {
    const tableName = (0, shared_1.getTableName)();
    const timestamp = (0, shared_1.getCurrentTimestamp)();
    const result = await shared_1.docClient.send(new lib_dynamodb_1.UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `USER#${userId}`,
            SK: `REQUEST#${requestId}`,
        },
        UpdateExpression: "SET #status = :newStatus, updatedAt = :timestamp, #resolvedAt = :resolvedAt, :additionalFields",
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
    }));
    return result.Attributes ? mapToRequest(result.Attributes) : null;
};
exports.updateRequestStatus = updateRequestStatus;
/**
 * Add approval record to a request
 */
const addApproval = async (requestId, adminId, adminEmail, action, reason) => {
    const tableName = (0, shared_1.getTableName)();
    const approvalId = (0, shared_1.generateId)();
    const timestamp = (0, shared_1.getCurrentTimestamp)();
    const approval = {
        id: approvalId,
        requestId,
        adminId,
        adminEmail,
        action,
        reason,
        timestamp,
    };
    await shared_1.docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: tableName,
        Item: {
            PK: `REQUEST#${requestId}`,
            SK: `APPROVAL#${approvalId}`,
            entityType: shared_1.EntityType.APPROVAL,
            ...approval,
        },
    }));
    return approval;
};
exports.addApproval = addApproval;
/**
 * Create a notification for a user
 */
const createNotification = async (userId, type, title, message, requestId, accessName) => {
    const tableName = (0, shared_1.getTableName)();
    const notificationId = (0, shared_1.generateId)();
    const timestamp = (0, shared_1.getCurrentTimestamp)();
    const notification = {
        id: notificationId,
        userId,
        type,
        title,
        message,
        requestId,
        accessName,
        isRead: false,
        createdAt: timestamp,
    };
    // Use timestamp-based SK for chronological ordering
    await shared_1.docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: tableName,
        Item: {
            PK: `USER#${userId}`,
            SK: `#${timestamp}#${notificationId}`,
            entityType: shared_1.EntityType.NOTIFICATION,
            ...notification,
        },
    }));
    return notification;
};
exports.createNotification = createNotification;
/**
 * Get all pending requests (admin use)
 */
const getPendingRequests = async () => {
    const tableName = (0, shared_1.getTableName)();
    const result = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: tableName,
        IndexName: GSI1_NAME,
        KeyConditionExpression: "GSI1PK = :pk",
        ExpressionAttributeValues: {
            ":pk": "REQUEST#pending",
        },
        ScanIndexForward: true, // Oldest first for admin queue
    }));
    const requests = (result.Items || [])
        .filter((item) => item.entityType === shared_1.EntityType.REQUEST)
        .map(mapToRequest);
    return {
        requests,
        total: requests.length,
    };
};
exports.getPendingRequests = getPendingRequests;
/**
 * Get all requests with optional status filter (admin use)
 */
const getAllRequests = async (page = 1, pageSize = 20, statusFilter) => {
    const tableName = (0, shared_1.getTableName)();
    // For admin view, we need to scan with filter
    // In production, consider using GSI1 with different approach
    const result = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: tableName,
        FilterExpression: "entityType = :entityType",
        ExpressionAttributeValues: {
            ":entityType": shared_1.EntityType.REQUEST,
            ...(statusFilter ? { ":status": statusFilter } : {}),
        },
        Limit: pageSize * page, // Get enough for pagination
    }));
    let requests = (result.Items || []).map(mapToRequest);
    if (statusFilter) {
        requests = requests.filter((r) => r.status === statusFilter);
    }
    // Sort by createdAt descending
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = requests.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedRequests = requests.slice(startIndex, startIndex + pageSize);
    return {
        requests: paginatedRequests,
        total,
    };
};
exports.getAllRequests = getAllRequests;
/**
 * Helper to map DynamoDB item to AccessRequest
 */
const mapToRequest = (item) => ({
    id: item.requestId,
    accessId: item.accessId,
    accessName: item.accessName,
    accessType: item.accessType,
    userId: item.userId,
    userName: item.userName,
    userEmail: item.userEmail,
    status: item.status,
    justification: item.justification,
    duration: item.duration,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    resolvedAt: item.resolvedAt,
    resolvedBy: item.resolvedBy,
    resolutionNote: item.resolutionNote,
    requestedMoreInfoMessage: item.requestedMoreInfoMessage,
});
//# sourceMappingURL=dynamodb.js.map