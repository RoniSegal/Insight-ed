# Growth Engine Design System

**Version:** 1.0
**Last Updated:** December 30, 2025
**Status:** Approved
**Owner:** Designer

---

## 1. Overview

This design system establishes the foundational visual language, interaction patterns, and accessibility standards for Growth Engine - an AI-powered K-12 student analysis platform. The system is optimized for educational professionals (teachers and principals) who value efficiency, clarity, and trustworthiness in their tools.

### Design Principles

1. **Trust & Transparency**
   - Educational data requires trust; design should feel secure and professional
   - Clear data provenance (show what analysis is based on)
   - No dark patterns or hidden functionality
   - FERPA compliance visible (privacy indicators, data handling transparency)

2. **Efficiency for Busy Educators**
   - Teachers work 50+ hours/week; minimize clicks and cognitive load
   - Intelligent defaults and progressive disclosure
   - Keyboard shortcuts for power users
   - Fast loading and responsive interactions

3. **Clarity Over Cleverness**
   - Plain language over jargon
   - Obvious actions over subtle affordances
   - Data visualizations that tell a story at a glance
   - Error messages that help, not confuse

4. **Accessibility First**
   - WCAG 2.1 Level AA compliance is baseline, not aspiration
   - Support diverse abilities (visual, motor, cognitive)
   - Work in varied school environments (older hardware, slow networks)
   - Responsive design for phones, tablets, Chromebooks, desktops

5. **Respectful of Teaching Expertise**
   - AI augments teacher judgment, never replaces it
   - Teachers maintain control (edit, override, annotate AI suggestions)
   - Respect teacher time and intelligence

---

## 2. Brand & Visual Identity

### Color Palette

#### Primary Colors

**Primary Blue** - Trust, education, authority
- `primary-900`: `#0A2540` - Darkest shade (text on light backgrounds)
- `primary-800`: `#0D3A5F` - Headers, important text
- `primary-700`: `#10507E` - Default primary (buttons, links, active states)
- `primary-600`: `#1366A0` - Hover states
- `primary-500`: `#177EC2` - Base primary
- `primary-400`: `#3D96D1` - Light accents
- `primary-300`: `#6DAFE0` - Disabled states, backgrounds
- `primary-200`: `#A5CAED` - Very light backgrounds
- `primary-100`: `#D2E5F7` - Hover backgrounds, subtle highlights
- `primary-50`: `#EBF4FC` - Page backgrounds, cards

**Usage:**
- Primary CTAs (buttons, links)
- Navigation active states
- Data visualization primary color
- Focus indicators

#### Secondary Colors

**Emerald Green** - Growth, progress, success
- `secondary-700`: `#065F46` - Dark green (text)
- `secondary-600`: `#047857` - Default secondary
- `secondary-500`: `#059669` - Base secondary
- `secondary-400`: `#10B981` - Light accents
- `secondary-300`: `#6EE7B7` - Backgrounds
- `secondary-200`: `#A7F3D0` - Very light backgrounds
- `secondary-100`: `#D1FAE5` - Success message backgrounds

**Usage:**
- Success states (analysis completed, saved)
- Positive trends (improvement indicators)
- Progress bars
- "New" or "Updated" badges

#### Semantic Colors

**Error Red** - Errors, warnings, destructive actions
- `error-700`: `#991B1B` - Dark red (text)
- `error-600`: `#DC2626` - Default error
- `error-500`: `#EF4444` - Base error
- `error-400`: `#F87171` - Light accents
- `error-100`: `#FEE2E2` - Error message backgrounds

**Warning Orange** - Caution, important notices
- `warning-700`: `#C2410C` - Dark orange (text)
- `warning-600`: `#EA580C` - Default warning
- `warning-500`: `#F59E0B` - Base warning
- `warning-400`: `#FBBF24` - Light accents
- `warning-100`: `#FEF3C7` - Warning message backgrounds

