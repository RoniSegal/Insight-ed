# Design System Quick Start Guide

Get up and running with the Growth Engine design system in 5 minutes.

## Installation

The design system is already configured in the frontend package. You just need to install the dependencies:

```bash
cd packages/frontend
npm install
```

This will install:

- `class-variance-authority` - Component variants
- `clsx` - Conditional classes
- `tailwind-merge` - Merge Tailwind classes

## Basic Usage

### Import Components

```tsx
import { Button, Input, Card, Alert } from '@/components/ui';
import { Header, PageContainer, PageHeader } from '@/components/layout';
```

### Use Design Tokens

All Tailwind classes use our custom tokens:

```tsx
// Colors
<div className="bg-primary-50 text-primary-600">Primary colors</div>
<div className="bg-success-500 text-white">Success</div>
<div className="bg-error-50 text-error-700">Error</div>

// Typography
<h1 className="text-4xl font-bold">Heading 1</h1>
<p className="text-base text-neutral-600">Body text</p>
<span className="font-mono text-sm">12,345</span>

// Spacing (4px grid)
<div className="p-6 space-y-4">
  <div className="mb-8">Section</div>
</div>

// Shadows
<div className="shadow">Default card</div>
<div className="shadow-md">Elevated card</div>
<div className="shadow-glow">Glowing element</div>
```

## Common Patterns

### Page Layout

```tsx
export default function MyPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <PageHeader title="כותרת העמוד" description="תיאור העמוד" action={<Button>פעולה</Button>} />

        {/* Your content here */}
      </PageContainer>
    </>
  );
}
```

### Form

```tsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [errors, setErrors] = useState({});

return (
  <form className="space-y-6 max-w-lg">
    <Input
      label="שם מלא"
      value={name}
      onChange={(e) => setName(e.target.value)}
      error={errors.name}
    />

    <Input
      label="אימייל"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={errors.email}
    />

    <Button type="submit" fullWidth>
      שמור
    </Button>
  </form>
);
```

### Dashboard Grid

```tsx
import { DashboardGrid } from '@/components/layout';
import { Card } from '@/components/ui';

export default function Dashboard() {
  return (
    <DashboardGrid columns={{ default: 1, md: 2, lg: 3 }}>
      <Card>
        <div className="text-4xl font-bold text-primary-600 font-mono">142</div>
        <div className="text-neutral-600">תלמידים</div>
      </Card>

      <Card>
        <div className="text-4xl font-bold text-success-600 font-mono">87%</div>
        <div className="text-neutral-600">שיעור השלמה</div>
      </Card>

      <Card variant="insight">
        <h3 className="font-semibold mb-2">תובנה חשובה</h3>
        <p className="text-sm text-neutral-600">השיפור במתמטיקה יוצא דופן השבוע!</p>
      </Card>
    </DashboardGrid>
  );
}
```

### Loading States

```tsx
import { LoadingContent, Spinner } from '@/components/ui';

// Full content area loading
if (isLoading) {
  return <LoadingContent message="טוען נתונים..." />;
}

// Inline spinner
<Spinner size="sm" />

// Button loading state
<Button loading>שומר...</Button>
```

### Alerts

```tsx
import { Alert } from '@/components/ui';

// Success
<Alert variant="success" title="הצלחה!">
  הנתונים נשמרו בהצלחה.
</Alert>

// Error
<Alert variant="error" title="שגיאה">
  לא ניתן לשמור. אנא נסה שנית.
</Alert>

// Dismissible
<Alert
  variant="warning"
  dismissible
  onDismiss={() => setWarning(null)}
>
  יש תלמידים ללא ניתוח עדכני.
</Alert>
```

## Color Reference (Quick)

```tsx
// Primary - Blue (main actions, links)
(primary - 50) | (primary - 500) | (primary - 600) | (primary - 700);

// Success - Green (positive, completed)
(success - 50) | (success - 500) | (success - 600);

// Error - Red (errors, destructive actions)
(error - 50) | (error - 500) | (error - 600);

// Warning - Orange (needs attention)
(warning - 50) | (warning - 500) | (warning - 600);

// Accent - Amber (highlights, insights)
(accent - 50) | (accent - 500) | (accent - 600);

// Neutral - Gray (text, backgrounds, borders)
(neutral - 50) |
  (neutral - 100) |
  (neutral - 200) |
  (neutral - 500) |
  (neutral - 600) |
  (neutral - 700);
```

