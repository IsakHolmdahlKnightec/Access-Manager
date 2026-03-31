# =============================================================================
# Outputs for DynamoDB Access Module
# =============================================================================

output "access_data_table_name" {
  description = "Name of the access-manager-data DynamoDB table"
  value       = aws_dynamodb_table.access_data.name
}

output "access_data_table_arn" {
  description = "ARN of the access-manager-data DynamoDB table"
  value       = aws_dynamodb_table.access_data.arn
}

output "access_data_table_stream_arn" {
  description = "ARN of the access-manager-data DynamoDB table stream"
  value       = aws_dynamodb_table.access_data.stream_arn
}
