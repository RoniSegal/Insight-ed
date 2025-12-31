# Growth Engine Component Library

This document describes all reusable UI components in the Growth Engine design system.

## Installation & Usage

All components are built with:
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **class-variance-authority** for variant management
- **clsx** and **tailwind-merge** for class composition

### Basic Import

```tsx
import { Button, Input, Card, Alert } from '@/components/ui';
```

---

## Core Components

### Button

A versatile button component with multiple variants and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success' | 'warning'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `loading`: boolean
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

**Examples:**

```tsx
// Primary button
<Button variant="primary" size="md">
  שמור שינויים
</Button>

// Loading state
<Button variant="primary" loading>
  שולח...
</Button>

// With icon
<Button variant="secondary" leftIcon={<PlusIcon />}>
  הוסף תלמיד
</Button>

// Destructive action
<Button variant="destructive" onClick={handleDelete}>
  מחק
</Button>
```

**Accessibility:**
- Full keyboard navigation support
- Focus ring visible on keyboard focus
- Disabled state prevents interaction
- Loading state shows spinner with sr-only label

---

### Input

Form input with label, error, and helper text support.

**Props:**
- `variant`: 'default' | 'error' | 'success'
- `size`: 'sm' | 'md' | 'lg'
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

**Examples:**

```tsx
// Basic input with label
<Input
  label="שם התלמיד"
  placeholder="הזן שם מלא"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Input with validation error
<Input
  label="אימייל"
  type="email"
  error="כתובת אימייל לא תקינה"
  value={email}
/>

// Input with icon
<Input
  label="חיפוש"
  placeholder="חפש תלמיד..."
  leftIcon={<SearchIcon />}
/>

// Input with helper text
<Input
  label="סיסמה"
  type="password"
  helperText="לפחות 8 תווים, אות גדולה ומספר"
/>
```

**RTL Considerations:**
- Icons automatically positioned correctly in RTL (left/right swap)
- Uses logical properties (start/end) instead of left/right

**Accessibility:**
- Proper label association
- Error messages announced to screen readers
- Helper text provides additional context
- Focus states clearly visible

---

### Card

Container component with multiple variants for different hierarchy levels.

**Props:**
- `variant`: 'default' | 'bordered' | 'elevated' | 'insight'
- `padding`: 'none' | 'compact' | 'default' | 'spacious'
- `as`: 'div' | 'section' | 'article'

**Sub-components:**
- `CardHeader` - Title, description, and action area
- `CardContent` - Main content area
- `CardFooter` - Footer with actions or metadata

**Examples:**

```tsx
// Basic card
<Card>
  <h3>כותרת כרטיס</h3>
  <p>תוכן הכרטיס...</p>
</Card>

// Elevated card with structure
<Card variant="elevated">
  <CardHeader
    title="סטטיסטיקות תלמיד"
    description="סיכום ביצועים חודשי"
    action={<Button size="sm">פרטים</Button>}
  />
  <CardContent>
    <p>תוכן ראשי...</p>
  </CardContent>
  <CardFooter>
    <span>עודכן: 5 דקות</span>
  </CardFooter>
</Card>

// Insight card (signature glow)
<Card variant="insight">
  <h3>תובנה חשובה</h3>
  <p>הסטודנט משתפר במהירות יוצאת דופן במתמטיקה!</p>
</Card>
```

**Visual Identity:**
- **Insight variant** uses signature gradient border + glow effect
- Creates distinctive "aha moment" visual
- Avoid overuse - reserve for truly important insights

---

### Alert

Notification component for various message types.

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `title`: string
- `dismissible`: boolean
- `onDismiss`: () => void
- `icon`: ReactNode (custom icon)

**Examples:**

```tsx
// Info alert
<Alert variant="info" title="מידע חשוב">
  המערכת תעבור תחזוקה מתוכננת ביום ראשון.
</Alert>

// Success alert
<Alert variant="success" title="נשמר בהצלחה!">
  הנתונים עודכנו במערכת.
</Alert>

// Error alert with dismiss
<Alert
  variant="error"
  title="שגיאה"
  dismissible
  onDismiss={() => setError(null)}
>
  לא ניתן לשמור. אנא נסה שנית.
</Alert>

// Warning alert
<Alert variant="warning">
  יש תלמידים ללא ניתוח עדכני.
</Alert>
```

**RTL Considerations:**
- Icon positioned on right side (start)
- Dismiss button on left side (end)
- Border accent on right side (border-s-4)

**Accessibility:**
- `role="alert"` for screen reader announcements
- Semantic color coding reinforced by icons
- Keyboard accessible dismiss button

---

### Spinner

Loading indicator with multiple sizes and colors.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'primary' | 'white' | 'current'
- `label`: string (for screen readers)

**Additional Components:**
- `LoadingPage` - Full page loading state
- `LoadingContent` - Inline content loading state

**Examples:**

```tsx
// Basic spinner
<Spinner size="md" />

// White spinner (on colored backgrounds)
<Spinner size="lg" color="white" />

// Full page loading
<LoadingPage message="טוען נתונים..." />

// Content area loading
<LoadingContent message="מחשב ניתוח..." />
```

---

## Layout Components

### Header

Top navigation bar with logo, menu, and user info.

**Features:**
- Responsive navigation
- User role-based menu items
- Logout functionality
- Brand logo with gradient

**Usage:**

```tsx
import { Header } from '@/components/layout';

<Header />
```

**RTL Support:**
- Navigation items ordered right-to-left
- User menu aligned to left
- Spacing uses space-x-reverse

---

### PageContainer

Main content wrapper with consistent padding and max-width.

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
- `className`: string

**Examples:**

