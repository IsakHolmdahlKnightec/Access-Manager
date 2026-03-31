import type { APIGatewayProxyEvent } from "aws-lambda";
import type { AuthenticatedUser } from "./types";
/**
 * Extract and decode JWT token from Authorization header
 */
export declare const getUserFromEvent: (event: APIGatewayProxyEvent) => AuthenticatedUser | null;
/**
 * Check if user has admin role
 */
export declare const isAdmin: (user: AuthenticatedUser | null) => boolean;
/**
 * Require authentication - throws if not authenticated
 */
export declare const requireAuth: (event: APIGatewayProxyEvent) => AuthenticatedUser;
/**
 * Require admin role - throws if not admin
 */
export declare const requireAdmin: (event: APIGatewayProxyEvent) => AuthenticatedUser;
//# sourceMappingURL=auth.d.ts.map