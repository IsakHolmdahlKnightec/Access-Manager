## ADDED Requirements

### Requirement: Route-level authentication protection
The system SHALL protect all application routes except `/login` and public assets, redirecting unauthenticated users to the login page.

#### Scenario: Unauthenticated user accesses protected route
- **WHEN** an unauthenticated user requests any route except `/login`
- **THEN** the middleware intercepts the request
- **AND** the user is redirected to `/login`
- **AND** the originally requested URL is preserved for post-login redirect

#### Scenario: Authenticated user accesses protected route
- **WHEN** an authenticated user requests any application route
- **THEN** the middleware validates the session token
- **AND** the request proceeds to the requested page
- **AND** no redirect occurs

#### Scenario: Public routes remain accessible
- **WHEN** a user requests `/login`
- **THEN** the middleware allows the request without authentication
- **AND** the login page is displayed

### Requirement: Middleware configuration
The system SHALL implement Next.js middleware with proper matcher configuration.

#### Scenario: Middleware file created
- **WHEN** the application builds
- **THEN** a `middleware.ts` file exists at the project root
- **AND** it exports a middleware function that checks authentication
- **AND** it includes a matcher config that excludes static assets and API routes

#### Scenario: Static assets bypass authentication
- **WHEN** a request is made for static files (images, CSS, JS)
- **THEN** the middleware matcher excludes these paths from auth checks
- **AND** the assets are served without authentication

### Requirement: Login redirect preservation
The system SHALL preserve the originally requested URL when redirecting to login.

#### Scenario: Deep link to protected page
- **WHEN** an unauthenticated user accesses `/dashboard/requests`
- **THEN** they are redirected to `/login?callbackUrl=/dashboard/requests`
- **AND** after successful login, they are redirected to `/dashboard/requests`
- **AND** not to a default page
