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
The Amplify application SHALL be configured for WEB_COMPUTE platform with proper framework settings.

#### Scenario: Platform validation
- **WHEN** the application is deployed
- **THEN** the Amplify platform setting SHALL be `WEB_COMPUTE`
- **AND** the deployment SHALL use Lambda compute for SSR
- **AND** static assets SHALL be served from the CDN

#### Scenario: Framework configuration for compute resources
- **WHEN** the branch is configured for WEB_COMPUTE deployment
- **THEN** the branch SHALL have `framework` attribute set (e.g., "Next.js - 15")
- **AND** without the framework attribute, Lambda functions SHALL NOT be provisioned
- **AND** this applies to both AWS Console and Infrastructure-as-Code (Terraform/CloudFormation)

#### Scenario: Infrastructure-as-Code framework configuration
- **WHEN** using Terraform to configure the Amplify branch
- **THEN** the `aws_amplify_branch` resource SHALL include the `framework` argument
- **AND** the framework value SHALL match the actual framework version (e.g., "Next.js - 15")
- **AND** example Terraform configuration SHALL be:
  ```hcl
  resource "aws_amplify_branch" "main" {
    app_id      = aws_amplify_app.main.id
    branch_name = var.branch_name
    framework   = "Next.js - 15"  # REQUIRED for WEB_COMPUTE Lambda provisioning
    # ... other configuration
  }
  ```
- **AND** missing the `framework` attribute SHALL result in silent failure with no Lambda functions created
- **AND** this is a CRITICAL requirement for WEB_COMPUTE deployments via Infrastructure-as-Code

### Requirement: Terraform infrastructure configuration
The Infrastructure-as-Code SHALL properly configure all required attributes for WEB_COMPUTE deployment.

#### Scenario: Terraform aws_amplify_branch resource
- **WHEN** Terraform creates or updates the Amplify branch
- **THEN** the resource SHALL include all required attributes:
  - `app_id` - Reference to the parent Amplify app
  - `branch_name` - Name of the Git branch
  - `framework` - **REQUIRED** Must be set to framework version (e.g., "Next.js - 15")
- **AND** the `framework` attribute SHALL NOT be omitted or null
- **AND** omitting `framework` SHALL cause silent deployment failure

#### Scenario: Terraform validation of WEB_COMPUTE deployment
- **WHEN** Terraform plan is executed
- **THEN** it SHALL show updates to `aws_amplify_branch` resource
- **AND** if `framework` was previously missing, it SHALL show as added
- **AND** after Terraform apply, Lambda functions SHALL be created

#### Scenario: Complete Terraform configuration example
- **WHEN** configuring Amplify with Terraform for WEB_COMPUTE
- **THEN** the complete working configuration SHALL be:
  ```hcl
  resource "aws_amplify_app" "main" {
    name     = var.app_name
    platform = "WEB_COMPUTE"
    # ... other configuration
  }

  resource "aws_amplify_branch" "main" {
    app_id      = aws_amplify_app.main.id
    branch_name = var.branch_name
    framework   = "Next.js - 15"  # CRITICAL: Required for Lambda provisioning
    # ... other configuration
  }
  ```
- **AND** both `platform = "WEB_COMPUTE"` AND `framework = "Next.js - 15"` are REQUIRED
- **AND** missing either SHALL result in failed or incomplete deployment

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

### Requirement: CloudWatch logging is configured
The deployment SHALL have CloudWatch logging enabled for observability and monitoring of the WEB_COMPUTE Lambda functions.

#### Scenario: CloudWatch log groups exist
- **WHEN** the application is deployed to Amplify WEB_COMPUTE
- **THEN** CloudWatch Logs SHALL capture all compute function logs
- **AND** log groups SHALL be created under `/aws/lambda/{function-name}` (NOT `/aws/amplify/`)
- **AND** logs SHALL include Lambda runtime logs and application console output
- **AND** log groups SHALL be created on first Lambda invocation (not at deployment time)

#### Scenario: Log retention is configured
- **WHEN** CloudWatch logging is enabled
- **THEN** log retention SHALL be set to 30 days by default
- **AND** log retention SHALL be configurable per environment

#### Scenario: Structured application logging
- **WHEN** the application writes to stdout/stderr
- **THEN** logs SHALL be captured by CloudWatch Logs
- **AND** application logs SHALL use structured JSON format where applicable
- **AND** logs SHALL include request ID, timestamp, and log level

#### Scenario: Log access and permissions
- **WHEN** an authorized user attempts to view logs
- **THEN** CloudWatch Logs SHALL be accessible via AWS Console
- **AND** logs SHALL be queryable using CloudWatch Logs Insights
- **AND** appropriate IAM permissions SHALL be required for log access

#### Scenario: Troubleshooting missing log groups
- **WHEN** log groups are not found in CloudWatch
- **THEN** deployment status SHALL be verified in Amplify Console
- **AND** platform SHALL be confirmed as WEB_COMPUTE (not WEB_DYNAMIC or WEB_STATIC)
- **AND** Lambda function SHALL be confirmed as running
- **AND** log groups SHALL be searched under `/aws/lambda/` prefix
- **AND** Lambda SHALL be manually invoked to force log group creation
- **AND** log groups SHALL be searchable using CLI commands

#### Scenario: No Lambda infrastructure exists (CRITICAL FAILURE)
- **WHEN** Lambda functions are confirmed to not exist for the app
- **THEN** the deployment SHALL be considered failed
- **AND** build logs SHALL be checked for deployment errors
- **AND** deploy-manifest.json SHALL be verified in build artifacts
- **AND** branch SHALL be confirmed as "Production" environment
- **AND** baseDirectory in amplify.yml SHALL be verified as correct
- **AND** platform SHALL be explicitly set to WEB_COMPUTE via CLI
- **AND** deployment SHALL be re-triggered with infrastructure recreation
