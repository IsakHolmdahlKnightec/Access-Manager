# =============================================================================
# Secrets Manager Outputs
# =============================================================================

output "secret_arns" {
  description = "ARNs of created Secrets Manager secrets"
  value       = { for k, v in aws_secretsmanager_secret.app_secrets : k => v.arn }
  sensitive   = true
}

output "secret_ids" {
  description = "IDs of created Secrets Manager secrets"
  value       = { for k, v in aws_secretsmanager_secret.app_secrets : k => v.id }
  sensitive   = true
}

# =============================================================================
# Parameter Store Outputs
# =============================================================================

output "parameter_paths" {
  description = "Paths of created Parameter Store parameters"
  value       = { for k, v in aws_ssm_parameter.app_config : k => v.name }
}

output "parameter_arns" {
  description = "ARNs of created Parameter Store parameters"
  value       = { for k, v in aws_ssm_parameter.app_config : k => v.arn }
}

output "standard_parameters" {
  description = "Standard application parameters"
  value = {
    app_name = aws_ssm_parameter.app_name.name
  }
}
