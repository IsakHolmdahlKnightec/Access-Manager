# =============================================================================
# Variables for Lambda Functions Module
# =============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "dynamodb_access_table_name" {
  description = "Name of the access-manager-data DynamoDB table"
  type        = string
}

variable "dynamodb_access_table_stream_arn" {
  description = "ARN of the DynamoDB table stream"
  type        = string
  default     = ""
}

variable "lambda_execution_role_arn" {
  description = "ARN of the Lambda execution IAM role"
  type        = string
}

variable "stage_name" {
  description = "Stage name for environment tagging"
  type        = string
  default     = "staging"
}

variable "lambda_zip_path" {
  description = "Path to the Lambda deployment package"
  type        = string
  default     = ""
}

variable "runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "nodejs20.x"
}

variable "handler" {
  description = "Default Lambda handler"
  type        = string
  default     = "index.handler"
}

variable "timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 30
}

variable "memory_size" {
  description = "Lambda memory size in MB"
  type        = number
  default     = 256
}

variable "lambda_layer_path" {
  description = "Path to the Lambda layer ZIP file containing AWS SDK"
  type        = string
  default     = ""
}
