# =============================================================================
# Secrets Manager - Application Secrets
# =============================================================================

locals {
  # Convert sensitive map to non-sensitive keys for for_each
  secret_keys = nonsensitive(keys(var.additional_secrets))
}

resource "aws_secretsmanager_secret" "app_secrets" {
  for_each = toset(local.secret_keys)

  name                    = "${var.secrets_prefix}/${each.value}"
  description             = "Secret for ${each.value}"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.secrets_prefix}/${each.value}"
  }
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  for_each = toset(local.secret_keys)

  secret_id     = aws_secretsmanager_secret.app_secrets[each.value].id
  secret_string = var.additional_secrets[each.value]
}

# =============================================================================
# Parameter Store - Application Configuration
# =============================================================================

resource "aws_ssm_parameter" "app_config" {
  for_each = var.additional_parameters

  name  = "${var.parameter_store_prefix}/${each.key}"
  type  = "String"
  value = each.value

  tags = {
    Name = "${var.parameter_store_prefix}/${each.key}"
  }
}

# =============================================================================
# Standard Application Parameters
# =============================================================================

resource "aws_ssm_parameter" "app_name" {
  name  = "${var.parameter_store_prefix}/app-name"
  type  = "String"
  value = var.project_name

  tags = {
    Name = "${var.parameter_store_prefix}/app-name"
  }
}
