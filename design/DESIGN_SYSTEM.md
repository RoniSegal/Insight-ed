# Growth Engine Design System

## Design Philosophy

Growth Engine is an educational technology platform designed for teachers and principals. The design system reflects:

- **Trust & Professionalism**: Educational institutions require credibility and reliability
- **Clarity & Readability**: Teachers work in time-constrained environments
- **Data Transparency**: Analytics and insights must be immediately understandable
- **Accessibility First**: Must work in diverse school environments with varying tech literacy

## Visual Identity

### Brand Attributes

- **Empowering**: Tools that augment teacher capabilities, not replace them
- **Insightful**: Data-driven but human-centered
- **Approachable**: Professional without being corporate or cold
- **Trustworthy**: Secure, private, compliant with educational standards

### Unique Signature Traits

1. **Warm Educational Palette**: Blue-indigo primary with warm accent touches (amber/orange for insights)
2. **Depth Through Soft Shadows**: Subtle elevation system that creates hierarchy without harsh lines
3. **Data Typography Contrast**: Clean sans-serif for UI + monospace for data/metrics
4. **Insight Cards with Glow**: Key insights use subtle gradient borders and glow effects

## Color System

### Tokens

```typescript
colors: {
  // Primary - Education Blue (trust, professionalism)
  primary: {
    50: '#eff6ff',   // Lightest backgrounds
    100: '#dbeafe',  // Hover states
    200: '#bfdbfe',  // Disabled states
    300: '#93c5fd',  // Borders
    400: '#60a5fa',  // Interactive elements
    500: '#3b82f6',  // Primary buttons, links
    600: '#2563eb',  // Primary hover
    700: '#1d4ed8',  // Primary active
    800: '#1e40af',  // Dark mode primary
    900: '#1e3a8a',  // Darkest
  },

  // Secondary - Deep Indigo (depth, intelligence)
  secondary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',   // Secondary actions
    600: '#4f46e5',   // Secondary hover
    700: '#4338ca',   // Secondary active
    800: '#3730a3',
    900: '#312e81',
  },

  // Accent - Warm Amber (insights, highlights, achievements)
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',   // Accent highlights
    600: '#d97706',   // Accent hover
    700: '#b45309',   // Accent active
    800: '#92400e',
    900: '#78350f',
  },

  // Success - Green (positive outcomes, completions)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',   // Success states
    600: '#16a34a',   // Success hover
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning - Orange (needs attention, pending)
  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',   // Warning states
    600: '#ea580c',   // Warning hover
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Error - Red (errors, critical issues)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',   // Error states
    600: '#dc2626',   // Error hover
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral - Gray (backgrounds, text, borders)
  neutral: {
    50: '#f9fafb',   // Page background
    100: '#f3f4f6',  // Card background
    200: '#e5e7eb',  // Borders
    300: '#d1d5db',  // Disabled
    400: '#9ca3af',  // Placeholders
    500: '#6b7280',  // Secondary text
    600: '#4b5563',  // Body text
    700: '#374151',  // Headings
    800: '#1f2937',  // Dark headings
    900: '#111827',  // Maximum contrast
  },
}
```

### Color Usage Guidelines

- **Primary (Blue)**: Main CTAs, primary navigation, active states, links
- **Secondary (Indigo)**: Secondary actions, alternative navigation, sub-sections
- **Accent (Amber)**: Insights, achievements, highlights, "aha moments"
- **Success (Green)**: Completed analyses, positive trends, confirmations
- **Warning (Orange)**: Pending analyses, needs review, incomplete data
- **Error (Red)**: Failed operations, critical alerts, validation errors
- **Neutral (Gray)**: Text, backgrounds, borders, disabled states

## Typography

### Font Families

```typescript
fontFamily: {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],  // UI text
  display: ['Inter', 'system-ui', 'sans-serif'],                 // Headings
  mono: ['JetBrains Mono', 'Consolas', 'monospace'],            // Data/metrics
  hebrew: ['Rubik', 'Assistant', 'sans-serif'],                  // Hebrew support
}
```

**Rationale:**
- **Inter**: Excellent readability, professional, works well in dense UIs
- **JetBrains Mono**: Clear distinction for numbers and data
- **Rubik/Assistant**: Native Hebrew font support with good RTL handling

### Typography Scale

```typescript
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px - Small labels, captions
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - Body small, table text
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px - Body text
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px - Large body, subtitles
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px - H4
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px - H3
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - H2
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px - H1
  '5xl': ['3rem', { lineHeight: '1' }],           // 48px - Display
}
```

### Typography Usage

- **Display (48px)**: Page titles, welcome screens
- **H1 (36px)**: Main page headings
- **H2 (30px)**: Section headings
- **H3 (24px)**: Subsection headings
- **H4 (20px)**: Card titles
- **Body (16px)**: Default text
- **Small (14px)**: Secondary text, table data
- **Caption (12px)**: Labels, helper text, timestamps

### Font Weights

