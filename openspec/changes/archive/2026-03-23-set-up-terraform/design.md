## Context

The Access Manager application is a Next.js web application requiring AWS infrastructure for production deployment. Currently, there is no infrastructure defined. This design establishes the foundation for Infrastructure as Code (IaC) using Terraform to manage all AWS resources.

**Current State:**
- Next.js 15 application in `/web/` directory
- No existing AWS infrastructure or Terraform configurations
- Design system defined in `/access_manager_design/`
- OpenSpec-driven development workflow

**Constraints:**
- Must use AWS as cloud provider
- Must follow AWS Well-Architected security best practices
- Infrastructure must be version-controlled and reproducible

## Goals / Non-Goals

**Goals:**
- Establish modular, maintainable Terraform project structure
- Configure secure AWS provider with remote state management
- Deploy Amplify for Next.js frontend hosting with CI/CD integration
- Provision DynamoDB tables with proper schema design for users and sessions
- Set up Cognito User Pool with secure authentication flows
- Define IAM roles following principle of least privilege
- Implement secure secrets management with AWS Secrets Manager and Parameter Store

**Non-Goals:**
- Multiple environment support (dev/staging/prod)
- ECS/Fargate container infrastructure (not needed for Amplify-hosted frontend)
- RDS databases (using DynamoDB for serverless data)
- API Gateway or Lambda functions (handled by Next.js API routes in Amplify)
- CDN/CloudFront custom configuration (Amplify handles this)
- VPN or private networking (not required for this architecture)

## Decisions

### 1. Terraform Project Structure: Simple Modular Layout

**Decision:** Use a straightforward modular Terraform structure without workspaces or environment separation.

**Rationale:**
- Single environment keeps the architecture simple and manageable
- No workspace complexity or environment variable switching needed
- Easier to understand and maintain for a single deployment
- Direct mapping from code to infrastructure

**Structure:**
```
/infrastructure/
├── main.tf                 # Provider and backend configuration
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── terraform.tfvars        # Variable values
├── modules/
│   ├── amplify/            # Amplify app module
│   ├── cognito/            # Cognito User Pool module
│   ├── dynamodb/           # DynamoDB tables module
│   └── iam/                # IAM roles and policies module
└── backend/
    └── bootstrap/          # One-time bootstrap for S3 backend and DynamoDB lock table
```

### 2. State Management: S3 Backend with DynamoDB Locking

**Decision:** Use S3 for remote state storage with DynamoDB for state locking.

**Rationale:**
- S3 provides durable, versioned state storage
- DynamoDB ensures only one person can apply changes at a time (prevents corruption)
- Enables team collaboration on infrastructure
- State encryption at rest enabled by default

**Configuration:**
- S3 bucket: `access-manager-terraform-state-{account-id}` with versioning enabled
- DynamoDB table: `terraform-state-lock` with partition key `LockID`
- State encryption using AWS SSE-S3

### 3. Secrets Management: Hybrid Approach (SSM Parameter Store + Secrets Manager)

**Decision:** Use AWS Systems Manager Parameter Store for non-sensitive configuration and AWS Secrets Manager for sensitive secrets (API keys).

**Rationale:**
- Parameter Store is cost-effective for configuration values (free tier)
- Secrets Manager provides automatic rotation for credentials
- Both integrate natively with Terraform and IAM
- Clear separation: Parameter Store for config, Secrets Manager for secrets

**Usage:**
- Parameter Store (`/access-manager/config/*`): Feature flags, non-sensitive app config
- Secrets Manager (`access-manager/secrets/*`): API keys, credentials

### 4. DynamoDB Capacity: On-Demand Mode

**Decision:** Use DynamoDB on-demand capacity mode instead of provisioned capacity.

**Rationale:**
- Pay-per-request pricing model suitable for variable workloads
- No capacity planning needed during initial development
- Scales automatically with application growth
- Can migrate to provisioned later with auto-scaling if cost optimization needed

**Alternative Considered:** Provisioned capacity with auto-scaling - rejected due to operational complexity during initial development phase.

### 5. Cognito User Pool: Email-based Sign-in with MFA

**Decision:** Configure Cognito User Pool with email as username, required email verification, and optional MFA via TOTP/SMS.

