# =============================================================================
# Variables
# =============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "app_name" {
  description = "Name for the Amplify app"
  type        = string
}

variable "repository_url" {
  description = "Git repository URL"
  type        = string
}

variable "access_token" {
  description = "Git provider access token"
  type        = string
  sensitive   = true
}

variable "branch_name" {
  description = "Branch name to deploy"
  type        = string
}

variable "custom_domain" {
  description = "Custom domain (optional)"
  type        = string
  default     = ""
}

variable "enable_basic_auth" {
  description = "Enable basic authentication"
  type        = bool
  default     = false
}

variable "basic_auth_username" {
  description = "Basic auth username"
  type        = string
  default     = ""
}

variable "basic_auth_password" {
  description = "Basic auth password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "environment_variables" {
  description = "Environment variables for the app"
  type        = map(string)
  default     = {}
}

variable "service_role_arn" {
  description = "ARN of the service role for Amplify"
  type        = string
}
