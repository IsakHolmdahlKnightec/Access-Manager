"use strict";
// ============================================================================
// cancelRequest - Cancel a pending request
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("./dynamodb");
const statusValidation_1 = require("./statusValidation");
const dynamodb_2 = require("../shared/dynamodb");
const handler = async (event) => {
    try {
        const user = (0, auth_1.requireAuth)(event);
        const requestId = event.pathParameters?.id;
        if (!requestId) {
            return response_1.Errors.badRequest("Request ID is required");
        }
        // Get the existing request
        const existingRequest = await (0, dynamodb_1.getRequestById)(user.userId, requestId);
        if (!existingRequest) {
            return response_1.Errors.notFound(`Request not found: ${requestId}`);
        }
        // Check if request can be cancelled
        if (!(0, statusValidation_1.canCancelRequest)(existingRequest.status)) {
            return response_1.Errors.conflict(`Cannot cancel request with status: ${existingRequest.status}`);
        }
        // Update the request status
        const updatedRequest = await (0, dynamodb_1.updateRequestStatus)(user.userId, requestId, dynamodb_2.RequestStatus.CANCELLED);
        if (!updatedRequest) {
            return response_1.Errors.internalError("Failed to cancel request");
        }
        const response = {
            request: updatedRequest,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error cancelling request:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to cancel request");
    }
};
exports.handler = handler;
//# sourceMappingURL=cancelRequest.js.map