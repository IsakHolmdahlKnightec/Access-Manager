import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
export declare const docClient: DynamoDBDocumentClient;
export declare const getTableName: () => string;
export declare const EntityType: {
    readonly ACCESS: "ACCESS";
    readonly REQUEST: "REQUEST";
    readonly APPROVAL: "APPROVAL";
    readonly NOTIFICATION: "NOTIFICATION";
    readonly PROJECT: "PROJECT";
    readonly TEAM: "TEAM";
};
export declare const RequestStatus: {
    readonly PENDING: "pending";
    readonly APPROVED: "approved";
    readonly DECLINED: "declined";
    readonly CANCELLED: "cancelled";
    readonly MORE_INFO: "more_info";
};
export type RequestStatusType = (typeof RequestStatus)[keyof typeof RequestStatus];
export declare const AccessType: {
    readonly KUBERNETES: "kubernetes";
    readonly AWS: "aws";
    readonly WEB_SERVICE: "web_service";
    readonly DATABASE: "database";
};
export type AccessTypeValue = (typeof AccessType)[keyof typeof AccessType];
export declare const RequestDuration: {
    readonly PERMANENT: "permanent";
    readonly DAYS_30: "30_days";
    readonly DAYS_90: "90_days";
};
/**
 * Generate a unique ID
 */
export declare const generateId: () => string;
/**
 * Get current ISO timestamp
 */
export declare const getCurrentTimestamp: () => string;
/**
 * Parse pagination parameters from query string
 */
export interface PaginationParams {
    page: number;
    pageSize: number;
}
export declare const parsePagination: (page?: string, pageSize?: string) => PaginationParams;
/**
 * Calculate DynamoDB scan offset
 */
export declare const calculateOffset: (page: number, pageSize: number) => number;
//# sourceMappingURL=dynamodb.d.ts.map