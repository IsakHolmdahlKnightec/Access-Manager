# Access Catalog

## Purpose

The access catalog provides a browsable inventory of all available accesses that users can request. Accesses are organized by type (Kubernetes, AWS, Web Service, Database) and include metadata such as description, requirements, and dependencies.

## ADDED Requirements

### Requirement: Access catalog listing

The system SHALL provide a list of all available accesses that users can browse.

#### Scenario: List all accesses
- **WHEN** user navigates to the access catalog page
- **THEN** system SHALL display all active accesses
- **AND** each access SHALL show name, type, and brief description

#### Scenario: Filter accesses by type
- **WHEN** user selects an access type filter (Kubernetes, AWS, Web, Database)
- **THEN** system SHALL display only accesses matching that type
- **AND** user SHALL be able to clear the filter to show all

#### Scenario: Search accesses by name
- **WHEN** user enters a search term
- **THEN** system SHALL display accesses where name contains the search term (case-insensitive)
- **AND** search SHALL update as user types with debounce (300ms)

#### Scenario: Pagination of access list
- **WHEN** access catalog has more than 25 items
- **THEN** system SHALL display first 25 accesses
- **AND** system SHALL provide pagination controls for remaining pages

### Requirement: Access detail view

The system SHALL provide detailed information about a specific access.

#### Scenario: View access details
- **WHEN** user clicks on an access from the catalog
- **THEN** system SHALL display access name, type, full description
- **AND** system SHALL display any access dependencies
- **AND** system SHALL display whether user already has active access

#### Scenario: Access not found
- **WHEN** user requests access details for non-existent access ID
- **THEN** system SHALL return 404 error
- **AND** frontend SHALL display "Access not found" message

### Requirement: Access types

The system SHALL categorize accesses by type.

#### Scenario: Access type categories
- **WHEN** accessing the catalog
- **THEN** system SHALL support access types: Kubernetes, AWS, Web Service, Database
- **AND** each access SHALL have exactly one type

#### Scenario: Access type display
- **WHEN** displaying an access
- **THEN** system SHALL show a type badge/icon
- **AND** Kubernetes SHALL display with k8s icon
- **AND** AWS SHALL display with AWS icon
- **AND** Web Service SHALL display with web icon
- **AND** Database SHALL display with database icon
