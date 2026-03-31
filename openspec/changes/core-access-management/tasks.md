## 1. Infrastructure Setup

- [x] 1.1 Create DynamoDB module in Terraform (`infrastructure/modules/dynamodb-access/`)
- [x] 1.2 Define access-manager-data table with single-table schema design
- [x] 1.3 Add GSIs for status-based queries and notification queries
- [x] 1.4 Enable DynamoDB streams with NEW_AND_OLD_IMAGES
- [x] 1.5 Update users table schema to add teamId, projectId, role attributes
- [x] 1.6 Create IAM module for Lambda execution role
- [x] 1.7 Add execution role for access management Lambda functions
- [x] 1.8 Create API Gateway execution role for Lambda invocation
- [x] 1.9 Create Lambda layer for AWS SDK dependencies (@aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb)
- [ ] 1.10 Apply Terraform changes and verify table creation

## 2. Lambda Functions - Core

- [x] 2.1 Create Lambda function: `getAccesses` - list all accesses with filters
- [x] 2.2 Create Lambda function: `getAccess` - get single access details
- [x] 2.3 Create Lambda function: `createRequest` - create new access request
- [x] 2.4 Create Lambda function: `getRequests` - list user's requests
- [x] 2.5 Create Lambda function: `getRequest` - get request details
- [x] 2.6 Create Lambda function: `cancelRequest` - cancel pending request
- [x] 2.7 Add request status validation helpers (moved to `statusValidation.ts`)
- [x] 2.8 Implement DynamoDB single-table operations with entity discrimination
- [x] 2.9 Fix AWS SDK imports (`@aws-sdk/lib-dynamodb` instead of `@aws/lib-dynamodb`)
- [x] 2.10 Create Lambda build process (TypeScript compilation to `dist/`)
- [x] 2.11 Package functions into domain-specific zips (access.zip, requests.zip, admin.zip, notifications.zip)

## 3. Lambda Functions - Admin

- [x] 3.1 Create Lambda function: `getPendingRequests` - list pending requests (admin)
- [x] 3.2 Create Lambda function: `approveRequest` - approve pending request
- [x] 3.3 Create Lambda function: `declineRequest` - decline with reason
- [x] 3.4 Create Lambda function: `requestMoreInfo` - request additional info
- [x] 3.5 Create Lambda function: `getAllRequests` - admin request history
- [x] 3.6 Add admin role validation middleware
- [x] 3.7 Implement notification creation on approve/decline/info request

## 4. Lambda Functions - Notifications

- [x] 4.1 Create Lambda function: `getNotifications` - list user notifications
- [x] 4.2 Create Lambda function: `markNotificationRead` - mark as read
- [x] 4.3 Create Lambda function: `markAllNotificationsRead` - bulk mark read
- [x] 4.4 Create Lambda trigger: DynamoDB stream for request status changes
- [x] 4.5 Implement notification creation logic for each event type
- [x] 4.6 Add admin notification routing for new requests

## 5. API Gateway Setup

- [x] 5.1 Create API Gateway HTTP API (v2)
- [x] 5.2 Configure Cognito authorizer
- [x] 5.3 Add routes for access endpoints (GET /accesses, GET /accesses/:id)
- [x] 5.4 Add routes for request endpoints (GET /requests, POST /requests, GET /requests/:id, PATCH /requests/:id)
- [x] 5.5 Add routes for approval endpoints (POST /requests/:id/approve, POST /requests/:id/decline)
- [x] 5.6 Add routes for notification endpoints (GET /notifications, PATCH /notifications/:id/read)
- [x] 5.7 Add routes for admin endpoints (GET /admin/pending, GET /admin/requests)
- [x] 5.8 Configure CORS settings
- [ ] 5.9 Deploy to staging stage

## 6. Frontend - API Client

- [x] 6.1 Create typed API client (`web/lib/api/client.ts`)
- [x] 6.2 Define TypeScript interfaces for all request/response types
- [x] 6.3 Create API hooks for accesses (`useAccesses`, `useAccess`)
- [x] 6.4 Create API hooks for requests (`useRequests`, `useRequest`, `useCreateRequest`)
- [x] 6.5 Create API hooks for admin (`usePendingRequests`, `useApproveRequest`, `useDeclineRequest`)
- [x] 6.6 Create API hooks for notifications (`useNotifications`, `useMarkNotificationRead`)
- [x] 6.7 Configure React Query provider in app layout

## 7. Frontend - Shared Components

- [x] 7.1 Create AccessCard component with type badge and icon
- [x] 7.2 Create RequestStatusBadge component (pending, approved, declined, cancelled)
- [x] 7.3 Create NotificationBell component with unread count
- [x] 7.4 Create NotificationDropdown component
- [x] 7.5 Create EmptyState component for lists
- [x] 7.6 Create LoadingSpinner component
- [x] 7.7 Add components to exports barrel file

