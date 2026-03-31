"use strict";
// ============================================================================
// markNotificationRead - Mark a single notification as read
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("./dynamodb");
const handler = async (event) => {
    try {
        const user = (0, auth_1.requireAuth)(event);
        const notificationId = event.pathParameters?.id;
        if (!notificationId) {
            return response_1.Errors.badRequest("Notification ID is required");
        }
        const notification = await (0, dynamodb_1.markNotificationAsRead)(user.userId, notificationId);
        if (!notification) {
            return response_1.Errors.notFound(`Notification not found: ${notificationId}`);
        }
        const response = {
            notification,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error marking notification as read:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to mark notification as read");
    }
};
exports.handler = handler;
//# sourceMappingURL=markNotificationRead.js.map