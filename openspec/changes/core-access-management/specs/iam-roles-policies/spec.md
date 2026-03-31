# IAM Roles and Policies

## Purpose

[TBD - IAM roles and policies for least privilege access]

## MODIFIED Requirements

### Requirement: DynamoDB access policy

**FROM:**
> The system SHALL create IAM policies for DynamoDB table access.

#### Scenario: DynamoDB policy creation
- **WHEN** configuring IAM
- **THEN** it SHALL create policy for users table access
- **AND** it SHALL create policy for sessions table access
- **AND** each policy SHALL allow only required actions (GetItem, PutItem, UpdateItem, DeleteItem, Query)
- **AND** policies SHALL restrict to specific table ARNs

**TO:**
The system SHALL create IAM policies for DynamoDB table access.

#### Scenario: DynamoDB policy creation
- **WHEN** configuring IAM
- **THEN** it SHALL create policy for users table access
- **AND** it SHALL create policy for sessions table access
- **AND** it SHALL create policy for access-manager-data table access
- **AND** each policy SHALL allow only required actions (GetItem, PutItem, UpdateItem, DeleteItem, Query, Scan)
- **AND** policies SHALL restrict to specific table ARNs

## ADDED Requirements

### Requirement: Lambda execution role for access management

The system SHALL create an IAM role for Lambda functions handling access management operations.

#### Scenario: Lambda execution role provisioning
- **WHEN** configuring the IAM module for access management
- **THEN** it SHALL create Lambda-Execution-Role for access-manager
- **AND** it SHALL allow Lambda service to assume the role
- **AND** it SHALL grant read/write access to access-manager-data table
- **AND** it SHALL grant read access to access-manager-users table
- **AND** it SHALL grant access to CloudWatch Logs for Lambda
- **AND** it SHALL follow least privilege with specific action restrictions

### Requirement: API Gateway execution role

The system SHALL create an IAM role for API Gateway to invoke Lambda functions.

#### Scenario: API Gateway execution role provisioning
- **WHEN** configuring the IAM module
- **THEN** it SHALL create APIGateway-Execution-Role
- **AND** it SHALL allow API Gateway service to assume the role
- **AND** it SHALL grant invoke permission on access management Lambda functions
- **AND** it SHALL restrict invoke permission to specific function ARNs
