## Context

### Background
The project is an OpenSpec Access Manager built with Next.js 15, using NextAuth.js for authentication with AWS Cognito. The application includes API routes (specifically `/api/auth/[...nextauth]`) for handling authentication callbacks, sessions, and token refresh.

### Current State
- **Next.js Version**: 15.5.14 (requires Node.js 20.9+)
- **Authentication**: NextAuth.js v5 beta with Cognito provider
- **Deployment Target**: AWS Amplify Hosting WEB_COMPUTE platform
- **Build Output**: Next.js standalone mode (required for Lambda deployment)
- **Current Issue**: Deployment fails with "deploy-manifest.json not found" error

### Constraints
- Must support API routes (cannot use static export)
- Must maintain existing NextAuth.js authentication flow
- Must work with Amplify WEB_COMPUTE platform (not WEB_DYNAMIC or WEB_STATIC)
- Must follow AWS documented deployment patterns for SSR frameworks

### Stakeholders
- Development team needing working deployments
- End users requiring authentication via Cognito
- Operations team managing AWS infrastructure

## Goals / Non-Goals

**Goals:**
- Fix the deploy-manifest.json error and enable successful deployments
- Update Node.js runtime to match Next.js 15 requirements (20.x)
- Remove conflicting dependencies (@aws-amplify/adapter-nextjs)
- Optimize static asset serving through CDN with proper caching
- Maintain full compatibility with existing API routes

**Non-Goals:**
- No changes to authentication logic or NextAuth.js configuration
- No changes to application business logic or UI components
- No migration to a different hosting platform
- No migration from NextAuth.js to Amplify Auth
- No upgrade of Next.js version at this time

## Decisions

### Decision 1: Use Custom postbuild.sh Instead of Framework Adapter

**Choice**: Maintain the custom postbuild.sh script approach rather than using an official framework adapter.

**Rationale**:
- AWS does not provide an official Next.js framework adapter for Amplify WEB_COMPUTE
- The postbuild.sh pattern is documented by AWS as the standard approach for custom SSR frameworks
- The script provides full control over the deployment structure
- Community solutions like OpenNext exist but add complexity (SST/CDK dependency)

**Alternatives Considered**:
- OpenNext: Rejected due to additional infrastructure complexity
- Static export: Rejected because API routes are required
- WEB_DYNAMIC platform: Rejected because it only supports Next.js 11

### Decision 2: Remove @aws-amplify/adapter-nextjs Dependency

**Choice**: Remove the `@aws-amplify/adapter-nextjs` package entirely.

**Rationale**:
- The package is designed for Amplify Gen 2 with Amplify Auth
- The project uses NextAuth.js with Cognito, not Amplify Auth
- The dependency creates confusion and potential conflicts
- NextAuth.js works directly with Cognito without needing Amplify adapters

**Alternatives Considered**:
- Keep dependency but don't use it: Rejected - unnecessary bloat and confusion
- Migrate to Amplify Auth: Rejected - would require significant authentication refactoring

### Decision 3: Dual Static Asset Strategy

**Choice**: Copy static assets to both `compute/default/` (fallback) and `static/` (CDN-optimized).

**Rationale**:
- AWS Amplify WEB_COMPUTE serves static files from `.amplify-hosting/static/` via CDN
- Standalone Next.js server expects static files in its own directory structure
- Having both ensures compatibility with both serving methods
- The deploy-manifest.json routes can fall back to compute if needed

**Structure**:
```
.amplify-hosting/
├── static/_next/static/     # CDN-served with long-term caching
└── compute/default/.next/static/  # Fallback for standalone server
```

### Decision 4: Optimized Routing Configuration

**Choice**: Configure routes to serve static assets directly from CDN before falling back to compute.

**Rationale**:
- Static assets (`/_next/static/*`) should be served with immutable caching headers
- Compute functions have cost and cold start implications
- Proper routing reduces latency for static assets
- AWS documentation recommends this pattern for optimal performance

