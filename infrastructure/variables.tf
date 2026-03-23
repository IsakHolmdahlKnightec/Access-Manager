# =============================================================================
# General Variables
# =============================================================================

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "eu-north-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "access-manager"
}

variable "aws_profile" {
  description = "AWS CLI profile to use for deployment"
  type        = string
  default     = "default"
}

# =============================================================================
# Cognito Variables
# =============================================================================

variable "cognito_user_pool_name" {
  description = "Name for the Cognito User Pool"
  type        = string
  default     = "access-manager-users"
}

variable "cognito_callback_urls" {
  description = "List of callback URLs for OAuth flows"
  type        = list(string)
  default     = ["http://localhost:3000/api/auth/callback/cognito"]
}

variable "cognito_logout_urls" {
  description = "List of sign-out URLs for OAuth flows"
  type        = list(string)
  default     = ["http://localhost:3000"]
}

variable "cognito_domain_prefix" {
  description = "Prefix for Cognito domain (will be {prefix}.auth.{region}.amazoncognito.com)"
  type        = string
  default     = "access-manager"
}

# =============================================================================
# Amplify Variables
# =============================================================================

variable "amplify_app_name" {
  description = "Name for the Amplify app"
  type        = string
  default     = "access-manager-web"
}

variable "amplify_repository_url" {
  description = "Git repository URL for Amplify"
  type        = string
  default     = ""
}

variable "amplify_access_token" {
  description = "Git provider access token for Amplify"
  type        = string
  sensitive   = true
  default     = ""
}

variable "amplify_branch_name" {
  description = "Branch name to deploy"
  type        = string
  default     = "main"
}

variable "amplify_custom_domain" {
  description = "Custom domain for Amplify (optional)"
  type        = string
  default     = ""
}

variable "enable_amplify_basic_auth" {
  description = "Enable basic authentication for Amplify"
  type        = bool
  default     = false
}

variable "amplify_basic_auth_username" {
  description = "Basic auth username"
  type        = string
  default     = ""
}

variable "amplify_basic_auth_password" {
  description = "Basic auth password"
  type        = string
  sensitive   = true
  default     = ""
}

# =============================================================================
# DynamoDB Variables
# =============================================================================

variable "dynamodb_table_name_users" {
  description = "Name for the users DynamoDB table"
  type        = string
  default     = "access-manager-users"
}

variable "dynamodb_table_name_sessions" {
  description = "Name for the sessions DynamoDB table"
  type        = string
  default     = "access-manager-sessions"
}

variable "enable_dynamodb_point_in_time_recovery" {
  description = "Enable point-in-time recovery for DynamoDB tables"
  type        = bool
  default     = true
}

# =============================================================================
# Secrets and Configuration Variables
# =============================================================================

variable "secrets_prefix" {
  description = "Prefix for Secrets Manager secrets"
  type        = string
  default     = "access-manager"
}

variable "parameter_store_prefix" {
  description = "Prefix for Parameter Store parameters"
  type        = string
  default     = "/access-manager/config"
}

variable "additional_secrets" {
  description = "Map of additional secrets to create"
  type        = map(string)
  sensitive   = true
  default     = {}
}

variable "additional_parameters" {
  description = "Map of additional parameters to create"
  type        = map(string)
  default     = {}
}
