# =============================================================================
# Users Table Outputs
# =============================================================================

output "users_table_name" {
  description = "Name of the users DynamoDB table"
  value       = aws_dynamodb_table.users.name
}

output "users_table_arn" {
  description = "ARN of the users DynamoDB table"
  value       = aws_dynamodb_table.users.arn
}

output "users_table_id" {
  description = "ID of the users DynamoDB table"
  value       = aws_dynamodb_table.users.id
}

# =============================================================================
# Sessions Table Outputs
# =============================================================================

output "sessions_table_name" {
  description = "Name of the sessions DynamoDB table"
  value       = aws_dynamodb_table.sessions.name
}

output "sessions_table_arn" {
  description = "ARN of the sessions DynamoDB table"
  value       = aws_dynamodb_table.sessions.arn
}

output "sessions_table_id" {
  description = "ID of the sessions DynamoDB table"
  value       = aws_dynamodb_table.sessions.id
}
