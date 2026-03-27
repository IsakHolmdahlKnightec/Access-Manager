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
    frontend:
      phases:
        preBuild:
          commands:
            - cd web
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: web/.amplify-hosting
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

  # SPA routing: serve index.html for client-side navigation
  # With WEB_COMPUTE, API routes go to Lambda, static pages are served via CDN
  custom_rule {
    source = "/<*>"
    status = "404-200"
    target = "/index.html"
  }

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
  branch_name = var.branch_name

  # Enable auto-build for the branch
  enable_auto_build = true

  # Basic authentication (if enabled)
  enable_basic_auth = var.enable_basic_auth

  tags = {
    Name        = "${var.app_name}-${var.branch_name}"
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
