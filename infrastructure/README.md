# Access Manager Infrastructure

This directory contains Terraform configurations for deploying the Access Manager application infrastructure on AWS.

## Architecture Overview

The infrastructure consists of the following AWS services:

- **AWS Amplify**: Frontend hosting with CI/CD for the Next.js application
- **Amazon Cognito**: User authentication and authorization
- **Amazon DynamoDB**: Data persistence (users and sessions tables)
- **AWS IAM**: Role-based access control with least privilege
- **AWS Secrets Manager**: Secure storage for API keys and credentials
- **AWS Systems Manager Parameter Store**: Application configuration

## Project Structure

```
infrastructure/
├── bootstrap.sh              # One-time setup for Terraform backend
├── main.tf                   # Root module with provider and backend config
├── variables.tf              # Input variables
├── outputs.tf                # Output values
├── terraform.tfvars          # Variable values (not committed)
├── .env.example              # Example environment variables
├── modules/
│   ├── amplify/             # Amplify app and hosting configuration
│   ├── cognito/             # Cognito User Pool and App Client
│   ├── dynamodb/            # DynamoDB tables (users, sessions)
│   ├── iam/                 # IAM roles and policies
│   └── secrets/             # Secrets Manager and Parameter Store
```

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) 1.5.0 or later
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- AWS account with appropriate permissions

## Quick Start

### 1. Bootstrap Terraform Backend

The bootstrap script creates the S3 bucket and DynamoDB table required for Terraform state management:

```bash
cd infrastructure
./bootstrap.sh
```

Or specify an AWS profile:

```bash
./bootstrap.sh --profile production
# or
./bootstrap.sh -p production
```

This creates:
- S3 bucket: `access-manager-terraform-state-{account-id}`
- DynamoDB table: `terraform-state-lock`

### 2. Configure Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
# Edit .env with your configuration
```

Update `terraform.tfvars` with your specific values:

```hcl
aws_region  = "eu-north-1"

# Cognito
cognito_callback_urls = ["https://your-domain.com/api/auth/callback/cognito"]
cognito_logout_urls   = ["https://your-domain.com"]
cognito_domain_prefix = "your-unique-domain-prefix"

# Amplify
amplify_repository_url = "https://github.com/your-username/access-manager"
amplify_access_token   = "your-github-token"
amplify_branch_name    = "main"
amplify_custom_domain  = "your-domain.com"  # Optional
```

### 3. Initialize Terraform

```bash
cd infrastructure
terraform init
```

### 4. Review Changes

```bash
terraform plan
```

### 5. Deploy Infrastructure

```bash
terraform apply
```

## Module Details

### IAM Module

Creates the following roles:
- **Amplify Execution Role**: Allows Amplify to access DynamoDB, Parameter Store, and Secrets Manager
- **Terraform Execution Role**: Administrative role for Terraform operations

### DynamoDB Module

Creates two tables:
- **Users Table**: Stores user data with `userId` as partition key
  - Global Secondary Index on `email` for lookups
  - Point-in-time recovery enabled
  - Encryption at rest
- **Sessions Table**: Stores session data with `sessionId` as partition key
  - TTL on `expiresAt` for automatic expiration
  - Global Secondary Index on `userId`
  - Point-in-time recovery enabled

### Cognito Module

Configures:
- User Pool with email-based authentication
- Email verification required
- Password policy (8+ chars, mixed case, numbers, symbols)
- Optional MFA with TOTP
- Public App Client with OAuth 2.0 flows
- Hosted UI domain

### Amplify Module

Sets up:
- Amplify app with Next.js build configuration
- Git-based continuous deployment
- Build caching for faster builds
- Environment variables from Terraform outputs
- Optional custom domain
- Basic authentication (optional)

### Secrets Module

Manages:
- Secrets Manager secrets for API keys
- Parameter Store parameters for configuration
- Encrypted storage with KMS

## Outputs

After deployment, Terraform outputs:

- `cognito_user_pool_id`: Cognito User Pool ID
- `cognito_app_client_id`: Cognito App Client ID
- `cognito_domain`: Cognito hosted UI domain
- `amplify_app_id`: Amplify app ID
- `amplify_default_domain`: Default Amplify domain
- `amplify_branch_url`: Deployed branch URL
- `dynamodb_users_table_name`: Users table name
- `dynamodb_sessions_table_name`: Sessions table name

## Environment Variables

The following environment variables are automatically configured for the Amplify app:

- `COGNITO_USER_POOL_ID`
- `COGNITO_APP_CLIENT_ID`
- `COGNITO_DOMAIN`
- `DYNAMODB_USERS_TABLE`
- `DYNAMODB_SESSIONS_TABLE`
- `AWS_REGION`

## Deployment Process

1. **Local Development**: Test changes locally with `terraform plan`
2. **Staging**: Deploy to staging environment (if configured)
3. **Production**: Deploy to production with `terraform apply`

## Rollback Procedures

### Rollback Terraform Changes

```bash
# View previous state versions
terraform state list

# Rollback to previous state (if using S3 backend versioning)
aws s3 cp s3://your-bucket/terraform.tfstate s3://your-bucket/terraform.tfstate.backup
aws s3 cp s3://your-bucket/terraform.tfstate-previous terraform.tfstate
terraform state push terraform.tfstate
```

### Restore DynamoDB Data

Point-in-time recovery allows restoring tables to any point within the last 35 days:

```bash
aws dynamodb restore-table-to-point-in-time \
  --source-table-name access-manager-users \
  --target-table-name access-manager-users-restored \
  --use-latest-restorable-time
```

## Security Considerations

- **State Security**: Terraform state is stored in S3 with versioning and encryption
- **State Locking**: DynamoDB prevents concurrent modifications
- **Least Privilege**: IAM roles have minimal required permissions
- **Secret Management**: Sensitive values stored in Secrets Manager, not in state
- **Encryption**: All data encrypted at rest and in transit
- **Access Control**: S3 bucket policies restrict access to specific IAM roles

## Cost Optimization

- DynamoDB uses on-demand capacity (pay-per-request)
- Consider migrating to provisioned capacity with auto-scaling for predictable workloads
- Monitor AWS Budgets for cost alerts
- Review CloudWatch metrics for usage patterns

## Troubleshooting

### Terraform State Lock

If Terraform is interrupted and leaves a lock:

```bash
terraform force-unlock <LOCK_ID>
```

### Amplify Build Failures

Check build logs in AWS Amplify Console. Common issues:
- Missing environment variables
- Incorrect build commands
- Node.js version mismatches

### Cognito Domain Conflicts

Cognito domain prefixes must be globally unique. If you get a conflict:

1. Choose a different `cognito_domain_prefix` in `terraform.tfvars`
2. Run `terraform apply` again

## Contributing

When making infrastructure changes:

1. Test changes locally with `terraform plan`
2. Follow the principle of least privilege for IAM changes
3. Document new resources in this README
4. Update `variables.tf` for any new inputs
5. Run `terraform fmt` before committing

## Resources

- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Amazon Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Amazon DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)

## License

This infrastructure code is part of the Access Manager project.