**Route Priority**:
1. `/_next/static/*` → Static (immutable cache)
2. `/static/*` → Static (immutable cache)
3. `/*.*` → Static with fallback to Compute (for files with extensions)
4. `/*` → Compute (catch-all for SSR/API routes)

### Decision 5: Keep Node.js 20.x (Not 22.x)

**Choice**: Use `nodejs20.x` runtime instead of `nodejs22.x`.

**Rationale**:
- Next.js 15 requires minimum Node.js 20.9
- AWS Amplify supports nodejs20.x for WEB_COMPUTE
- Using the minimum required version reduces risk of compatibility issues
- Can upgrade to 22.x later after deployment is stable

**Alternatives Considered**:
- nodejs22.x: Could work but adds unnecessary risk for initial fix
- nodejs18.x: Current broken state - doesn't meet Next.js 15 requirements

## Risks / Trade-offs

### Risk: Dependency Removal May Break Something Unexpected
**Risk**: Removing `@aws-amplify/adapter-nextjs` might have unforeseen side effects if parts of the codebase depend on it.
→ **Mitigation**: The package was only in dependencies, not actively imported in the auth flow. Build and test locally before deploying.

### Risk: Routing Changes May Affect Asset Loading
**Risk**: The new routing configuration could cause 404s for static assets if paths don't match.
→ **Mitigation**: Test build locally and verify all static files are in expected locations. The dual-copy strategy provides fallback safety.

### Risk: Amplify Platform Setting May Be Wrong
**Risk**: If the Amplify app is set to WEB_DYNAMIC or WEB_STATIC instead of WEB_COMPUTE, the deployment will fail.
→ **Mitigation**: Verify platform setting in AWS Console before deploying. Provide CLI command to update if needed.

### Risk: Node.js 20.x Not Available in All Regions
**Risk**: Some AWS regions may not support nodejs20.x for WEB_COMPUTE yet.
→ **Mitigation**: nodejs20.x is widely available as of 2024. If issues arise, can fall back to nodejs18.x with Next.js 14 (not ideal but workable).

### Trade-off: Manual Postbuild vs Framework Adapter
**Trade-off**: The custom postbuild.sh requires maintenance if AWS changes deployment specs.
→ **Acceptance**: AWS deployment specs are stable. The script is well-documented and follows official patterns.

## Migration Plan

### Pre-Deployment Checklist
1. ✅ Verify changes in local build (`npm run build`)
2. ✅ Confirm `.amplify-hosting/deploy-manifest.json` is created
3. ✅ Verify `server.js` exists in compute directory
4. ✅ Check AWS Console: Platform = WEB_COMPUTE
5. ⏳ Update package-lock.json (remove old dependency)

### Deployment Steps
1. Commit all changes to git
2. Remove package-lock.json and run `npm install` to update lockfile
3. Push to trigger Amplify deployment
4. Monitor build logs for errors
5. Verify application loads and API routes work
6. Test authentication flow (login/logout)

### Rollback Strategy
If deployment fails:
1. Revert to previous commit: `git revert HEAD`
2. Push to trigger rebuild with previous configuration
3. Investigate error logs and fix issues
4. Retry deployment

### Verification Steps
1. ✅ Build completes without errors
2. ✅ deploy-manifest.json is found by Amplify
3. ✅ Application loads at domain
4. ✅ Static assets load (CSS, JS, images)
5. ✅ API routes respond correctly
6. ✅ Authentication flow works (Cognito callbacks)

### Decision 6: CloudWatch Logging Configuration

**Choice**: Enable CloudWatch Logs for the Amplify WEB_COMPUTE deployment with 30-day retention.

**Rationale**:
- WEB_COMPUTE uses Lambda functions which automatically send logs to CloudWatch
- CloudWatch Logs provides essential observability for debugging and monitoring
- 30-day retention balances cost with operational needs
- Logs include both Lambda runtime and application stdout/stderr
- CloudWatch Logs Insights enables powerful log querying

