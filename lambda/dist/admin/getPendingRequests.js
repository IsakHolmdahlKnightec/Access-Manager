"use strict";
// ============================================================================
// getPendingRequests - List all pending requests (admin only)
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("../requests/dynamodb");
const handler = async (event) => {
    try {
        (0, auth_1.requireAdmin)(event);
        const { requests, total } = await (0, dynamodb_1.getPendingRequests)();
        const response = {
            requests,
            total,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error getting pending requests:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
            if (error.message === "Forbidden") {
                return response_1.Errors.forbidden();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to get pending requests");
    }
};
exports.handler = handler;
//# sourceMappingURL=getPendingRequests.js.map