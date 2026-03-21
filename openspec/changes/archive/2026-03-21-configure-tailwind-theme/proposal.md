## Why

The project currently lacks a comprehensive Tailwind CSS theme configuration that aligns with the "Architectural Sentinel" design system. Without a centralized theme, developers must manually apply colors, typography, and spacing values, leading to inconsistencies and maintenance overhead. This change establishes a robust, token-based design system that brings the "Digital Vault" aesthetic to life while supporting both light and dark modes.

## What Changes

- **Configure Tailwind CSS v4** with custom CSS variables following Material Design 3 token architecture
- **Define complete color palette** with primary, secondary, tertiary, error, and surface color ramps (0-100 tonal values)
- **Set up typography scale** with Inter font family following the "High-Contrast Scale" pattern (display-lg to label-sm)
- **Configure semantic spacing tokens** (spacing-2 through spacing-10)
- **Implement dark/light mode support** using Tailwind's `dark:` variant with automatic color inversion
- **Add semantic color tokens** for status states (success, warning, info) aligned with design system
- **Create CSS custom properties** in `globals.css` for runtime theme switching capabilities

## Capabilities

### New Capabilities
- `tailwind-theme`: Comprehensive Tailwind theme configuration with custom colors, typography, spacing, and dark mode support
- `design-tokens`: CSS custom properties system for runtime theme switching and consistent design values

### Modified Capabilities
- *(none - this is a foundational configuration change)*

## Impact

- **Files Modified:**
  - `web/app/globals.css` - Extended with CSS custom properties and Tailwind v4 directives
  - `web/package.json` - Verify Tailwind v4 dependencies
- **Dependencies:** Uses existing Tailwind CSS v4 setup
- **Breaking Changes:** None - this is additive configuration
- **Developer Experience:** Enables consistent use of design tokens via Tailwind classes (e.g., `bg-primary`, `text-on-surface`, `dark:bg-surface-container-low`)