**Implementation**:
- CloudWatch logging is automatically enabled for Amplify WEB_COMPUTE
- Log groups are created when the first log entry is written (not at deployment time)
- **IMPORTANT**: Log groups for WEB_COMPUTE appear under `/aws/lambda/` prefix, NOT `/aws/amplify/`
- Lambda function names follow pattern: `<app-id>-<branch>-<random>` or similar
- Application should use structured logging (JSON) for better queryability
- Retention can be configured via AWS Console or CLI

**Finding Log Groups**:
1. Ensure deployment completed successfully in Amplify Console
2. Verify platform is set to WEB_COMPUTE (not WEB_DYNAMIC or WEB_STATIC)
3. Verify Lambda function actually exists: `aws lambda list-functions`
4. Trigger at least one request to the application (logs are created lazily)
5. **Search under `/aws/lambda/`** - This is where WEB_COMPUTE Lambda logs go
6. If still no logs, manually invoke Lambda to force log group creation

**Note on Log Group Location**:
- WEB_STATIC: Logs go to S3/CloudFront (different mechanism)
- WEB_DYNAMIC: Legacy platform, logs may vary
- **WEB_COMPUTE**: Logs ALWAYS go to `/aws/lambda/{function-name}`

**Alternatives Considered**:
- Third-party logging (Datadog, etc.): Rejected - adds cost and complexity
- Custom log shipping: Rejected - unnecessary with built-in CloudWatch integration
- No logging: Rejected - unacceptable for production operations

### Decision 7: Application Logging Strategy

**Choice**: Use console methods (console.log, console.error) which are captured by CloudWatch.

**Rationale**:
- Next.js standalone server stdout/stderr is automatically captured by Lambda
- No additional logging library needed for basic needs
- CloudWatch Logs Insights can parse and query logs effectively
- Structured JSON logging can be added later if needed

**Log Levels**:
- `console.log` - General information, request handling
- `console.warn` - Warnings, non-critical issues
- `console.error` - Errors, exceptions, authentication failures

**Alternatives Considered**:
- Winston/Pino logging libraries: Could be added later for structured logging
- AWS X-Ray: Could be added for distributed tracing

## Risks / Trade-offs

### Risk: CloudWatch Logs Costs
**Risk**: CloudWatch Logs can become expensive with high log volume.
→ **Mitigation**: 30-day retention limit, monitor log volume, consider log sampling for high-traffic scenarios.

### Risk: Log Group Retention Misconfiguration
**Risk**: Logs may be retained longer than necessary or deleted too quickly.
→ **Mitigation**: Standardize on 30-day retention, document change process for retention adjustments.

### Risk: PII in Logs
**Risk**: Sensitive user data may be accidentally logged to CloudWatch.
→ **Mitigation**: Code review process for logging statements, avoid logging request bodies with credentials or tokens.

### Risk: Log Groups Not Appearing
**Risk**: CloudWatch log groups may not be found after deployment.
→ **Mitigation**: 
- Verify deployment succeeded in Amplify Console
- Confirm platform is WEB_COMPUTE (check app settings)
- Trigger at least one request to the app (logs are created on first write, not at deploy)
- Search both `/aws/lambda/` and `/aws/amplify/` prefixes
- Wait 2-3 minutes after first request for logs to propagate

### Risk: No Lambda Functions Created (CRITICAL)
**Risk**: WEB_COMPUTE platform may not actually create Lambda infrastructure.
→ **Mitigation**:
- **CRITICAL**: Verify Lambda functions actually exist: `aws lambda list-functions`
- **MOST COMMON CAUSE**: Missing `framework` attribute in branch configuration
  - Terraform: Must set `framework = "Next.js - 15"` in `aws_amplify_branch`
  - AWS Console: Must set Framework in branch settings
  - Without this, WEB_COMPUTE creates NO Lambda functions!
- If no Lambda exists, check:
  1. `framework` attribute is set on the branch
  2. Build logs for "deploy-manifest.json" errors
  3. `baseDirectory` in amplify.yml points to correct location
  4. Platform is explicitly set: `aws amplify update-app --platform WEB_COMPUTE`
- If still failing, escalate to AWS Support or consider alternative deployment

## Open Questions

None at this time. All technical decisions have been made and implemented.