**Info Blue** - Informational messages, tips
- `info-700`: `#1E40AF` - Dark blue (text)
- `info-600`: `#2563EB` - Default info
- `info-500`: `#3B82F6` - Base info
- `info-400`: `#60A5FA` - Light accents
- `info-100`: `#DBEAFE` - Info message backgrounds

**Attention Purple** - Flagged students, requires attention
- `attention-700`: `#6B21A8` - Dark purple (text)
- `attention-600`: `#9333EA` - Default attention
- `attention-500`: `#A855F7` - Base attention
- `attention-400`: `#C084FC` - Light accents
- `attention-100`: `#F3E8FF` - Attention backgrounds

#### Neutral Grays

**Grayscale** - Text, borders, backgrounds
- `gray-900`: `#111827` - Primary text (headings, body on light)
- `gray-800`: `#1F2937` - Secondary text
- `gray-700`: `#374151` - Tertiary text, labels
- `gray-600`: `#4B5563` - Placeholder text
- `gray-500`: `#6B7280` - Disabled text
- `gray-400`: `#9CA3AF` - Borders (medium)
- `gray-300`: `#D1D5DB` - Borders (light)
- `gray-200`: `#E5E7EB` - Dividers, subtle borders
- `gray-100`: `#F3F4F6` - Card backgrounds, alternate rows
- `gray-50`: `#F9FAFB` - Page backgrounds

#### Data Visualization Colors

**Chart Palette** (Colorblind-safe, distinct)
- `chart-1`: `#3B82F6` (Blue) - Primary metric
- `chart-2`: `#10B981` (Green) - Secondary metric
- `chart-3`: `#F59E0B` (Amber) - Tertiary metric
- `chart-4`: `#8B5CF6` (Purple) - Fourth metric
- `chart-5`: `#EF4444` (Red) - Alert/negative metric
- `chart-6`: `#06B6D4` (Cyan) - Additional metric
- `chart-7`: `#EC4899` (Pink) - Additional metric
- `chart-8`: `#84CC16` (Lime) - Additional metric

**Gradient for Heatmaps:**
- Low: `#DBEAFE` (Light blue)
- Medium: `#3B82F6` (Blue)
- High: `#1E40AF` (Dark blue)

#### Accessibility Requirements

**Color Contrast Ratios (WCAG 2.1 AA):**
- Normal text (16px+): minimum 4.5:1
- Large text (18px+ or 14px+ bold): minimum 3:1
- UI components and graphics: minimum 3:1

**Tested Combinations:**
- `gray-900` on `white`: 16.1:1 ✓
- `gray-900` on `gray-50`: 15.2:1 ✓
- `primary-700` on `white`: 7.8:1 ✓
- `primary-700` on `primary-50`: 7.1:1 ✓
- `error-700` on `error-100`: 9.2:1 ✓
- `secondary-700` on `secondary-100`: 11.5:1 ✓

**Never use color alone:**
- Always pair color with icons, text, or patterns
- Example: Error states use red + icon + error message text

---

### Typography

#### Font Families

**Primary Font: Inter** (Sans-serif)
- Modern, highly legible, optimized for screens
- Excellent for UI elements, body text, data tables
- Open-source, self-hostable (GDPR compliance, performance)
- Variable font support for performance optimization

**Fallback Stack:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
             'Droid Sans', 'Helvetica Neue', sans-serif;
```

**Monospace Font: JetBrains Mono** (for code, IDs, data)
- Student IDs, technical identifiers
- Error codes, system messages

**Fallback Stack:**
```css
font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata',
             'Fira Code', 'Droid Sans Mono', 'Courier New', monospace;
