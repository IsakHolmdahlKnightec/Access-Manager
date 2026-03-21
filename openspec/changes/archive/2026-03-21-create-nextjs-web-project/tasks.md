## 1. Initialize Next.js Project

- [x] 1.1 Create `/web` directory and navigate into it
- [x] 1.2 Run `npx create-next-app@latest .` with TypeScript, ESLint, Tailwind CSS, App Router options enabled
- [x] 1.3 Verify `package.json` contains Next.js, React, and TypeScript dependencies
- [x] 1.4 Verify `tsconfig.json` exists with proper TypeScript configuration
- [x] 1.5 Install project dependencies with `npm install`

## 2. Configure TypeScript Strict Mode

- [x] 2.1 Open `/web/tsconfig.json` and verify `"strict": true` is set
- [x] 2.2 Enable additional strict options: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`
- [x] 2.3 Verify TypeScript compilation works with `npx tsc --noEmit`

## 3. Set Up Tailwind CSS

- [x] 3.1 Verify `tailwind.config.ts` exists with proper configuration (v4 uses @theme in CSS)
- [x] 3.2 Configure custom theme colors and fonts in `tailwind.config.ts` (adapted for v4)
- [x] 3.3 Verify `postcss.config.js` exists and is properly configured (postcss.config.mjs exists)
- [x] 3.4 Verify `globals.css` imports Tailwind directives (`@import "tailwindcss"` for v4)
- [x] 3.5 Test Tailwind is working by adding utility classes to the page

## 4. Install and Configure shadcn/ui

- [x] 4.1 Run `npx shadcn@latest init` to initialize shadcn/ui
- [x] 4.2 Select base color theme (slate or zinc) during initialization (neutral selected)
- [x] 4.3 Verify `components.json` is created with correct configuration
- [x] 4.4 Verify `lib/utils.ts` is created with `cn()` utility function
- [x] 4.5 Install essential shadcn components: `npx shadcn@latest add button` (auto-installed)
- [x] 4.6 Verify button component exists in `components/ui/button.tsx`
- [x] 4.7 Test button component renders correctly in the app

## 5. Configure App Router Structure

- [x] 5.1 Verify `app/` directory exists with proper structure
- [x] 5.2 Review `app/layout.tsx` for proper HTML structure and metadata
- [x] 5.3 Review `app/page.tsx` for initial landing page content
- [x] 5.4 Add proper metadata to layout (title, description)
- [x] 5.5 Ensure root layout includes necessary providers and wrappers

## 6. Establish Project Directory Structure

- [x] 6.1 Create `/web/components/` directory for reusable components
- [x] 6.2 Create `/web/components/ui/` directory for shadcn components
- [x] 6.3 Verify `/web/lib/` directory exists with utility functions
- [x] 6.4 Create `/web/types/` directory for TypeScript definitions (if needed)
- [x] 6.5 Verify `/web/public/` directory exists for static assets

## 7. Configure Development Scripts

- [x] 7.1 Verify `package.json` has `dev` script for development server
- [x] 7.2 Verify `package.json` has `build` script for production builds
- [x] 7.3 Verify `package.json` has `start` script for production server
- [x] 7.4 Verify `package.json` has `lint` script for ESLint
- [x] 7.5 Add optional `type-check` script: `"type-check": "tsc --noEmit"`
- [x] 7.6 Test all scripts work correctly

## 8. Final Verification and Testing

- [x] 8.1 Run `npm run dev` and verify development server starts without errors
- [x] 8.2 Open browser to `http://localhost:3000` and verify page loads
- [x] 8.3 Run `npm run build` and verify production build succeeds
- [x] 8.4 Run `npm run lint` and verify no linting errors
- [x] 8.5 Run `npm run type-check` and verify no TypeScript errors
- [x] 8.6 Verify Tailwind styles are applied correctly
- [x] 8.7 Verify shadcn button component renders and is interactive
