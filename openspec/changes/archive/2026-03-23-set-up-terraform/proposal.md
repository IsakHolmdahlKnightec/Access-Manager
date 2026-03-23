## Why

The Access Manager application needs production-ready AWS infrastructure to support user authentication, data persistence, and frontend hosting. Terraform will provide infrastructure-as-code for consistent, repeatable, and version-controlled deployments.

## What Changes

- Create Terraform project structure with modular organization
- Configure AWS provider with proper authentication and region settings
- Set up AWS Amplify for Next.js frontend hosting with CI/CD pipeline
- Provision DynamoDB tables for user data and session management
- Configure Cognito User Pool for authentication and authorization
- Define IAM roles and policies with principle of least privilege
- Implement environment variables and secrets management using AWS Systems Manager Parameter Store and Secrets Manager

## Capabilities

### New Capabilities
- `terraform-project-structure`: Modular Terraform project organization with reusable modules and state management configuration
- `aws-provider-config`: AWS provider setup with authentication, backend state (S3), and locking (DynamoDB)
- `amplify-frontend-hosting`: AWS Amplify app configuration for Next.js deployment with build settings, custom domains, and environment variables
- `dynamodb-tables`: DynamoDB table definitions for users and sessions with proper partitioning, indexing, and capacity settings
- `cognito-user-pool`: Cognito User Pool and Client configuration for authentication flows, MFA, and user attributes
- `iam-roles-policies`: IAM roles for ECS tasks, Lambda functions, and service accounts with minimal required permissions
- `secrets-management`: AWS Secrets Manager and Systems Manager Parameter Store integration for sensitive configuration

### Modified Capabilities
- None (this is new infrastructure setup)

## Impact

- **New Files**: Terraform configurations in `/infrastructure/` or `/terraform/` directory
- **AWS Services**: Amplify, DynamoDB, Cognito, IAM, S3 (for state), Secrets Manager, Systems Manager
- **Dependencies**: Requires AWS CLI, Terraform CLI (1.5+), and appropriate AWS credentials
- **CI/CD**: GitHub Actions or similar may need updates to integrate with Terraform workflow
- **Security**: All infrastructure follows AWS Well-Architected security best practices
