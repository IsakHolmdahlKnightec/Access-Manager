# =============================================================================
# Lambda Functions Outputs
# =============================================================================

# Access Functions
output "get_accesses_function_name" {
  description = "Name of the getAccesses Lambda function"
  value       = aws_lambda_function.get_accesses.function_name
}

output "get_access_function_name" {
  description = "Name of the getAccess Lambda function"
  value       = aws_lambda_function.get_access.function_name
}

# Request Functions
output "get_requests_function_name" {
  description = "Name of the getRequests Lambda function"
  value       = aws_lambda_function.get_requests.function_name
}

output "get_request_function_name" {
  description = "Name of the getRequest Lambda function"
  value       = aws_lambda_function.get_request.function_name
}

output "create_request_function_name" {
  description = "Name of the createRequest Lambda function"
  value       = aws_lambda_function.create_request.function_name
}

output "cancel_request_function_name" {
  description = "Name of the cancelRequest Lambda function"
  value       = aws_lambda_function.cancel_request.function_name
}

output "add_more_info_function_name" {
  description = "Name of the addMoreInfo Lambda function"
  value       = aws_lambda_function.add_more_info.function_name
}

# Admin Functions
output "get_pending_requests_function_name" {
  description = "Name of the getPendingRequests Lambda function"
  value       = aws_lambda_function.get_pending_requests.function_name
}

output "get_all_requests_function_name" {
  description = "Name of the getAllRequests Lambda function"
  value       = aws_lambda_function.get_all_requests.function_name
}

output "approve_request_function_name" {
  description = "Name of the approveRequest Lambda function"
  value       = aws_lambda_function.approve_request.function_name
}

output "decline_request_function_name" {
  description = "Name of the declineRequest Lambda function"
  value       = aws_lambda_function.decline_request.function_name
}

output "request_more_info_function_name" {
  description = "Name of the requestMoreInfo Lambda function"
  value       = aws_lambda_function.request_more_info.function_name
}

# Notification Functions
output "get_notifications_function_name" {
  description = "Name of the getNotifications Lambda function"
  value       = aws_lambda_function.get_notifications.function_name
}

output "mark_notification_read_function_name" {
  description = "Name of the markNotificationRead Lambda function"
  value       = aws_lambda_function.mark_notification_read.function_name
}

output "mark_all_notifications_read_function_name" {
  description = "Name of the markAllNotificationsRead Lambda function"
  value       = aws_lambda_function.mark_all_notifications_read.function_name
}

output "notification_stream_handler_function_name" {
  description = "Name of the notificationStreamHandler Lambda function"
  value       = aws_lambda_function.notification_stream_handler.function_name
}

output "lambda_function_names" {
  description = "Map of Lambda function names for API Gateway"
  value = {
    getAccesses              = aws_lambda_function.get_accesses.function_name
    getAccess                = aws_lambda_function.get_access.function_name
    getRequests              = aws_lambda_function.get_requests.function_name
    getRequest               = aws_lambda_function.get_request.function_name
    createRequest            = aws_lambda_function.create_request.function_name
    cancelRequest            = aws_lambda_function.cancel_request.function_name
    addMoreInfo              = aws_lambda_function.add_more_info.function_name
    getPendingRequests       = aws_lambda_function.get_pending_requests.function_name
    getAllRequests           = aws_lambda_function.get_all_requests.function_name
    approveRequest           = aws_lambda_function.approve_request.function_name
    declineRequest           = aws_lambda_function.decline_request.function_name
    requestMoreInfo          = aws_lambda_function.request_more_info.function_name
    getNotifications         = aws_lambda_function.get_notifications.function_name
    markNotificationRead     = aws_lambda_function.mark_notification_read.function_name
    markAllNotificationsRead = aws_lambda_function.mark_all_notifications_read.function_name
  }
}
