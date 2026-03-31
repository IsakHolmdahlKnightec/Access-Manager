# Amplify Frontend Hosting

## Purpose
Infrastructure capability for deploying Next.js 15 applications with API routes (including NextAuth.js) to AWS Amplify using the WEB_COMPUTE platform for native SSR support.

## Requirements

### Requirement: Amplify app creation with WEB_COMPUTE
The system SHALL create an AWS Amplify application configured for Next.js SSR hosting.

#### Scenario: App provisioning
- **WHEN** applying Terraform configuration
- **THEN** it SHALL create an Amplify app with specified name
- **AND** it SHALL set platform to `WEB_COMPUTE` to support API routes as Lambda functions
- **AND** it SHALL configure the build spec with `nextjs-ssr` framework
- **AND** it SHALL enable build caching

### Requirement: Git repository connection
The system SHALL connect Amplify to a Git repository for CI/CD.

#### Scenario: Repository configuration
- **WHEN** configuring the amplify module
- **THEN** it SHALL support GitHub, GitLab, or Bitbucket repositories
- **AND** it SHALL configure OAuth token for repository access
- **AND** it SHALL auto-build on configured branch pushes

### Requirement: Branch configuration for Next.js SSR
The system SHALL create Amplify branches mapped to Git branches with proper Next.js SSR framework configuration.

#### Scenario: Branch creation
- **WHEN** applying configuration
- **THEN** it SHALL create Amplify branch with `framework = "Next.js - SSR"`
- **AND** the branch SHALL have auto-build enabled
- **AND** the appRoot SHALL be set to the Next.js application directory

### Requirement: Build specification for Next.js 15 + NextAuth
The system SHALL configure build settings for Next.js 15 with NextAuth.js (no Amplify Auth adapter needed).

#### Scenario: Build configuration
- **WHEN** Amplify builds the application
- **THEN** it SHALL use Node.js 20.x or later (Next.js 15 requires 20.9+)
- **AND** it SHALL run `npm ci` for dependency installation
- **AND** it SHALL run `npm run build` for production build
- **AND** it SHALL set baseDirectory to `.next`
- **AND** it SHALL cache `node_modules` and `.next/cache` directories

### Requirement: Next.js configuration for Amplify
The system SHALL configure Next.js for Amplify WEB_COMPUTE deployment.

#### Scenario: Next.js config
- **WHEN** configuring Next.js for Amplify
- **THEN** images.unoptimized SHALL be set to `true` to avoid server-dependent image optimization
- **AND** output mode defaults to Next.js hybrid (static + SSR)
- **AND** no custom postbuild scripts SHALL be required (Amplify handles deployment natively)

### Requirement: Authentication compatibility
The system SHALL support NextAuth.js v5 for authentication without conflicting dependencies.

#### Scenario: Authentication setup
- **WHEN** using NextAuth.js for authentication
- **THEN** the system SHALL NOT install `@aws-amplify/adapter-nextjs` (conflicts with NextAuth)
- **AND** API routes SHALL work via Amplify compute (Lambda@Edge)
- **AND** session management SHALL be handled by NextAuth's built-in API routes

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

### Requirement: Static asset and SSR routing
The system SHALL handle static assets and SSR routes through Amplify's native routing.

#### Scenario: Artifact output and routing
- **WHEN** Next.js build completes
- **THEN** it SHALL output to `.next` directory
- **AND** Amplify SHALL serve static files from `.next/static` via CDN
- **AND** SSR pages and API routes SHALL be served via Amplify compute (Lambda@Edge)
- **AND** no custom deploy-manifest.json or postbuild scripts SHALL be required
