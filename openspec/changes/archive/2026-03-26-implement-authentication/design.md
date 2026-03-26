## Context

### Current State

The Access Manager application has a complete frontend foundation:
- Next.js 15 with TypeScript and Tailwind CSS
- "Digital Vault" design system (deep midnight blues, no-line aesthetic)
- Comprehensive UI component library (buttons, inputs, cards, navigation)
- Landing page with hero section and feature grid
- Existing login page design in `/access_manager_design/refined_employee_login_desktop/code.html`
- Layout components (Header, Sidebar, Navigation shell)

Infrastructure is deployed via Terraform:
- AWS Cognito User Pool with email-based authentication
- Cognito App Client configured for OAuth2/OIDC flows
- DynamoDB tables for users and sessions
- Amplify ready for frontend hosting
- S3 backend for Terraform state

### Problem

The frontend has no authentication integration. Users can browse the landing page, but:
- No login functionality exists
- No route protection
- No session management
- No identity context for personalized features
- Cannot proceed to access management features (requests, approvals, etc.)

The application is a "vault with no lock" - beautifully designed but functionally inaccessible.

### Constraints

- Must use existing AWS Cognito infrastructure (already deployed)
- Must maintain the "Digital Vault" design aesthetic
- Must support both email/password and future SSO expansion
- Must work with Next.js App Router (Server Components)
- Must be cost-effective (serverless-first)
- JWT sessions preferred per roadmap (Phase 2 requirements)

## Goals / Non-Goals

**Goals:**
- Integrate NextAuth.js v5 (Auth.js) with AWS Cognito as OIDC provider
- Implement custom login page matching existing "Digital Vault" design
- Establish JWT-based session management with automatic token refresh
- Protect all application routes except `/login` via middleware
- Display authenticated user information in navigation
- Support seamless authentication flow (login → dashboard)
- Enable logout functionality

**Non-Goals:**
- Multi-factor authentication (MFA) in this phase (Cognito supports it, but UI deferred)
- Social login providers (Google, GitHub) - Cognito supports but not enabling yet
- Password reset flow UI (Cognito handles this via email)
- User registration UI (admin-created users only)
- Role-based access control (RBAC) enforcement - identity only, authorization later
- API route protection beyond session validation

## Decisions

### Decision 1: NextAuth.js (Auth.js) v5 as Authentication Framework

**Choice:** Use NextAuth.js v5 (Auth.js) with Cognito provider

**Rationale:**
- Native Next.js integration with App Router support
- Built-in JWT session strategy (aligns with roadmap)
- Automatic token refresh handling
- Custom login page support (preserves our design)
- CSRF protection and secure cookie handling out-of-box
- Active community and documentation

**Alternatives Considered:**
- *AWS Amplify Auth*: Too heavy, vendor-specific, less flexible for custom UI
- *Cognito Hosted UI*: Doesn't match "Digital Vault" aesthetic, redirects away from app
- *Custom OIDC implementation*: Too much boilerplate, security risks

### Decision 2: JWT Session Strategy with Database Fallback

**Choice:** JWT sessions stored in httpOnly cookies, with refresh tokens from Cognito

**Rationale:**
- Stateless - no database writes for every request (cheaper)
- Works with Server Components (no fetch to session API)
- Automatic refresh via NextAuth.js callbacks
- Aligns with roadmap Phase 2 requirements

**Token Lifetimes:**
- Access Token: 1 hour (Cognito default)
- Refresh Token: 30 days (Cognito default)
- NextAuth Session: 24 hours (with refresh)

**Alternatives Considered:**
- *Database sessions*: More complex, requires DynamoDB writes per request, but easier revocation
- *Cognito tokens directly*: Bypass NextAuth, but lose middleware integration and session abstraction

### Decision 3: Middleware-Based Route Protection

**Choice:** Use Next.js middleware to intercept requests and redirect to `/login` if unauthenticated

**Rationale:**
- Runs at edge (Vercel/AWS Lambda@Edge) - fast, scalable
- Protects all routes uniformly
- Can exclude specific paths (public assets, API routes)
- Works with App Router architecture

**Protected Pattern:**
```
All routes → Check session → Valid: continue | Invalid: redirect to /login
Except: /login, /api/auth/*, static assets
```

**Alternatives Considered:**
- *Component-level protection*: More granular but repetitive, easy to miss routes
- *Layout-level protection*: Cleaner but doesn't prevent direct URL access

### Decision 4: Custom Login Page Over Cognito Hosted UI

**Choice:** Build custom login page adapting existing design, integrate with NextAuth

**Rationale:**
- Preserves "Digital Vault" aesthetic (midnight blue, glassmorphism)
- Seamless user experience (no redirect to AWS domain)
- Full control over form fields and validation
- Can add SSO buttons later without AWS UI constraints

