"use strict";
// ============================================================================
// markAllNotificationsRead - Mark all notifications as read for a user
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("./dynamodb");
const handler = async (event) => {
    try {
        const user = (0, auth_1.requireAuth)(event);
        const success = await (0, dynamodb_1.markAllNotificationsAsRead)(user.userId);
        const response = {
            success,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error marking all notifications as read:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
        }
        return response_1.Errors.internalError(error instanceof Error
            ? error.message
            : "Failed to mark all notifications as read");
    }
};
exports.handler = handler;
//# sourceMappingURL=markAllNotificationsRead.js.map