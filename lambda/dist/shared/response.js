"use strict";
// ============================================================================
// API Response Helpers
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.errorResponse = exports.successResponse = void 0;
/**
 * Create a successful API response
 */
const successResponse = (data, statusCode = 200) => {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
        },
        body: JSON.stringify(data),
    };
};
exports.successResponse = successResponse;
/**
 * Create an error API response
 */
const errorResponse = (error, message, statusCode = 500) => {
    const response = {
        error,
        message,
        statusCode,
    };
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
        },
        body: JSON.stringify(response),
    };
};
exports.errorResponse = errorResponse;
/**
 * Common error responses
 */
exports.Errors = {
    badRequest: (message = "Bad Request") => (0, exports.errorResponse)("Bad Request", message, 400),
    unauthorized: (message = "Unauthorized") => (0, exports.errorResponse)("Unauthorized", message, 401),
    forbidden: (message = "Forbidden") => (0, exports.errorResponse)("Forbidden", message, 403),
    notFound: (message = "Not Found") => (0, exports.errorResponse)("Not Found", message, 404),
    conflict: (message = "Conflict") => (0, exports.errorResponse)("Conflict", message, 409),
    internalError: (message = "Internal Server Error") => (0, exports.errorResponse)("Internal Server Error", message, 500),
    validationError: (message) => (0, exports.errorResponse)("Validation Error", message, 400),
};
//# sourceMappingURL=response.js.map