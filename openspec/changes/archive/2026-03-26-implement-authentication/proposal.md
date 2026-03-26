## Why

The Access Manager application currently has a polished frontend with no actual functionality - users cannot log in, access is not protected, and there's no identity layer. Authentication is fundamental to all subsequent features (access requests, approvals, role management). Without auth, we have a "vault with no lock" - beautiful but unusable. This change establishes the identity foundation using the existing AWS Cognito infrastructure.

## What Changes

- Integrate NextAuth.js (Auth.js v5) with AWS Cognito as the OIDC provider
- Create custom login page adapting the existing "Digital Vault" design
- Implement JWT-based session management with automatic token refresh
- Add middleware to protect all routes except `/login` (redirects unauthenticated users)
- Configure environment variables for Cognito integration (User Pool ID, App Client ID, Domain)
- Update user navigation to display logged-in user info and logout functionality
- Establish the authentication context provider for the React component tree

## Capabilities

### New Capabilities
- `nextjs-cognito-auth`: Next.js authentication integration using NextAuth.js with AWS Cognito OIDC provider
- `protected-routes`: Route-level authentication protection via Next.js middleware
- `session-management`: JWT token handling, persistence, and automatic refresh mechanism
- `login-page`: Custom authentication UI adapting the existing "Digital Vault" design system

### Modified Capabilities
- None (this is new authentication infrastructure)

## Impact

- **New Dependencies**: `next-auth` package and related peer dependencies
- **Environment Variables**: Requires `COGNITO_USER_POOL_ID`, `COGNITO_APP_CLIENT_ID`, `COGNITO_DOMAIN`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **AWS Services**: Uses existing Cognito User Pool (already deployed via Terraform)
- **Frontend Changes**: 
  - New `/login` page route
  - New API route `/api/auth/[...nextauth]` for auth handlers
  - New `middleware.ts` for route protection
  - Updated `layout.tsx` with session provider
  - Updated `user-nav.tsx` component with auth state
- **Security**: Implements secure httpOnly cookies for session tokens, CSRF protection via NextAuth.js
- **User Experience**: Seamless login with automatic token refresh; protected app experience