**Implementation:**
- Form submits credentials to NextAuth `/api/auth/callback/credentials` (or Cognito via authorize callback)
- Error handling integrated with design system
- Loading states match component library

**Alternatives Considered:**
- *Cognito Hosted UI*: Faster to implement but breaks design continuity
- *Amplify UI components*: Pre-built but generic styling, heavy bundle

### Decision 5: Environment Variable Configuration

**Choice:** Configure Cognito via environment variables, not hardcoded

**Variables Required:**
```
NEXTAUTH_URL=http://localhost:3000 (or deployed URL)
NEXTAUTH_SECRET=<random-secret-for-jwt-signing>
COGNITO_USER_POOL_ID=eu-north-1_xxxxxxxxx
COGNITO_APP_CLIENT_ID=xxxxxxxxxxxxxxxx
COGNITO_DOMAIN=access-manager.auth.eu-north-1.amazoncognito.com
```

**Rationale:**
- Different environments (dev/staging/prod) can use different Cognito pools
n- Secrets stay out of code
- Follows 12-factor app methodology

### Decision 6: Admin-Only User Creation

**Choice:** Configure Cognito User Pool to disable self-registration and enforce admin-only user creation.

**Implementation:**
- Set `allow_admin_create_user_only = true` in Cognito configuration
- Administrators create users via AWS Console or AWS CLI
- Users receive temporary password via email and must change on first login

**Rationale:**
- Aligns with enterprise security model for access management
- Prevents unauthorized account creation
- Administrators have full control over user provisioning
- Simpler than building custom user management UI for this phase

**Alternatives Considered:**
- *Self-registration*: Easier for users but creates security risk
- *Custom admin UI*: Better long-term but adds complexity; deferred to future phase

## Risks / Trade-offs

**[Risk] Token refresh failures could log users out unexpectedly**
→ Mitigation: Implement error handling in refresh callback; graceful degradation to login page with "session expired" message

**[Risk] JWT in cookies vulnerable to XSS if not httpOnly**
→ Mitigation: NextAuth.js uses httpOnly cookies by default; ensure no client-side JavaScript can access tokens

**[Risk] Session state mismatch between Server Components and client**
→ Mitigation: Use NextAuth.js SessionProvider; always wrap data fetching with session validation

**[Risk] Cognito rate limits on authentication requests**
→ Mitigation: Implement exponential backoff on failed login attempts; consider CAPTCHA for repeated failures (future)

**[Trade-off] JWT sessions cannot be instantly revoked**
→ Accepted: Short access token lifetime (1 hour) limits exposure; refresh token rotation on each use provides some protection; full revocation requires custom session store (can add later if needed)

**[Trade-off] NextAuth.js adds bundle size (~20KB gzipped)**
→ Accepted: Justified by security features, maintenance reduction, and faster development

## Migration Plan

### Phase 1: Development Setup
1. Install NextAuth.js: `npm install next-auth`
2. Create `.env.local` with Cognito configuration (use Terraform outputs)
3. Verify Cognito App Client allows `http://localhost:3000/api/auth/callback/cognito` callback URL

### Phase 2: Configuration
1. Create `auth.ts` with Cognito provider configuration
2. Create `app/api/auth/[...nextauth]/route.ts` API route handler
3. Create `middleware.ts` with route protection rules
4. Update `app/layout.tsx` with SessionProvider

### Phase 3: Login Page
1. Create `app/login/page.tsx` adapting existing design
2. Integrate NextAuth signIn function
3. Add error handling and loading states
4. Test authentication flow locally

### Phase 4: Protected Routes
1. Verify middleware redirects unauthenticated users to `/login`
2. Update `user-nav.tsx` to show authenticated user info
3. Add logout functionality
4. Test protected route access

### Phase 5: Deployment
1. Build application: `npm run build`
2. Deploy to Amplify
3. Update Cognito App Client callback URLs for production domain
4. Set environment variables in Amplify console
5. Verify end-to-end flow in production

### Rollback Strategy
1. Revert to previous Amplify deployment
2. Or disable middleware temporarily to make all routes public
3. Cognito configuration remains unchanged

## Open Questions

1. **Should we implement "remember me" functionality?** Currently refresh tokens last 30 days; explicit "remember me" could extend this, but adds complexity.

2. **What happens to existing sessions when we deploy?** Users will be logged out (no session cookie). Acceptable for initial launch, but future updates should maintain backward compatibility.

3. **Do we need API key authentication for programmatic access?** Not in this phase, but might need service-to-service auth later.

4. **Should we track login attempts in DynamoDB?** Could be useful for security auditing, but not required for MVP.
