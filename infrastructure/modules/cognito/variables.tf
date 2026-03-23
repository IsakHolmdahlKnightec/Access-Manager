# =============================================================================
# Variables
# =============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "user_pool_name" {
  description = "Name for the Cognito User Pool"
  type        = string
}

variable "callback_urls" {
  description = "List of callback URLs for OAuth flows"
  type        = list(string)
}

variable "logout_urls" {
  description = "List of sign-out URLs for OAuth flows"
  type        = list(string)
}

variable "domain_prefix" {
  description = "Prefix for Cognito domain"
  type        = string
}
