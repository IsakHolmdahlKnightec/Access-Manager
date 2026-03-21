# Agent Guidelines for OpenSpec Access Manager

This document provides guidelines for AI agents working in this repository.

## Project Overview

This is an **OpenSpec Access Manager** - a modern access management system built with a specification-driven development workflow using the OpenSpec framework.

### OpenSpec Workflow

This project uses **OpenSpec** for specification-driven development:

- **`/openspec/config.yaml`** - Main configuration for the spec-driven workflow
- **`/openspec/specs/`** - Contains formal system specifications (e.g., `nextjs-web-project/spec.md`)
- **`/openspec/changes/`** - Active changes being worked on
- **`/openspec/changes/archive/`** - Completed and archived changes

When implementing features, always check if there are existing OpenSpec artifacts. Changes follow a structured workflow: proposal → design → specs → tasks → implementation → verification → archive.

### Design System

The project follows **"The Architectural Sentinel"** design system defined in `/access_manager_design/`:

- **Core Design**: `/access_manager_design/sentinel_core/DESIGN.md` - Contains the "Digital Vault" creative direction, color palette, typography (Inter), and component guidelines
- **Key Design Principles**:
  - **"No-Line" Rule**: Use background color shifts instead of borders
  - **Tonal Authority**: Deep midnight blue (`#001430`) as primary color
  - **Surface Hierarchy**: 3 levels - surface → surface-container-low → surface-container-lowest
  - **No Pure Black**: Use `primary` (#001430) for deep text
  - **Glassmorphism**: Floating elements use 85% opacity with 20px backdrop-blur

Additional design artifacts exist for specific views:
- `refined_employee_login_desktop/` - Login page design
- `refined_request_access_desktop/` - Access request flow design
- `refined_user_dashboard_desktop/` - Dashboard design
- `streamlined_admin_control_center/` - Admin interface design

## Project Structure

```
/
├── web/                    # Next.js 15 web application
│   ├── app/               # App Router (pages & layouts)
│   ├── components/        # React components
│   │   └── ui/           # shadcn/ui components
│   ├── lib/              # Utility functions
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies & scripts
│   └── tsconfig.json     # TypeScript config
├── openspec/             # OpenSpec artifacts
│   ├── config.yaml       # OpenSpec configuration
│   ├── specs/            # System specifications
│   └── changes/          # Active & archived changes
└── access_manager_design/# Design system & specifications
```

## Build & Development Commands

All commands are run from the `/web` directory:

```bash
cd /Users/isakholmdahl/Git/openspec-access-manager/web

# Development
npm run dev              # Start development server (Next.js dev mode)

# Building
npm run build            # Create production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler (no emit)
```

**Note:** There is no test runner configured yet. To add tests, consider installing Vitest or Jest.

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - All strict compiler options are active
- Use explicit return types for exported functions
- Prefer `interface` over `type` for object shapes
- Use `Readonly<T>` for immutable props
- Avoid `any` - use `unknown` with type guards when type is uncertain

### Imports & Path Aliases

Use the configured path aliases:

```typescript
// Good
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Avoid relative paths like:
// import { Button } from "../../../components/ui/button"
```

**Aliases defined in tsconfig.json:**
- `@/*` → `./*` (project root)
- `@/components/*` → `components/*`
- `@/lib/*` → `lib/*`
- `@/hooks/*` → `hooks/*`

### Component Patterns

**shadcn/ui Components:**
- Located in `/web/components/ui/`
- Use `@base-ui/react` as the underlying primitive library
- Styled with Tailwind CSS + `class-variance-authority` (CVA)
- Follow the existing Button component pattern with `cva` variants

**Custom Components:**
- Use functional components with explicit props interfaces
- Export components as default when they're page/route components
- Use named exports for reusable UI components
- Apply `cn()` utility for conditional class merging

### Naming Conventions

- **Components**: PascalCase (e.g., `AccessRequestForm.tsx`)
- **Utilities/Helpers**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Types/Interfaces**: PascalCase with descriptive names
- **Files**: Match the default export name (PascalCase for components)

### Styling (Tailwind CSS v4)

- Use **Tailwind CSS v4** with the new `@tailwindcss/postcss` setup
- Global styles in `app/globals.css`
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Follow the design system colors (defined in globals.css CSS variables)
- **No arbitrary values** - extend Tailwind config if needed

### Error Handling

- Use early returns for guard clauses
- Prefer explicit error handling over try/catch when possible
- For async operations, handle errors at the call site
- Use TypeScript's strict null checks to prevent null reference errors

### Formatting

The project uses ESLint with Next.js configurations:
- `next/core-web-vitals`
- `next/typescript`

Run `npm run lint` before committing. No Prettier is configured - rely on ESLint for formatting consistency.

## Key Dependencies

- **Next.js 15.5.14** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type system
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Component library (uses `@base-ui/react` primitives)
- **lucide-react** - Icon library
- **class-variance-authority** - Component variant management
- **clsx + tailwind-merge** - Conditional class utilities

## Notes for Agents

1. Always check `/openspec/specs/` before implementing new features - the specs define the requirements
2. Follow the "Architectural Sentinel" design system - especially the "No-Line" rule and color palette
3. When adding shadcn components, use the shadcn CLI: `npx shadcn add <component>`
4. The project uses React Server Components by default - use `"use client"` only when needed
5. Keep components modular and follow the existing patterns in `/web/components/ui/`
