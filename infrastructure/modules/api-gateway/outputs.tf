# =============================================================================
# API Gateway Outputs
# =============================================================================

output "api_id" {
  description = "ID of the API Gateway API"
  value       = aws_apigatewayv2_api.main.id
}

output "api_endpoint" {
  description = "Endpoint URL for the API Gateway API"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "stage_name" {
  description = "Name of the deployed stage"
  value       = aws_apigatewayv2_stage.staging.name
}

output "stage_url" {
  description = "URL of the deployed stage"
  value       = "${aws_apigatewayv2_api.main.api_endpoint}/${var.stage_name}"
}

output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch Log Group for API Gateway"
  value       = aws_cloudwatch_log_group.api_gateway.name
}

output "cloudwatch_log_group_arn" {
  description = "ARN of the CloudWatch Log Group for API Gateway"
  value       = aws_cloudwatch_log_group.api_gateway.arn
}
