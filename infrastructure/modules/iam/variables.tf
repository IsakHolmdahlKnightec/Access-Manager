# =============================================================================
# Variables
# =============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "dynamodb_users_table_arn" {
  description = "ARN of the DynamoDB users table"
  type        = string
}

variable "dynamodb_sessions_table_arn" {
  description = "ARN of the DynamoDB sessions table"
  type        = string
}

variable "secrets_arns" {
  description = "List of Secrets Manager secret ARNs"
  type        = list(string)
  default     = []
}

variable "parameter_store_prefix" {
  description = "Prefix for Parameter Store parameters"
  type        = string
}
