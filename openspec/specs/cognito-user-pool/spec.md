# Cognito User Pool

## Purpose
[TBD - AWS Cognito user authentication and authorization]

## Requirements

### Requirement: Cognito User Pool creation
The system SHALL create a Cognito User Pool for user authentication.

#### Scenario: User Pool provisioning
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create User Pool named access-manager
- **AND** it SHALL enable self-registration
- **AND** it SHALL configure email as username alias

### Requirement: User Pool email configuration
The system SHALL configure email for verification and communication.

#### Scenario: Email setup
- **WHEN** configuring the User Pool
- **THEN** it SHALL require email verification for sign-up
- **AND** it SHALL use Cognito's default email sender or SES configuration
- **AND** it SHALL send verification emails automatically

### Requirement: User Pool password policy
The system SHALL enforce strong password requirements.

#### Scenario: Password policy validation
- **WHEN** users create passwords
- **THEN** minimum length SHALL be 8 characters
- **AND** it SHALL require at least one uppercase letter
- **AND** it SHALL require at least one lowercase letter
- **AND** it SHALL require at least one number
- **AND** it SHALL require at least one special character

### Requirement: MFA configuration
The system SHALL support Multi-Factor Authentication.

#### Scenario: MFA setup
- **WHEN** configuring the User Pool
- **THEN** MFA SHALL be optional (configurable to required)
- **AND** it SHALL support TOTP (Time-based One-Time Password)
- **AND** it SHALL support SMS-based MFA

### Requirement: User Pool App Client creation
The system SHALL create an App Client for the web application.

#### Scenario: App Client provisioning
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create a public App Client
- **AND** it SHALL allow OAuth 2.0 authorization code grant flow
- **AND** it SHALL allow implicit flow
- **AND** it SHALL NOT generate client secret (public client)

### Requirement: OAuth flow configuration
The system SHALL configure OAuth 2.0 flows and scopes.

#### Scenario: OAuth configuration
- **WHEN** configuring the App Client
- **THEN** it SHALL support openid, email, and profile scopes
- **AND** it SHALL configure callback URLs
- **AND** it SHALL configure sign-out URLs

### Requirement: User attributes configuration
The system SHALL define required and optional user attributes.

#### Scenario: Attributes setup
- **WHEN** configuring the User Pool
- **THEN** email SHALL be a required attribute
- **AND** given_name and family_name SHALL be optional attributes
- **AND** custom attributes SHALL be defined for access management role

### Requirement: Cognito Domain configuration
The system SHALL configure a Cognito domain for hosted UI.

#### Scenario: Domain setup
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create a Cognito domain (custom or prefix-based)
- **AND** hosted UI SHALL be accessible at the domain
- **AND** sign-in and sign-up pages SHALL be functional
