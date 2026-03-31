# Notification System

## Purpose

The notification system provides in-app notifications to users about events related to their access requests. Users receive notifications when their requests are approved, declined, or need more information. Admins receive notifications when new requests need their attention.

## ADDED Requirements

### Requirement: Notification creation

The system SHALL create notifications for relevant events.

#### Scenario: Notification on request approval
- **WHEN** admin approves a request
- **THEN** system SHALL create notification for the requester
- **AND** notification SHALL include: "Your request for [access-name] has been approved"
- **AND** notification SHALL include request ID link

#### Scenario: Notification on request decline
- **WHEN** admin declines a request
- **THEN** system SHALL create notification for the requester
- **AND** notification SHALL include: "Your request for [access-name] has been declined"
- **AND** notification SHALL include decline reason
- **AND** notification SHALL include request ID link

#### Scenario: Notification on info request
- **WHEN** admin requests more information
- **THEN** system SHALL create notification for the requester
- **AND** notification SHALL include: "More information needed for [access-name] request"
- **AND** notification SHALL include info request message
- **AND** notification SHALL include request ID link

#### Scenario: Notification on new pending request
- **WHEN** user submits a new access request
- **THEN** system SHALL create notification for all admins
- **AND** notification SHALL include: "New access request from [user-name]"
- **AND** notification SHALL include access name and justification preview
- **AND** notification SHALL include request ID link

#### Scenario: Notification on request cancelled
- **WHEN** user cancels their pending request
- **THEN** system SHALL remove any pending admin notifications for that request
- **AND** no notification SHALL be sent to admins about the cancelled request

### Requirement: List user notifications

The system SHALL allow users to view their notifications.

#### Scenario: View notifications list
- **WHEN** user clicks notification bell icon
- **THEN** system SHALL display dropdown with recent notifications (max 10)
- **AND** each notification SHALL show message, timestamp
- **AND** unread notifications SHALL be visually distinct (bold or dot indicator)
- **AND** system SHALL show "Mark all as read" option

#### Scenario: View all notifications
- **WHEN** user navigates to notifications page
- **THEN** system SHALL display all notifications for this user
- **AND** notifications SHALL be sorted by timestamp (newest first)
- **AND** system SHALL support pagination (20 per page)

#### Scenario: Empty notifications
- **WHEN** user has no notifications
- **THEN** system SHALL display "No notifications"
- **AND** notification bell SHALL show no badge

### Requirement: Mark notification as read

The system SHALL allow users to mark notifications as read.

#### Scenario: Mark single notification as read
- **WHEN** user clicks on a notification or marks it as read
- **THEN** system SHALL update notification status to "read"
- **AND** notification SHALL no longer appear as unread

#### Scenario: Mark all as read
- **WHEN** user clicks "Mark all as read"
- **THEN** system SHALL update all user's unread notifications to "read"
- **AND** notification bell badge SHALL clear

### Requirement: Notification persistence

The system SHALL persist notifications until explicitly deleted.

#### Scenario: Notifications persist across sessions
- **WHEN** user logs out and logs back in
- **THEN** all previous notifications SHALL still be present
- **AND** read/unread status SHALL be preserved

#### Scenario: Notification retention
- **WHEN** notification is older than 90 days
- **THEN** system MAY archive the notification
- **AND** archived notifications MAY be excluded from default views