## Typography Scale

```tsx
text-xs    // 12px - Captions, labels
text-sm    // 14px - Small body, table text
text-base  // 16px - Body text (default)
text-lg    // 18px - Large body, subtitles
text-xl    // 20px - H4
text-2xl   // 24px - H3
text-3xl   // 30px - H2
text-4xl   // 36px - H1
text-5xl   // 48px - Display
```

## Font Families

```tsx
font - sans; // Inter - UI text (default)
font - hebrew; // Rubik - Hebrew text (auto-applied in RTL)
font - mono; // JetBrains Mono - Numbers, data, code
```

## Spacing (4px grid)

```tsx
p - 1; // 4px
p - 2; // 8px
p - 3; // 12px
p - 4; // 16px
p - 6; // 24px
p - 8; // 32px
p - 12; // 48px

gap - 4; // 16px gap in flex/grid
space - y - 6; // 24px vertical spacing between children
```

## Component Variants Quick Reference

### Button

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Approve</Button>

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

### Card

```tsx
<Card>Default</Card>
<Card variant="bordered">Bordered</Card>
<Card variant="elevated">Elevated</Card>
<Card variant="insight">Insight (signature glow)</Card>

<Card padding="compact">Compact padding</Card>
<Card padding="default">Default padding</Card>
<Card padding="spacious">Spacious padding</Card>
```

### Input

```tsx
<Input label="Label" />
<Input error="Error message" />
<Input helperText="Helper text" />
<Input leftIcon={<Icon />} />
<Input disabled />
```

## RTL Support

All components automatically support RTL when `dir="rtl"` is set on `<html>`:

```tsx
// Automatic in layout.tsx
<html lang="he" dir="rtl">
```

Key RTL considerations:

- Use `space-x-reverse` for horizontal spacing
- Use `ms-*` (margin-start) instead of `ml-*` (margin-left)
- Use `me-*` (margin-end) instead of `mr-*` (margin-right)
- Icons automatically flip where needed

## Utility Functions

```tsx
import { cn, formatDate, getInitials } from '@/lib/utils';

// Merge classes
const classes = cn('base-class', isActive && 'active-class', className);

// Format dates
formatDate(new Date(), 'short'); // "31/12/2025"
formatDate(new Date(), 'long'); // "יום שלישי, 31 בדצמבר 2025"

// Get initials
getInitials('דוד כהן'); // "דכ"
```

## Responsive Breakpoints

```tsx
// Mobile first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  // 1 column on mobile, 2 on tablet, 3 on desktop
</div>

// Breakpoints:
sm:   // 640px+
md:   // 768px+
lg:   // 1024px+
xl:   // 1280px+
2xl:  // 1536px+
```

## Accessibility Checklist

When building components:

- [ ] Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- [ ] Add ARIA labels where needed
- [ ] Ensure keyboard navigation works
- [ ] Test focus states (visible ring)
- [ ] Verify color contrast (text on backgrounds)
- [ ] Add alt text to images
- [ ] Use proper heading hierarchy (h1 → h6)

## View the Design System

Open `/design/prototypes/design-system-showcase.html` in your browser to see:

- All colors with shades
- Typography examples
- All component variants
- Interactive examples

## Full Documentation

- **Design System**: `/design/DESIGN_SYSTEM.md` - Complete visual identity and tokens
- **Components**: `/design/COMPONENTS.md` - All components with examples and patterns
- **This Guide**: `/design/QUICK_START.md` - You are here!

## Common Mistakes to Avoid

1. Don't use raw Tailwind colors (e.g., `bg-blue-500`) - use tokens (`bg-primary-500`)
2. Don't use `ml-*` or `mr-*` in RTL - use `ms-*` and `me-*`
3. Don't create custom buttons - use the `<Button>` component
4. Don't skip the `label` prop on inputs - accessibility requirement
5. Don't use `className` to override core component styles - use variants instead

## Need Help?

1. Check `/design/COMPONENTS.md` for detailed examples
2. View `/design/prototypes/design-system-showcase.html` for visual reference
3. Look at existing pages in `/packages/frontend/src/app` for patterns
4. Read component source code in `/packages/frontend/src/components/ui`

Happy building!