```typescript
fontWeight: {
  normal: '400',    // Body text
  medium: '500',    // Emphasized text
  semibold: '600',  // Subheadings, buttons
  bold: '700',      // Headings
  extrabold: '800', // Display text, critical alerts
}
```

## Spacing & Layout

### Spacing Scale

Based on 4px grid system:

```typescript
spacing: {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
}
```

### Layout Guidelines

- **Page padding**: 16px mobile, 24px tablet, 32px desktop
- **Card padding**: 16px (compact), 24px (default), 32px (spacious)
- **Component spacing**: 8px within groups, 16px between groups, 24px between sections
- **Form fields**: 12px vertical gap between fields

### Container Widths

```typescript
maxWidth: {
  xs: '20rem',    // 320px - Narrow content
  sm: '24rem',    // 384px - Forms, cards
  md: '28rem',    // 448px - Medium forms
  lg: '32rem',    // 512px - Login/auth pages
  xl: '36rem',    // 576px - Wide forms
  '2xl': '42rem', // 672px - Article content
  '3xl': '48rem', // 768px - Dashboard cards
  '4xl': '56rem', // 896px - Wide layouts
  '5xl': '64rem', // 1024px - Main content
  '6xl': '72rem', // 1152px - Wide dashboards
  '7xl': '80rem', // 1280px - Maximum width
}
```

## Depth & Shadow System

### Shadow Tokens

```typescript
boxShadow: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',                          // Subtle elevation
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // Cards
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',   // Dropdowns
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // Modals
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // High elevation
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',                 // Maximum elevation
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',                 // Inset elements

  // Signature glow for insights
  glow: '0 0 20px rgb(59 130 246 / 0.3)',                       // Primary glow
  'glow-accent': '0 0 20px rgb(245 158 11 / 0.3)',              // Accent glow
}
```

### Elevation Hierarchy

1. **Page background**: No shadow (neutral-50)
2. **Cards**: shadow (default)
3. **Hover cards**: shadow-md
4. **Dropdowns/popovers**: shadow-lg
5. **Modals/dialogs**: shadow-xl or shadow-2xl
6. **Insight cards**: shadow-md + glow (signature)

## Border Radius

```typescript
borderRadius: {
  none: '0',
  sm: '0.125rem',   // 2px - Tight corners
  DEFAULT: '0.25rem', // 4px - Buttons, inputs
  md: '0.375rem',   // 6px - Cards
  lg: '0.5rem',     // 8px - Large cards
  xl: '0.75rem',    // 12px - Modals
  '2xl': '1rem',    // 16px - Hero elements
  '3xl': '1.5rem',  // 24px - Large features
  full: '9999px',   // Pills, avatars
}
```

## Core Components

### Button

**Variants:**

1. **Primary**: Solid primary-600 background, white text, shadow
2. **Secondary**: Outline primary-600 border, primary-600 text, transparent background
3. **Ghost**: No border, primary-600 text, hover background primary-50
4. **Destructive**: Solid error-600 background, white text
5. **Success**: Solid success-600 background, white text

**Sizes:**
- **sm**: py-1.5 px-3, text-sm
- **md** (default): py-2 px-4, text-base
- **lg**: py-3 px-6, text-lg

**States:**
- **Hover**: Darker shade (e.g., primary-600 → primary-700)
- **Active**: Even darker (primary-700 → primary-800)
- **Disabled**: opacity-50, cursor-not-allowed
- **Loading**: Spinner + disabled state

### Input

**Variants:**
- **Default**: border neutral-300, focus:ring-2 primary-500
- **Error**: border error-500, focus:ring-2 error-500
- **Success**: border success-500, focus:ring-2 success-500
- **Disabled**: bg-neutral-100, cursor-not-allowed

**Sizes:**
- **sm**: py-1.5 px-3, text-sm
- **md** (default): py-2 px-3, text-base
- **lg**: py-3 px-4, text-lg

### Card

**Structure:**
- Background: white (neutral-50 for nested)
- Border: 1px solid neutral-200 (optional)
- Shadow: shadow (default) or shadow-md
- Padding: p-4 (compact), p-6 (default), p-8 (spacious)
- Border radius: rounded-lg

**Variants:**
- **Default**: white bg, shadow
- **Bordered**: white bg, border, no shadow
- **Elevated**: white bg, shadow-md
- **Insight** (signature): white bg, shadow-md, border-2 gradient (primary to accent), glow effect

### Alert

**Variants by severity:**

1. **Info**: bg-primary-50, border-primary-200, text-primary-800, icon primary-600
2. **Success**: bg-success-50, border-success-200, text-success-800, icon success-600
3. **Warning**: bg-warning-50, border-warning-200, text-warning-800, icon warning-600
4. **Error**: bg-error-50, border-error-200, text-error-800, icon error-600

**Structure:**
- Border left: 4px solid (color-600)
- Padding: p-4
- Icon on right (RTL), text on left
- Optional dismiss button

### Loading Spinner

**Sizes:**
- **sm**: 16px
- **md**: 24px
- **lg**: 32px
- **xl**: 48px

