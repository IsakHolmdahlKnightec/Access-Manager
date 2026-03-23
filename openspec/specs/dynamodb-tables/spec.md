# DynamoDB Tables

## Purpose
[TBD - DynamoDB tables for users and sessions storage]

## Requirements

### Requirement: Users table creation
The system SHALL create a DynamoDB table for storing user data.

#### Scenario: Users table provisioning
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create table named access-manager-users
- **AND** it SHALL use userId (String) as partition key
- **AND** it SHALL use on-demand capacity mode
- **AND** it SHALL enable point-in-time recovery

### Requirement: Users table schema design
The system SHALL define appropriate attributes and indexes for the users table.

#### Scenario: Users table schema
- **WHEN** examining the users table structure
- **THEN** it SHALL have attributes: userId (PK), email, createdAt, updatedAt, status
- **AND** it SHALL have a Global Secondary Index on email for lookups
- **AND** email GSI SHALL project all attributes

### Requirement: Sessions table creation
The system SHALL create a DynamoDB table for session management.

#### Scenario: Sessions table provisioning
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create table named access-manager-sessions
- **AND** it SHALL use sessionId (String) as partition key
- **AND** it SHALL use on-demand capacity mode
- **AND** it SHALL enable TTL on expiresAt attribute

### Requirement: Sessions table TTL configuration
The system SHALL enable Time-To-Live for automatic session expiration.

#### Scenario: TTL configuration
- **WHEN** configuring the sessions table
- **THEN** TTL SHALL be enabled with expiresAt as the TTL attribute
- **AND** expired items SHALL be automatically deleted within 48 hours
- **AND** the expiresAt attribute SHALL NOT be declared in the attribute blocks (TTL attributes are handled separately)
- **AND** only attributes used as keys SHALL be declared (sessionId, userId)

### Requirement: Table encryption
The system SHALL enable encryption at rest for all DynamoDB tables.

#### Scenario: Encryption validation
- **WHEN** tables are created
- **THEN** they SHALL use AWS owned key (default) or customer-managed key
- **AND** encryption SHALL be enabled at rest by default

### Requirement: Table tags and monitoring
The system SHALL apply appropriate tags and enable CloudWatch metrics.

#### Scenario: Table metadata
- **WHEN** tables are provisioned
- **THEN** they SHALL be tagged with Application and ManagedBy tags
- **AND** CloudWatch metrics SHALL be enabled for monitoring