**Rationale:**
- Email is familiar to users and doesn't require username management
- Email verification ensures valid contact information
- MFA provides additional security layer for sensitive access management
- Supports OAuth 2.0 flows for third-party integrations

**Configuration:**
- Alias attribute: `email` (allows sign-in with email)
- Required attributes: `email`
- MFA: Optional (can be enforced later)
- Password policy: 8+ characters, requires uppercase, lowercase, number, symbol
- App client: Public client with allowed OAuth flows (authorization code grant, implicit)

### 6. IAM Strategy: Role-Based with Least Privilege

**Decision:** Create specific IAM roles for each service/component rather than using AWS-managed policies broadly.

**Rationale:**
- Principle of least privilege reduces blast radius of compromised credentials
- Custom policies document exactly what each component needs
- Easier to audit and review permissions
- Follows AWS security best practices

**Roles to Create:**
- `AmplifyExecutionRole`: Read access to Parameter Store, Secrets Manager
- `DynamoDBAccessRole`: Read/write to specific tables only
- `TerraformExecutionRole`: Administrative access for Terraform operations (limited to specific users/groups)

### 7. Amplify Configuration: Git-based CI/CD with Build Caching

**Decision:** Configure Amplify with Git-based continuous deployment, enabling build caching for faster builds.

**Rationale:**
- Automatic deployments on git push to configured branch
- Build caching reduces build times for Next.js applications
- Environment variables managed through Terraform
- Custom build settings in `amplify.yml` for Next.js optimization

**Build Settings:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

## Risks / Trade-offs

**Risk:** Terraform state file exposure → **Mitigation:** Store in private S3 bucket with encryption, versioning, and bucket policies restricting access to specific IAM roles only.

**Risk:** Accidental infrastructure destruction (`terraform destroy`) → **Mitigation:** Enable S3 bucket versioning for state recovery, add `prevent_destroy` lifecycle hooks on critical resources, use approval workflows for destructive changes.

**Risk:** Cost overruns from on-demand DynamoDB → **Mitigation:** Monitor usage with CloudWatch alarms, set AWS budget alerts, plan to migrate to provisioned capacity with auto-scaling once usage patterns stabilize.

**Risk:** Secrets in Terraform state → **Mitigation:** Use `sensitive = true` on outputs, rely on Secrets Manager for actual secret values (store ARNs in state, not values), implement least-privilege access to state files.

**Risk:** Amplify build failures → **Mitigation:** Document all environment variables required, use `.env.example` in repository, test builds before pushing to main branch.

**Trade-off:** On-demand DynamoDB costs more at low scale but requires no capacity planning → **Acceptance:** Accept higher initial cost for operational simplicity; optimize later when usage patterns are understood.

## Migration Plan

**Phase 1: Bootstrap (One-time Setup)**
1. Create S3 bucket for Terraform state (manual or via bootstrap script)
2. Create DynamoDB table for state locking
3. Configure local AWS credentials with appropriate permissions
4. Initialize Terraform backend

**Phase 2: Foundation**
1. Apply IAM roles and policies
2. Apply Secrets Manager and Parameter Store resources
3. Verify access controls work as expected

**Phase 3: Data Layer**
1. Apply DynamoDB tables
2. Verify table schemas and indexes
3. Test basic CRUD operations

**Phase 4: Authentication**
1. Apply Cognito User Pool and Client
2. Configure test user
3. Verify authentication flows

**Phase 5: Frontend Hosting**
1. Apply Amplify app and branch
2. Connect to GitHub repository
3. Configure build settings and environment variables
4. Verify deployment pipeline

**Rollback Strategy:**
- Each phase can be rolled back by destroying resources created in that phase
- State versioning in S3 allows recovery of previous infrastructure states
- Critical user data (DynamoDB, Cognito users) should be backed up before any destructive changes

## Open Questions

1. **Custom Domain:** What domain name will be used? (Required for Amplify custom domain configuration)

2. **Git Repository:** Is the repository public or private? (Affects Amplify OAuth app permissions)

3. **CI/CD Integration:** Should Terraform apply be automated in CI/CD pipeline, or manual execution only? (Security vs. automation trade-off)

4. **Backup Strategy:** Do we need automated backups for DynamoDB tables (Point-in-time recovery) and Cognito user pools?

5. **Monitoring:** Should we set up CloudWatch dashboards and alarms as part of this infrastructure, or as a separate change?