```tsx
// Default container (max-w-7xl)
<PageContainer>
  <h1>תוכן העמוד</h1>
</PageContainer>

// Narrow container for forms
<PageContainer maxWidth="lg">
  <LoginForm />
</PageContainer>

// Full width
<PageContainer maxWidth="full">
  <WideTable />
</PageContainer>
```

---

### PageHeader

Page title section with optional description and action button.

**Props:**
- `title`: string
- `description`: string
- `action`: ReactNode
- `breadcrumbs`: ReactNode

**Examples:**

```tsx
<PageHeader
  title="ניהול תלמידים"
  description="צפה ונהל את כל התלמידים בכיתה שלך"
  action={<Button>הוסף תלמיד חדש</Button>}
/>
```

---

### DashboardGrid

Responsive grid layout for dashboard cards.

**Props:**
- `columns`: object with breakpoint-specific column counts

**Examples:**

```tsx
// 1 column mobile, 2 tablet, 3 desktop
<DashboardGrid columns={{ default: 1, md: 2, lg: 3 }}>
  <Card>כרטיס 1</Card>
  <Card>כרטיס 2</Card>
  <Card>כרטיס 3</Card>
</DashboardGrid>

// 2 columns at all sizes
<DashboardGrid columns={{ default: 2 }}>
  <StatCard />
  <StatCard />
</DashboardGrid>
```

---

## Utility Functions

### cn() - Class Name Utility

Merge Tailwind classes with proper precedence.

```tsx
import { cn } from '@/lib/utils';

// Conditional classes
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)} />

// Merge conflicting classes (tailwind-merge handles conflicts)
cn('px-4 py-2', 'px-6') // Result: 'px-6 py-2'
```

### formatDate()

Format dates in Hebrew locale.

```tsx
import { formatDate } from '@/lib/utils';

formatDate(new Date(), 'short'); // "31/12/2025"
formatDate(new Date(), 'long');  // "יום שלישי, 31 בדצמבר 2025"
```

### getInitials()

Extract initials for avatars.

```tsx
import { getInitials } from '@/lib/utils';

getInitials('דוד כהן'); // "דכ"
getInitials('מרים');     // "מר"
```

---

## Design Patterns

### Form Layout

```tsx
<form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
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

  <div className="flex gap-4">
    <Button type="submit" loading={isSubmitting} fullWidth>
      שמור
    </Button>
    <Button variant="secondary" onClick={onCancel} fullWidth>
      ביטול
    </Button>
  </div>
</form>
```

### Dashboard Stats Card

```tsx
<Card>
  <div className="text-4xl font-bold text-primary-600 font-mono mb-2">
    {count}
  </div>
  <div className="text-neutral-600 mb-4">
    {label}
  </div>
  <div className="flex items-center text-sm">
    <span className={cn(
      'font-semibold',
      trend > 0 ? 'text-success-600' : 'text-error-600'
    )}>
      {trend > 0 ? '+' : ''}{trend}%
    </span>
    <span className="text-neutral-500 mr-2">מהחודש שעבר</span>
  </div>
</Card>
```

### Loading State Pattern

```tsx
{isLoading ? (
  <LoadingContent message="טוען נתונים..." />
) : error ? (
  <Alert variant="error" title="שגיאה">
    {error.message}
  </Alert>
) : data.length === 0 ? (
  <EmptyState
    title="אין תלמידים"
    description="התחל על ידי הוספת תלמיד ראשון"
    action={<Button>הוסף תלמיד</Button>}
  />
) : (
  <DataTable data={data} />
)}
```

### Confirmation Dialog Pattern

```tsx
<Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
  <DialogHeader>
    <h3 className="text-lg font-semibold">אישור מחיקה</h3>
  </DialogHeader>
  <DialogContent>
    <p>האם אתה בטוח שברצונך למחוק את התלמיד?</p>
    <p className="text-sm text-neutral-500 mt-2">
      פעולה זו אינה ניתנת לביטול.
    </p>
  </DialogContent>
  <DialogFooter>
    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
      ביטול
    </Button>
    <Button variant="destructive" onClick={handleDelete}>
      מחק
    </Button>
  </DialogFooter>
</Dialog>
```

---

## Testing Components

All components should be tested for:

1. **Rendering**: Component renders without errors
2. **Props**: All variants and sizes work correctly
3. **Interactions**: Click, hover, focus work as expected
4. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
5. **RTL**: Layout, icons, spacing work in RTL mode

Example test structure:

```tsx
describe('Button', () => {
  it('renders primary button', () => {
    render(<Button variant="primary">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600');
  });

  it('shows loading state', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

---

## Component Checklist

Before marking a component as "done":

- [ ] TypeScript types defined
- [ ] All variants implemented
- [ ] RTL support tested
- [ ] Accessibility attributes added
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Loading/disabled states work
- [ ] Documented with examples
- [ ] Used in at least one real page

---

## Future Components

Planned for future sprints:

- **Modal/Dialog** - Overlays and dialogs
- **Dropdown** - Select menus and action menus
- **Table** - Data tables with sorting/filtering
- **Tabs** - Tabbed navigation
- **Badge** - Status indicators
- **Avatar** - User avatars with initials
- **EmptyState** - Empty state illustrations
- **Toast** - Toast notifications
- **DatePicker** - Hebrew calendar date picker
- **Tooltip** - Contextual help tooltips
- **Breadcrumbs** - Navigation breadcrumbs
- **Pagination** - Table pagination
- **Progress** - Progress bars and indicators

---

## Maintenance

This component library is living documentation. Update this file when:

- Adding new components
- Changing component APIs
- Adding new variants or features
- Discovering common patterns
- Fixing accessibility issues

Last updated: 2025-12-31
