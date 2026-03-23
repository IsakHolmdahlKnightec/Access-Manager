# =============================================================================
# Amplify App Outputs
# =============================================================================

output "app_id" {
  description = "ID of the Amplify app"
  value       = aws_amplify_app.main.id
}

output "app_name" {
  description = "Name of the Amplify app"
  value       = aws_amplify_app.main.name
}

output "app_arn" {
  description = "ARN of the Amplify app"
  value       = aws_amplify_app.main.arn
}

output "default_domain" {
  description = "Default domain of the Amplify app"
  value       = aws_amplify_app.main.default_domain
}

# =============================================================================
# Amplify Branch Outputs
# =============================================================================

output "branch_name" {
  description = "Name of the deployed branch"
  value       = aws_amplify_branch.main.branch_name
}

output "branch_arn" {
  description = "ARN of the branch"
  value       = aws_amplify_branch.main.arn
}

output "branch_url" {
  description = "URL of the deployed branch"
  value       = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.main.default_domain}"
}

# =============================================================================
# Domain Association Outputs
# =============================================================================

output "custom_domain" {
  description = "Custom domain (if configured)"
  value       = length(aws_amplify_domain_association.main) > 0 ? aws_amplify_domain_association.main[0].domain_name : null
}