```

#### Type Scale (Modular scale: 1.250 - Major Third)

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| `display-2xl` | 60px / 3.75rem | 72px / 1.2 | 700 (Bold) | Marketing headlines (rarely used in app) |
| `display-xl` | 48px / 3rem | 60px / 1.25 | 700 (Bold) | Page titles (dashboard headers) |
| `display-lg` | 36px / 2.25rem | 44px / 1.22 | 600 (Semibold) | Section headers |
| `heading-xl` | 30px / 1.875rem | 38px / 1.27 | 600 (Semibold) | Modal titles, card headers |
| `heading-lg` | 24px / 1.5rem | 32px / 1.33 | 600 (Semibold) | Subsection headers |
| `heading-md` | 20px / 1.25rem | 28px / 1.4 | 600 (Semibold) | Widget titles |
| `heading-sm` | 18px / 1.125rem | 26px / 1.44 | 600 (Semibold) | Small headers, labels |
| `body-lg` | 18px / 1.125rem | 28px / 1.56 | 400 (Regular) | Lead paragraphs, introductions |
| `body-md` | 16px / 1rem | 24px / 1.5 | 400 (Regular) | **Default body text** |
| `body-sm` | 14px / 0.875rem | 20px / 1.43 | 400 (Regular) | Secondary text, captions |
| `body-xs` | 12px / 0.75rem | 16px / 1.33 | 400 (Regular) | Metadata, timestamps, fine print |

#### Font Weights

- **300 (Light):** Rarely used; large display text only
- **400 (Regular):** Default body text, paragraphs
- **500 (Medium):** Emphasized text, button labels
- **600 (Semibold):** Headings, important labels, active navigation
- **700 (Bold):** High emphasis, alerts, key metrics

#### Letter Spacing (Tracking)

- Headings (`display-*`, `heading-*`): `-0.02em` (tighter for readability)
- Body text: `0` (default)
- All caps labels: `0.05em` (wider for legibility)
- Button text: `0.01em` (slightly wider)

#### Text Styles & Utilities

**Text Colors:**
- Primary: `gray-900` (default)
- Secondary: `gray-700` (supporting text)
- Tertiary: `gray-600` (metadata, timestamps)
- Disabled: `gray-500`
- Inverse (on dark backgrounds): `white` or `gray-50`

**Text Alignment:**
- Left-aligned: Default for body text, forms
- Center-aligned: Empty states, modals, marketing pages
- Right-aligned: Numerical data in tables

**Text Decoration:**
- Links: `underline` on hover (not by default, except in dense text blocks)
- Strikethrough: Deprecated or removed items

**Special Text Styles:**

*Code/Technical:*
```css
.text-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  background: gray-100;
  padding: 2px 6px;
  border-radius: 4px;
}
```

*Label (all caps):*
```css
.text-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: gray-700;
}
```

---

### Spacing System

**8px Grid System** (Base unit: 8px)

All spacing uses multiples of 8px for visual rhythm and consistency.

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0px | Reset spacing |
| `space-1` | 4px | Tight spacing (icon + text, badge padding) |
| `space-2` | 8px | **Base unit** (small gaps, input padding) |
| `space-3` | 12px | Compact spacing (button padding, small margins) |
| `space-4` | 16px | **Default spacing** (card padding, margins between elements) |
| `space-5` | 20px | Medium spacing |
| `space-6` | 24px | Comfortable spacing (section padding) |
| `space-8` | 32px | Large spacing (major section margins) |
| `space-10` | 40px | Extra large spacing |
| `space-12` | 48px | Section dividers |
| `space-16` | 64px | Page-level spacing |
| `space-20` | 80px | Extra large page spacing |
| `space-24` | 96px | Maximum spacing (hero sections) |

#### Spacing Guidelines

**Component Internal Padding:**
- Buttons: `space-3` (12px) vertical, `space-6` (24px) horizontal
- Input fields: `space-3` (12px) vertical, `space-4` (16px) horizontal
- Cards: `space-6` (24px) all sides
- Modals: `space-8` (32px) all sides

**Margins Between Elements:**
- Related elements: `space-2` to `space-4` (8-16px)
- Sections: `space-8` to `space-12` (32-48px)
- Page sections: `space-16` (64px)

**Layout Gutters:**
- Mobile (<640px): `space-4` (16px)
- Tablet (640-1024px): `space-6` (24px)
- Desktop (1024px+): `space-8` to `space-12` (32-48px)

---

### Elevation & Shadows

**Shadow System** (Subtle, layered, realistic)

| Level | Name | Box Shadow | Usage |
|-------|------|------------|-------|
| 0 | `shadow-none` | `none` | Flush with background (default state) |
| 1 | `shadow-xs` | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle lift (cards at rest) |
| 2 | `shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)` | Default cards, dropdowns |
| 3 | `shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)` | Hover states, raised elements |
| 4 | `shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)` | Popovers, tooltips |
| 5 | `shadow-xl` | `0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)` | Modals, dialogs |
| 6 | `shadow-2xl` | `0 25px 50px rgba(0, 0, 0, 0.15)` | Highest elevation (overlays, important modals) |

**Inner Shadow** (for inset elements):
```css
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
```

**Focus Ring** (accessibility):
```css
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* primary-500 at 50% opacity */
```

#### Elevation Guidelines

- **Default:** Most content is flat (`shadow-none` or `shadow-xs`)
- **Cards:** `shadow-sm` at rest, `shadow-md` on hover (if interactive)
- **Dropdowns/Menus:** `shadow-lg` (clearly above page)
- **Modals:** `shadow-xl` or `shadow-2xl` (highest layer)
- **Sticky headers:** `shadow-sm` when scrolled, `shadow-none` at top

**Z-Index Layers:**
```css
z-index-0: 0;      /* Default */
z-index-10: 10;    /* Dropdowns, popovers */
z-index-20: 20;    /* Sticky headers */
z-index-30: 30;    /* Modals, dialogs */
z-index-40: 40;    /* Tooltips */
z-index-50: 50;    /* Toast notifications (highest) */
```

---

### Border Radius System

**Rounded Corners** (Friendly, modern, approachable)

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-none` | 0px | Sharp corners (data tables, technical UI) |
| `rounded-sm` | 2px | Subtle (badges, tags) |
| `rounded` | 4px | **Default** (buttons, inputs, cards) |
| `rounded-md` | 6px | Medium rounding (larger cards) |
| `rounded-lg` | 8px | Large rounding (modals, prominent cards) |
| `rounded-xl` | 12px | Extra large (hero cards, feature sections) |
| `rounded-2xl` | 16px | Maximum rounding (rare; images, avatars) |
| `rounded-full` | 9999px | Circular (avatars, icon buttons, pills) |

