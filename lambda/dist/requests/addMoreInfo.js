"use strict";
// ============================================================================
// addMoreInfo - Add additional information to a request in more_info status
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("./dynamodb");
const statusValidation_1 = require("./statusValidation");
const dynamodb_2 = require("../shared/dynamodb");
const MIN_JUSTIFICATION_LENGTH = 10;
const handler = async (event) => {
    try {
        const user = (0, auth_1.requireAuth)(event);
        const requestId = event.pathParameters?.id;
        if (!requestId) {
            return response_1.Errors.badRequest("Request ID is required");
        }
        // Parse request body
        if (!event.body) {
            return response_1.Errors.badRequest("Request body is required");
        }
        const body = JSON.parse(event.body);
        const { message } = body;
        if (!message || message.length < MIN_JUSTIFICATION_LENGTH) {
            return response_1.Errors.validationError(`Message must be at least ${MIN_JUSTIFICATION_LENGTH} characters`);
        }
        // Get the existing request
        const existingRequest = await (0, dynamodb_1.getRequestById)(user.userId, requestId);
        if (!existingRequest) {
            return response_1.Errors.notFound(`Request not found: ${requestId}`);
        }
        // Check if request is in more_info status
        if (!(0, statusValidation_1.canAddMoreInfo)(existingRequest.status)) {
            return response_1.Errors.conflict(`Cannot add more info to request with status: ${existingRequest.status}`);
        }
        // Append the new justification to existing
        const updatedJustification = `${existingRequest.justification}\n\n[Additional Info]: ${message}`;
        // Update the request status back to pending
        const updatedRequest = await (0, dynamodb_1.updateRequestStatus)(user.userId, requestId, dynamodb_2.RequestStatus.PENDING, {
            justification: updatedJustification,
            requestedMoreInfoMessage: "", // Clear the more info request message
        });
        if (!updatedRequest) {
            return response_1.Errors.internalError("Failed to add more info");
        }
        const response = {
            request: updatedRequest,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error adding more info:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to add more info");
    }
};
exports.handler = handler;
//# sourceMappingURL=addMoreInfo.js.map