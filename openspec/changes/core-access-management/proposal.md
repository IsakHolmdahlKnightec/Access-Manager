## Why

The Access Manager system currently has authentication and infrastructure foundations in place (Phase 1-2 complete), but lacks the core capability to actually request and manage access to systems. Users cannot browse available accesses, submit access requests, or go through an approval workflow. This is the fundamental value proposition of the system—enabling developers to request and receive access through a controlled, auditable process.

## What Changes

This phase implements the complete access request and approval workflow end-to-end:

- **Database layer**: DynamoDB tables for accesses, requests, approvals, projects, and teams with proper indexes and relationships
- **API layer**: Serverless Lambda functions behind API Gateway for all access management operations
- **Frontend pages**: Access catalog browsing, request creation wizard, my requests view, request detail page
- **Admin interface**: Pending approvals dashboard with approve/decline actions, request history
- **Notification system**: In-app notifications for request lifecycle events (submitted, approved/denied, needs more info)
- **User management**: Enhanced user profiles with team/project assignments

## Capabilities

### New Capabilities

- `access-catalog`: Browse and search available accesses organized by type (Kubernetes, AWS, Web, Database). Includes access details, requirements, and dependencies.
- `access-request`: Create and manage access requests. Supports selecting access, providing justification, and tracking request status through its lifecycle.
- `approval-workflow`: Admin approval system for access requests. Includes pending queue, approve/decline actions, and request review details.
- `notification-system`: In-app notification system for request lifecycle events. Users see notifications for their own requests and admins receive notifications for pending approvals.
- `dynamodb-access-schema`: Extended DynamoDB table definitions for accesses, requests, approvals, projects, and teams tables with proper GSIs for common access patterns.

### Modified Capabilities

- `dynamodb-tables`: Extend existing users table to include team/project relationships; add new tables for access requests and approvals
- `iam-roles-policies`: Add execution roles for new Lambda handlers accessing DynamoDB and sending notifications

## Impact

**Backend (Lambda/API Gateway)**:
- New Lambda functions for access catalog, request management, approval workflow, and notifications
- New API Gateway routes and endpoints
- DynamoDB tables with stream triggers for notification events

**Frontend (Next.js)**:
- New pages: `/access` (catalog), `/requests/new`, `/requests`, `/requests/[id]`
- Admin pages: `/admin/approvals`, `/admin/requests`
- Shared components for access cards, request status badges, notification bell

**Infrastructure (Terraform)**:
- New DynamoDB tables (accesses, requests, approvals, projects, teams)
- New Lambda functions and IAM execution roles
- API Gateway routes and authorizers
- EventBridge rules for notification triggers

**Dependencies**:
- Existing Cognito authentication (Phase 2)
- Existing DynamoDB users table (Phase 2)
- Existing IAM roles infrastructure (Phase 2)
