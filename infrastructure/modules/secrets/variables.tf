# =============================================================================
# Variables
# =============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "secrets_prefix" {
  description = "Prefix for Secrets Manager secrets"
  type        = string
}

variable "parameter_store_prefix" {
  description = "Prefix for Parameter Store parameters"
  type        = string
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
