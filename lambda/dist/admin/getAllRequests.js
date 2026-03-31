"use strict";
// ============================================================================
// getAllRequests - List all requests with optional filters (admin only)
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const shared_1 = require("../shared");
const response_1 = require("../shared/response");
const dynamodb_1 = require("../requests/dynamodb");
const handler = async (event) => {
    try {
        (0, auth_1.requireAdmin)(event);
        const { page, pageSize } = (0, shared_1.parsePagination)(event.queryStringParameters?.page, event.queryStringParameters?.pageSize);
        const statusFilter = event.queryStringParameters?.status;
        const { requests, total } = await (0, dynamodb_1.getAllRequests)(page, pageSize, statusFilter);
        const response = {
            requests,
            total,
            page,
            pageSize,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error getting all requests:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
            if (error.message === "Forbidden") {
                return response_1.Errors.forbidden();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to get all requests");
    }
};
exports.handler = handler;
//# sourceMappingURL=getAllRequests.js.map