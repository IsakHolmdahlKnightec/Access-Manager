# Design System Specification: The Architectural Sentinel

## 1. Overview & Creative North Star: "The Digital Vault"
This design system rejects the "flat-web" aesthetic in favor of **The Digital Vault**—a creative North Star that treats access management not as a series of forms, but as a high-security, premium architectural experience. We move beyond generic dashboards by utilizing "Structural Depth" and "Tonal Authority."

The experience is defined by **intentional asymmetry** and **high-contrast editorial density**. Instead of a centered, symmetrical grid, we lean into a strong "Anchor-and-Flow" layout: heavy, authoritative navigation on the left (the Anchor) paired with expansive, high-contrast workspaces on the right (the Flow). By using Inter at extreme scale differentials (e.g., a `display-lg` headline next to a `label-sm` metadata tag), we create a sense of hierarchy that feels curated and expensive.

---

## 2. Colors: Tonal Authority
The palette is rooted in `primary` (#001430), a deep midnight blue that communicates absolute security. 

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for layout sectioning. In this system, boundaries are defined by **Background Color Shifts**. 
*   **Workspace:** Use `surface` (#fcf9f8) as the base.
*   **Sidebars/Panels:** Transition to `surface-container-low` (#f6f3f2) or `surface-container` (#f0edec) to denote a functional change without a hard line.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of "Security Glass." 
1.  **Level 0 (Base):** `surface`
2.  **Level 1 (Sub-sections):** `surface-container-low`
3.  **Level 2 (Active Cards):** `surface-container-lowest` (#ffffff) – This creates a "lifted" appearance against the off-white base.

### The "Glass & Gradient" Rule
To elevate the professional polish:
*   **Signature Textures:** For high-level CTA backgrounds or login hero states, apply a subtle linear gradient from `primary` (#001430) to `primary_container` (#002855). 
*   **Glassmorphism:** Floating modals or dropdowns must use `surface_container_lowest` at 85% opacity with a `20px` backdrop-blur. This ensures the "Vault" feels interconnected rather than fragmented.

---

## 3. Typography: Editorial Utility
We use **Inter** exclusively. The system relies on a "High-Contrast Scale" to ensure information density doesn't compromise readability.

*   **Display & Headline (`display-lg` to `headline-sm`):** Set with a tight letter-spacing (-0.02em). These are the "Signposts." They should feel bold and immovable.
*   **The Utility Pair:** Always pair `title-sm` (1rem, Semi-bold) for field labels with `body-md` (0.875rem, Regular) for supporting text. 
*   **The Metadata Micro-tier:** Use `label-sm` (0.6875rem) in `on_surface_variant` (#43474f) for audit logs and timestamps. The small scale suggests technical precision.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "consumer-grade" for a high-security system. We use **Tonal Layering**.

*   **The Layering Principle:** A `surface-container-lowest` card sitting on a `surface-container` background provides all the "elevation" needed. The eye perceives the brighter white as being closer to the viewer.
*   **Ambient Shadows:** If an element must float (e.g., a critical access prompt), use a shadow tinted with the `primary` hue: `rgba(0, 20, 48, 0.06)` with a 32px blur and 16px Y-offset.
*   **The "Ghost Border" Fallback:** If a container requires a boundary (e.g., in high-glare environments), use the `outline_variant` (#c3c6d0) at **15% opacity**. A solid 100% border is a failure of the system's elegance.

---

## 5. Components: Precision Primitives

### Buttons (The Interaction Anchors)
*   **Primary:** Solid `primary` (#001430) with `on_primary` (#ffffff) text. Use `md` (0.375rem) roundedness. 
*   **Secondary:** `secondary_container` (#cfe6f2) background. No border.
*   **Tertiary:** Transparent background, `primary` text, with a subtle `primary_fixed` (#d6e3ff) hover state.

### Input Fields (The Entry Points)
*   **Static State:** Background `surface_container_low`, `label-md` floating above.
*   **Active State:** Background `surface_container_lowest`. Replace the standard 2px border with a 2px solid bottom-accent in `surface_tint` (#305ea0).
*   **Error State:** Background `error_container` (#ffdad6) with `on_error_container` (#93000a) text.

### Cards & Lists (The Data Repositories)
*   **Rule:** Forbid divider lines. 
*   **Execution:** Separate list items using a `spacing-2` (0.5rem) vertical gap. Use alternating background shades (`surface` vs `surface-container-low`) only if the data is extremely dense.
*   **Access Chips:** Use `secondary_fixed` (#cfe6f2) for granted permissions and `error_container` (#ffdad6) for revoked/expired states.

### Identity-Specific Components
*   **The "Security Pulse":** A small, animated dot using `on_tertiary_container` (amber-toned) to indicate real-time syncing or active sessions.
*   **Permission Matrix:** A grid where the "Access Level" is defined by the intensity of the blue (using the `primary` to `primary_fixed` ramp) rather than checkmarks.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Whitespace as a Tool:** Use `spacing-10` (2.5rem) to separate major functional groups. Room to breathe equals room to think.
*   **Prioritize Contrast:** Always check that `on_surface` text against `surface_container` tiers exceeds a 4.5:1 ratio (WCAG AA).
*   **Embrace Asymmetry:** Align your primary headers to the far left, while utility actions (Export, Filter) sit asymmetrically on the right.

### Don’t:
*   **Don't use "Pure Black":** Use `primary` (#001430) for deep text; it maintains the tonal "soul" of the system.
*   **Don't use Dividers:** If you feel the need to draw a line, try adding `spacing-4` (1rem) of empty space instead.
*   **Don't use Default Shadows:** Standard grey shadows "muddy" the crisp white-and-blue professional palette. Always tint your shadows with the primary navy.