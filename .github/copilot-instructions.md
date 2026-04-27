# Recio Ecommerce (Men's clothing) - Frontend Guidelines

- Nextjs 16 (App Router) + Tailwind CSS 4

## Core Principles

- **Style:** Minimalist, luxury, high-end retail.
- **Visual Identity:** Strict use of square corners (radius: 0px) and a monochrome palette with specific accents.
- **Framework:** Next.js (App Router) + Tailwind CSS 4.
- **Architecture:** Separation of Concerns (UI vs. Logic). Components must be "dumb" (UI only), and data must come from custom Hooks using Mocks.

## Styling Rules (Tailwind 4 Design System)

- **Colors:** DO NOT use hex codes or standard Tailwind colors (e.g., blue-500). ALWAYS use the custom tokens defined in `@theme`:
  - Backgrounds: `bg-background`, `bg-primary`, `bg-secondary`, `bg-neutral-100`.
  - Text: `text-foreground`, `text-primary-foreground`, `text-secondary-foreground`, `text-neutral-600`.
  - Borders: `border-border` (subtle), `border-border-strong` (bold/black).
  - Feedback: `text-success`, `text-warning`, `text-error`.
- **Layout:** - Use `rounded-none` for all components to match the `--radius-sm: 0px` luxury look.
  - Use spacing tokens: `py-section`, `px-content`, `max-w-container`.
- **Typography:** Use `font-sans` for body/general and `font-display` (Geist Mono) for prices, tech specs, or headers.

## Tailwind 4 & Design System Syntax

- **Variable Syntax:** ALWAYS use parentheses `()` to reference custom tokens defined in the `@theme` block.
  - Correct: `max-w-(--width-container-max)`, `py-(--spacing-section)`, `aspect-(--aspect-portrait)`.
  - Incorrect: `max-w-[--width-container-max]`.
- **Layout Consistency:** Every page section must use the "Full-Bleed" pattern:
  1. An outer wrapper with `w-full`.
  2. An inner container with `max-w-(--width-container-max) mx-auto px-(--spacing-content) w-full` to ensure all content stays centered and aligned in the same vertical "track" across the entire storefront.

## Component Structure (Shadcn-Ready)

To facilitate future migration to shadcn/ui:

1. **Naming:** Use standard shadcn naming conventions for props (e.g., `variant`, `size`).
2. **Variants:** Implement a simple `cva`-like logic or conditional classes for variants: `primary`, `secondary`, `outline`, `ghost`.
3. **Accessibility:** Ensure buttons have types, and images have alt text.

## Data & Logic (Mocks & Hooks)

- **Hooks:** Never fetch data or use `useState` for global data inside a component.
- **Pattern:** Use custom hooks located in `@/hooks` (e.g., `useProducts`, `useCategories`, `useCart`).
- **Mocks:** Assume data follows the Prisma schema: `Product` has `isNew`, `isOnSale`, and images have `isMain`.

## Prototyping Speed

- Prefer clean, semantic HTML.
- Use `lucide-react` for iconography.
- Avoid complex animations for now; use the custom `--transition-recio` for hovers.
