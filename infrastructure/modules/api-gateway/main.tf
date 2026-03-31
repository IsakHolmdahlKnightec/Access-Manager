# =============================================================================
# Data Sources
# =============================================================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# =============================================================================
# Helper: Construct Lambda ARN from function name
# =============================================================================

locals {
  lambda_arn = {
    for name, fn_name in var.lambda_function_names :
    name => "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:${fn_name}"
  }
}

# =============================================================================
# API Gateway HTTP API v2 - Access Manager API
# =============================================================================

resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
  description   = "Access Manager HTTP API v2"

  # Enable CORS
  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ]
    allow_headers = [
      "Authorization",
      "Content-Type",
      "X-Amz-Date",
      "X-Api-Key",
      "X-Amz-Security-Token"
    ]
    expose_headers = [
      "X-Request-Id"
    ]
    max_age = 3600
  }

  tags = {
    Name        = "${var.project_name}-api"
    Application = var.project_name
    ManagedBy   = "Terraform"
  }
}

# =============================================================================
# Cognito Authorizer
# =============================================================================

resource "aws_apigatewayv2_authorizer" "cognito" {
  name             = "${var.project_name}-cognito-authorizer"
  api_id           = aws_apigatewayv2_api.main.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]

  jwt_configuration {
    audience = [var.cognito_app_client_id]
    issuer   = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${var.cognito_user_pool_id}"
  }
}

# =============================================================================
# Lambda Permission for API Gateway
# =============================================================================

