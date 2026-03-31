# =============================================================================
# Variables for API Gateway Module
# =============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID for the authorizer"
  type        = string
}

variable "cognito_app_client_id" {
  description = "Cognito App Client ID"
  type        = string
}

variable "dynamodb_access_table_name" {
  description = "Name of the access-manager-data DynamoDB table"
  type        = string
}

variable "lambda_execution_role_arn" {
  description = "ARN of the Lambda execution IAM role"
  type        = string
}

variable "stage_name" {
  description = "Stage name for the API Gateway deployment"
  type        = string
  default     = "staging"
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "lambda_function_names" {
  description = "Map of Lambda function names"
  type        = map(string)
  default     = {}
}
