# Approval Workflow

## Purpose

The approval workflow enables designated admins to review and act on access requests. Admins can approve, decline, or request more information on pending requests.

## ADDED Requirements

### Requirement: Admin access to pending requests

The system SHALL provide admins with a list of pending requests requiring their attention.

#### Scenario: View pending requests
- **WHEN** admin navigates to admin approvals page
- **THEN** system SHALL display all requests with status "pending"
- **AND** each request SHALL show requester name, access name, justification, timestamp
- **AND** requests SHALL be sorted by age (oldest first)
- **AND** system SHALL display count of pending requests

#### Scenario: Non-admin cannot view pending
- **WHEN** non-admin user attempts to access admin approvals page
- **THEN** system SHALL return 403 Forbidden
- **AND** frontend SHALL redirect to access denied page

### Requirement: Approve request

The system SHALL allow admins to approve pending requests.

#### Scenario: Approve pending request
- **WHEN** admin clicks "Approve" on a pending request
- **THEN** system SHALL validate request is in "pending" status via `canApproveRequest()`
- **AND** system SHALL update request status to "approved"
- **AND** system SHALL record approver ID and approval timestamp
- **AND** system SHALL create notification for requester
- **AND** requester SHALL see access granted within their active accesses

#### Scenario: Approve non-pending request
- **WHEN** admin attempts to approve a request that is not pending
- **THEN** system SHALL return error "Request is not pending"
- **AND** request status SHALL remain unchanged

### Requirement: Decline request

The system SHALL allow admins to decline pending requests.

#### Scenario: Decline with reason
- **WHEN** admin clicks "Decline" on a pending request
- **THEN** system SHALL validate request is in "pending" status via `canDeclineRequest()`
- **AND** system SHALL prompt for decline reason (required)
- **AND** admin SHALL provide reason text
- **AND** system SHALL update request status to "declined"
- **AND** system SHALL record decliner ID and timestamp
- **AND** system SHALL create notification for requester with reason

#### Scenario: Decline without reason
- **WHEN** admin attempts to decline without providing reason
- **THEN** system SHALL return validation error
- **AND** request status SHALL remain unchanged

### Requirement: Request more information

The system SHALL allow admins to request additional information from requesters.

#### Scenario: Request more info
- **WHEN** admin clicks "Need More Info" on a pending request
- **THEN** system SHALL validate request is in "pending" status via `canRequestMoreInfo()`
- **AND** system SHALL prompt for information request message (required)
- **AND** system SHALL update request status to "more_info"
- **AND** system SHALL create notification for requester
- **AND** requester SHALL be able to add additional justification

### Requirement: Respond to info request

The system SHALL allow requesters to provide additional information on requests in "more_info" status.

#### Scenario: Provide additional info
- **WHEN** user adds justification text and submits on "more_info" request
- **THEN** system SHALL validate request is in "more_info" status via `canAddMoreInfo()`
- **AND** system SHALL update request status back to "pending"
- **AND** system SHALL append new justification to existing
- **AND** system SHALL create notification for assigned admins

### Requirement: Admin request history

The system SHALL allow admins to view all requests, not just pending.

#### Scenario: View all requests
- **WHEN** admin navigates to admin request history page
- **THEN** system SHALL display all requests
- **AND** requests SHALL be filterable by status
- **AND** requests SHALL be filterable by date range
- **AND** requests SHALL be sortable by date, status, requester

### Requirement: Admin search requests

The system SHALL allow admins to search requests by various criteria.

#### Scenario: Search by requester
- **WHEN** admin enters a requester name or email
- **THEN** system SHALL display requests matching that requester
- **AND** search SHALL be case-insensitive

#### Scenario: Search by access
- **WHEN** admin enters an access name
- **THEN** system SHALL display requests for that access
