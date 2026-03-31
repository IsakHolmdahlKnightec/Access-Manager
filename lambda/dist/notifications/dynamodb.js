"use strict";
// ============================================================================
// Notification DynamoDB Operations
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getNotificationsByUser = void 0;
const shared_1 = require("../shared");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
/**
 * Get notifications for a user
 */
const getNotificationsByUser = async (userId, limit = 20) => {
    const tableName = (0, shared_1.getTableName)();
    const result = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":skPrefix": "#",
        },
        ScanIndexForward: false, // Newest first
        Limit: limit,
    }));
    const notifications = (result.Items || [])
        .filter((item) => item.entityType === shared_1.EntityType.NOTIFICATION)
        .map(mapToNotification);
    // Get total count
    const countResult = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":skPrefix": "#",
        },
        Select: "COUNT",
    }));
    // Get unread count
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return {
        notifications,
        total: countResult.Count || 0,
        unreadCount,
    };
};
exports.getNotificationsByUser = getNotificationsByUser;
/**
 * Mark a single notification as read
 */
const markNotificationAsRead = async (userId, notificationId) => {
    const tableName = (0, shared_1.getTableName)();
    const timestamp = (0, shared_1.getCurrentTimestamp)();
    // First, find the notification to get its SK
    // In a real scenario, we might store notificationId in the item
    // For now, we'll need to query and find it
    // This is a simplified approach - in production you'd have a GSI on notificationId
    const result = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":skPrefix": "#",
            ":nid": notificationId,
        },
        FilterExpression: "notificationId = :nid",
    }));
    if (!result.Items || result.Items.length === 0) {
        return null;
    }
    const notificationItem = result.Items[0];
    // Update the notification
    const updateResult = await shared_1.docClient.send(new lib_dynamodb_1.UpdateCommand({
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
    }));
    return updateResult.Attributes ? mapToNotification(updateResult.Attributes) : null;
};
exports.markNotificationAsRead = markNotificationAsRead;
/**
 * Mark all notifications as read for a user
 */
const markAllNotificationsAsRead = async (userId) => {
    const tableName = (0, shared_1.getTableName)();
    const timestamp = (0, shared_1.getCurrentTimestamp)();
    // Query all unread notifications
    const result = await shared_1.docClient.send(new lib_dynamodb_1.QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":skPrefix": "#",
            ":isRead": false,
        },
        FilterExpression: "isRead = :isRead",
    }));
    if (!result.Items || result.Items.length === 0) {
        return true;
    }
    // Update each notification to mark as read
    // In production, you'd use BatchWriteItem for efficiency
    for (const item of result.Items) {
        await shared_1.docClient.send(new lib_dynamodb_1.UpdateCommand({
            TableName: tableName,
            Key: {
                PK: item.PK,
                SK: item.SK,
            },
            UpdateExpression: "SET isRead = :isRead",
            ExpressionAttributeValues: {
                ":isRead": true,
            },
        }));
    }
    return true;
};
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
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
    await shared_1.docClient.send(new lib_dynamodb_1.PutCommand({
        TableName: tableName,
        Item: {
            PK: `USER#${userId}`,
            SK: `#${timestamp}#${notificationId}`,
            entityType: shared_1.EntityType.NOTIFICATION,
            notificationId,
            ...notification,
        },
    }));
    return notification;
};
exports.createNotification = createNotification;
/**
 * Helper to map DynamoDB item to Notification
 */
const mapToNotification = (item) => ({
    id: item.notificationId,
    userId: item.userId,
    type: item.type,
    title: item.title,
    message: item.message,
    requestId: item.requestId,
    accessName: item.accessName,
    isRead: item.isRead,
    createdAt: item.createdAt,
});
//# sourceMappingURL=dynamodb.js.map