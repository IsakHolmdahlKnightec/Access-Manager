# =============================================================================
# Variables
# =============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "users_table_name" {
  description = "Name for the users DynamoDB table"
  type        = string
}

variable "sessions_table_name" {
  description = "Name for the sessions DynamoDB table"
  type        = string
}

variable "enable_point_in_time_recovery" {
  description = "Enable point-in-time recovery for tables"
  type        = bool
  default     = true
}
