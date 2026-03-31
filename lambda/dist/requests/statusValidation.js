"use strict";
// ============================================================================
// Request Status Validation Helpers
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStatuses = exports.isValidStatus = exports.canAddMoreInfo = exports.canRequestMoreInfo = exports.canDeclineRequest = exports.canApproveRequest = exports.canCancelRequest = exports.isValidStatusTransition = void 0;
const dynamodb_1 = require("../shared/dynamodb");
/**
 * Valid status transitions for request lifecycle
 */
const VALID_TRANSITIONS = {
    [dynamodb_1.RequestStatus.PENDING]: [
        dynamodb_1.RequestStatus.APPROVED,
        dynamodb_1.RequestStatus.DECLINED,
        dynamodb_1.RequestStatus.CANCELLED,
        dynamodb_1.RequestStatus.MORE_INFO,
    ],
    [dynamodb_1.RequestStatus.MORE_INFO]: [
        dynamodb_1.RequestStatus.PENDING,
        dynamodb_1.RequestStatus.CANCELLED,
    ],
    [dynamodb_1.RequestStatus.APPROVED]: [],
    [dynamodb_1.RequestStatus.DECLINED]: [],
    [dynamodb_1.RequestStatus.CANCELLED]: [],
};
/**
 * Check if a status transition is valid
 */
const isValidStatusTransition = (currentStatus, newStatus) => {
    const validNextStatuses = VALID_TRANSITIONS[currentStatus];
    return validNextStatuses.includes(newStatus);
};
exports.isValidStatusTransition = isValidStatusTransition;
/**
 * Check if a request can be cancelled
 */
const canCancelRequest = (status) => {
    return (status === dynamodb_1.RequestStatus.PENDING || status === dynamodb_1.RequestStatus.MORE_INFO);
};
exports.canCancelRequest = canCancelRequest;
/**
 * Check if a request can be approved
 */
const canApproveRequest = (status) => {
    return status === dynamodb_1.RequestStatus.PENDING;
};
exports.canApproveRequest = canApproveRequest;
/**
 * Check if a request can be declined
 */
const canDeclineRequest = (status) => {
    return status === dynamodb_1.RequestStatus.PENDING;
};
exports.canDeclineRequest = canDeclineRequest;
/**
 * Check if more info can be requested
 */
const canRequestMoreInfo = (status) => {
    return status === dynamodb_1.RequestStatus.PENDING;
};
exports.canRequestMoreInfo = canRequestMoreInfo;
/**
 * Check if user can add more info (on more_info status)
 */
const canAddMoreInfo = (status) => {
    return status === dynamodb_1.RequestStatus.MORE_INFO;
};
exports.canAddMoreInfo = canAddMoreInfo;
/**
 * Validate status value
 */
const isValidStatus = (status) => {
    return Object.values(dynamodb_1.RequestStatus).includes(status);
};
exports.isValidStatus = isValidStatus;
/**
 * Get all possible statuses
 */
const getAllStatuses = () => {
    return Object.values(dynamodb_1.RequestStatus);
};
exports.getAllStatuses = getAllStatuses;
//# sourceMappingURL=statusValidation.js.map