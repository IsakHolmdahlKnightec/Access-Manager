// ============================================================================
// API Response Helpers
// ============================================================================

import type { APIGatewayProxyResult } from "aws-lambda"
import type { ErrorResponse } from "./types"

/**
 * Create a successful API response
 */
export const successResponse = <T>(
  data: T,
  statusCode: number = 200
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    },
    body: JSON.stringify(data),
  }
}

/**
 * Create an error API response
 */
export const errorResponse = (
  error: string,
  message: string,
  statusCode: number = 500
): APIGatewayProxyResult => {
  const response: ErrorResponse = {
    error,
    message,
    statusCode,
  }

  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    },
    body: JSON.stringify(response),
  }
}

/**
 * Common error responses
 */
export const Errors = {
  badRequest: (message: string = "Bad Request") =>
    errorResponse("Bad Request", message, 400),

  unauthorized: (message: string = "Unauthorized") =>
    errorResponse("Unauthorized", message, 401),

  forbidden: (message: string = "Forbidden") =>
    errorResponse("Forbidden", message, 403),

  notFound: (message: string = "Not Found") =>
    errorResponse("Not Found", message, 404),

  conflict: (message: string = "Conflict") =>
    errorResponse("Conflict", message, 409),

  internalError: (message: string = "Internal Server Error") =>
    errorResponse("Internal Server Error", message, 500),

  validationError: (message: string) =>
    errorResponse("Validation Error", message, 400),
}
