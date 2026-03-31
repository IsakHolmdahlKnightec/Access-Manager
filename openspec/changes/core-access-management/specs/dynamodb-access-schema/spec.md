# DynamoDB Access Schema

## Purpose

This spec defines the DynamoDB table schema for storing access requests, approvals, accesses, projects, and teams using a single-table design with entity discrimination.

## ADDED Requirements

### Requirement: Single-table entity design

The system SHALL use a single DynamoDB table for all access-related entities.

#### Scenario: Table naming
- **WHEN** DynamoDB table is provisioned
- **THEN** table SHALL be named "access-manager-data"
- **AND** it SHALL use on-demand capacity mode
- **AND** it SHALL enable point-in-time recovery

### Requirement: Access entity schema

The system SHALL store access definitions with proper attributes.

#### Scenario: Access entity attributes
- **WHEN** storing an access entity
- **THEN** PK SHALL be "ACCESS#<accessId>"
- **AND** SK SHALL be "METADATA"
- **AND** attributes SHALL include: accessId, name, type, description, createdAt, updatedAt, status, dependencies

### Requirement: Request entity schema

The system SHALL store access requests with full lifecycle tracking.

#### Scenario: Request entity attributes
- **WHEN** storing a request entity
- **THEN** PK SHALL be "USER#<userId>"
- **AND** SK SHALL be "REQUEST#<requestId>"
- **AND** attributes SHALL include: requestId, accessId, accessName, status, justification, createdAt, updatedAt, duration
- **AND** GSI1PK SHALL be "REQUEST#<status>" for status-based queries
- **AND** GSI1SK SHALL be "<timestamp>" for sorting

### Requirement: Approval entity schema

The system SHALL store approval/decline records for audit trail.

#### Scenario: Approval entity attributes
- **WHEN** storing an approval entity
- **THEN** PK SHALL be "REQUEST#<requestId>"
- **AND** SK SHALL be "APPROVAL#<approvalId>"
- **AND** attributes SHALL include: approvalId, adminId, adminEmail, action, reason, timestamp

### Requirement: Notification entity schema

The system SHALL store notifications for users.

#### Scenario: Notification entity attributes
- **WHEN** storing a notification entity
- **THEN** PK SHALL be "USER#<userId>"
- **AND** SK SHALL be "#<timestamp>#<notificationId>"
- **AND** attributes SHALL include: notificationId, type, message, requestId, read, createdAt

### Requirement: Project entity schema

The system SHALL store project definitions for organizing accesses.

#### Scenario: Project entity attributes
- **WHEN** storing a project entity
- **THEN** PK SHALL be "PROJECT#<projectId>"
- **AND** SK SHALL be "METADATA"
- **AND** attributes SHALL include: projectId, name, description, status, createdAt

### Requirement: Team entity schema

The system SHALL store team definitions for organizing users and accesses.

#### Scenario: Team entity attributes
- **WHEN** storing a team entity
- **THEN** PK SHALL be "TEAM#<teamId>"
- **AND** SK SHALL be "METADATA"
- **AND** attributes SHALL include: teamId, name, description, projectId, createdAt

### Requirement: Global Secondary Indexes

The system SHALL provide GSIs for common access patterns.

#### Scenario: Status-based request queries (GSI1)
- **WHEN** querying requests by status
- **THEN** GSI1 with PK "REQUEST#<status>" SHALL be used
- **AND** SK SHALL be timestamp for chronological ordering
- **AND** GSI1 SHALL project all attributes

#### Scenario: User notification queries
- **WHEN** querying notifications for a user
- **THEN** PK "USER#<userId>" with SK starting with "#" SHALL be used
- **AND** notifications SHALL be returned in reverse chronological order

#### Scenario: Access type queries (GSI2)
- **WHEN** querying accesses by type
- **THEN** GSI2 with PK "ACCESS#TYPE#<type>" SHALL be used
- **AND** SK SHALL be "ACCESS#<accessId>" for pagination
