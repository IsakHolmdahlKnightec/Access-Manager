# Secrets Management

## Purpose
[TBD - AWS Secrets Manager and Parameter Store for secrets and configuration]

## Requirements

### Requirement: Secrets Manager for sensitive data
The system SHALL use AWS Secrets Manager for storing sensitive secrets, handling sensitive Terraform variables correctly.

#### Scenario: Secrets creation
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create secrets in Secrets Manager for third-party API keys
- **AND** it SHALL create secrets for database credentials (if RDS added later)
- **AND** secrets SHALL be named with prefix (access-manager/{secret-name})
- **AND** when using for_each with sensitive map variables, it SHALL extract non-sensitive keys using `nonsensitive(keys(var.additional_secrets))`
- **AND** it SHALL use extracted keys in for_each: `for_each = toset(local.secret_keys)`
- **AND** it SHALL reference secret values via the original map: `var.additional_secrets[each.value]`

### Requirement: Parameter Store for configuration
The system SHALL use AWS Systems Manager Parameter Store for non-sensitive configuration.

#### Scenario: Parameter creation
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create parameters in Parameter Store for application configuration
- **AND** parameters SHALL use hierarchical paths (/access-manager/config/{name})
- **AND** it SHALL support both String and SecureString parameter types

### Requirement: Secret versioning
The system SHALL support secret versioning in Secrets Manager.

#### Scenario: Version management
- **WHEN** rotating or updating secrets
- **THEN** Secrets Manager SHALL maintain version history
- **AND** previous versions SHALL be accessible for rollback
- **AND** automatic rotation CAN be configured for supported secrets

### Requirement: Parameter encryption
The system SHALL encrypt SecureString parameters.

#### Scenario: Parameter encryption
- **WHEN** creating SecureString parameters
- **THEN** they SHALL be encrypted using AWS KMS
- **AND** default AWS managed key SHALL be used or custom KMS key can be specified
- **AND** IAM policies SHALL control decryption access

### Requirement: Secrets access via IAM
The system SHALL control access to secrets via IAM policies.

#### Scenario: Access control
- **WHEN** IAM roles access secrets
- **THEN** Amplify execution role SHALL have read access to required secrets
- **AND** Terraform role SHALL have full access for management
- **AND** no other roles SHALL have access unless explicitly required

### Requirement: Secrets in Terraform state protection
The system SHALL prevent secrets from being stored in plain text in Terraform state.

#### Scenario: State protection
- **WHEN** Terraform manages secrets
- **THEN** secret values SHALL be marked as sensitive in outputs
- **AND** Terraform SHALL mask sensitive values in logs
- **AND** state files SHALL be encrypted at rest in S3
- **AND** access to state files SHALL be restricted to Terraform execution role

### Requirement: Secret reference in configuration
The system SHALL reference secrets by ARN rather than value.

#### Scenario: Configuration reference
- **WHEN** configuring services that need secrets
- **THEN** they SHALL reference the Secrets Manager ARN
- **AND** services SHALL retrieve secret values at runtime
- **AND** secret values SHALL NOT be hardcoded in configuration files