## 8. Frontend - Access Catalog Page

- [x] 8.1 Create page route `/access` (access catalog)
- [x] 8.2 Implement access type filter tabs (All, Kubernetes, AWS, Web, Database)
- [x] 8.3 Implement search input with debounce
- [x] 8.4 Implement pagination controls
- [x] 8.5 Create AccessCard grid layout
- [x] 8.6 Add loading skeleton state
- [x] 8.7 Add empty state when no accesses match filters
- [x] 8.8 Add "Request Access" button linking to request creation

## 9. Frontend - Request Creation Flow

- [x] 9.1 Create page route `/requests/new`
- [x] 9.2 Implement access selector (pre-selected if coming from catalog)
- [x] 9.3 Create justification textarea with character count
- [x] 9.4 Create duration selector (permanent, 30 days, 90 days)
- [x] 9.5 Add form validation (justification min 10 chars)
- [x] 9.6 Implement submit with loading state
- [x] 9.7 Redirect to request details on success
- [x] 9.8 Add error handling and display

## 10. Frontend - My Requests Page

- [x] 10.1 Create page route `/requests`
- [x] 10.2 Implement request list with status badges
- [x] 10.3 Implement request sorting (newest first)
- [x] 10.4 Implement pagination (20 per page)
- [x] 10.5 Create request list item component
- [x] 10.6 Add loading skeleton state
- [x] 10.7 Add empty state with link to access catalog
- [x] 10.8 Implement cancel request action (if pending)

## 11. Frontend - Request Details Page

- [x] 11.1 Create page route `/requests/[id]`
- [x] 11.2 Display request details (access, status, justification, timeline)
- [x] 11.3 Display approval/decline info if resolved
- [x] 11.4 Show "Cancel Request" button for pending requests
- [x] 11.5 Show "Add More Info" form for more_info status
- [x] 11.6 Implement status-specific UI states
- [x] 11.7 Add loading and error states

## 12. Frontend - Admin Approvals Dashboard

- [x] 12.1 Create page route `/admin/approvals`
- [x] 12.2 Implement pending requests list (oldest first)
- [x] 12.3 Display requester info, access name, justification preview
- [x] 12.4 Create approve action with optimistic update
- [x] 12.5 Create decline action with reason modal
- [x] 12.6 Create request more info action with message modal
- [x] 12.7 Add loading and empty states
- [x] 12.8 Implement real-time refresh on action completion

## 13. Frontend - Admin Navigation

- [x] 13.1 Add admin-only navigation items (hidden from non-admins)
- [x] 13.2 Add "Approvals" link with pending count badge
- [x] 13.3 Protect admin routes with auth check
- [x] 13.4 Redirect unauthorized users to access denied page
- [x] 13.5 Add admin badge to user menu

## 14. Frontend - Notifications

- [x] 14.1 Implement notification dropdown in header
- [x] 14.2 Add polling for notifications (5 second interval)
- [x] 14.3 Implement mark as read on click
- [x] 14.4 Implement mark all as read
- [x] 14.5 Create notifications page `/notifications`
- [x] 14.6 Implement pagination on notifications page
- [x] 14.7 Add empty state for no notifications
- [x] 14.8 Style unread notifications distinctly

## 15. Sample Data

- [ ] 15.1 Create seed script for sample accesses (at least 20)
- [ ] 15.2 Include Kubernetes accesses (prod, dev, staging clusters)
- [ ] 15.3 Include AWS accesses (account admin, developer, S3, Lambda)
- [ ] 15.4 Include Web Service accesses (admin panels, dashboards, APIs)
- [ ] 15.5 Include Database accesses (read, write, full access)
- [ ] 15.6 Run seed script and verify data in DynamoDB

## 16. Integration & Testing

- [ ] 16.1 Test complete request flow end-to-end
- [ ] 16.2 Test admin approve flow
- [ ] 16.3 Test admin decline flow
- [ ] 16.4 Test notification creation and display
- [ ] 16.5 Test pagination on all list pages
- [ ] 16.6 Test search and filter on access catalog
- [ ] 16.7 Verify admin routes protected for non-admins
- [ ] 16.8 Test CORS configuration for API calls

## 17. Deployment Preparation

- [ ] 17.1 Update API Gateway stage variables for environment
- [ ] 17.2 Configure environment-specific Lambda function names
- [ ] 17.3 Update frontend API base URL for production
- [ ] 17.4 Add Lambda environment variables for table names
- [ ] 17.5 Document API endpoints for future reference
- [ ] 17.6 Final Terraform plan review
