"use strict";
// ============================================================================
// approveRequest - Approve a pending request (admin only)
// ============================================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const auth_1 = require("../shared/auth");
const response_1 = require("../shared/response");
const dynamodb_1 = require("../requests/dynamodb");
const statusValidation_1 = require("../requests/statusValidation");
const dynamodb_2 = require("../shared/dynamodb");
// Notification type for request approval
const NOTIFICATION_TYPE_APPROVED = "request_approved";
const handler = async (event) => {
    try {
        const admin = (0, auth_1.requireAdmin)(event);
        const requestId = event.pathParameters?.id;
        if (!requestId) {
            return response_1.Errors.badRequest("Request ID is required");
        }
        // Get the existing request - we need to find it first
        // Since admin doesn't have USER# prefix, we need to search
        // In production, we'd have a GSI for this
        const { getAllRequests } = await Promise.resolve().then(() => __importStar(require("../requests/dynamodb")));
        const { requests } = await getAllRequests(1, 100);
        const existingRequest = requests.find((r) => r.id === requestId);
        if (!existingRequest) {
            return response_1.Errors.notFound(`Request not found: ${requestId}`);
        }
        // Check if request can be approved
        if (!(0, statusValidation_1.canApproveRequest)(existingRequest.status)) {
            return response_1.Errors.conflict(`Cannot approve request with status: ${existingRequest.status}`);
        }
        // Update the request status to approved
        const updatedRequest = await (0, dynamodb_1.updateRequestStatus)(existingRequest.userId, requestId, dynamodb_2.RequestStatus.APPROVED, {
            resolvedBy: admin.userId,
            resolutionNote: "Approved by admin",
        });
        if (!updatedRequest) {
            return response_1.Errors.internalError("Failed to approve request");
        }
        // Add approval record
        await (0, dynamodb_1.addApproval)(requestId, admin.userId, admin.email, "approved");
        // Create notification for the requester
        await (0, dynamodb_1.createNotification)(existingRequest.userId, NOTIFICATION_TYPE_APPROVED, "Request Approved", `Your request for ${existingRequest.accessName} has been approved.`, requestId, existingRequest.accessName);
        const response = {
            request: updatedRequest,
        };
        return (0, response_1.successResponse)(response);
    }
    catch (error) {
        console.error("Error approving request:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return response_1.Errors.unauthorized();
            }
            if (error.message === "Forbidden") {
                return response_1.Errors.forbidden();
            }
        }
        return response_1.Errors.internalError(error instanceof Error ? error.message : "Failed to approve request");
    }
};
exports.handler = handler;
//# sourceMappingURL=approveRequest.js.map