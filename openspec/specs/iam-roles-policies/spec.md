# IAM Roles and Policies

## Purpose
[TBD - IAM roles and policies for least privilege access]

## Requirements

### Requirement: Terraform execution role
The system SHALL create an IAM role for Terraform execution.

#### Scenario: Terraform role provisioning
- **WHEN** applying bootstrap configuration
- **THEN** it SHALL create IAM role for Terraform operations
- **AND** it SHALL have AdministratorAccess or scoped administrative permissions
- **AND** it SHALL have trust policy allowing specific users/groups

### Requirement: Amplify execution role
The system SHALL create an IAM role for Amplify service.

#### Scenario: Amplify role provisioning
- **WHEN** configuring the Amplify module
- **THEN** it SHALL create Amplify-Execution-Role
- **AND** it SHALL allow Amplify service to assume the role
- **AND** it SHALL grant read access to Parameter Store and Secrets Manager

### Requirement: DynamoDB access policy
The system SHALL create IAM policies for DynamoDB table access.

#### Scenario: DynamoDB policy creation
- **WHEN** configuring IAM
- **THEN** it SHALL create policy for users table access
- **AND** it SHALL create policy for sessions table access
- **AND** each policy SHALL allow only required actions (GetItem, PutItem, UpdateItem, DeleteItem, Query)
- **AND** policies SHALL restrict to specific table ARNs

### Requirement: Cognito authentication role
The system SHALL create IAM roles for authenticated and unauthenticated Cognito users.

#### Scenario: Cognito IAM roles
- **WHEN** configuring Cognito Identity Pool (if used)
- **THEN** it SHALL create AuthenticatedRole with limited permissions
- **AND** it SHALL create UnauthenticatedRole with minimal or no permissions
- **AND** roles SHALL follow principle of least privilege

### Requirement: IAM policy least privilege
The system SHALL implement least privilege access for all IAM policies.

#### Scenario: Policy validation
- **WHEN** reviewing IAM policies
- **THEN** no policy SHALL grant wildcard (*) permissions on resources
- **AND** policies SHALL specify exact actions required
- **AND** policies SHALL specify exact resource ARNs where possible
- **AND** policies SHALL include conditions for additional security where appropriate

### Requirement: Service-linked roles
The system SHALL ensure required service-linked roles exist.

#### Scenario: Service roles validation
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create service-linked roles for Cognito and other services if needed
- **AND** it SHALL verify roles are properly configured

### Requirement: IAM role trust policies
The system SHALL define proper trust policies for all roles.

#### Scenario: Trust policy configuration
- **WHEN** creating IAM roles
- **THEN** trust policies SHALL specify which principals can assume the role
- **AND** trust policies SHALL include external ID for third-party access if applicable
- **AND** trust policies SHALL restrict to specific AWS services where applicable
