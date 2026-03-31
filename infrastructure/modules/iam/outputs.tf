# =============================================================================
# Amplify Execution Role Outputs
# =============================================================================

output "amplify_execution_role_arn" {
  description = "ARN of the Amplify execution IAM role"
  value       = aws_iam_role.amplify_execution.arn
}

output "amplify_execution_role_name" {
  description = "Name of the Amplify execution IAM role"
  value       = aws_iam_role.amplify_execution.name
}

# =============================================================================
# Terraform Execution Role Outputs
# =============================================================================

output "terraform_execution_role_arn" {
  description = "ARN of the Terraform execution IAM role"
  value       = aws_iam_role.terraform_execution.arn
}

output "terraform_execution_role_name" {
  description = "Name of the Terraform execution IAM role"
  value       = aws_iam_role.terraform_execution.name
}

# =============================================================================
# Policy ARNs Outputs
# =============================================================================

output "dynamodb_users_policy_arn" {
  description = "ARN of the DynamoDB users table access policy"
  value       = aws_iam_policy.dynamodb_users_access.arn
}

output "dynamodb_sessions_policy_arn" {
  description = "ARN of the DynamoDB sessions table access policy"
  value       = aws_iam_policy.dynamodb_sessions_access.arn
}

output "parameter_store_policy_arn" {
  description = "ARN of the Parameter Store read policy"
  value       = aws_iam_policy.parameter_store_read.arn
}

output "secrets_manager_policy_arn" {
  description = "ARN of the Secrets Manager read policy"
  value       = aws_iam_policy.secrets_manager_read.arn
}

# =============================================================================
# Lambda Execution Role Outputs
# =============================================================================

output "lambda_execution_role_arn" {
  description = "ARN of the Lambda execution IAM role"
  value       = aws_iam_role.lambda_execution.arn
}

output "lambda_execution_role_name" {
  description = "Name of the Lambda execution IAM role"
  value       = aws_iam_role.lambda_execution.name
}

output "dynamodb_access_data_policy_arn" {
  description = "ARN of the DynamoDB access-manager-data table access policy"
  value       = aws_iam_policy.dynamodb_access_data_access.arn
}

output "lambda_logs_policy_arn" {
  description = "ARN of the Lambda CloudWatch Logs policy"
  value       = aws_iam_policy.lambda_logs.arn
}

output "api_gateway_execution_role_arn" {
  description = "ARN of the API Gateway execution IAM role"
  value       = aws_iam_role.api_gateway_execution.arn
}

output "api_gateway_execution_role_name" {
  description = "Name of the API Gateway execution IAM role"
  value       = aws_iam_role.api_gateway_execution.name
}

output "api_gateway_lambda_invoke_policy_arn" {
  description = "ARN of the API Gateway Lambda invoke policy"
  value       = aws_iam_policy.api_gateway_lambda_invoke.arn
}