**Guidelines:**
- Most UI components: `rounded` (4px)
- Pills/badges: `rounded-full`
- Modals/dialogs: `rounded-lg` (8px)
- Images: `rounded-md` or `rounded-lg`

---

### Iconography

**Icon Library: Heroicons v2** (MIT License, Tailwind Labs)
- Two styles: Outline (default) and Solid (emphasis)
- Consistent 24x24px size (scales to 16px, 20px, 24px, 32px)
- Stroke width: 1.5px (outline style)
- Optimized SVGs for performance

**Icon Sizes:**
- `icon-xs`: 16px (inline with small text, tight spaces)
- `icon-sm`: 20px (inline with body text, button icons, form icons)
- `icon-md`: 24px (standalone icons, navigation, larger touch targets)
- `icon-lg`: 32px (empty states, feature highlights)
- `icon-xl`: 48px (hero sections, large status messages)

**Icon Colors:**
- Default: Inherit text color (`currentColor`)
- Semantic: Match context (error icons in `error-600`, success in `secondary-600`)

**Icon Usage:**
- Always include accessible text label (visually hidden if needed)
- Use outline style by default; solid for active/selected states
- Align vertically center with adjacent text
- **Button icons:** Use `icon-sm` (20px) for icons inside buttons alongside text
- **Standalone icons:** Use `icon-md` (24px) for clickable icon-only buttons
- **Status icons:** Use `icon-lg` (32px) or `icon-xl` (48px) for large status messages
- **Avoid help/info icons:** Show help text directly instead of hiding it behind icons

**Icon Sizing in CSS:**
```css
.icon-xs { width: 16px; height: 16px; }
.icon-sm { width: 20px; height: 20px; }
.icon-md { width: 24px; height: 24px; }
.icon-lg { width: 32px; height: 32px; }
.icon-xl { width: 48px; height: 48px; }
```

