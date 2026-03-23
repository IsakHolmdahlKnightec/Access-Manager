# =============================================================================
# User Pool Outputs
# =============================================================================

output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.arn
}

output "user_pool_endpoint" {
  description = "Endpoint of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.endpoint
}

# =============================================================================
# App Client Outputs
# =============================================================================

output "app_client_id" {
  description = "ID of the Cognito App Client"
  value       = aws_cognito_user_pool_client.main.id
}

output "app_client_name" {
  description = "Name of the Cognito App Client"
  value       = aws_cognito_user_pool_client.main.name
}

# =============================================================================
# Domain Outputs
# =============================================================================

output "cognito_domain" {
  description = "Cognito domain URL"
  value       = "${aws_cognito_user_pool_domain.main.domain}.auth.${data.aws_region.current.name}.amazoncognito.com"
}

output "authority_url" {
  description = "OpenID Connect authority URL"
  value       = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${aws_cognito_user_pool.main.id}"
}

# =============================================================================
# Data Sources
# =============================================================================

data "aws_region" "current" {}
