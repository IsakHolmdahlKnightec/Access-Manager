## ADDED Requirements

### Requirement: Material Design 3 color token architecture
The system SHALL implement Material Design 3 color token architecture with tonal palettes for each color family (primary, secondary, tertiary, error, neutral, neutral-variant).

#### Scenario: Tonal color ramps exist
- **WHEN** a developer references `--color-primary-40` custom property
- **THEN** the value corresponds to the 40% tonal value of the primary color

#### Scenario: Container color variants exist
- **WHEN** a developer uses `bg-primary-container` class
- **THEN** the background uses the primary container color from the tonal palette

#### Scenario: Fixed color variants exist
- **WHEN** a developer uses `text-primary-fixed` class
- **THEN** the text color remains consistent in both light and dark modes

### Requirement: Semantic status colors
The system SHALL define semantic color tokens for status states (success, warning, info) that align with the design system's "Access Chips" pattern.

#### Scenario: Success state colors exist
- **WHEN** a developer uses `bg-success-container` class
- **THEN** the background uses a green-tinted container color indicating success state

#### Scenario: Warning state colors exist
- **WHEN** a developer uses `text-warning` class
- **THEN** the text uses an amber-tinted color indicating warning state

#### Scenario: Error state colors exist
- **WHEN** a developer uses `bg-error-container` class
- **THEN** the background uses the error container color (#ffdad6) for error states

### Requirement: Elevation and shadow tokens
The system SHALL provide shadow tokens that follow the "Tonal Layering" principle, using primary-tinted ambient shadows instead of default grey shadows.

#### Scenario: Ambient shadow tokens exist
- **WHEN** a developer uses `shadow-ambient` class
- **THEN** the shadow uses primary-tinted color (rgba(0, 20, 48, 0.06)) with 32px blur

#### Scenario: Elevation surface tokens exist
- **WHEN** a developer uses `bg-surface-container-lowest` class
- **THEN** the background creates tonal elevation effect without using drop shadows

### Requirement: Outline and border tokens
The system SHALL provide outline tokens for the "Ghost Border" pattern, using low-opacity variants instead of solid borders.

#### Scenario: Outline variant tokens exist
- **WHEN** a developer uses `border-outline-variant` class
- **THEN** the border uses outline variant color at appropriate opacity (15%)

#### Scenario: Focus ring tokens exist
- **WHEN** an element receives focus
- **THEN** the focus ring uses primary color with appropriate offset and width

### Requirement: Glassmorphism effect tokens
The system SHALL provide tokens for the "Glass & Gradient" glassmorphism effects, including backdrop blur and opacity values.

#### Scenario: Glass surface tokens exist
- **WHEN** a developer uses `bg-glass` class on a modal
- **THEN** the background uses surface-container-lowest at 85% opacity with 20px backdrop blur

#### Scenario: Gradient tokens exist
- **WHEN** a developer uses `bg-gradient-primary` class
- **THEN** the background displays a linear gradient from primary to primary-container