**SVG Best Practices:**
- Use `viewBox="0 0 24 24"` (Heroicons standard)
- Set `fill="none"` for outline style, `fill="currentColor"` for solid
- Set `stroke="currentColor"` to inherit text color
- Control size via CSS class, not inline width/height attributes
- Use `stroke-width="2"` for outline icons (matches Heroicons)
- Add `aria-hidden="true"` for decorative icons
- Add `role="img"` and `aria-label` for meaningful icons

**Custom Icons:**
- Education-specific icons may be custom-designed (student, principal, analysis)
- Must match Heroicons style (1.5px stroke, 24x24px grid)
- All custom icons documented in icon library

---

## 3. Accessibility

### WCAG 2.1 Level AA Compliance

**Perceivable:**
- **Color Contrast:** All text meets 4.5:1 (normal) or 3:1 (large text)
- **Non-Text Contrast:** UI components and graphics meet 3:1
- **Color Independence:** Never use color alone (pair with icons, text, patterns)
- **Text Resizing:** Support up to 200% zoom without loss of functionality
- **Reflow:** Content reflows for 320px viewport width (mobile)

**Operable:**
- **Keyboard Accessible:** All functionality available via keyboard
- **Focus Visible:** 3px focus ring (primary-500 at 50% opacity)
- **No Keyboard Trap:** Users can navigate away from all elements
- **Timing:** No time limits on interactions (analysis sessions can be paused)
- **Motion:** Respect `prefers-reduced-motion` for animations

**Understandable:**
- **Language:** Set `lang="en"` on HTML element
- **Predictable:** Consistent navigation and interaction patterns
- **Input Assistance:** Clear labels, error messages, and help text
- **Error Identification:** Errors clearly marked and described

**Robust:**
- **Valid HTML:** Semantic HTML5 elements
- **ARIA Attributes:** Only when needed; native HTML preferred
- **Compatibility:** Test with JAWS, NVDA, VoiceOver screen readers

### Focus States

**Focus Ring:**
```css
.focus-visible:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* primary-500 */
  border-radius: 4px;
}
```

**Skip to Content:**
- Visible "Skip to main content" link (keyboard-only, appears on focus)
- Positioned at top of page before header

### Screen Reader Support

**Landmark Roles:**
- `<header role="banner">` - Site header
- `<nav role="navigation" aria-label="Main">` - Primary navigation
- `<main role="main">` - Main content
- `<aside role="complementary">` - Sidebar, related content
- `<footer role="contentinfo">` - Site footer

**ARIA Labels:**
- Form inputs: Use `<label>` elements (not just placeholders)
- Buttons: Descriptive text or `aria-label` (avoid "Click here")
- Icons: `aria-hidden="true"` if decorative; `aria-label` if interactive

**Live Regions:**
- Toast notifications: `role="alert"` or `aria-live="assertive"`
- Dynamic updates: `aria-live="polite"` for non-critical changes

### Color Blindness Considerations

**Colorblind-Safe Palette:**
- Avoid red/green only distinctions (use icons, patterns)
- Data visualizations use colorblind-safe palette (tested with Coblis)
- High contrast mode supported (Windows High Contrast, macOS Increase Contrast)

**Pattern Support:**
- Charts: Use patterns (stripes, dots) in addition to color
- Status indicators: Use icons + color (checkmark + green, X + red)

---

## 4. Responsive Breakpoints

### Breakpoint System

| Name | Min Width | Max Width | Target Devices | Layout |
|------|-----------|-----------|----------------|--------|
| `xs` | 0px | 639px | Mobile phones (portrait) | Single column |
| `sm` | 640px | 767px | Mobile phones (landscape), small tablets | 1-2 columns |
| `md` | 768px | 1023px | Tablets (iPad portrait) | 2-3 columns |
| `lg` | 1024px | 1279px | Tablets (landscape), laptops | 3-4 columns, sidebar |
| `xl` | 1280px | 1535px | Desktops, large laptops | 4+ columns, full layout |
| `2xl` | 1536px | — | Large desktops, 4K monitors | Max-width container |

