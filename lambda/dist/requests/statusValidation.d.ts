import type { RequestStatusType } from "../shared/dynamodb";
/**
 * Check if a status transition is valid
 */
export declare const isValidStatusTransition: (currentStatus: RequestStatusType, newStatus: RequestStatusType) => boolean;
/**
 * Check if a request can be cancelled
 */
export declare const canCancelRequest: (status: RequestStatusType) => boolean;
/**
 * Check if a request can be approved
 */
export declare const canApproveRequest: (status: RequestStatusType) => boolean;
/**
 * Check if a request can be declined
 */
export declare const canDeclineRequest: (status: RequestStatusType) => boolean;
/**
 * Check if more info can be requested
 */
export declare const canRequestMoreInfo: (status: RequestStatusType) => boolean;
/**
 * Check if user can add more info (on more_info status)
 */
export declare const canAddMoreInfo: (status: RequestStatusType) => boolean;
/**
 * Validate status value
 */
export declare const isValidStatus: (status: string) => status is RequestStatusType;
/**
 * Get all possible statuses
 */
export declare const getAllStatuses: () => RequestStatusType[];
//# sourceMappingURL=statusValidation.d.ts.map