# Amplify Frontend Hosting

## Purpose
[TBD - Infrastructure capability for AWS Amplify application hosting]

## Requirements

### Requirement: Amplify app creation
The system SHALL create an AWS Amplify application for Next.js hosting.

#### Scenario: App provisioning
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create an Amplify app with specified name
- **AND** it SHALL configure the app for Next.js framework
- **AND** it SHALL enable build caching

### Requirement: Git repository connection
The system SHALL connect Amplify to a Git repository for CI/CD.

#### Scenario: Repository configuration
- **WHEN** configuring the amplify module
- **THEN** it SHALL support GitHub, GitLab, or Bitbucket repositories
- **AND** it SHALL configure OAuth token for repository access
- **AND** it SHALL auto-build on configured branch pushes

### Requirement: Branch configuration
The system SHALL create an Amplify branch mapped to the main Git branch.

#### Scenario: Branch creation
- **WHEN** applying configuration
- **THEN** it SHALL create Amplify branch mapped to main branch
- **AND** the branch SHALL have build configuration
- **AND** branch previews SHALL be configurable

### Requirement: Build specification configuration
The system SHALL configure amplify.yml or build settings for Next.js.

#### Scenario: Build configuration
- **WHEN** Amplify builds the application
- **THEN** it SHALL use Node.js 18.x or later
- **AND** it SHALL run npm ci for dependency installation
- **AND** it SHALL run npm run build for production build
- **AND** it SHALL cache node_modules and .next/cache directories

### Requirement: Environment variables injection
The system SHALL inject environment variables into Amplify builds using the correct Terraform attribute pattern.

#### Scenario: Environment variable configuration
- **WHEN** defining environment variables in Terraform
- **THEN** they SHALL be available during build process
- **AND** they SHALL be available to the Next.js application at runtime
- **AND** sensitive values SHALL reference Secrets Manager or Parameter Store
- **AND** the aws_amplify_app resource SHALL use map(string) attribute assignment: `environment_variables = var.environment_variables`
- **AND** it SHALL NOT use dynamic blocks (environment_variables is a map attribute, not a block type)
- **AND** environment variable names SHALL NOT use reserved prefixes (e.g., "AWS_")

### Requirement: Custom domain configuration
The system SHALL support custom domain configuration.

#### Scenario: Domain setup
- **WHEN** a custom domain is provided
- **THEN** it SHALL configure Amplify custom domain
- **AND** it SHALL generate SSL certificate via ACM
- **AND** it SHALL configure DNS verification

### Requirement: Build artifact configuration
The system SHALL configure build artifact output settings.

#### Scenario: Artifact output
- **WHEN** Next.js build completes
- **THEN** it SHALL output to .next directory
- **AND** Amplify SHALL serve static files from .next/static
- **AND** SSR pages SHALL be served via Amplify compute
