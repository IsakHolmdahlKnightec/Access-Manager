## 1. Setup and Dependencies

- [x] 1.1 Install NextAuth.js v5: `npm install next-auth@beta` (or appropriate version)
- [x] 1.2 Install required peer dependencies if any
- [x] 1.3 Create `.env.local` file with placeholder Cognito configuration
- [x] 1.4 Add `.env.local` to `.gitignore` (if not already present)
- [ ] 1.5 Verify Cognito App Client callback URLs include `http://localhost:3000/api/auth/callback/cognito`

## 2. NextAuth Configuration

- [x] 2.1 Create `auth.ts` file at project root with Cognito provider configuration
- [x] 2.2 Configure JWT session strategy with 24-hour max age
- [x] 2.3 Implement session callback to include user email and Cognito sub
- [x] 2.4 Implement JWT callback to handle token refresh from Cognito
- [x] 2.5 Add error handling for failed token refresh
- [x] 2.6 Create `app/api/auth/[...nextauth]/route.ts` with GET and POST handlers
- [x] 2.7 Verify auth configuration loads correctly on app start

## 3. Session Provider and Layout Integration

- [x] 3.1 Create or update `app/providers.tsx` with NextAuth SessionProvider
- [x] 3.2 Wrap root layout children with SessionProvider in `app/layout.tsx`
- [x] 3.3 Ensure SessionProvider is properly typed with TypeScript
- [x] 3.4 Test that session context is available in client components

## 4. Middleware and Route Protection

- [x] 4.1 Create `middleware.ts` at project root
- [x] 4.2 Implement authentication check using NextAuth.js getToken
- [x] 4.3 Configure matcher to exclude `/login`, `/api/auth/*`, and static assets
- [x] 4.4 Implement redirect to `/login` for unauthenticated requests
- [x] 4.5 Preserve callbackUrl in redirect query parameters
- [x] 4.6 Test middleware redirects unauthenticated users correctly
- [x] 4.7 Test middleware allows authenticated users through

## 5. Login Page Implementation

- [x] 5.1 Create `app/login/page.tsx` file
- [x] 5.2 Adapt existing design from `access_manager_design/refined_employee_login_desktop/code.html`
- [x] 5.3 Implement email input field with label "Work Email"
- [x] 5.4 Implement password input field with label "Password"
- [x] 5.5 Add "Forgot password?" link (can be placeholder for now)
- [x] 5.6 Create Sign In button with primary button styling
- [x] 5.7 Implement form submission using NextAuth.js `signIn` function
- [x] 5.8 Add loading state to button during authentication
- [x] 5.9 Implement error message display for failed login
- [x] 5.10 Add redirect to callbackUrl or `/dashboard` on successful login
- [x] 5.11 Style page to match "Digital Vault" design system (midnight blue, no borders)

## 6. User Navigation and Session UI

- [x] 6.1 Update `components/layout/user-nav.tsx` to display authenticated user info
- [x] 6.2 Use `useSession` hook to get user email and name
- [x] 6.3 Add logout button that calls NextAuth.js `signOut` function
- [x] 6.4 Implement logout redirect to `/login`
- [x] 6.5 Update Header component to show/hide navigation based on auth state
- [x] 6.6 Add user avatar or initials display in navigation

## 7. Environment Configuration

- [x] 7.1 Set `NEXTAUTH_URL` to `http://localhost:3000` for local development
- [x] 7.2 Generate `NEXTAUTH_SECRET` using `openssl rand -base64 32`
- [ ] 7.3 Get Cognito User Pool ID from Terraform outputs
- [ ] 7.4 Get Cognito App Client ID from Terraform outputs
- [ ] 7.5 Get Cognito Domain from Terraform outputs
- [ ] 7.6 Populate all values in `.env.local`
- [x] 7.7 Verify application starts without environment errors

## 8. Testing and Verification

- [ ] 8.1 Test login flow with valid Cognito credentials
- [ ] 8.2 Test login failure with invalid credentials shows error
- [x] 8.3 Test middleware redirects unauthenticated user from `/` to `/login`
- [ ] 8.4 Test successful login redirects to originally requested page
- [ ] 8.5 Test session persists across page navigation
- [ ] 8.6 Test logout clears session and redirects to login
- [ ] 8.7 Test token refresh by waiting near token expiry (or manually)
- [x] 8.8 Test protected route access returns 401/redirect when unauthenticated
- [x] 8.9 Verify design matches "Digital Vault" aesthetic on all auth pages
- [x] 8.10 Test responsive design on mobile devices

## 9. TypeScript and Type Safety

- [x] 9.1 Extend NextAuth.js types to include Cognito user data
- [x] 9.2 Add TypeScript interfaces for session user object
- [x] 9.3 Ensure all auth callbacks are properly typed
- [x] 9.4 Run `npm run type-check` and fix any errors
- [x] 9.5 Verify no `any` types in auth-related code

## 10. Deployment Preparation

- [x] 10.1 Build application: `npm run build`
- [x] 10.2 Fix any build errors
- [x] 10.3 Create `.env.example` with placeholder values (for documentation)
- [ ] 10.4 Document required environment variables in README
- [ ] 10.5 Update Cognito App Client callback URLs for production domain
- [ ] 10.6 Set environment variables in Amplify console
- [ ] 10.7 Deploy to Amplify and verify auth flow in production
- [ ] 10.8 Test end-to-end login/logout in production environment

## 11. Documentation

- [x] 11.1 Add authentication section to project README
- [ ] 11.2 Document Cognito configuration requirements
- [ ] 11.3 Document environment variables needed
- [ ] 11.4 Add troubleshooting section for common auth issues
- [ ] 11.5 Document how to add new protected routes
