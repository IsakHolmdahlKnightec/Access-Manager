"use strict";
// ============================================================================
// getRequest - Get single request details
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("./dynamodb");
const handler = async (event) => {
    try {
        const user = (0, auth_1.requireAuth)(event);
        const requestId = event.pathParameters?.id;
        if (!requestId) {
            return response_1.Errors.badRequest("Request ID is required");
        }
        const request = await (0, dynamodb_1.getRequestById)(user.userId, requestId);
        if (!request) {
            return response_1.Errors.notFound(`Request not found: ${requestId}`);
        }
        const response = {
            request,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error getting request:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to get request");
    }
};
exports.handler = handler;
//# sourceMappingURL=getRequest.js.map