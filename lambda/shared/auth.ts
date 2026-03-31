// ============================================================================
// Authentication Helpers
// ============================================================================

import type { APIGatewayProxyEvent } from "aws-lambda"
import type { CognitoUser, AuthenticatedUser } from "./types"

/**
 * Extract and decode JWT token from Authorization header
 */
export const getUserFromEvent = (
  event: APIGatewayProxyEvent
): AuthenticatedUser | null => {
  const authHeader = event.headers.Authorization || event.headers.authorization

  if (!authHeader) {
    return null
  }

  try {
    // Extract the token ( Bearer <token> )
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader

    // Decode the JWT payload (base64url)
    const payload = token.split(".")[1]
    if (!payload) {
      return null
    }

    // Base64url decode
    const decoded = Buffer.from(
      payload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf-8")

    const claims: CognitoUser = JSON.parse(decoded)

    return {
      userId: claims.sub,
      email: claims.email || "",
      name: claims.name || "",
      role: claims["custom:access-manager-role"],
    }
  } catch {
    return null
  }
}

/**
 * Check if user has admin role
 */
export const isAdmin = (user: AuthenticatedUser | null): boolean => {
  return user?.role === "admin"
}

/**
 * Require authentication - throws if not authenticated
 */
export const requireAuth = (event: APIGatewayProxyEvent): AuthenticatedUser => {
  const user = getUserFromEvent(event)

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

/**
 * Require admin role - throws if not admin
 */
export const requireAdmin = (event: APIGatewayProxyEvent): AuthenticatedUser => {
  const user = requireAuth(event)

  if (!isAdmin(user)) {
    throw new Error("Forbidden")
  }

  return user
}
