# Access Manager

A secure, efficient, and user-friendly access management system built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Secure Authentication**: AWS Cognito integration via NextAuth.js v5 with JWT-based sessions
- **Protected Routes**: Middleware-based route protection with automatic redirects
- **Digital Vault Design**: Modern "no-line" aesthetic with deep midnight blue (#001430) theme
- **Session Management**: Automatic token refresh, persistent sessions, and secure httpOnly cookies
- **Responsive Design**: Mobile-first approach with Tailwind CSS v4

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) (Auth.js) with AWS Cognito
- **UI Components**: shadcn/ui with @base-ui/react primitives
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+
- AWS CLI configured with appropriate profile
- AWS Cognito User Pool (see [Infrastructure Setup](#infrastructure-setup))

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Authentication

### Overview

This application uses **NextAuth.js v5** (Auth.js) with **AWS Cognito** as the OIDC provider. Authentication is handled via OAuth 2.0 / OpenID Connect flows.

### Features

- **JWT Session Strategy**: Stateless sessions with 24-hour max age
- **Token Refresh**: Automatic refresh of access tokens before expiration
- **Route Protection**: Middleware-based protection for all routes except `/login`
- **Callback URL Preservation**: Deep links are preserved through authentication flow
- **Session Persistence**: Sessions survive browser restarts (via refresh tokens)

### Authentication Flow

1. Unauthenticated user visits any protected route (`/`)
2. Middleware redirects to `/login` with `callbackUrl` parameter
3. User clicks "Sign In with SSO" button
4. NextAuth redirects to Cognito Hosted UI
5. User authenticates with Cognito credentials
6. Cognito redirects to `/api/auth/callback/cognito`
7. NextAuth establishes session and redirects to original URL

## Environment Variables

### Required Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `NEXTAUTH_URL` | Your application URL | `http://localhost:3000` for local dev |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | Generate with `openssl rand -base64 32` |
| `COGNITO_USER_POOL_ID` | Cognito User Pool ID | Terraform output |
| `COGNITO_APP_CLIENT_ID` | Cognito App Client ID | Terraform output |
| `COGNITO_DOMAIN` | Cognito domain | Terraform output |

### Example `.env.local`

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# AWS Cognito Configuration
COGNITO_USER_POOL_ID=eu-north-1_xxxxxxxx
COGNITO_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
COGNITO_DOMAIN=your-domain.auth.eu-north-1.amazoncognito.com
```

### Getting Cognito Values from Terraform

If you have the infrastructure deployed via Terraform:

```bash
cd infrastructure
terraform output cognito_user_pool_id
terraform output cognito_app_client_id
terraform output cognito_domain
```

## Infrastructure Setup

### AWS Cognito Configuration

The application requires an AWS Cognito User Pool with the following configuration:

**User Pool Settings:**
- Email as username alias
- Email verification required
- MFA: Optional (TOTP)
- Password policy: Min 8 chars, require uppercase, lowercase, numbers, symbols

**App Client Settings:**
- Generate secret: No
- Authentication flows: ALLOW_USER_SRP_AUTH, ALLOW_REFRESH_TOKEN_AUTH, ALLOW_USER_PASSWORD_AUTH
- OAuth flows: code, implicit
- OAuth scopes: openid, email, profile
- Callback URLs: `http://localhost:3000/api/auth/callback/cognito`
- Sign-out URLs: `http://localhost:3000`

**Token Validity:**
- Access token: 1 hour
- ID token: 1 hour
- Refresh token: 30 days

### Deploying Infrastructure

The infrastructure is managed via Terraform in the `/infrastructure` directory:

```bash
cd infrastructure
terraform init
terraform apply
```

**Resources Created:**
- Cognito User Pool
- Cognito App Client
- Cognito Domain
- DynamoDB Tables (users, sessions)
- Amplify App
- IAM Roles

## User Management

### Admin-Only User Creation

This application uses **admin-only user creation** for enhanced security. Self-registration is disabled by default, meaning users cannot sign up on their own. Administrators must create all users manually.

#### Creating Admin Users via AWS CLI

After deploying the infrastructure with `allow_admin_create_user_only = true`, use the following AWS CLI commands to create users:

**1. Create a user with email and temporary password:**

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <USER_POOL_ID> \
  --username <user-email@example.com> \
  --user-attributes Name=email,Value=<user-email@example.com> Name=email_verified,Value=true Name=name,Value="<User Name>" \
  --temporary-password <TemporaryPassword123!> \
  --message-action SUPPRESS
```

**Example:**

```bash
aws cognito-idp admin-create-user \
  --user-pool-id eu-north-1_g3ouwfuXS \
  --username admin@example.com \
  --user-attributes Name=email,Value=admin@example.com Name=email_verified,Value=true Name=name,Value="Admin User" \
  --temporary-password TempPass123! \
  --message-action SUPPRESS
```

**2. Enable the user (if needed):**

```bash
aws cognito-idp admin-enable-user \
  --user-pool-id <USER_POOL_ID> \
  --username <user-email@example.com>
```

**3. List all users in the User Pool:**

```bash
aws cognito-idp list-users \
  --user-pool-id <USER_POOL_ID>
```

**4. Delete a user (if needed):**

```bash
aws cognito-idp admin-delete-user \
  --user-pool-id <USER_POOL_ID> \
  --username <user-email@example.com>
```

#### Terraform Configuration

The `allow_admin_create_user_only` setting is configured in `infrastructure/modules/cognito/main.tf`:

```hcl
admin_create_user_config {
  allow_admin_create_user_only = true
}
```

To apply changes after modifying this setting:

```bash
cd infrastructure
terraform apply
```

#### First Login Experience

When a new admin-created user logs in for the first time:
1. User enters their email and temporary password
2. Cognito detects the temporary password and requires a password change
3. User sets a new permanent password meeting the password policy requirements
4. After password change, the user is authenticated and redirected to the dashboard

#### Security Notes

- Temporary passwords should be communicated securely to users
- Users are required to change their password on first login
- Self-registration attempts will fail with an appropriate error message
- All user creation is logged in CloudWatch for audit purposes

## Adding Protected Routes

By default, all routes are protected except:
- `/login` - Login page
- `/api/auth/*` - Authentication API routes
- Static assets (images, CSS, JS)

To add a new protected route, simply create a page in the `app` directory. The middleware will automatically protect it.

### Excluding Routes from Protection

If you need to make a route public, add it to the `publicRoutes` array in `middleware.ts`:

```typescript
const publicRoutes = ["/login", "/api/auth", "/my-public-page"]
```

## Troubleshooting

### Common Issues

**Error: "Invalid redirect URI"**
- Ensure the callback URL in Cognito matches exactly: `http://localhost:3000/api/auth/callback/cognito`
- Check that `NEXTAUTH_URL` is set correctly

**Error: "Token refresh failed"**
- Refresh token may have expired (30 days)
- User will be redirected to login with "Session expired" message

**Session not persisting**
- Check that `NEXTAUTH_SECRET` is set
- Verify cookies are not blocked by browser

**Type errors with NextAuth**
- Ensure you've extended the types in `auth.ts`
- Run `npm run type-check` to verify

### Development Tips

- Use `npm run type-check` to verify TypeScript before building
- Check browser console for authentication errors
- Use Chrome DevTools Application tab to inspect cookies

## Deployment

### Production Environment Variables

When deploying to production, update the following:

1. **Cognito Callback URLs**: Add production domain to `cognito_callback_urls` in `infrastructure/terraform.tfvars`:
   ```hcl
   cognito_callback_urls = [
     "http://localhost:3000/api/auth/callback/cognito",
     "https://your-production-domain.com/api/auth/callback/cognito"
   ]
   ```

2. **Environment Variables in Amplify**: Set these in the Amplify Console:
   - `NEXTAUTH_URL` = `https://your-production-domain.com`
   - `NEXTAUTH_SECRET` = (generate new secret)
   - `COGNITO_USER_POOL_ID`
   - `COGNITO_APP_CLIENT_ID`
   - `COGNITO_DOMAIN`

3. **Redeploy Terraform** to update Cognito callback URLs

### Build

```bash
npm run build
```

### Deploy to Amplify

The application is configured for AWS Amplify hosting. Push to your connected branch to trigger automatic deployment.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler (no emit)

## Design System

This project follows the **"Digital Vault"** design system:

- **Primary Color**: #001430 (midnight blue)
- **No-Line Rule**: Use background color shifts instead of borders
- **Surface Hierarchy**: 3 levels of surface depth
- **Glassmorphism**: 85% opacity with 20px backdrop blur
- **Typography**: Inter font family

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://authjs.dev/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)

## License

[MIT](LICENSE)
