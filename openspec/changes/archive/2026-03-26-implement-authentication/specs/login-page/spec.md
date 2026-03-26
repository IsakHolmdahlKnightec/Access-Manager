## ADDED Requirements

### Requirement: Custom login page implementation
The system SHALL provide a custom login page that matches the "Digital Vault" design system.

#### Scenario: Login page exists at /login
- **WHEN** the application builds
- **THEN** a login page exists at `app/login/page.tsx`
- **AND** it is accessible at the `/login` URL
- **AND** it uses the application's layout and styling

#### Scenario: Login page design matches design system
- **WHEN** the login page is rendered
- **THEN** it uses the primary color (#001430) for the background
- **AND** it uses the surface colors for form containers
- **AND** it follows the "No-Line" rule (no borders, color shifts only)
- **AND** it uses Inter font family
- **AND** it includes the shield/lock icon from the design system

### Requirement: Login form functionality
The system SHALL provide a functional email and password login form.

#### Scenario: Email input field
- **WHEN** the login page loads
- **THEN** it displays an email input field
- **AND** the field has a label "Work Email"
- **AND** the field accepts email format input
- **AND** the field has appropriate placeholder text

#### Scenario: Password input field
- **WHEN** the login page loads
- **THEN** it displays a password input field
- **AND** the field has a label "Password"
- **AND** the field masks input characters
- **AND** the field includes a "Forgot password?" link

#### Scenario: Sign in button
- **WHEN** the login form is displayed
- **THEN** it displays a "Sign In" button
- **AND** the button uses the primary button style (solid #001430 background)
- **AND** the button shows loading state during authentication
- **AND** the button is disabled while authentication is in progress

### Requirement: Login form submission
The system SHALL handle login form submission and authentication.

#### Scenario: Successful login
- **WHEN** a user enters valid credentials
- **AND** clicks the Sign In button
- **THEN** the form submits to NextAuth.js
- **AND** NextAuth.js authenticates with Cognito
- **AND** upon success, the user is redirected to the originally requested page
- **AND** the session is established

#### Scenario: Failed login - invalid credentials
- **WHEN** a user enters invalid credentials
- **AND** clicks the Sign In button
- **THEN** the authentication attempt fails
- **AND** an error message is displayed: "Invalid email or password"
- **AND** the user remains on the login page
- **AND** the password field is cleared

#### Scenario: Failed login - network error
- **WHEN** the Cognito service is unavailable
- **AND** a user attempts to log in
- **THEN** an error message is displayed: "Unable to sign in. Please try again."
- **AND** the user can retry authentication

### Requirement: Loading and error states
The system SHALL provide visual feedback during authentication and for error conditions.

#### Scenario: Loading state during authentication
- **WHEN** the user submits the login form
- **THEN** the Sign In button shows a loading indicator
- **AND** the button text changes to "Signing in..."
- **AND** the form inputs are disabled
- **AND** the loading state matches the design system's loading pattern

#### Scenario: Error message display
- **WHEN** an authentication error occurs
- **THEN** an error message is displayed above the form
- **AND** the message uses the error color from the design system (#ba1a1a)
- **AND** the message is clearly visible but not intrusive
- **AND** the error can be dismissed or automatically clears on retry
