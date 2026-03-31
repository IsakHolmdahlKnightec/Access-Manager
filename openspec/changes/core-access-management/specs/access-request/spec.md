# Access Request

## Purpose

The access request capability allows users to request access to specific resources. Users select an access, provide justification, and track their request through its lifecycle (pending, approved, declined, active).

## ADDED Requirements

### Requirement: Create access request

The system SHALL allow users to create access requests for available accesses.

#### Scenario: Create request for available access
- **WHEN** user selects an access and clicks "Request Access"
- **THEN** system SHALL display request creation form
- **AND** form SHALL include justification field (required, min 10 characters)
- **AND** form SHALL include intended duration field (optional, default: permanent)
- **AND** form SHALL include submit button

#### Scenario: Submit valid request
- **WHEN** user fills form with valid justification (≥10 characters) and submits
- **THEN** system SHALL create request with status "pending"
- **AND** system SHALL store requester ID from session
- **AND** system SHALL store access ID, justification, timestamp
- **AND** system SHALL return success with request ID
- **AND** system SHALL create notification for admins

#### Scenario: Submit request without justification
- **WHEN** user submits form with justification shorter than 10 characters
- **THEN** system SHALL return validation error
- **AND** system SHALL not create request

#### Scenario: Request already active
- **WHEN** user attempts to request access they already have active
- **THEN** system SHALL return error "Access already granted"
- **AND** system SHALL not create duplicate request

### Requirement: List user's requests

The system SHALL allow users to view their own access requests.

#### Scenario: View my requests list
- **WHEN** user navigates to my requests page
- **THEN** system SHALL display all requests by this user
- **AND** each request SHALL show access name, status, creation date
- **AND** requests SHALL be sorted by creation date (newest first)

#### Scenario: Empty requests list
- **WHEN** user has no requests
- **THEN** system SHALL display "No requests yet"
- **AND** system SHALL provide link to browse access catalog

### Requirement: View request details

The system SHALL allow users to view details of their own requests.

#### Scenario: View pending request details
- **WHEN** user views details of their pending request
- **THEN** system SHALL display access name, justification, status
- **AND** system SHALL display creation timestamp
- **AND** system SHALL display "Pending Review" status badge
- **AND** system SHALL allow user to cancel request

#### Scenario: View approved request details
- **WHEN** user views details of their approved request
- **THEN** system SHALL display access name, justification, status
- **AND** system SHALL display approval timestamp and approver name
- **AND** system SHALL display "Approved" status badge

#### Scenario: View declined request details
- **WHEN** user views details of their declined request
- **THEN** system SHALL display access name, justification, status
- **AND** system SHALL display decline reason if provided
- **AND** system SHALL display "Declined" status badge

### Requirement: Cancel request

The system SHALL allow users to cancel their own pending requests.

#### Scenario: Cancel pending request
- **WHEN** user clicks "Cancel" on their pending request
- **THEN** system SHALL update request status to "cancelled"
- **AND** system SHALL record cancellation timestamp
- **AND** user SHALL receive confirmation notification

#### Scenario: Cancel non-pending request
- **WHEN** user attempts to cancel a request that is not pending
- **THEN** system SHALL return error "Cannot cancel this request"
- **AND** request status SHALL remain unchanged

### Requirement: Request status lifecycle

The system SHALL track requests through a defined status lifecycle.

#### Scenario: Request status values
- **WHEN** request is created
- **THEN** status SHALL be "pending"
- **AND** status MAY transition to "approved", "declined", or "cancelled"
- **AND** status SHALL NOT transition from "approved" to any other status except "revoked" (admin action)

#### Scenario: Approved request becomes active
- **WHEN** admin approves a request
- **THEN** status SHALL become "approved"
- **AND** after approval, system SHALL mark access as granted to user

### Requirement: Request pagination

The system SHALL paginate request lists for users with many requests.

#### Scenario: Paginate request list
- **WHEN** user has more than 20 requests
- **THEN** system SHALL display first 20 requests
- **AND** system SHALL provide pagination for remaining requests
