"use strict";
// ============================================================================
// declineRequest - Decline a pending request (admin only)
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("../requests/dynamodb");
const statusValidation_1 = require("../requests/statusValidation");
const dynamodb_2 = require("../shared/dynamodb");
// Notification type for request decline
const NOTIFICATION_TYPE_DECLINED = "request_declined";
const handler = async (event) => {
    try {
        const admin = (0, auth_1.requireAdmin)(event);
        const requestId = event.pathParameters?.id;
        if (!requestId) {
            return response_1.Errors.badRequest("Request ID is required");
        }
        // Parse request body for decline reason
        if (!event.body) {
            return response_1.Errors.validationError("Decline reason is required");
        }
        const body = JSON.parse(event.body);
        const { reason } = body;
        if (!reason || reason.trim().length === 0) {
            return response_1.Errors.validationError("Decline reason is required");
        }
        // Get the existing request
        const { requests } = await (0, dynamodb_1.getAllRequests)(1, 100);
        const existingRequest = requests.find((r) => r.id === requestId);
        if (!existingRequest) {
            return response_1.Errors.notFound(`Request not found: ${requestId}`);
        }
        // Check if request can be declined
        if (!(0, statusValidation_1.canDeclineRequest)(existingRequest.status)) {
            return response_1.Errors.conflict(`Cannot decline request with status: ${existingRequest.status}`);
        }
        // Update the request status to declined
        const updatedRequest = await (0, dynamodb_1.updateRequestStatus)(existingRequest.userId, requestId, dynamodb_2.RequestStatus.DECLINED, {
            resolvedBy: admin.userId,
            resolutionNote: reason,
        });
        if (!updatedRequest) {
            return response_1.Errors.internalError("Failed to decline request");
        }
        // Add approval record
        await (0, dynamodb_1.addApproval)(requestId, admin.userId, admin.email, "declined", reason);
        // Create notification for the requester
        await (0, dynamodb_1.createNotification)(existingRequest.userId, NOTIFICATION_TYPE_DECLINED, "Request Declined", `Your request for ${existingRequest.accessName} has been declined. Reason: ${reason}`, requestId, existingRequest.accessName);
        const response = {
            request: updatedRequest,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error declining request:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
            if (error.message === "Forbidden") {
                return response_1.Errors.forbidden();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to decline request");
    }
};
exports.handler = handler;
//# sourceMappingURL=declineRequest.js.map