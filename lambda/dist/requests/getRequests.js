"use strict";
// ============================================================================
// getRequests - List user's requests with pagination
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const shared_1 = require("../shared");
const response_1 = require("../shared/response");
const dynamodb_1 = require("./dynamodb");
const handler = async (event) => {
    try {
        const user = (0, auth_1.requireAuth)(event);
        const { page, pageSize } = (0, shared_1.parsePagination)(event.queryStringParameters?.page, event.queryStringParameters?.pageSize);
        const { requests, total } = await (0, dynamodb_1.getRequestsByUser)(user.userId, page, pageSize);
        const response = {
            requests,
            total,
            page,
            pageSize,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error getting requests:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to get requests");
    }
};
exports.handler = handler;
//# sourceMappingURL=getRequests.js.map