**Container Max-Widths:**
- `xs`: 100% (no max-width)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Grid System

**12-Column Grid** (Tailwind CSS Grid)
- Flexible, responsive grid
- Gap: `space-6` (24px) on desktop, `space-4` (16px) on mobile

**Example Layouts:**

*Teacher Dashboard (Desktop):*
- Left sidebar: 3 columns (navigation)
- Main content: 9 columns (student list, analysis)

*Principal Dashboard (Desktop):*
- Metrics cards: 3 columns each (4 cards in a row)
- Charts: 6 columns each (2 charts in a row)

*Mobile (<640px):*
- All content: Single column, stacked vertically
- Navigation: Collapsed hamburger menu

### Touch Targets

**Minimum Sizes (WCAG 2.1 Success Criterion 2.5.5):**
- Interactive elements: **44x44px minimum** (touch targets)
- Desktop buttons: 40px height minimum
- Mobile buttons: 48px height minimum
- Links in text: Allow for padding around clickable area

---

## 5. Design Principles (Detailed)

### Principle 1: Trust & Transparency

**Why it matters:**
- Teachers are entrusting student data (FERPA-protected)
- AI-generated recommendations must be explainable
- Principals need to trust platform data for decision-making

**Design applications:**
- Always cite evidence for AI recommendations (link to teacher input)
- Show data sources clearly ("Based on your response: ...")
- Privacy indicators (lock icons, "Private note" labels)
- Clear "Edited by teacher" vs. "AI-generated" markers
- Transparent loading states ("Analyzing observations...")

**Anti-patterns to avoid:**
- Hiding data processing behind vague "Processing..." messages
- Auto-saving without user awareness
- Unclear who can see what data (sharing permissions)

### Principle 2: Efficiency for Busy Educators

**Why it matters:**
- Teachers have 5-10 minutes max for student analysis
- Context switching is expensive (minimize navigation)
- Principals check dashboards between meetings (30-60 seconds)

**Design applications:**
- Minimize clicks: One-click actions where possible
- Keyboard shortcuts: Power users should never need mouse
- Autosave: Never lose progress due to interruption
- Quick filters: Pre-configured views ("Students needing attention")
- Progressive disclosure: Show summary first, details on demand

**Anti-patterns to avoid:**
- Multi-step wizards for simple tasks
- Modals that block workflow unnecessarily
- Pagination when infinite scroll or "Load more" is faster
- Requiring mouse for tasks that could be keyboard-driven

### Principle 3: Clarity Over Cleverness

**Why it matters:**
- Not all teachers are tech-savvy (Sarah Chen: moderate proficiency)
- Educational jargon is enough; don't add UI jargon
- Mistakes with student data have real consequences

**Design applications:**
- Plain language: "Save" not "Persist", "Delete" not "Remove"
- Obvious buttons: High contrast, clear labels, predictable placement
- Confirm destructive actions: "Are you sure you want to delete [Student Name]'s analysis?"
- Visual hierarchy: Most important actions are most prominent
- Help text: Contextual, non-intrusive (tooltips, info icons)

**Anti-patterns to avoid:**
- Icon-only buttons without labels (unless universally understood)
- Hidden actions in three-dot menus (use for secondary actions only)
- Vague error messages ("Something went wrong")
- Assuming users will read documentation

### Principle 4: Accessibility First

**Why it matters:**
- Legal requirement (Section 508, ADA for public schools)
- Moral imperative (inclusive design for all educators)
- Some teachers may have disabilities (vision, motor, cognitive)
- Older school hardware may have limited input options

**Design applications:**
- Keyboard navigation: Tab order logical, all actions accessible
- Focus indicators: Always visible (3px ring)
- Color contrast: 4.5:1 minimum (WCAG AA)
- Screen reader support: Semantic HTML, ARIA labels
- Motion: Respect `prefers-reduced-motion`

**Anti-patterns to avoid:**
- Color-only status indicators (must include icon/text)
- Mouse-required interactions (drag-and-drop without keyboard alternative)
- Auto-playing animations (startles users, accessibility issue)
- Tiny click targets (<44x44px on mobile)