# GetAccesses Lambda permission
resource "aws_lambda_permission" "api_gateway_get_accesses" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["getAccesses"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# GetAccess Lambda permission
resource "aws_lambda_permission" "api_gateway_get_access" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["getAccess"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# GetRequests Lambda permission
resource "aws_lambda_permission" "api_gateway_get_requests" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["getRequests"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# GetRequest Lambda permission
resource "aws_lambda_permission" "api_gateway_get_request" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["getRequest"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# CreateRequest Lambda permission
resource "aws_lambda_permission" "api_gateway_create_request" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["createRequest"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# CancelRequest Lambda permission
resource "aws_lambda_permission" "api_gateway_cancel_request" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["cancelRequest"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# AddMoreInfo Lambda permission
resource "aws_lambda_permission" "api_gateway_add_more_info" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["addMoreInfo"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# GetPendingRequests Lambda permission
resource "aws_lambda_permission" "api_gateway_get_pending_requests" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["getPendingRequests"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# GetAllRequests Lambda permission
resource "aws_lambda_permission" "api_gateway_get_all_requests" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["getAllRequests"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# ApproveRequest Lambda permission
resource "aws_lambda_permission" "api_gateway_approve_request" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["approveRequest"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# DeclineRequest Lambda permission
resource "aws_lambda_permission" "api_gateway_decline_request" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["declineRequest"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# RequestMoreInfo Lambda permission
resource "aws_lambda_permission" "api_gateway_request_more_info" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["requestMoreInfo"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# GetNotifications Lambda permission
resource "aws_lambda_permission" "api_gateway_get_notifications" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["getNotifications"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# MarkNotificationRead Lambda permission
resource "aws_lambda_permission" "api_gateway_mark_notification_read" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["markNotificationRead"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# MarkAllNotificationsRead Lambda permission
resource "aws_lambda_permission" "api_gateway_mark_all_notifications_read" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_names["markAllNotificationsRead"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# =============================================================================
# Lambda Integrations
# =============================================================================

# Access Integrations
resource "aws_apigatewayv2_integration" "get_accesses" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["getAccesses"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "get_access" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["getAccess"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

# Request Integrations
resource "aws_apigatewayv2_integration" "get_requests" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["getRequests"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "get_request" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["getRequest"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "create_request" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["createRequest"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "cancel_request" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["cancelRequest"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "add_more_info" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["addMoreInfo"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

# Admin Integrations
resource "aws_apigatewayv2_integration" "get_pending_requests" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["getPendingRequests"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "get_all_requests" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["getAllRequests"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "approve_request" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["approveRequest"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "decline_request" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["declineRequest"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "request_more_info" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["requestMoreInfo"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

# Notification Integrations
resource "aws_apigatewayv2_integration" "get_notifications" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["getNotifications"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "mark_notification_read" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["markNotificationRead"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "mark_all_notifications_read" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_uri    = local.lambda_arn["markAllNotificationsRead"]
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

# =============================================================================
# API Routes - Access Endpoints
# =============================================================================

resource "aws_apigatewayv2_route" "get_accesses" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "GET /accesses"
  target        = "integrations/${aws_apigatewayv2_integration.get_accesses.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "get_access" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "GET /accesses/{id}"
  target        = "integrations/${aws_apigatewayv2_integration.get_access.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

# =============================================================================
# API Routes - Request Endpoints
# =============================================================================

resource "aws_apigatewayv2_route" "get_requests" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "GET /requests"
  target        = "integrations/${aws_apigatewayv2_integration.get_requests.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "create_request" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "POST /requests"
  target        = "integrations/${aws_apigatewayv2_integration.create_request.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "get_request" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "GET /requests/{id}"
  target        = "integrations/${aws_apigatewayv2_integration.get_request.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "update_request" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "PATCH /requests/{id}"
  target        = "integrations/${aws_apigatewayv2_integration.add_more_info.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "cancel_request" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "DELETE /requests/{id}"
  target        = "integrations/${aws_apigatewayv2_integration.cancel_request.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

# =============================================================================
# API Routes - Approval Endpoints
# =============================================================================

resource "aws_apigatewayv2_route" "approve_request" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "POST /requests/{id}/approve"
  target        = "integrations/${aws_apigatewayv2_integration.approve_request.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "decline_request" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "POST /requests/{id}/decline"
  target        = "integrations/${aws_apigatewayv2_integration.decline_request.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "request_more_info" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "POST /requests/{id}/request-more-info"
  target        = "integrations/${aws_apigatewayv2_integration.request_more_info.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

# =============================================================================
# API Routes - Admin Endpoints
# =============================================================================

resource "aws_apigatewayv2_route" "get_pending_requests" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "GET /admin/pending"
  target        = "integrations/${aws_apigatewayv2_integration.get_pending_requests.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "get_all_requests" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "GET /admin/requests"
  target        = "integrations/${aws_apigatewayv2_integration.get_all_requests.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

# =============================================================================
# API Routes - Notification Endpoints
# =============================================================================

resource "aws_apigatewayv2_route" "get_notifications" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "GET /notifications"
  target        = "integrations/${aws_apigatewayv2_integration.get_notifications.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "mark_notification_read" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "PATCH /notifications/{id}/read"
  target        = "integrations/${aws_apigatewayv2_integration.mark_notification_read.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "mark_all_notifications_read" {
  api_id        = aws_apigatewayv2_api.main.id
  route_key     = "PATCH /notifications/read-all"
  target        = "integrations/${aws_apigatewayv2_integration.mark_all_notifications_read.id}"
  authorizer_id = aws_apigatewayv2_authorizer.cognito.id
}

# =============================================================================
# API Gateway Stage
# =============================================================================

resource "aws_apigatewayv2_stage" "staging" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = var.stage_name
  auto_deploy = true

  # Access logging
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      caller         = "$context.identity.caller"
      user           = "$context.identity.user"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      resourcePath   = "$context.resourcePath"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
    })
  }

  tags = {
    Name        = "${var.project_name}-${var.stage_name}"
    Application = var.project_name
    ManagedBy   = "Terraform"
  }
}

# =============================================================================
# CloudWatch Log Group for API Gateway
# =============================================================================

resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.project_name}"
  retention_in_days = 14

  tags = {
    Name        = "${var.project_name}-api-gateway-logs"
    Application = var.project_name
    ManagedBy   = "Terraform"
  }
}
