## ADDED Requirements

### Requirement: JWT session strategy
The system SHALL use JSON Web Tokens (JWT) for session management with secure httpOnly cookies.

#### Scenario: Session initialized on login
- **WHEN** a user successfully authenticates
- **THEN** NextAuth.js creates a JWT session
- **AND** the session is stored in an httpOnly cookie
- **AND** the cookie has Secure and SameSite attributes set appropriately
- **AND** client-side JavaScript cannot access the token

#### Scenario: Session contains user information
- **WHEN** a session is created
- **THEN** it includes the user's email address
- **AND** it includes the user's Cognito sub (subject identifier)
- **AND** it includes the user's name if available
- **AND** it includes access token for API calls

### Requirement: Token refresh mechanism
The system SHALL automatically refresh access tokens before they expire using refresh tokens.

#### Scenario: Access token refresh
- **WHEN** the access token is near expiration (within 5 minutes)
- **THEN** NextAuth.js automatically requests a new access token from Cognito
- **AND** it uses the stored refresh token
- **AND** the new tokens replace the old ones in the session
- **AND** the user experiences no interruption

#### Scenario: Refresh token rotation
- **WHEN** a refresh token is used to obtain new tokens
- **THEN** Cognito issues a new refresh token
- **AND** the new refresh token replaces the old one in the session
- **AND** the old refresh token is invalidated

#### Scenario: Refresh failure handling
- **WHEN** token refresh fails (e.g., refresh token expired)
- **THEN** the session is invalidated
- **AND** the user is redirected to `/login`
- **AND** a "Session expired" message is displayed

### Requirement: Session persistence
The system SHALL maintain session state across page navigations and browser sessions.

#### Scenario: Session persists across page navigation
- **WHEN** an authenticated user navigates between pages
- **THEN** the session remains valid
- **AND** the user does not need to re-authenticate
- **AND** the session cookie is sent with each request

#### Scenario: Session survives browser restart
- **WHEN** an authenticated user closes and reopens the browser
- **THEN** the session is restored from the cookie
- **AND** if the refresh token is still valid, the user remains logged in
- **AND** if the refresh token expired, the user is redirected to login

### Requirement: Session timeout configuration
The system SHALL configure appropriate session and token lifetimes.

#### Scenario: Session lifetime configured
- **WHEN** the session strategy is configured
- **THEN** access tokens have a maximum lifetime of 1 hour
- **AND** refresh tokens have a maximum lifetime of 30 days
- **AND** NextAuth sessions have a maximum age of 24 hours
- **AND** tokens are refreshed proactively before expiration
