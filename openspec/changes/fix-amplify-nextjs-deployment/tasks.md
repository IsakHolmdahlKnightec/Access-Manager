## 1. Dependency Cleanup

- [x] 1.1 Remove `@aws-amplify/adapter-nextjs` from package.json dependencies
- [x] 1.2 Verify no imports of `@aws-amplify/adapter-nextjs` exist in the codebase
- [x] 1.3 Update package-lock.json by running `npm install` after removal

## 2. Postbuild Script Refactoring

- [x] 2.1 Update Node.js runtime from `nodejs18.x` to `nodejs20.x` in deploy-manifest.json template
- [x] 2.2 Add optimized routing configuration for static assets (`/_next/static/*`, `/static/*`)
- [x] 2.3 Implement dual static asset strategy (copy to both compute and static directories)
- [x] 2.4 Add proper static directory structure creation in `.amplify-hosting/static/`
- [x] 2.5 Update public folder copying to both compute and static directories
- [x] 2.6 Verify server.js validation logic is correct

## 3. Build Verification

- [x] 3.1 Run `npm ci` to install dependencies
- [x] 3.2 Run `npm run build` locally to verify build succeeds
- [x] 3.3 Verify `.amplify-hosting/deploy-manifest.json` is created
- [x] 3.4 Verify deploy-manifest.json contains `nodejs20.x` runtime
- [x] 3.5 Verify `.amplify-hosting/compute/default/server.js` exists
- [x] 3.6 Verify `.amplify-hosting/static/_next/static/` exists with assets
- [x] 3.7 Verify all public files are copied to both directories

## 4. Amplify Configuration Verification

- [x] 4.1 Verify `amplify.yml` has correct baseDirectory set to `web/.amplify-hosting`
- [x] 4.2 Verify `next.config.ts` has `output: "standalone"` configured
- [x] 4.3 Confirm Amplify platform is set to WEB_COMPUTE in AWS Console

## 5. Testing and Validation

- [x] 5.1 Test local build process completes without errors
- [x] 5.2 Verify all required files are generated in correct locations
- [x] 5.3 Confirm build output structure matches AWS documentation
- [x] 5.4 Validate deploy-manifest.json JSON structure is valid

## 6. Documentation and Handoff

- [x] 6.1 Create OpenSpec change with proposal.md documenting the problem and solution
- [x] 6.2 Create design.md with technical decisions and rationale
- [x] 6.3 Create specs/amplify-web-compute-deployment/spec.md with requirements
- [x] 6.4 Create tasks.md with all completed tasks documented
- [x] 6.5 Update AGENTS.md or relevant documentation if needed

## 7. Deployment Preparation

- [x] 7.1 Commit all changes to git
- [x] 7.2 Remove and regenerate package-lock.json to reflect dependency removal
- [x] 7.3 Push changes to trigger Amplify deployment
- [ ] 7.4 Monitor deployment logs for success
- [ ] 7.5 Verify application loads correctly at domain
- [ ] 7.6 Test API routes (e.g., `/api/auth/[...nextauth]`)
- [ ] 7.7 Test authentication flow (Cognito login/logout)
- [ ] 7.8 Verify static assets load with correct cache headers

## 8. CRITICAL: Fix Terraform - Add Framework Attribute

### ⚠️ ROOT CAUSE FOUND: Missing `framework` attribute in Terraform

**The `aws_amplify_branch` resource MUST have the `framework` attribute set for WEB_COMPUTE to provision Lambda functions!**

### 8.1 Fix Terraform Configuration

- [x] 8.1.1 Add `framework` attribute to aws_amplify_branch resource
  - File: `infrastructure/modules/amplify/main.tf`
  - Added: `framework = "Next.js - 15"` to aws_amplify_branch.main
  - **This is REQUIRED for Lambda functions to be created**

- [ ] 8.1.2 Apply Terraform changes
  ```bash
  cd infrastructure
  terraform plan
  terraform apply
  ```

- [ ] 8.1.3 Verify Terraform apply succeeds
  - Check output shows aws_amplify_branch resource updated
  - No errors during apply

### 8.2 Verify Lambda Functions Created

- [ ] 8.2.1 Check Lambda functions exist after Terraform apply
  ```bash
  aws lambda list-functions --query 'Functions[*].FunctionName'
  # Should now see a Lambda function for your Amplify app
  ```

- [ ] 8.2.2 Verify Lambda function naming
  - Should contain app ID or name
  - Should be in same region as Amplify app

### 8.3 Trigger Deployment After Infrastructure Fix

- [ ] 8.3.1 Redeploy application
  - Option A: Push empty commit: `git commit --allow-empty -m "trigger deploy" && git push`
  - Option B: Click "Redeploy this version" in Amplify Console

- [ ] 8.3.2 Monitor deployment for compute resource creation
  - Watch for "Creating compute resources..." in build logs
  - Should see Lambda being invoked

### 8.4 Verify CloudWatch Logs

- [ ] 8.4.1 Check log groups exist
  ```bash
  aws logs describe-log-groups --log-group-name-prefix "/aws/lambda"
  # Should now see log group for your Lambda function
  ```

- [ ] 8.4.2 Configure 30-day log retention
  ```bash
  aws logs put-retention-policy \
    --log-group-name "/aws/lambda/<function-name>" \
    --retention-in-days 30
  ```

- [ ] 8.4.3 Trigger application request and verify logs
  - Visit deployed URL
  - Check CloudWatch Logs for entries
  - Should see Lambda runtime logs + application console output

### 8.5 Document the Fix

- [ ] 8.5.1 Update Terraform documentation with framework requirement
- [ ] 8.5.2 Add note to AGENTS.md about WEB_COMPUTE requiring framework attribute
- [ ] 8.5.3 Create troubleshooting guide for future deployments

## Summary

**Root Cause**: The Terraform `aws_amplify_branch` resource was missing the `framework` attribute, which is REQUIRED for AWS Amplify to provision Lambda compute resources when using WEB_COMPUTE platform.

**Fix**: Added `framework = "Next.js - 15"` to the `aws_amplify_branch` resource.

**Impact**: Without this attribute, WEB_COMPUTE deployments create no Lambda functions, resulting in:
- No CloudWatch log groups
- No compute resources for API routes
- Static-only behavior despite WEB_COMPUTE platform setting
