# =============================================================================
# Variables for DynamoDB Access Module
# =============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "access_data_table_name" {
  description = "Name for the access-manager-data DynamoDB table"
  type        = string
  default     = "access-manager-data"
}

variable "users_table_name" {
  description = "Name of the existing users DynamoDB table"
  type        = string
  default     = "access-manager-users"
}

variable "enable_point_in_time_recovery" {
  description = "Enable point-in-time recovery for DynamoDB tables"
  type        = bool
  default     = true
}
