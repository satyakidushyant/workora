# Styling Guidelines

Workora uses a hybrid styling approach, combining **Angular Material** for core interactive components and **Tailwind CSS** for layout, spacing, and utility styling.

## 1. Angular Material
Use Angular Material components (`MatButton`, `MatTable`, `MatDialog`) for all complex UI elements. This ensures WCAG 2.1 AA accessibility out of the box.

- Do not override Material internal classes (e.g., `.mat-mdc-button`) globally unless absolutely necessary for the theme. Use the Material Theming SCSS API instead.
- Use Material Typography for global text sizes.

## 2. Tailwind CSS
Use Tailwind for all non-Material layout concerns.

- **Spacing & Layout**: Flexbox, CSS Grid, margins, paddings (e.g., `flex flex-col gap-4 p-6`).
- **Responsive Design**: Use Tailwind breakpoints (`md:`, `lg:`) instead of writing custom media queries.
- **Avoid Custom CSS**: Keep `.component.scss` files empty unless you are dealing with complex animations or third-party library overrides. Rely on `@apply` in your stylesheet if you must create a reusable class.

## 3. Dark Mode
The application must support Dark Mode. 
- Ensure your Angular Material theme defines a dark palette.
- Use Tailwind's `dark:` modifier for custom elements (e.g., `bg-white dark:bg-gray-800`).
