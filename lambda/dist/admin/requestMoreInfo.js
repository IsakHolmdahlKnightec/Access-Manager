"use strict";
// ============================================================================
// requestMoreInfo - Request additional information from requester (admin only)
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("../requests/dynamodb");
const statusValidation_1 = require("../requests/statusValidation");
const dynamodb_2 = require("../shared/dynamodb");
// Notification type for more info request
const NOTIFICATION_TYPE_MORE_INFO = "request_more_info";
const handler = async (event) => {
    try {
        const admin = (0, auth_1.requireAdmin)(event);
        const requestId = event.pathParameters?.id;
        if (!requestId) {
            return response_1.Errors.badRequest("Request ID is required");
        }
        // Parse request body for the info request message
        if (!event.body) {
            return response_1.Errors.validationError("Message is required");
        }
        const body = JSON.parse(event.body);
        const { message } = body;
        if (!message || message.trim().length === 0) {
            return response_1.Errors.validationError("Message is required");
        }
        // Get the existing request
        const { requests } = await (0, dynamodb_1.getAllRequests)(1, 100);
        const existingRequest = requests.find((r) => r.id === requestId);
        if (!existingRequest) {
            return response_1.Errors.notFound(`Request not found: ${requestId}`);
        }
        // Check if more info can be requested
        if (!(0, statusValidation_1.canRequestMoreInfo)(existingRequest.status)) {
            return response_1.Errors.conflict(`Cannot request more info for request with status: ${existingRequest.status}`);
        }
        // Update the request status to more_info
        const updatedRequest = await (0, dynamodb_1.updateRequestStatus)(existingRequest.userId, requestId, dynamodb_2.RequestStatus.MORE_INFO, {
            requestedMoreInfoMessage: message,
        });
        if (!updatedRequest) {
            return response_1.Errors.internalError("Failed to request more info");
        }
        // Create notification for the requester
        await (0, dynamodb_1.createNotification)(existingRequest.userId, NOTIFICATION_TYPE_MORE_INFO, "More Information Needed", `Additional information is needed for your ${existingRequest.accessName} request. ${message}`, requestId, existingRequest.accessName);
        const response = {
            request: updatedRequest,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error requesting more info:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
            if (error.message === "Forbidden") {
                return response_1.Errors.forbidden();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to request more info");
    }
};
exports.handler = handler;
//# sourceMappingURL=requestMoreInfo.js.map