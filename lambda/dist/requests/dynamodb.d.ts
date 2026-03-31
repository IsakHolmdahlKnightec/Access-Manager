import type { AccessRequest, Approval, Notification } from "../shared/types";
/**
 * Create a new access request
 */
export declare const createRequest: (userId: string, userName: string, userEmail: string, accessId: string, accessName: string, accessType: string, justification: string, duration: string) => Promise<AccessRequest>;
/**
 * Get a single request by user ID and request ID
 */
export declare const getRequestById: (userId: string, requestId: string) => Promise<AccessRequest | null>;
/**
 * Get all requests for a user with pagination
 */
export declare const getRequestsByUser: (userId: string, page?: number, pageSize?: number) => Promise<{
    requests: AccessRequest[];
    total: number;
}>;
/**
 * Update request status
 */
export declare const updateRequestStatus: (userId: string, requestId: string, newStatus: string, additionalFields?: Record<string, unknown>) => Promise<AccessRequest | null>;
/**
 * Add approval record to a request
 */
export declare const addApproval: (requestId: string, adminId: string, adminEmail: string, action: string, reason?: string) => Promise<Approval>;
/**
 * Create a notification for a user
 */
export declare const createNotification: (userId: string, type: string, title: string, message: string, requestId?: string, accessName?: string) => Promise<Notification>;
/**
 * Get all pending requests (admin use)
 */
export declare const getPendingRequests: () => Promise<{
    requests: AccessRequest[];
    total: number;
}>;
/**
 * Get all requests with optional status filter (admin use)
 */
export declare const getAllRequests: (page?: number, pageSize?: number, statusFilter?: string) => Promise<{
    requests: AccessRequest[];
    total: number;
}>;
//# sourceMappingURL=dynamodb.d.ts.map