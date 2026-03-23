# =============================================================================
# Cognito Outputs
# =============================================================================

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = module.cognito.user_pool_id
}

output "cognito_user_pool_arn" {
  description = "ARN of the Cognito User Pool"
  value       = module.cognito.user_pool_arn
}

output "cognito_app_client_id" {
  description = "ID of the Cognito App Client"
  value       = module.cognito.app_client_id
}

output "cognito_domain" {
  description = "Cognito domain URL"
  value       = module.cognito.cognito_domain
}

output "cognito_authority_url" {
  description = "OpenID Connect authority URL"
  value       = module.cognito.authority_url
}

# =============================================================================
# Amplify Outputs
# =============================================================================

output "amplify_app_id" {
  description = "ID of the Amplify app"
  value       = module.amplify.app_id
}

output "amplify_app_name" {
  description = "Name of the Amplify app"
  value       = module.amplify.app_name
}

output "amplify_default_domain" {
  description = "Default domain of the Amplify app"
  value       = module.amplify.default_domain
}

output "amplify_branch_url" {
  description = "URL of the deployed branch"
  value       = module.amplify.branch_url
}

# =============================================================================
# DynamoDB Outputs
# =============================================================================

output "dynamodb_users_table_name" {
  description = "Name of the users DynamoDB table"
  value       = module.dynamodb.users_table_name
}

output "dynamodb_users_table_arn" {
  description = "ARN of the users DynamoDB table"
  value       = module.dynamodb.users_table_arn
}

output "dynamodb_sessions_table_name" {
  description = "Name of the sessions DynamoDB table"
  value       = module.dynamodb.sessions_table_name
}

output "dynamodb_sessions_table_arn" {
  description = "ARN of the sessions DynamoDB table"
  value       = module.dynamodb.sessions_table_arn
}

# =============================================================================
# IAM Outputs
# =============================================================================

output "amplify_execution_role_arn" {
  description = "ARN of the Amplify execution IAM role"
  value       = module.iam.amplify_execution_role_arn
}

output "terraform_execution_role_arn" {
  description = "ARN of the Terraform execution IAM role"
  value       = module.iam.terraform_execution_role_arn
}

# =============================================================================
# Secrets and Configuration Outputs
# =============================================================================

output "secrets_manager_secret_arns" {
  description = "ARNs of created Secrets Manager secrets"
  value       = module.secrets.secret_arns
  sensitive   = true
}

output "parameter_store_paths" {
  description = "Paths of created Parameter Store parameters"
  value       = module.secrets.parameter_paths
}

# =============================================================================
# General Outputs
# =============================================================================

output "aws_region" {
  description = "AWS region where resources are deployed"
  value       = data.aws_region.current.name
}

output "aws_account_id" {
  description = "AWS account ID"
  value       = data.aws_caller_identity.current.account_id
}
