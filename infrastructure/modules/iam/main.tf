# =============================================================================
# Amplify Execution Role
# =============================================================================

resource "aws_iam_role" "amplify_execution" {
  name = "${var.project_name}-amplify-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "amplify.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-amplify-execution-role"
  }
}

# =============================================================================
# Terraform Execution Role
# =============================================================================

resource "aws_iam_role" "terraform_execution" {
  name = "${var.project_name}-terraform-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Condition = {
          Bool = {
            "aws:MultiFactorAuthPresent" = "true"
          }
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-terraform-execution-role"
  }
}

# =============================================================================
# DynamoDB Access Policy - Users Table
# =============================================================================

resource "aws_iam_policy" "dynamodb_users_access" {
  name        = "${var.project_name}-dynamodb-users-access"
  description = "Policy for accessing the users DynamoDB table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem"
        ]
        Resource = [
          var.dynamodb_users_table_arn,
          "${var.dynamodb_users_table_arn}/index/*"
        ]
      }
    ]
  })
}

# =============================================================================
# DynamoDB Access Policy - Sessions Table
# =============================================================================

resource "aws_iam_policy" "dynamodb_sessions_access" {
  name        = "${var.project_name}-dynamodb-sessions-access"
  description = "Policy for accessing the sessions DynamoDB table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem"
        ]
        Resource = [
          var.dynamodb_sessions_table_arn,
          "${var.dynamodb_sessions_table_arn}/index/*"
        ]
      }
    ]
  })
}

# =============================================================================
# Parameter Store Access Policy
# =============================================================================

resource "aws_iam_policy" "parameter_store_read" {
  name        = "${var.project_name}-parameter-store-read"
  description = "Policy for reading Parameter Store parameters"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:*:*:parameter${var.parameter_store_prefix}*"
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:ViaService" = "ssm.*.amazonaws.com"
          }
        }
      }
    ]
  })
}

# =============================================================================
# Secrets Manager Access Policy
# =============================================================================

resource "aws_iam_policy" "secrets_manager_read" {
  name        = "${var.project_name}-secrets-manager-read"
  description = "Policy for reading Secrets Manager secrets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = length(var.secrets_arns) > 0 ? var.secrets_arns : ["arn:aws:secretsmanager:*:*:secret:${var.project_name}*"]
      }
    ]
  })
}

# =============================================================================
# Policy Attachments for Amplify Role
# =============================================================================

resource "aws_iam_role_policy_attachment" "amplify_dynamodb_users" {
  role       = aws_iam_role.amplify_execution.name
  policy_arn = aws_iam_policy.dynamodb_users_access.arn
}

resource "aws_iam_role_policy_attachment" "amplify_dynamodb_sessions" {
  role       = aws_iam_role.amplify_execution.name
  policy_arn = aws_iam_policy.dynamodb_sessions_access.arn
}

resource "aws_iam_role_policy_attachment" "amplify_parameter_store" {
  role       = aws_iam_role.amplify_execution.name
  policy_arn = aws_iam_policy.parameter_store_read.arn
}

resource "aws_iam_role_policy_attachment" "amplify_secrets_manager" {
  role       = aws_iam_role.amplify_execution.name
  policy_arn = aws_iam_policy.secrets_manager_read.arn
}

# =============================================================================
# Terraform Execution Policy
# =============================================================================

resource "aws_iam_role_policy" "terraform_execution_policy" {
  name = "${var.project_name}-terraform-execution-policy"
  role = aws_iam_role.terraform_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:*",
          "amplify:*",
          "dynamodb:*",
          "iam:*",
          "ssm:*",
          "secretsmanager:*",
          "kms:*"
        ]
        Resource = "*"
      }
    ]
  })
}

# =============================================================================
# Lambda Execution Role
# =============================================================================

resource "aws_iam_role" "lambda_execution" {
  name = "${var.project_name}-lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-lambda-execution-role"
  }
}

# =============================================================================
# DynamoDB Access Policy - Access Manager Data Table
# =============================================================================

resource "aws_iam_policy" "dynamodb_access_data_access" {
  name        = "${var.project_name}-dynamodb-access-data-access"
  description = "Policy for accessing the access-manager-data DynamoDB table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem"
        ]
        Resource = [
          var.dynamodb_access_data_table_arn,
          "${var.dynamodb_access_data_table_arn}/index/*",
          "${var.dynamodb_access_data_table_arn}/stream/*"
        ]
      }
    ]
  })
}

# =============================================================================
# CloudWatch Logs Policy
# =============================================================================

resource "aws_iam_policy" "lambda_logs" {
  name        = "${var.project_name}-lambda-logs"
  description = "Policy for Lambda function CloudWatch Logs"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# =============================================================================
# Policy Attachments for Lambda Role
# =============================================================================

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_access_data" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = aws_iam_policy.dynamodb_access_data_access.arn
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_users" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = aws_iam_policy.dynamodb_users_access.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = aws_iam_policy.lambda_logs.arn
}

# =============================================================================
# API Gateway Execution Role for Lambda Invocation
# =============================================================================

resource "aws_iam_role" "api_gateway_execution" {
  name = "${var.project_name}-api-gateway-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-api-gateway-execution-role"
  }
}

# Policy allowing API Gateway to invoke Lambda functions
resource "aws_iam_policy" "api_gateway_lambda_invoke" {
  name        = "${var.project_name}-api-gateway-lambda-invoke"
  description = "Policy for API Gateway to invoke Lambda functions"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction",
          "lambda:InvokeAsync"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_gateway_lambda_invoke" {
  role       = aws_iam_role.api_gateway_execution.name
  policy_arn = aws_iam_policy.api_gateway_lambda_invoke.arn
}

# =============================================================================
# Data Sources
# =============================================================================

data "aws_caller_identity" "current" {}
