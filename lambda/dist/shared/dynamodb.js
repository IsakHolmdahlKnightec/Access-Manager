"use strict";
// ============================================================================
// DynamoDB Client and Utilities
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOffset = exports.parsePagination = exports.getCurrentTimestamp = exports.generateId = exports.RequestDuration = exports.AccessType = exports.RequestStatus = exports.EntityType = exports.getTableName = exports.docClient = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// Initialize DynamoDB client
const dynamoDBClient = new client_dynamodb_1.DynamoDBClient({});
exports.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoDBClient, {
    marshallOptions: {
        removeUndefinedValues: true,
    },
});
// Table name from environment
const getTableName = () => {
    const tableName = process.env.DYNAMODB_ACCESS_TABLE_NAME;
    if (!tableName) {
        throw new Error("DYNAMODB_ACCESS_TABLE_NAME environment variable is not set");
    }
    return tableName;
};
exports.getTableName = getTableName;
// Entity type constants
exports.EntityType = {
    ACCESS: "ACCESS",
    REQUEST: "REQUEST",
    APPROVAL: "APPROVAL",
    NOTIFICATION: "NOTIFICATION",
    PROJECT: "PROJECT",
    TEAM: "TEAM",
};
// Status constants
exports.RequestStatus = {
    PENDING: "pending",
    APPROVED: "approved",
    DECLINED: "declined",
    CANCELLED: "cancelled",
    MORE_INFO: "more_info",
};
// Access type constants
exports.AccessType = {
    KUBERNETES: "kubernetes",
    AWS: "aws",
    WEB_SERVICE: "web_service",
    DATABASE: "database",
};
// Duration constants
exports.RequestDuration = {
    PERMANENT: "permanent",
    DAYS_30: "30_days",
    DAYS_90: "90_days",
};
// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Generate a unique ID
 */
const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};
exports.generateId = generateId;
/**
 * Get current ISO timestamp
 */
const getCurrentTimestamp = () => {
    return new Date().toISOString();
};
exports.getCurrentTimestamp = getCurrentTimestamp;
const parsePagination = (page, pageSize) => {
    const defaultPageSize = 25;
    const maxPageSize = 100;
    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedPageSize = pageSize ? parseInt(pageSize, 10) : defaultPageSize;
    return {
        page: isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage,
        pageSize: isNaN(parsedPageSize)
            ? defaultPageSize
            : Math.min(parsedPageSize, maxPageSize),
    };
};
exports.parsePagination = parsePagination;
/**
 * Calculate DynamoDB scan offset
 */
const calculateOffset = (page, pageSize) => {
    return (page - 1) * pageSize;
};
exports.calculateOffset = calculateOffset;
//# sourceMappingURL=dynamodb.js.map