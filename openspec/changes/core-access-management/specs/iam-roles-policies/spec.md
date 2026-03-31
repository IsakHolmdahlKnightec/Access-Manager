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

### Requirement: Lambda layer for AWS SDK dependencies

The system SHALL provide a Lambda layer containing shared AWS SDK dependencies.

#### Scenario: Lambda layer provisioning
- **WHEN** configuring Lambda functions
- **THEN** it SHALL create a Lambda layer for AWS SDK v3 dependencies
- **AND** layer SHALL include `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`
- **AND** layer SHALL be attached to all access management Lambda functions
- **AND** layer attachment SHALL reduce deployment package size
- **AND** layer version SHALL be compatible with the Lambda runtime (Node.js 20.x)

#### Scenario: Lambda layer packaging
- **WHEN** building deployment artifacts
- **THEN** layer SHALL be packaged as `lambda/layer.zip`
- **AND** layer SHALL follow Lambda layer directory structure (`nodejs/node_modules/`)
- **AND** layer SHALL contain only production dependencies (no devDependencies)
- **AND** layer zip SHALL be approximately 3-4MB in size

### Requirement: Lambda function deployment packages

The system SHALL organize Lambda functions into deployment packages by domain.

#### Scenario: Function packaging structure
- **WHEN** deploying Lambda functions
- **THEN** functions SHALL be grouped into domain-specific zip files:
  - `lambda/access.zip` - Access catalog functions (getAccesses, getAccess)
  - `lambda/requests.zip` - Request management functions (getRequests, getRequest, createRequest, cancelRequest, addMoreInfo)
  - `lambda/admin.zip` - Admin approval functions (getPendingRequests, getAllRequests, approveRequest, declineRequest, requestMoreInfo)
  - `lambda/notifications.zip` - Notification functions (getNotifications, markNotificationRead, markAllNotificationsRead, streamHandler)
- **AND** each zip SHALL contain compiled JavaScript from `lambda/dist/` directory
- **AND** each zip SHALL be approximately 25-35KB (excluding AWS SDK, which is in layer)
- **AND** shared code SHALL be located in `lambda/shared/` and included in all zips

### Requirement: API Gateway execution role

The system SHALL create an IAM role for API Gateway to invoke Lambda functions.

#### Scenario: API Gateway execution role provisioning
- **WHEN** configuring the IAM module
- **THEN** it SHALL create APIGateway-Execution-Role
- **AND** it SHALL allow API Gateway service to assume the role
- **AND** it SHALL grant invoke permission on access management Lambda functions
- **AND** it SHALL restrict invoke permission to specific function ARNs
