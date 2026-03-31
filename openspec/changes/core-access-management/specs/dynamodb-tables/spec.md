# DynamoDB Tables

## Purpose

[TBD - DynamoDB tables for users, sessions, and access management data storage]

## MODIFIED Requirements

### Requirement: Users table creation

**FROM:**
> The system SHALL create a DynamoDB table for storing user data.

**TO:**
The system SHALL create a DynamoDB table for storing user data.

#### Scenario: Users table provisioning
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create table named access-manager-users
- **AND** it SHALL use userId (String) as partition key
- **AND** it SHALL use on-demand capacity mode
- **AND** it SHALL enable point-in-time recovery

### Requirement: Users table schema design

**FROM:**
> The system SHALL define appropriate attributes and indexes for the users table.

**TO:**
The system SHALL define appropriate attributes and indexes for the users table.

#### Scenario: Users table schema
- **WHEN** examining the users table structure
- **THEN** it SHALL have attributes: userId (PK), email, createdAt, updatedAt, status, teamId, projectId, role
- **AND** it SHALL have a Global Secondary Index on email for lookups
- **AND** email GSI SHALL project all attributes
- **AND** role attribute SHALL store "user" or "admin" value

## ADDED Requirements

### Requirement: Access data table creation

The system SHALL create a DynamoDB table for storing access management entities (accesses, requests, approvals, projects, teams, notifications).

#### Scenario: Access data table provisioning
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create table named access-manager-data
- **AND** it SHALL use userId (String) as partition key
- **AND** it SHALL use on-demand capacity mode
- **AND** it SHALL enable point-in-time recovery
- **AND** it SHALL enable DynamoDB streams with NEW_AND_OLD_IMAGES view type
