## Context

The OpenSpec Access Manager project uses Tailwind CSS v4 for styling, but currently lacks a comprehensive theme configuration that aligns with the "Architectural Sentinel" design system. The design system defines specific colors, typography, and interaction patterns centered around the "Digital Vault" aesthetic—a premium, high-security visual language.

Current state:
- Tailwind CSS v4 is installed with the new `@tailwindcss/postcss` setup
- Basic `globals.css` exists but lacks the full token system
- No dark mode configuration
- No centralized design tokens

Constraints:
- Must follow the "No-Line" rule (no borders, use background color shifts)
- Must use the Material Design 3 token architecture for color ramps
- Must support both light and dark modes
- Must align with the "Architectural Sentinel" design system colors and typography

## Goals / Non-Goals

**Goals:**
- Configure Tailwind CSS v4 with a complete custom theme matching the "Architectural Sentinel" design system
- Implement Material Design 3 color token architecture (primary, secondary, tertiary, error, surface ramps)
- Set up Inter font family with the "High-Contrast Scale" typography system
- Configure semantic spacing tokens
- Enable dark mode support with automatic color inversion
- Create CSS custom properties for runtime theme switching
- Ensure WCAG AA contrast compliance (4.5:1 ratio minimum)

**Non-Goals:**
- Changing existing component implementations (this is configuration only)
- Adding new shadcn/ui components
- Implementing runtime theme toggle UI (just the CSS infrastructure)
- Modifying the build system or PostCSS configuration

## Decisions

### Decision 1: Use CSS Custom Properties for Color Tokens
**Rationale:** CSS custom properties (variables) enable runtime theme switching and are the standard approach in Tailwind v4. They allow the same Tailwind classes (e.g., `bg-primary`) to resolve to different values in light vs dark mode.

**Alternatives considered:**
- Tailwind's `darkMode: 'class'` with manual color overrides - rejected because it requires more verbose class names
- JavaScript-based theme management - rejected because it adds unnecessary complexity for this use case

### Decision 2: Implement Material Design 3 Color Architecture
**Rationale:** The design system uses specific tonal values (0-100) for each color. Following MD3's architecture ensures consistent lightening/darkening and proper dark mode adaptation.

Structure per color family:
- Base color (e.g., `--color-primary`: #001430)
- Container variants (e.g., `--color-primary-container`: #002855)
- Fixed variants (e.g., `--color-primary-fixed`: #d6e3ff)
- On-colors for text (e.g., `--color-on-primary`: #ffffff)

### Decision 3: Use Tailwind v4's CSS-First Configuration
**Rationale:** Tailwind v4 moves away from `tailwind.config.js` in favor of CSS-based configuration using `@theme` directive. This aligns better with the project's setup and provides better IDE support.

Configuration location: `web/app/globals.css`

### Decision 4: Typography Scale: High-Contrast Editorial
**Rationale:** The design system specifies Inter font with extreme scale differentials. We'll implement:
- Display sizes (display-lg, display-md) for hero content
- Headline sizes (headline-lg to headline-sm) for section headers
- Title sizes (title-lg to title-sm) for field labels and card titles
- Body sizes (body-lg to body-sm) for content
- Label sizes (label-lg to label-sm) for metadata and timestamps

Letter-spacing: -0.02em for display/headline, default for body

### Decision 5: Dark Mode Color Strategy
**Rationale:** Instead of defining separate dark palettes, we'll use the "surface inversion" pattern where dark mode swaps surface colors:
- Light mode: surface (#fcf9f8) → surface-container-low (#f6f3f2)
- Dark mode: surface (#001430) → surface-container-low (#0a1d3d)

This maintains the "Tonal Authority" aesthetic in both modes.

## Risks / Trade-offs

**Risk: Breaking existing styles** → Mitigation: This change is purely additive. Existing hardcoded colors will continue to work. We'll verify no visual regressions in existing components.

**Risk: CSS file size increase** → Mitigation: CSS custom properties have negligible runtime cost. The variables are defined once and reused.

**Risk: Developer confusion with new tokens** → Mitigation: We'll follow Tailwind's naming conventions closely (e.g., `bg-primary` not `bg-primary-500`). The token names match the design system documentation.

**Trade-off: No JavaScript theme API** → We're only providing CSS infrastructure. If the project later needs programmatic theme control (e.g., user preference storage), it can be added on top of this foundation.

## Migration Plan

1. **Phase 1: Add CSS variables** - Extend `globals.css` with all color, typography, and spacing tokens
2. **Phase 2: Configure Tailwind theme** - Add `@theme` directive mapping tokens to Tailwind utilities
3. **Phase 3: Enable dark mode** - Add `darkMode: 'media'` (or 'class' if preferred) configuration
4. **Phase 4: Verification** - Run the dev server and verify tokens work correctly

Rollback: Simply revert the `globals.css` changes. No database migrations or API changes involved.
