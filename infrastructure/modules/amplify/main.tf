# =============================================================================
# Amplify App
# =============================================================================

resource "aws_amplify_app" "main" {
  name       = var.app_name
  repository = var.repository_url != "" ? var.repository_url : null
  platform   = "WEB_COMPUTE" # Supports Next.js API routes as Lambda functions

  # OAuth token for repository access
  access_token = var.access_token != "" ? var.access_token : null

  # Build specification
  build_spec = <<-EOT
    version: 1
    applications:
    - appRoot: web
      frontend:
        phases:
          preBuild:
            commands:
              - npm ci
          build:
            commands:
              - npm run build --prefix=web
        artifacts:
          baseDirectory: .next
          files:
            - '**/*'
        cache:
          paths:
            - web/node_modules/**/*
            - web/.next/cache/**/*
  EOT

  # Enable branch auto-build
  enable_branch_auto_build = true

  # IAM service role
  iam_service_role_arn = var.service_role_arn

  # Environment variables
  environment_variables = var.environment_variables

  # SPA routing: With WEB_COMPUTE, all routes are handled by the compute resource
  # The deploy-manifest.json defines the routing rules
  # Note: Custom rules for 404 handling should be managed in the application code

  tags = {
    Name        = var.app_name
    Application = var.project_name
    ManagedBy   = "Terraform"
  }

  # Prevent accidental destruction
  lifecycle {
    prevent_destroy = false
  }
}

# =============================================================================
# Amplify Branch
# =============================================================================

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.main.id
  branch_name = "main"

  # Enable auto-build for the branch
  enable_auto_build = true

  # Basic authentication (if enabled)
  enable_basic_auth = var.enable_basic_auth

  tags = {
    Name        = "${var.app_name}-main"
    Application = var.project_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_amplify_branch" "dev" {
  app_id      = aws_amplify_app.main.id
  branch_name = "dev"

  # Enable auto-build for the branch
  enable_auto_build = true

  # Basic authentication (if enabled)
  enable_basic_auth = var.enable_basic_auth

  tags = {
    Name        = "${var.app_name}-dev"
    Application = var.project_name
    ManagedBy   = "Terraform"
  }
}
# =============================================================================
# Amplify Domain Association (Optional)
# =============================================================================

resource "aws_amplify_domain_association" "main" {
  count = var.custom_domain != "" ? 1 : 0

  app_id      = aws_amplify_app.main.id
  domain_name = var.custom_domain

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}
