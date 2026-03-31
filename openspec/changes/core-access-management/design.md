## Context

Phase 1-2 completed the foundational infrastructure: Next.js frontend with design system, AWS Cognito authentication, DynamoDB for users/sessions, and Terraform-based infrastructure-as-code. The system can authenticate users but has no way to manage access requests.

Phase 3 implements the core access management workflow: users browse available accesses, submit requests, and admins approve/decline. This requires:

- **New data stores**: Accesses catalog, requests, approvals, projects, teams
- **New API endpoints**: CRUD for accesses, request lifecycle management, admin approval actions
- **New frontend pages**: Access catalog, request creation, request tracking, admin dashboard
- **Notification system**: In-app notifications for request lifecycle events

The existing Terraform modules follow a modular pattern in `infrastructure/modules/`. New Lambda functions will follow the same module pattern.

## Goals / Non-Goals

**Goals:**
- End-to-end access request workflow (browse → request → approve → activate)
- Admin approval interface with approve/decline actions
- In-app notification system for request lifecycle
- DynamoDB single-table design for all access-related entities
- Serverless backend using Lambda + API Gateway (consistent with Phase 2)
- Frontend integration with existing NextAuth.js session management

**Non-Goals:**
- Email/Slack notifications (deferred to Phase 6)
- Multi-stage approval workflows (deferred to Phase 6)
- Time-bound access with auto-expiration (deferred to Phase 6)
- AI-powered access discovery (deferred to Phase 5)
- Team/project management UI (deferred to Phase 4)

## Decisions

### Decision: DynamoDB Single-Table Design

**Choice**: Use a single DynamoDB table `access-manager-data` with entity type discrimination via PK/SK pattern.

**Rationale**: 
- Single-table design reduces operational overhead and cost
- Efficient access patterns: queries by entity ID, by user, by status
- Consistent with AWS best practices for related entity types
- Easier transactions for operations spanning entities

**Alternatives Considered**:
- Multi-table design: Rejected as it adds latency for cross-entity queries and increases operational cost
- RDS/PostgreSQL: Rejected as it would require managing a persistent database instance, contrary to serverless goals

**Access Patterns**:
```
PK                          | SK                        | Entity
----------------------------|---------------------------|-------
USER#<userId>              | PROFILE                   | User
USER#<userId>              | REQUEST#<requestId>       | Request
ACCESS#<accessId>          | METADATA                  | Access
REQUEST#<requestId>        | APPROVAL#<approvalId>     | Approval
PROJECT#<projectId>        | METADATA                  | Project
TEAM#<teamId>               | METADATA                  | Team
NOTIFICATION#<userId>       | #<timestamp>              | Notification
```

### Decision: REST API with Lambda Functions

**Choice**: Continue Lambda + API Gateway pattern from Phase 2 for all new endpoints.

**Rationale**:
- Consistent with Phase 2 architecture decisions
- Lambda handles business logic; API Gateway handles routing/auth
- Integration with existing Cognito authorizer
- Cost-effective for variable traffic patterns

**API Routes**:
```
GET    /accesses                    - List all accesses (with filters)
GET    /accesses/:id                - Get access details
GET    /requests                    - List user's requests
POST   /requests                    - Create new request
GET    /requests/:id                - Get request details
PATCH  /requests/:id                - Update request (cancel, provide more info)
POST   /requests/:id/approve        - Admin: approve request
POST   /requests/:id/decline        - Admin: decline request
GET    /notifications               - List user notifications
PATCH  /notifications/:id/read      - Mark notification as read
GET    /admin/pending               - Admin: list pending requests
GET    /admin/requests              - Admin: list all requests
```

### Decision: React Query for Frontend State

**Choice**: Use TanStack Query (React Query) v5 for server state management.

**Rationale**:
- Built-in caching and background refetching reduces API calls
- Optimistic updates for better UX on approve/decline actions
- TypeScript support with excellent inference
- Widely adopted with good documentation

**Alternatives Considered**:
- SWR: React Query offers more features (optimistic updates, cache invalidation patterns)
- Redux RTK Query: Overkill for this use case; adds unnecessary complexity
- Raw fetch + useState: Rejected as it would lead to duplicated logic and poor cache management

### Decision: In-App Notifications via DynamoDB Streams

**Choice**: Store notifications in DynamoDB and display via polling (5-second interval) or on-demand refresh.

**Rationale**:
- Simple to implement within existing DynamoDB infrastructure
- No additional AWS services required (SNS, EventBridge adds complexity)
- Sufficient for Phase 3 scope

**Alternatives Considered**:
- WebSocket via API Gateway: Deferred - adds complexity for marginal real-time benefit
- EventBridge + SNS push: Deferred to Phase 6 when email/slack integration is added

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| DynamoDB hot partitions on USER#<userId> | High | Add random suffix to notification PKs; monitor RCU/WCU |
| No real-time notification updates | Medium | Inform users notifications refresh on page navigation or 5s polling |
| Request approval latency | Low | Use on-demand Lambda; approval workflows are not latency-critical (1-2s cold start acceptable) |
| Frontend API integration complexity | Medium | Create typed API client with React Query hooks |
| Access catalog performance with many accesses | Low | Add GSI on access type; implement pagination (25 items/page) |

## Migration Plan

### Phase 3.1: Database Schema
1. Add new DynamoDB table `access-manager-data` with single-table design
2. Create Lambda handler for initial seed data (sample accesses)
3. No downtime; new table is independent of existing tables

### Phase 3.2: API Layer
1. Create new Lambda functions for each API route
2. Add API Gateway routes with Cognito authorizer
3. Deploy to new API stage (v1) - no impact to existing endpoints

### Phase 3.3: Frontend Pages
1. Create new pages under `/access`, `/requests`, `/admin/approvals`
2. Integrate with existing navigation and layout
3. Use React Query for data fetching
4. Feature flag: hide new pages until full deployment

### Phase 3.4: Notification System
1. Add DynamoDB streams to requests table
2. Lambda trigger creates notification records
3. Frontend polling endpoint for notifications

### Rollback Strategy
- Terraform state rollbacks restore previous table configurations
- API Gateway stages allow instant traffic switchback
- Frontend deployment can be reverted via Amplify

## Open Questions

1. **Admin designation**: Decision: Use Cognito custom attribute (`access-manager-role = "admin"`) to identify admins. This integrates with existing Cognito setup and doesn't require additional database lookups.

2. **Access status workflow**: Should accesses be manually created by admins, or loaded from external systems (Kubernetes, AWS)? → Decision: Phase 3 uses manual admin creation; external integrations deferred.

3. **Request limits**: Should users be limited on pending requests per access? → Decision: No limits in Phase 3; can add in Phase 6 if needed.

4. **Access dependencies**: Some accesses may require other accesses first. Should this be enforced? → Decision: Display dependencies in UI but don't enforce; deferred to Phase 4 role system.
