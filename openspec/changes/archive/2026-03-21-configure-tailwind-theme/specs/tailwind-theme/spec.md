## ADDED Requirements

### Requirement: Complete color palette definition
The system SHALL define all color tokens required by the "Architectural Sentinel" design system, including primary, secondary, tertiary, error, and surface color families with full tonal ramps (0-100).

#### Scenario: Primary color tokens exist
- **WHEN** a developer uses `bg-primary` class
- **THEN** the element background uses the primary color (#001430)

#### Scenario: Surface hierarchy tokens exist
- **WHEN** a developer uses `bg-surface-container-low` class
- **THEN** the element background uses the appropriate surface variant color

#### Scenario: Text contrast tokens exist
- **WHEN** a developer uses `text-on-primary` class
- **THEN** the text color provides proper contrast against primary background

### Requirement: Typography scale implementation
The system SHALL implement the "High-Contrast Scale" typography system using Inter font family with display, headline, title, body, and label size variants.

#### Scenario: Display typography is available
- **WHEN** a developer uses `text-display-lg` class
- **THEN** the text renders at the display large size with tight letter-spacing (-0.02em)

#### Scenario: Body typography is available
- **WHEN** a developer uses `text-body-md` class
- **THEN** the text renders at the body medium size (0.875rem) with normal letter-spacing

#### Scenario: Label typography is available
- **WHEN** a developer uses `text-label-sm` class
- **THEN** the text renders at the label small size (0.6875rem) for metadata display

### Requirement: Semantic spacing system
The system SHALL provide semantic spacing tokens (spacing-2 through spacing-10) that align with the design system's spacing scale.

#### Scenario: Spacing tokens work for padding
- **WHEN** a developer uses `p-spacing-4` class
- **THEN** the element has 1rem (16px) padding

#### Scenario: Spacing tokens work for gaps
- **WHEN** a developer uses `gap-spacing-6` class
- **THEN** the flex/grid container has 1.5rem gap

### Requirement: Dark mode support
The system SHALL support dark mode using CSS custom properties that automatically invert surface colors while maintaining the "Tonal Authority" aesthetic.

#### Scenario: Dark mode surface colors invert
- **WHEN** the system is in dark mode and a developer uses `bg-surface` class
- **THEN** the background color uses the dark surface variant (#001430)

#### Scenario: Dark mode text colors adapt
- **WHEN** the system is in dark mode and a developer uses `text-on-surface` class
- **THEN** the text color uses the dark on-surface variant (#ffffff)

### Requirement: CSS custom properties architecture
The system SHALL define all design tokens as CSS custom properties in `globals.css` to enable runtime theme switching and consistent values across the application.

#### Scenario: CSS variables are defined
- **WHEN** inspecting the computed styles of any element
- **THEN** color values resolve from CSS custom properties (e.g., `var(--color-primary)`)

#### Scenario: Token values can be overridden
- **WHEN** a CSS rule overrides a custom property (e.g., `--color-primary: red`)
- **THEN** all elements using that token update to the new value