**Colors:**
- Primary-600 (default)
- White (on colored backgrounds)
- Current color (inherits from parent)

## Layout Components

### Header / Navigation

**Desktop:**
- Height: 64px
- Background: white
- Border bottom: 1px solid neutral-200
- Shadow: shadow-sm
- Padding: px-6

**Mobile:**
- Height: 56px
- Fixed position
- Z-index: 50

**Navigation items:**
- Text: neutral-600
- Hover: primary-600
- Active: primary-700, font-semibold

### Main Container

- Max width: 7xl (1280px)
- Padding: px-4 sm:px-6 lg:px-8
- Margin: mx-auto
- Background: neutral-50

### Page Wrapper

- Min height: 100vh
- Background: neutral-50
- Display: flex, flex-col

### Dashboard Grid

- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Gap: gap-6
- Auto rows: auto-rows-fr (equal height cards)

## Interaction Patterns

### Loading States

1. **Skeleton loaders**: Use neutral-200 background with animated pulse
2. **Spinners**: For buttons and small components
3. **Progress bars**: For long-running operations (analysis)
4. **Shimmer effect**: For data tables and lists

### Error Handling

1. **Inline validation**: Below input, text-sm, text-error-600
2. **Alert banners**: Top of form or page, dismissible
3. **Toast notifications**: Fixed position, auto-dismiss after 5s
4. **Empty states**: Illustration + message + CTA

### Async Flows (Analysis)

1. **Initiate**: Button → loading state
2. **Processing**: Modal or card with progress indicator
3. **Streaming results**: Real-time text display with typing effect
4. **Complete**: Success alert + show full results
5. **Error**: Error alert + retry option

### Confirmation Dialogs

- Modal overlay: bg-black/50
- Modal card: white, shadow-2xl, max-w-md
- Title: text-lg, font-semibold
- Description: text-neutral-600
- Actions: Cancel (secondary) + Confirm (primary/destructive)

## Responsive Breakpoints

```typescript
screens: {
  sm: '640px',   // Mobile landscape, small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large screens
}
```

### Responsive Strategy

- **Mobile first**: Design for 375px width minimum
- **Tablet (768px+)**: 2-column layouts, expanded navigation
- **Desktop (1024px+)**: 3-column layouts, full dashboards
- **Large (1280px+)**: Maximum content width, side panels

## RTL (Hebrew) Support

### Typography

- Font: Rubik or Assistant for Hebrew text
- Line height: Slightly increased (1.6 vs 1.5) for Hebrew readability
- Letter spacing: default (no additional spacing needed)

### Layout Adjustments

- `dir="rtl"` on html element
- Padding/margin: Use logical properties where possible
  - `ps` (padding-start) instead of `pl` (padding-left)
  - `me` (margin-end) instead of `mr` (margin-right)
- Icons: Flip directional icons (arrows, chevrons)
- Forms: Labels on right, inputs full width
- Navigation: Right to left order

### Component RTL Considerations

- **Alerts**: Icon on right, text on left
- **Breadcrumbs**: Separator flipped (< instead of >)
- **Dropdowns**: Align to right edge
- **Tables**: Headers and data right-aligned for Hebrew

## Accessibility

### Contrast Ratios

All text meets WCAG AA standards:
- Normal text (16px+): 4.5:1 minimum
- Large text (24px+): 3:1 minimum
- UI components: 3:1 minimum

### Focus States

- **Visible focus ring**: ring-2 ring-primary-500 ring-offset-2
- **Keyboard navigation**: Logical tab order, skip links
- **Focus within**: Highlight parent containers when child focused

### ARIA Labels

- **Buttons**: Descriptive labels, not just icons
- **Forms**: Proper label associations, error announcements
- **Dynamic content**: aria-live regions for updates
- **Modals**: aria-modal, aria-labelledby, focus trap

### Screen Reader Support

- Semantic HTML (nav, main, aside, article)
- Proper heading hierarchy (h1 → h6)
- Alt text for images and icons
- Hidden text for icon-only buttons (sr-only class)

## Quality Gates

Before marking any design work as "complete":

1. **Anti-Generic Check**: Does this look like any other SaaS dashboard? If yes → redesign
2. **Brand Consistency**: Are signature traits present (warm palette, soft shadows, insight glow)?
3. **Accessibility**: Do all interactive elements meet WCAG AA?
4. **Responsive**: Does it work on 375px mobile and 1920px desktop?
5. **RTL Ready**: Does Hebrew text display correctly with proper alignment?
6. **Implementation Ready**: Can a developer build this without guessing?

## Design System Evolution

This is version 1.0 of the design system. As the product evolves:

- **Color adjustments**: May refine accent colors based on user feedback
- **Component additions**: Data visualization, charts, timeline components
- **Dark mode**: Future consideration for after-hours teacher usage
- **Print styles**: For parent reports and documentation
- **Whitelabel**: School branding customization options

All changes must maintain the core brand identity and signature traits.
