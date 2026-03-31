"use strict";
// ============================================================================
// getNotifications - List user notifications
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("./dynamodb");
const handler = async (event) => {
    try {
        const user = (0, auth_1.requireAuth)(event);
        // Parse limit parameter
        const limitParam = event.queryStringParameters?.limit;
        const limit = limitParam ? parseInt(limitParam, 10) : 20;
        const safeLimit = Math.min(Math.max(limit, 1), 100);
        const { notifications, total, unreadCount } = await (0, dynamodb_1.getNotificationsByUser)(user.userId, safeLimit);
        const response = {
            notifications,
            total,
            unreadCount,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error getting notifications:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to get notifications");
    }
};
exports.handler = handler;
//# sourceMappingURL=getNotifications.js.map