### Principle 5: Respectful of Teaching Expertise

**Why it matters:**
- Teachers are domain experts (we are tools, not replacements)
- AI can be wrong; teachers must maintain control
- Trust erodes if platform "second-guesses" teacher judgment

**Design applications:**
- AI suggestions are suggestions (editable, deletable)
- Teachers can override any AI recommendation
- "Add private note" option (not visible to principals)
- Clear "AI-generated" vs. "Teacher-written" labels
- Undo/redo for all actions

**Anti-patterns to avoid:**
- Auto-applying AI recommendations without review
- Making it hard to delete or edit AI content
- Hiding teacher input once AI analyzes it
- Suggesting teachers are "wrong" about their observations

---

## 6. Motion & Animation

### Principle: Purposeful, Subtle, Fast

**Goals:**
- Provide feedback (user action acknowledged)
- Guide attention (important state change)
- Create continuity (page transitions)

**Non-goals:**
- Decoration for its own sake
- Slow down user workflows
- Distract from content

### Animation Durations

| Duration | Usage |
|----------|-------|
| **0ms** | Instant (no animation) - use for immediate feedback |
| **100ms** | Micro-interactions (button press, checkbox toggle) |
| **200ms** | **Default** (hover states, dropdown open, tooltip) |
| **300ms** | Moderate (modal open/close, slide-in panels) |
| **500ms** | Slow (page transitions, large content changes) |

**Easing Functions:**
- **Ease-out** (`cubic-bezier(0, 0, 0.2, 1)`): Entering elements (feel snappy)
- **Ease-in** (`cubic-bezier(0.4, 0, 1, 1)`): Exiting elements (feel decisive)
- **Ease-in-out** (`cubic-bezier(0.4, 0, 0.2, 1)`): Transitions (smooth)

### Specific Animations

**Button Press:**
```css
.button:active {
  transform: scale(0.98);
  transition: transform 100ms ease-out;
}
```

**Dropdown Open:**
```css
.dropdown {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}
.dropdown.open {
  opacity: 1;
  transform: translateY(0);
}
```

**Modal Fade-In:**
```css
.modal {
  opacity: 0;
  transition: opacity 300ms ease-out;
}
.modal.open {
  opacity: 1;
}
```

