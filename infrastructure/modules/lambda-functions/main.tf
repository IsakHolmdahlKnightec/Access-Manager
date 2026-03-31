# =============================================================================
# Lambda Functions - Access Management API
# =============================================================================
# This module deploys all Lambda functions for the Access Manager API
# Lambda source code is located in /lambda/ directory

data "aws_region" "current" {}

# =============================================================================
# Access Functions
# =============================================================================

resource "aws_lambda_function" "get_accesses" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/access.zip"
  function_name = "${var.project_name}-getAccesses"
  role          = var.lambda_execution_role_arn
  handler       = "access/getAccesses.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "List all accesses with optional filters"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-getAccesses"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "get_access" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/access.zip"
  function_name = "${var.project_name}-getAccess"
  role          = var.lambda_execution_role_arn
  handler       = "access/getAccess.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Get single access details"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-getAccess"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

# =============================================================================
# Request Functions
# =============================================================================

resource "aws_lambda_function" "get_requests" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/requests.zip"
  function_name = "${var.project_name}-getRequests"
  role          = var.lambda_execution_role_arn
  handler       = "requests/getRequests.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "List user's requests"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-getRequests"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "get_request" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/requests.zip"
  function_name = "${var.project_name}-getRequest"
  role          = var.lambda_execution_role_arn
  handler       = "requests/getRequest.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Get request details"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-getRequest"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "create_request" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/requests.zip"
  function_name = "${var.project_name}-createRequest"
  role          = var.lambda_execution_role_arn
  handler       = "requests/createRequest.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Create new access request"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-createRequest"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "cancel_request" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/requests.zip"
  function_name = "${var.project_name}-cancelRequest"
  role          = var.lambda_execution_role_arn
  handler       = "requests/cancelRequest.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Cancel pending request"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-cancelRequest"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "add_more_info" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/requests.zip"
  function_name = "${var.project_name}-addMoreInfo"
  role          = var.lambda_execution_role_arn
  handler       = "requests/addMoreInfo.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Add more information to request"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-addMoreInfo"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

# =============================================================================
# Admin Functions
# =============================================================================

resource "aws_lambda_function" "get_pending_requests" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/admin.zip"
  function_name = "${var.project_name}-getPendingRequests"
  role          = var.lambda_execution_role_arn
  handler       = "admin/getPendingRequests.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "List pending requests (admin)"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-getPendingRequests"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "get_all_requests" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/admin.zip"
  function_name = "${var.project_name}-getAllRequests"
  role          = var.lambda_execution_role_arn
  handler       = "admin/getAllRequests.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Admin request history"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-getAllRequests"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "approve_request" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/admin.zip"
  function_name = "${var.project_name}-approveRequest"
  role          = var.lambda_execution_role_arn
  handler       = "admin/approveRequest.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Approve pending request"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-approveRequest"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "decline_request" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/admin.zip"
  function_name = "${var.project_name}-declineRequest"
  role          = var.lambda_execution_role_arn
  handler       = "admin/declineRequest.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Decline request with reason"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-declineRequest"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "request_more_info" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/admin.zip"
  function_name = "${var.project_name}-requestMoreInfo"
  role          = var.lambda_execution_role_arn
  handler       = "admin/requestMoreInfo.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Request additional information"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-requestMoreInfo"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

# =============================================================================
# Notification Functions
# =============================================================================

resource "aws_lambda_function" "get_notifications" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/notifications.zip"
  function_name = "${var.project_name}-getNotifications"
  role          = var.lambda_execution_role_arn
  handler       = "notifications/getNotifications.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "List user notifications"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-getNotifications"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "mark_notification_read" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/notifications.zip"
  function_name = "${var.project_name}-markNotificationRead"
  role          = var.lambda_execution_role_arn
  handler       = "notifications/markNotificationRead.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Mark notification as read"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-markNotificationRead"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_lambda_function" "mark_all_notifications_read" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/notifications.zip"
  function_name = "${var.project_name}-markAllNotificationsRead"
  role          = var.lambda_execution_role_arn
  handler       = "notifications/markAllNotificationsRead.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "Bulk mark notifications as read"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-markAllNotificationsRead"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

# =============================================================================
# DynamoDB Stream Handler for Notifications
# =============================================================================

resource "aws_lambda_function" "notification_stream_handler" {
  filename      = var.lambda_zip_path != "" ? var.lambda_zip_path : "../../lambda/notifications.zip"
  function_name = "${var.project_name}-notificationStreamHandler"
  role          = var.lambda_execution_role_arn
  handler       = "notifications/streamHandler.handler"
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size
  description   = "DynamoDB stream handler for notification creation"

  environment {
    variables = {
      DYNAMODB_ACCESS_TABLE_NAME = var.dynamodb_access_table_name
      STAGE                      = var.stage_name
      AWS_REGION                 = data.aws_region.current.name
    }
  }

  tags = {
    Name        = "${var.project_name}-notificationStreamHandler"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}

# DynamoDB Stream association
resource "aws_lambda_event_source_mapping" "notification_stream" {
  event_source_arn  = var.dynamodb_access_table_stream_arn
  function_name     = aws_lambda_function.notification_stream_handler.function_name
  starting_position = "LATEST"
  batch_size        = 100

  tags = {
    Name        = "${var.project_name}-notificationStream"
    Application = var.project_name
    Stage       = var.stage_name
    ManagedBy   = "Terraform"
  }
}
