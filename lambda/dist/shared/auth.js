"use strict";
// ============================================================================
// Authentication Helpers
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = exports.isAdmin = exports.getUserFromEvent = void 0;
/**
 * Extract and decode JWT token from Authorization header
 */
const getUserFromEvent = (event) => {
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) {
        return null;
    }
    try {
        // Extract the token ( Bearer <token> )
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : authHeader;
        // Decode the JWT payload (base64url)
        const payload = token.split(".")[1];
        if (!payload) {
            return null;
        }
        // Base64url decode
        const decoded = Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
        const claims = JSON.parse(decoded);
        return {
            userId: claims.sub,
            email: claims.email || "",
            name: claims.name || "",
            role: claims["custom:access-manager-role"],
        };
    }
    catch {
        return null;
    }
};
exports.getUserFromEvent = getUserFromEvent;
/**
 * Check if user has admin role
 */
const isAdmin = (user) => {
    return user?.role === "admin";
};
exports.isAdmin = isAdmin;
/**
 * Require authentication - throws if not authenticated
 */
const requireAuth = (event) => {
    const user = (0, exports.getUserFromEvent)(event);
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
};
exports.requireAuth = requireAuth;
/**
 * Require admin role - throws if not admin
 */
const requireAdmin = (event) => {
    const user = (0, exports.requireAuth)(event);
    if (!(0, exports.isAdmin)(user)) {
        throw new Error("Forbidden");
    }
    return user;
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.js.map