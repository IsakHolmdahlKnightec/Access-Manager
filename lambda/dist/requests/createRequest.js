"use strict";
// ============================================================================
// createRequest - Create a new access request
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("./dynamodb");
// Minimum justification length
const MIN_JUSTIFICATION_LENGTH = 10;
const handler = async (event) => {
    try {
        const user = (0, auth_1.requireAuth)(event);
        // Parse request body
        if (!event.body) {
            return response_1.Errors.badRequest("Request body is required");
        }
        const body = JSON.parse(event.body);
        const { accessId, accessName, accessType, justification, duration } = body;
        // Validate required fields
        if (!accessId) {
            return response_1.Errors.validationError("accessId is required");
        }
        if (!accessName) {
            return response_1.Errors.validationError("accessName is required");
        }
        if (!accessType) {
            return response_1.Errors.validationError("accessType is required");
        }
        if (!justification || justification.length < MIN_JUSTIFICATION_LENGTH) {
            return response_1.Errors.validationError(`Justification must be at least ${MIN_JUSTIFICATION_LENGTH} characters`);
        }
        if (!duration) {
            return response_1.Errors.validationError("duration is required");
        }
        // Create the request
        const request = await (0, dynamodb_1.createRequest)(user.userId, user.name || user.email, user.email, accessId, accessName, accessType, justification, duration);
        // Create notification for admins (in production, query all admins)
        // For now, we'll create a notification that can be looked up
        // This would typically be done via a batch process or separate admin notification system
        console.log(`New access request created: ${request.id} by user ${user.userId}`);
        const response = {
            request,
        };
        return (0, response_1.successResponse)(response, 201);
    }
    catch (error) {
        console.error("Error creating request:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to create request");
    }
};
exports.handler = handler;
//# sourceMappingURL=createRequest.js.map