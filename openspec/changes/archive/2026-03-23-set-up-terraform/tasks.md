## 1. Bootstrap and Foundation

- [x] 1.1 Create bootstrap script to create S3 bucket for Terraform state with versioning enabled
- [x] 1.2 Create DynamoDB table for Terraform state locking with LockID partition key
- [x] 1.3 Configure S3 bucket policy to restrict access to specific IAM roles
- [x] 1.4 Test bootstrap process by initializing Terraform backend

## 2. Terraform Project Structure

- [x] 2.1 Create infrastructure directory at project root
- [x] 2.2 Create modules/ subdirectory structure (amplify/, cognito/, dynamodb/, iam/)
- [x] 2.3 Create main.tf with Terraform and AWS provider configuration
- [x] 2.4 Create variables.tf with all required input variables
- [x] 2.5 Create outputs.tf with resource identifiers and ARNs
- [x] 2.6 Create terraform.tfvars with variable values

## 3. AWS Provider Configuration

- [x] 3.1 Configure AWS provider with version constraint (~> 5.0)
- [x] 3.2 Configure S3 backend with bucket name and encryption settings
- [x] 3.3 Configure DynamoDB table name for state locking
- [x] 3.4 Add provider configuration to support region via variables
- [x] 3.5 Configure backend initialization validation

## 4. IAM Roles and Policies

- [x] 4.1 Create Terraform execution IAM role with appropriate trust policy
- [x] 4.2 Create Amplify execution IAM role with service trust relationship
- [x] 4.3 Create IAM policy for DynamoDB users table access (restricted actions)
- [x] 4.4 Create IAM policy for DynamoDB sessions table access (restricted actions)
- [x] 4.5 Create IAM policy for Parameter Store read access
- [x] 4.6 Create IAM policy for Secrets Manager read access
- [x] 4.7 Attach policies to Amplify execution role following least privilege
- [x] 4.8 Create service-linked roles for Cognito if required

## 5. Secrets Management Module

- [x] 5.1 Create infrastructure/modules/secrets/ directory with module files
- [x] 5.2 Implement Secrets Manager secret resources for API keys using nonsensitive(keys()) pattern for for_each with sensitive values
- [x] 5.3 Implement Parameter Store parameters for application configuration
- [x] 5.4 Configure parameter hierarchy (/access-manager/config/{name})
- [x] 5.5 Configure SecureString parameters with KMS encryption where needed
- [x] 5.6 Add outputs for secret ARNs and parameter paths
- [x] 5.7 Mark sensitive outputs to prevent exposure in logs

## 6. DynamoDB Tables Module

- [x] 6.1 Create infrastructure/modules/dynamodb/ directory with module files
- [x] 6.2 Implement users table with userId partition key (String)
- [x] 6.3 Add Global Secondary Index on email attribute for lookups
- [x] 6.4 Enable point-in-time recovery for users table
- [x] 6.5 Implement sessions table with sessionId partition key (String)
- [x] 6.6 Configure TTL on expiresAt attribute for sessions table (TTL attribute not declared in attribute blocks)
- [x] 6.7 Enable encryption at rest for both tables
- [x] 6.8 Add tags (Application, ManagedBy) to both tables
- [x] 6.9 Add outputs for table names and ARNs

## 7. Cognito User Pool Module

- [x] 7.1 Create infrastructure/modules/cognito/ directory with module files
- [x] 7.2 Implement Cognito User Pool with email as username alias
- [x] 7.3 Configure email verification requirement
- [x] 7.4 Implement password policy (8+ chars, mixed case, numbers, symbols)
- [x] 7.5 Configure MFA as optional with TOTP support
- [x] 7.6 Create public App Client with OAuth flows
- [x] 7.7 Configure OAuth scopes (openid, email, profile)
- [x] 7.8 Configure callback and sign-out URLs
- [x] 7.9 Configure Cognito domain (prefix-based or custom)
- [x] 7.10 Add outputs for User Pool ID, Client ID, and domain

## 8. Amplify Frontend Hosting Module

- [x] 8.1 Create infrastructure/modules/amplify/ directory with module files
- [x] 8.2 Implement Amplify app resource with Next.js framework detection
- [x] 8.3 Configure build caching enablement
- [x] 8.4 Configure Git repository connection with OAuth token
- [x] 8.5 Create Amplify branch mapped to main branch
- [x] 8.6 Configure build specification (amplify.yml) with Node.js 18.x
- [x] 8.7 Configure environment variables injection from Parameter Store/Secrets Manager using map(string) attribute (not dynamic block)
- [x] 8.8 Configure custom domain (if domain provided)
- [x] 8.9 Configure build artifact output settings for Next.js
- [x] 8.10 Attach Amplify execution role to the app
- [x] 8.11 Add outputs for Amplify app ID, default domain, and branch URL

## 9. Integration and Configuration

- [x] 9.1 Wire all modules together in root main.tf with proper dependencies
- [x] 9.2 Configure terraform.tfvars with all required values
- [x] 9.3 Create .env.example file documenting all required environment variables
- [x] 9.4 Add .gitignore entries for Terraform state and local files
- [x] 9.5 Create README.md in infrastructure/ directory with setup instructions
- [x] 9.6 Create AWS Resource Group to organize all project resources

## 10. Testing and Validation

- [x] 10.1 Run terraform validate to check configuration syntax
- [x] 10.2 Run terraform plan and review changes
- [x] 10.3 Apply bootstrap resources if not already created
- [x] 10.4 Apply Terraform configuration
- [x] 10.5 Verify S3 bucket and DynamoDB lock table are working
- [x] 10.6 Verify IAM roles and policies are created with correct permissions
- [x] 10.7 Verify DynamoDB tables are created with correct schema
- [x] 10.8 Verify Cognito User Pool and App Client are configured correctly
- [x] 10.9 Verify Amplify app is connected to repository and builds successfully
- [x] 10.10 Test authentication flow with Cognito hosted UI
- [x] 10.11 Verify secrets and parameters are accessible from Amplify

## 11. Documentation and Cleanup

- [x] 11.1 Document the infrastructure architecture in README
- [x] 11.2 Document setup process for new developers
- [x] 11.3 Document deployment process and rollback procedures
- [x] 11.4 Create architecture diagram showing resource relationships (documented in README)
- [x] 11.5 Review all resources for cost optimization opportunities (documented in README)
- [x] 11.6 Clean up any test resources created during development
