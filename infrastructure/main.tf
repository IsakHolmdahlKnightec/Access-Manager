terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "access-manager-terraform-state-747565123955"
    key          = "infrastructure/terraform.tfstate"
    region       = "eu-north-1"
    encrypt      = true
    use_lockfile = true
    profile      = "dewire"
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  default_tags {
    tags = {
      Application = "Access Manager"
      ManagedBy   = "Terraform"
    }
  }
}

# Data source for current AWS account
data "aws_caller_identity" "current" {}

# Data source for current AWS region
data "aws_region" "current" {}

# =============================================================================
# DynamoDB Module
# =============================================================================

module "dynamodb" {
  source = "./modules/dynamodb"

  project_name                  = var.project_name
  users_table_name              = var.dynamodb_table_name_users
  sessions_table_name           = var.dynamodb_table_name_sessions
  enable_point_in_time_recovery = var.enable_dynamodb_point_in_time_recovery
}

# =============================================================================
# IAM Module
# =============================================================================

module "iam" {
  source = "./modules/iam"

  project_name                = var.project_name
  dynamodb_users_table_arn    = module.dynamodb.users_table_arn
  dynamodb_sessions_table_arn = module.dynamodb.sessions_table_arn
  secrets_arns                = values(module.secrets.secret_arns)
  parameter_store_prefix      = var.parameter_store_prefix
}

# =============================================================================
# Secrets Module
# =============================================================================

module "secrets" {
  source = "./modules/secrets"

  project_name           = var.project_name
  secrets_prefix         = var.secrets_prefix
  parameter_store_prefix = var.parameter_store_prefix
  additional_secrets     = var.additional_secrets
  additional_parameters  = var.additional_parameters
}

# =============================================================================
# Cognito Module
# =============================================================================

module "cognito" {
  source = "./modules/cognito"

  project_name   = var.project_name
  user_pool_name = var.cognito_user_pool_name
  callback_urls  = var.cognito_callback_urls
  logout_urls    = var.cognito_logout_urls
  domain_prefix  = var.cognito_domain_prefix
}

# =============================================================================
# Amplify Module
# =============================================================================

module "amplify" {
  source = "./modules/amplify"

  project_name        = var.project_name
  app_name            = var.amplify_app_name
  repository_url      = var.amplify_repository_url
  access_token        = var.amplify_access_token
  branch_name         = var.amplify_branch_name
  custom_domain       = var.amplify_custom_domain
  enable_basic_auth   = var.enable_amplify_basic_auth
  basic_auth_username = var.amplify_basic_auth_username
  basic_auth_password = var.amplify_basic_auth_password
  service_role_arn    = module.iam.amplify_execution_role_arn

  environment_variables = {
    COGNITO_USER_POOL_ID    = module.cognito.user_pool_id
    COGNITO_APP_CLIENT_ID   = module.cognito.app_client_id
    COGNITO_DOMAIN          = module.cognito.cognito_domain
    DYNAMODB_USERS_TABLE    = module.dynamodb.users_table_name
    DYNAMODB_SESSIONS_TABLE = module.dynamodb.sessions_table_name
    APP_REGION              = var.aws_region
  }
}

# =============================================================================
# Resource Group - Organizes all Access Manager resources
# =============================================================================

resource "aws_resourcegroups_group" "access_manager" {
  name        = "${var.project_name}-resources"
  description = "Resource group for ${var.project_name} application resources"

  resource_query {
    query = jsonencode({
      ResourceTypeFilters = ["AWS::AllSupported"]
      TagFilters = [
        {
          Key    = "Application"
          Values = [var.project_name]
        }
      ]
    })
  }

  tags = {
    Name        = "${var.project_name}-resources"
    Application = var.project_name
    ManagedBy   = "Terraform"
  }
}
