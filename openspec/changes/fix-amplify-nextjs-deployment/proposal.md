## Why

The deployment to AWS Amplify is failing with the error: "Failed to find the deploy-manifest.json file in the build output." This occurs when using Next.js 15 with API routes on the Amplify WEB_COMPUTE platform. The root causes are:

1. **Node.js version mismatch**: The deploy-manifest.json was configured with `nodejs18.x` runtime, but Next.js 15+ requires Node.js 20.9 or higher
2. **Architecture conflict**: The project includes `@aws-amplify/adapter-nextjs` but uses NextAuth.js for authentication, creating unnecessary dependency conflicts
3. **Missing proper static asset handling**: Static files were not being served optimally through the CDN
4. **Suboptimal routing configuration**: All requests were being routed through compute instead of serving static assets directly

## What Changes

### Critical Fixes
- **Update Node.js runtime** in deploy-manifest.json from `nodejs18.x` to `nodejs20.x` to match Next.js 15 requirements
- **Remove conflicting dependency** `@aws-amplify/adapter-nextjs` from package.json (we're using NextAuth.js, not Amplify Auth)
- **Refactor postbuild.sh** to properly structure the `.amplify-hosting` directory with:
  - Correct compute resource configuration
  - Proper static asset handling for CDN optimization
  - Optimized routing rules for static vs compute requests

### Improvements
- Add dedicated static asset routes with long-term caching (`/_next/static/*`, `/static/*`)
- Implement proper static directory structure in `.amplify-hosting/static/`
- Add fallback routing pattern for files with extensions
- Ensure both static and compute directories have necessary assets

### Build Process
- Ensure `server.js` is properly copied to compute directory
- Copy `.next/static` to both compute (fallback) and static (CDN) directories
- Copy `public/` folder contents to both locations

### CloudWatch Logging
- Configure CloudWatch Logs for WEB_COMPUTE Lambda functions
- Set log retention to 30 days for cost optimization
- Enable CloudWatch Logs Insights for log querying and analysis
- Document logging conventions for application code

## Capabilities

### New Capabilities
- `amplify-web-compute-deployment`: Configuration and scripts for deploying Next.js 15 applications with API routes to AWS Amplify WEB_COMPUTE platform
- `cloudwatch-logging`: CloudWatch Logs integration for application observability and monitoring

### Modified Capabilities
- None (this is a configuration fix, not a requirement change)

## Impact

### Files Modified
- `web/bin/postbuild.sh` - Complete rewrite with proper WEB_COMPUTE structure
- `web/package.json` - Remove `@aws-amplify/adapter-nextjs` dependency
- `web/amplify.yml` - No changes needed (already correct)
- `web/next.config.ts` - No changes needed (already correct)

### Dependencies
- **Removed**: `@aws-amplify/adapter-nextjs` (^1.7.2) - Conflicting with NextAuth.js
- **Kept**: `next-auth` (^5.0.0-beta.30) - Primary authentication library

### Build Output Structure
```
.amplify-hosting/
├── deploy-manifest.json (with nodejs20.x runtime)
├── compute/
│   └── default/
│       ├── server.js
│       ├── node_modules/
│       ├── .next/static/ (fallback)
│       └── [public files]
└── static/
    ├── _next/static/ (CDN-optimized)
    └── [public files]
```

### Runtime Requirements
- **Minimum Node.js version**: 20.9 (matches Next.js 15 requirements)
- **Amplify Platform**: WEB_COMPUTE (required for SSR/API routes)
- **Next.js output mode**: standalone (required for Lambda deployment)

### API Routes
All existing API routes (e.g., `/api/auth/[...nextauth]`) will continue to work through the compute function as before.

### CloudWatch Logging
- Log groups are created under `/aws/lambda/{function-name}` (WEB_COMPUTE uses Lambda)
- Application logs (stdout/stderr) are automatically captured by CloudWatch
- Log groups are created on first Lambda invocation (not at deployment time)
- 30-day log retention provides balance between cost and operational needs
- CloudWatch Logs Insights enables powerful querying of application logs

### Infrastructure Verification
- **CRITICAL**: Lambda functions MUST exist for WEB_COMPUTE to function
- **ROOT CAUSE DISCOVERED**: Terraform missing `framework` attribute in `aws_amplify_branch`
  - Without `framework = "Next.js - 15"`, no Lambda functions are provisioned
  - This is a silent failure - deployment appears successful but has no compute
- Fix: Add `framework` attribute to Terraform aws_amplify_branch resource
- Requires Terraform apply and redeployment

### Risk Assessment
- **Low risk**: These are configuration fixes that align with documented best practices
- **Breaking**: None - all changes are backward compatible
- **Rollback**: Easy - can revert to previous commit if issues arise
- **CloudWatch Costs**: Monitor log volume to manage CloudWatch Logs costs
