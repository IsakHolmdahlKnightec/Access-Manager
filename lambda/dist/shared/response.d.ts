import type { APIGatewayProxyResult } from "aws-lambda";
/**
 * Create a successful API response
 */
export declare const successResponse: <T>(data: T, statusCode?: number) => APIGatewayProxyResult;
/**
 * Create an error API response
 */
export declare const errorResponse: (error: string, message: string, statusCode?: number) => APIGatewayProxyResult;
/**
 * Common error responses
 */
export declare const Errors: {
    badRequest: (message?: string) => APIGatewayProxyResult;
    unauthorized: (message?: string) => APIGatewayProxyResult;
    forbidden: (message?: string) => APIGatewayProxyResult;
    notFound: (message?: string) => APIGatewayProxyResult;
    conflict: (message?: string) => APIGatewayProxyResult;
    internalError: (message?: string) => APIGatewayProxyResult;
    validationError: (message: string) => APIGatewayProxyResult;
};
//# sourceMappingURL=response.d.ts.map