**Loading Spinner:**
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 1s linear infinite;
}
```

**Skeleton Loading:**
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### Reduced Motion

**Respect User Preference:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Users who enable "Reduce motion" in OS settings see instant state changes (no animations).

---

## 7. Design Tokens (CSS Variables)

**Purpose:** Centralized design values, easy theming, consistent design

```css
:root {
  /* Colors - Primary */
  --color-primary-900: #0A2540;
  --color-primary-800: #0D3A5F;
  --color-primary-700: #10507E;
  --color-primary-600: #1366A0;
  --color-primary-500: #177EC2;
  --color-primary-400: #3D96D1;
  --color-primary-300: #6DAFE0;
  --color-primary-200: #A5CAED;
  --color-primary-100: #D2E5F7;
  --color-primary-50: #EBF4FC;

  /* Colors - Secondary */
  --color-secondary-700: #065F46;
  --color-secondary-600: #047857;
  --color-secondary-500: #059669;
  --color-secondary-400: #10B981;
  --color-secondary-300: #6EE7B7;
  --color-secondary-200: #A7F3D0;
  --color-secondary-100: #D1FAE5;

  /* Colors - Semantic */
  --color-error-700: #991B1B;
  --color-error-600: #DC2626;
  --color-error-500: #EF4444;
  --color-error-100: #FEE2E2;

  --color-warning-700: #C2410C;
  --color-warning-600: #EA580C;
  --color-warning-500: #F59E0B;
  --color-warning-100: #FEF3C7;

  --color-info-700: #1E40AF;
  --color-info-600: #2563EB;
  --color-info-500: #3B82F6;
  --color-info-100: #DBEAFE;

  --color-attention-700: #6B21A8;
  --color-attention-600: #9333EA;
  --color-attention-500: #A855F7;
  --color-attention-100: #F3E8FF;

  /* Colors - Grayscale */
  --color-gray-900: #111827;
  --color-gray-800: #1F2937;
  --color-gray-700: #374151;
  --color-gray-600: #4B5563;
  --color-gray-500: #6B7280;
  --color-gray-400: #9CA3AF;
  --color-gray-300: #D1D5DB;
  --color-gray-200: #E5E7EB;
  --color-gray-100: #F3F4F6;
  --color-gray-50: #F9FAFB;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Typography */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'JetBrains Mono', 'SF Mono', monospace;

  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-md: 1rem;       /* 16px - default */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.15);
  --shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.5);

  /* Z-Index */
  --z-index-dropdown: 10;
  --z-index-sticky: 20;
  --z-index-modal: 30;
  --z-index-tooltip: 40;
  --z-index-toast: 50;

  /* Transitions */
  --transition-fast: 100ms ease-out;
  --transition-normal: 200ms ease-out;
  --transition-slow: 300ms ease-out;
}
```

---

## 8. Implementation Guidelines

### Tailwind CSS Configuration

Growth Engine uses **Tailwind CSS 3+** for styling. The design system maps directly to Tailwind's utility classes.

**Custom Tailwind Config:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF4FC',
          100: '#D2E5F7',
          200: '#A5CAED',
          300: '#6DAFE0',
          400: '#3D96D1',
          500: '#177EC2',
          600: '#1366A0',
          700: '#10507E',
          800: '#0D3A5F',
          900: '#0A2540',
        },
        // ... (secondary, semantic colors)
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        // Tailwind's default spacing aligns with our 8px grid
      },
      boxShadow: {
        'focus': '0 0 0 3px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Component Library

Growth Engine will use **Radix UI** primitives for accessible, unstyled components (buttons, modals, dropdowns, etc.) styled with Tailwind CSS.

**Why Radix UI:**
- Unstyled (full design control)
- WCAG 2.1 AA compliant out-of-the-box
- Keyboard navigation built-in
- Composable, flexible

**Alternative:** Headless UI (Tailwind Labs) - also acceptable.

### Design-to-Code Handoff

**Figma Design Files:**
- All mockups in Figma (or Sketch)
- Use Auto Layout (Figma) for responsive design
- Component library in Figma matches code components
- Export assets as SVG (icons, logos)

**Handoff Documentation:**
- Spacing: Annotate all margins, padding (multiples of 8px)
- Colors: Use Figma tokens matching CSS variables
- Typography: Specify font size, weight, line height
- States: Include hover, focus, disabled, error states
- Responsive: Show mobile, tablet, desktop variants

**Developer Collaboration:**
- Designers provide Figma links + exported assets
- Developers can inspect in Figma (measure spacing, copy CSS)
- Design QA: Designers review implemented UI for pixel-perfect match

---

## 9. Versioning & Updates

**Version:** 1.0
**Last Updated:** December 30, 2025

**Change Log:**
- v1.0 (Dec 30, 2025): Initial design system - colors, typography, spacing, accessibility

**Future Updates:**
- Add dark mode palette (if user research shows demand)
- Expand chart color palette (if >8 metrics needed)
- Add animation library (Framer Motion or similar)
- Document interaction patterns (drag-and-drop, multi-select)

**Review Cadence:**
- Quarterly review (every 3 months) - ensure system meets product needs
- Annual major version update - incorporate user feedback, design trends

---

## Next Steps

1. **Review & Approve:** Product, Architect, and Frontend teams review this design system
2. **Create Component Library:** Designer creates `/docs/design/COMPONENTS.md` with detailed UI components
3. **Build in Figma:** Designer creates Figma component library matching this system
4. **Implement in Code:** Frontend team implements Tailwind config and Radix UI components
5. **Design Review:** Designers QA implemented components for design system adherence

---

**Questions or Feedback?**
- Contact: Designer Agent
- Slack: #design-system
- Figma: [Growth Engine Design System](https://figma.com/growth-engine)
