## ADDED Requirements

### Requirement: Build script generates deploy-manifest.json
The build process SHALL generate a valid deploy-manifest.json file in the `.amplify-hosting/` directory that configures the Amplify WEB_COMPUTE platform.

#### Scenario: Build completes successfully
- **WHEN** the build script (`npm run build`) executes
- **THEN** a `.amplify-hosting/deploy-manifest.json` file SHALL be created
- **AND** the file SHALL contain valid JSON with required fields (version, framework, routes, computeResources)
- **AND** the file SHALL specify runtime as `nodejs20.x`

#### Scenario: deploy-manifest.json structure validation
- **WHEN** the deploy-manifest.json is created
- **THEN** it SHALL include a `computeResources` array with at least one resource
- **AND** the compute resource SHALL have `name`, `runtime`, and `entrypoint` properties
- **AND** the runtime SHALL be `nodejs20.x`
- **AND** the entrypoint SHALL be `server.js`

### Requirement: Build output includes compute server
The build process SHALL produce a runnable Node.js server in the compute directory.

#### Scenario: Server file exists after build
- **WHEN** the build completes
- **THEN** `.amplify-hosting/compute/default/server.js` SHALL exist
- **AND** the file SHALL be a valid Node.js script
- **AND** the file SHALL be executable by the runtime

#### Scenario: Compute directory structure is complete
- **WHEN** the build completes
- **THEN** `.amplify-hosting/compute/default/` SHALL contain:
  - `server.js` (the Next.js standalone server)
  - `node_modules/` (dependencies)
  - `.next/static/` (static assets for fallback)
  - All files from the `public/` directory

### Requirement: Build output includes static assets
The build process SHALL organize static assets for optimal CDN delivery.

#### Scenario: Static directory exists after build
- **WHEN** the build completes
- **THEN** `.amplify-hosting/static/` SHALL exist
- **AND** it SHALL contain `_next/static/` with all compiled assets
- **AND** it SHALL contain all files from the `public/` directory

#### Scenario: Static assets have correct cache headers
- **WHEN** a request is made to `/_next/static/*`
- **THEN** the response SHALL include `Cache-Control: public, max-age=31536000, immutable`

### Requirement: Routes configuration optimizes static vs compute
The deploy-manifest.json SHALL configure routes to serve static assets directly from CDN.

#### Scenario: Static assets bypass compute
- **WHEN** a request matches `/_next/static/*` or `/static/*`
- **THEN** the request SHALL be served from the static directory
- **AND** it SHALL NOT invoke the compute function

#### Scenario: API routes invoke compute
- **WHEN** a request matches `/api/*`
- **THEN** the request SHALL be routed to the compute function
- **AND** the server.js SHALL handle the request

#### Scenario: Dynamic routes invoke compute
- **WHEN** a request matches a dynamic route (e.g., `/*` catch-all)
- **THEN** the request SHALL be routed to the compute function
- **AND** Next.js SHALL handle SSR or static generation as configured

### Requirement: Node.js runtime version compatibility
The deployment SHALL use a Node.js runtime version compatible with Next.js 15.

#### Scenario: Runtime version check
- **WHEN** the application is deployed to Amplify
- **THEN** the compute environment SHALL run Node.js version 20.x
- **AND** the runtime SHALL satisfy Next.js 15 minimum requirement of Node.js 20.9+

### Requirement: Dependency conflicts are resolved
The project SHALL NOT include conflicting authentication dependencies.

#### Scenario: Build with clean dependencies
- **WHEN** `npm install` executes
- **THEN** `@aws-amplify/adapter-nextjs` SHALL NOT be in node_modules
- **AND** `next-auth` SHALL be the only authentication library
- **AND** the build SHALL complete without dependency conflicts

### Requirement: Environment configuration is correct
The Amplify application SHALL be configured for WEB_COMPUTE platform.

#### Scenario: Platform validation
- **WHEN** the application is deployed
- **THEN** the Amplify platform setting SHALL be `WEB_COMPUTE`
- **AND** the deployment SHALL use Lambda compute for SSR
- **AND** static assets SHALL be served from the CDN

### Requirement: Build artifacts are complete
All required files SHALL be present in the build output for successful deployment.

#### Scenario: Artifact verification
- **WHEN** the postbuild script completes
- **THEN** the following SHALL exist:
  - `.amplify-hosting/deploy-manifest.json`
  - `.amplify-hosting/compute/default/server.js`
  - `.amplify-hosting/compute/default/node_modules/`
  - `.amplify-hosting/static/_next/static/`
- **AND** Amplify SHALL successfully deploy without "deploy-manifest.json not found" errors
