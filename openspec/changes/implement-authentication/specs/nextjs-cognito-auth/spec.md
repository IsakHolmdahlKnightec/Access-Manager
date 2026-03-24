## ADDED Requirements

### Requirement: NextAuth.js configuration with Cognito provider
The system SHALL configure NextAuth.js (Auth.js v5) with AWS Cognito as the OIDC authentication provider.

#### Scenario: Auth configuration created
- **WHEN** the application initializes
- **THEN** a NextAuth configuration file exists at `auth.ts`
- **AND** it configures a Cognito provider with User Pool ID, App Client ID, and Domain
- **AND** it uses JWT session strategy
- **AND** it includes callbacks for session and JWT handling

#### Scenario: API route handler created
- **WHEN** the application starts
- **THEN** an API route exists at `app/api/auth/[...nextauth]/route.ts`
- **AND** it exports GET and POST handlers configured with the auth options
- **AND** authentication requests are routed through this handler

### Requirement: Cognito OIDC integration
The system SHALL integrate with AWS Cognito using standard OIDC/OAuth2 flows.

#### Scenario: User initiates login
- **WHEN** an unauthenticated user accesses the application
- **THEN** they are redirected to the custom login page
- **AND** upon form submission, credentials are validated against Cognito
- **AND** upon successful validation, Cognito returns access, refresh, and ID tokens

#### Scenario: Token exchange
- **WHEN** the login form submits credentials
- **THEN** NextAuth.js exchanges credentials with Cognito's token endpoint
- **AND** receives OAuth2 tokens in response
- **AND** stores tokens securely in the session

### Requirement: Environment variable configuration
The system SHALL read Cognito configuration from environment variables.

#### Scenario: Configuration loaded from environment
- **WHEN** the application starts
- **THEN** it reads `COGNITO_USER_POOL_ID` from environment
- **AND** it reads `COGNITO_APP_CLIENT_ID` from environment
- **AND** it reads `COGNITO_DOMAIN` from environment
- **AND** it reads `NEXTAUTH_SECRET` for JWT signing
- **AND** it reads `NEXTAUTH_URL` for callback URL construction
- **AND** the application fails to start if required variables are missing
