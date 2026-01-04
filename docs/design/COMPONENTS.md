# Growth Engine Component Library

**Version:** 1.0
**Last Updated:** December 30, 2025
**Status:** Approved
**Owner:** Designer

---

## 1. Overview

This document specifies all UI components for the Growth Engine platform, building on the foundational design system (`/docs/design/DESIGN_SYSTEM.md`). Each component includes:

- **Purpose** - What problem it solves
- **Anatomy** - Visual structure and parts
- **States** - All interaction states (default, hover, focus, disabled, error, etc.)
- **Variants** - Size, style, or type variations
- **Accessibility** - WCAG 2.1 AA requirements
- **Usage guidelines** - When to use, when not to use

---

## 2. Core Components

### 2.1 Buttons

**Purpose:** Primary interaction mechanism for triggering actions (save, submit, cancel, navigate).

#### Anatomy

```
┌─────────────────────────────┐
│  [Icon]  Button Label       │  ← Text + optional icon
└─────────────────────────────┘
 ↑                           ↑
Padding: 12px vertical       Padding: 24px horizontal
Border radius: 4px
```

#### Variants

**Primary Button** (Main action)

- Background: `primary-700` (#10507E)
- Text: `white`
- Hover: `primary-600` (#1366A0)
- Active: `primary-800` (#0D3A5F)
- Focus: 3px ring in `primary-500` at 50% opacity
- Disabled: `gray-300` background, `gray-500` text

**Secondary Button** (Alternative action)

- Background: `white`
- Border: 1px solid `gray-300`
- Text: `gray-700`
- Hover: `gray-50` background, border `gray-400`
- Active: `gray-100` background
- Focus: 3px ring in `primary-500` at 50% opacity
- Disabled: `gray-100` background, `gray-400` text

**Danger Button** (Destructive action)

- Background: `error-600` (#DC2626)
- Text: `white`
- Hover: `error-700` (#991B1B)
- Active: `error-700`
- Focus: 3px ring in `error-500` at 50% opacity
- Disabled: `error-200` background, `error-400` text

**Ghost Button** (Subtle action)

- Background: `transparent`
- Text: `primary-700`
- Hover: `primary-50` background
- Active: `primary-100` background
- Focus: 3px ring in `primary-500` at 50% opacity
- Disabled: `gray-400` text

**Link Button** (Text-only action)

- Background: `transparent`
- Text: `primary-700`, underline on hover
- Hover: `primary-600`, underline
- Focus: 3px ring in `primary-500` at 50% opacity
- Disabled: `gray-500` text, no underline

#### Sizes

| Size       | Height | Padding (Vertical) | Padding (Horizontal) | Font Size        | Icon Size        |
| ---------- | ------ | ------------------ | -------------------- | ---------------- | ---------------- |
| **Small**  | 32px   | 8px                | 16px                 | 14px (`body-sm`) | 16px (`icon-xs`) |
| **Medium** | 40px   | 12px               | 24px                 | 16px (`body-md`) | 20px (`icon-sm`) |
| **Large**  | 48px   | 14px               | 32px                 | 18px (`body-lg`) | 24px (`icon-md`) |

**Default:** Medium

#### States

1. **Default (Rest):**
   - Visible, fully opaque
   - Cursor: `pointer`

2. **Hover:**
   - Background color lightens/darkens (see variants)
   - Transition: 200ms ease-out
   - Cursor: `pointer`

3. **Focus (Keyboard):**
   - 3px ring around button (primary-500 at 50% opacity)
   - Focus ring has 2px offset
   - Background same as hover state

4. **Active (Pressed):**
   - Background darker than hover
   - `transform: scale(0.98)` (subtle press effect)
   - Transition: 100ms ease-out

5. **Disabled:**
   - Gray background and text (see variants)
   - Cursor: `not-allowed`
   - Opacity: 0.6
   - No hover or focus effects

6. **Loading:**
   - Spinner icon replaces text or appears next to it
   - Button disabled during loading
   - Cursor: `wait`

#### Accessibility

- **Keyboard:** Focusable via Tab, activated with Enter or Space
- **Screen Reader:** Use `<button>` element (not `<div>` or `<a>`)
- **ARIA:** `aria-label` if icon-only, `aria-disabled="true"` for disabled state
- **Color:** Never rely on color alone (use text label + icon)
- **Touch Target:** Minimum 44x44px (use padding to expand clickable area if needed)

#### Usage Guidelines

**When to use:**

- Primary actions: "Save Analysis", "Start Analysis", "Submit"
- Secondary actions: "Cancel", "Back", "Skip"
- Destructive actions: "Delete Student", "Remove Class"

**When NOT to use:**

- Navigation to another page (use Link component)
- Inline actions in text (use Link Button)
- Toggle states (use Toggle Switch)

**Best practices:**

- Use Primary button for main action (only one per section)
- Label buttons with verbs ("Save", not "Okay")
- Confirm destructive actions (modal or confirmation dialog)
- Show loading state for async actions (>1 second)

#### Examples

**Primary Action:**

```html
<button class="btn-primary btn-medium">Save Analysis</button>
```

**With Icon:**

```html
<button class="btn-primary btn-medium">
  <svg class="icon-sm"><!-- Heroicon: plus --></svg>
  Add Student
</button>
```

**Loading State:**

```html
<button class="btn-primary btn-medium" disabled>
  <svg class="icon-sm spinner"><!-- Heroicon: spinner --></svg>
  Saving...
</button>
```

---

### 2.2 Form Inputs

**Purpose:** Collect user input (text, email, password, numbers).

#### Anatomy

```
┌─────────────────────────────────────────┐
│  Label *                                │  ← Label (bold, gray-700)
├─────────────────────────────────────────┤
│  [Placeholder or value]                 │  ← Input field
└─────────────────────────────────────────┘
   ↑ Helper text (gray-600, small)
```

#### Variants

**Text Input** (Single-line text)

- Border: 1px solid `gray-300`
- Background: `white`
- Text: `gray-900`
- Placeholder: `gray-500`
- Border radius: 4px
- Padding: 12px vertical, 16px horizontal
- Font size: 16px (`body-md`)

**Textarea** (Multi-line text)

- Same as text input
- Min height: 80px (5 rows)
- Resizable vertically (not horizontally)

**Email Input** (Email addresses)

- Same as text input
- Input type: `email`
- Browser validation enabled

**Password Input** (Password with show/hide toggle)

- Same as text input
- Input type: `password`
- "Show/Hide" toggle icon on right (eye icon)
- Toggle changes input type between `password` and `text`

**Number Input** (Numeric values)

- Same as text input
- Input type: `number`
- Optional: Up/down arrows (browser default) or custom spinners

**Search Input** (Search queries)

- Same as text input
- Input type: `search`
- Search icon on left (magnifying glass)
- Clear button (X icon) on right when input has value

#### States

1. **Default (Empty):**
   - Border: `gray-300`
   - Background: `white`
   - Placeholder text: `gray-500`

2. **Focus:**
   - Border: `primary-500` (2px width)
   - 3px ring in `primary-500` at 50% opacity
   - Placeholder fades slightly

3. **Filled:**
   - Border: `gray-300`
   - Text: `gray-900`

4. **Hover:**
   - Border: `gray-400`
   - Cursor: `text`

5. **Error:**
   - Border: `error-600` (2px width)
   - Background: `error-50`
   - Error message below input in `error-700` with icon

6. **Disabled:**
   - Border: `gray-200`
   - Background: `gray-100`
   - Text: `gray-500`
   - Cursor: `not-allowed`

7. **Read-Only:**
   - Border: `gray-200`
   - Background: `gray-50`
   - Text: `gray-700`
   - Cursor: `default`

#### Label & Helper Text

**Label:**

- Font size: 14px (`body-sm`)
- Font weight: 600 (semibold)
- Color: `gray-700`
- Margin bottom: 8px (`space-2`)
- Required indicator: Red asterisk (\*) after label text

**Helper Text:**

- Font size: 12px (`body-xs`)
- Color: `gray-600`
- Margin top: 4px (`space-1`)
- Position: Below input

**Error Message:**

- Font size: 12px (`body-xs`)
- Color: `error-700`
- Icon: Error icon (X in circle) before text
- Margin top: 4px (`space-1`)
- ARIA: `aria-describedby` connects input to error message

#### Accessibility

- **Keyboard:** Focusable via Tab, editable via typing
- **Label:** Use `<label>` element with `for` attribute (not just placeholder)
- **ARIA:** `aria-invalid="true"` for error state, `aria-describedby` for helper/error text
- **Autofill:** Support browser autofill (don't disable)
- **Password Managers:** Allow password manager integration

#### Usage Guidelines

**When to use:**

- Collecting user input (name, email, password, notes)
- Search functionality
- Filters and form fields

**When NOT to use:**

- Selecting from predefined options (use Select, Radio, or Checkbox)
- Dates (use Date Picker)
- Large amounts of formatted text (use Rich Text Editor)

**Best practices:**

- Always provide label (not just placeholder)
- Use helper text for additional context
- Validate on blur, not on every keystroke (less annoying)
- Show error message below field, not in modal
- Required fields: Mark with asterisk (\*) in label

#### Examples

**Text Input:**

```html
<div class="form-field">
  <label for="student-name">Student Name *</label>
  <input type="text" id="student-name" placeholder="Enter student's full name" required />
  <p class="helper-text">First and last name</p>
</div>
```

**Email Input with Error:**

```html
<div class="form-field">
  <label for="email">Email Address *</label>
  <input
    type="email"
    id="email"
    aria-invalid="true"
    aria-describedby="email-error"
    value="invalid-email"
  />
  <p id="email-error" class="error-text">
    <svg class="icon-xs"><!-- Error icon --></svg>
    Please enter a valid email address
  </p>
</div>
```

**Password Input with Toggle:**

```html
<div class="form-field">
  <label for="password">Password *</label>
  <div class="password-input">
    <input type="password" id="password" />
    <button type="button" aria-label="Show password">
      <svg class="icon-sm"><!-- Eye icon --></svg>
    </button>
  </div>
</div>
```

---

### 2.3 Select / Dropdown

**Purpose:** Choose one option from a list of predefined values.

#### Anatomy

```
┌─────────────────────────────────────────┐
│  Selected Option              ▼         │  ← Closed state
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Selected Option              ▲         │  ← Open state
├─────────────────────────────────────────┤
│  Option 1                               │
│  Option 2  ✓                            │  ← Checkmark for selected
│  Option 3                               │
└─────────────────────────────────────────┘
```

#### Variants

**Single Select** (Choose one)

- Dropdown list appears below (or above if space limited)
- Selected option shown in field
- Checkmark next to selected option in dropdown

**Native Select** (Browser default)

- Use `<select>` element
- Faster, more accessible on mobile
- Limited styling options

**Custom Select** (Styled dropdown)

- Built with Radix UI or Headless UI
- Full design control
- Better UX for complex options (icons, descriptions)

#### States

1. **Default (Closed):**
   - Border: `gray-300`
   - Background: `white`
   - Chevron icon on right (down arrow)

2. **Hover:**
   - Border: `gray-400`
   - Cursor: `pointer`

3. **Focus:**
   - Border: `primary-500` (2px)
   - 3px ring in `primary-500` at 50% opacity

4. **Open:**
   - Border: `primary-500`
   - Chevron rotates 180° (up arrow)
   - Dropdown appears with `shadow-lg`

5. **Disabled:**
   - Border: `gray-200`
   - Background: `gray-100`
   - Text: `gray-500`
   - Cursor: `not-allowed`

6. **Error:**
   - Border: `error-600` (2px)
   - Background: `error-50`
   - Error message below

#### Dropdown Menu

**Appearance:**

- Background: `white`
- Border: 1px solid `gray-200`
- Border radius: 4px
- Shadow: `shadow-lg`
- Max height: 300px (scrollable if more options)

**Option Styling:**

- Padding: 12px vertical, 16px horizontal
- Hover: `primary-50` background
- Selected: `primary-700` text, checkmark icon
- Disabled: `gray-400` text, cursor `not-allowed`

**Option States:**

1. Default: `gray-900` text
2. Hover: `primary-50` background, `primary-700` text
3. Selected: `primary-700` text, checkmark icon on right
4. Focus (keyboard): Same as hover + focus ring

#### Accessibility

- **Keyboard:**
  - Arrow keys navigate options
  - Enter selects option
  - Escape closes dropdown
  - Space opens dropdown (when closed)
- **Screen Reader:** Use `<select>` or ARIA `role="listbox"` + `aria-expanded`
- **ARIA:** `aria-label` or `<label>` for dropdown, `aria-selected` for options

#### Usage Guidelines

**When to use:**

- Choosing from 5-20 options (if <5, use Radio buttons; if >20, use Autocomplete/Search)
- Grade level, class selection, role selection
- Filter dropdowns

**When NOT to use:**

- Yes/No or binary choices (use Toggle or Radio)
- Dates (use Date Picker)
- Searchable lists with many options (use Autocomplete)

**Best practices:**

- Sort options logically (alphabetical or most common first)
- Use placeholder text ("Select a class...") for initial state
- Don't use "Select..." as first option if required field
- Provide "None" or "All" option if applicable

#### Examples

**Native Select:**

```html
<div class="form-field">
  <label for="grade">Grade Level *</label>
  <select id="grade" required>
    <option value="" disabled selected>Select grade...</option>
    <option value="k">Kindergarten</option>
    <option value="1">1st Grade</option>
    <option value="2">2nd Grade</option>
    <!-- ... -->
  </select>
</div>
```

**Custom Select (Radix UI):**

```tsx
<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Select a class..." />
    <Select.Icon>
      <ChevronDownIcon />
    </Select.Icon>
  </Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Item value="math-p3">
        <Select.ItemText>Math Period 3</Select.ItemText>
        <Select.ItemIndicator>✓</Select.ItemIndicator>
      </Select.Item>
      {/* More options... */}
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

---

### 2.4 Checkbox

**Purpose:** Select multiple options from a list, or toggle a single option on/off.

#### Anatomy

```
┌───┐
│ ✓ │  Label text (can be multi-line)
└───┘
 ↑
16x16px checkbox
```

#### States

1. **Unchecked (Default):**
   - Border: 2px solid `gray-300`
   - Background: `white`
   - Border radius: 3px

2. **Checked:**
   - Border: 2px solid `primary-700`
   - Background: `primary-700`
   - Checkmark icon: `white`

3. **Indeterminate (Partial):**
   - Border: 2px solid `primary-700`
   - Background: `primary-700`
   - Minus icon: `white` (horizontal line)
   - Use for parent checkbox when some (not all) children are checked

4. **Hover (Unchecked):**
   - Border: `gray-400`
   - Background: `gray-50`

5. **Hover (Checked):**
   - Background: `primary-600`

6. **Focus:**
   - 3px ring in `primary-500` at 50% opacity

7. **Disabled (Unchecked):**
   - Border: `gray-200`
   - Background: `gray-100`
   - Cursor: `not-allowed`

8. **Disabled (Checked):**
   - Border: `gray-300`
   - Background: `gray-300`
   - Checkmark: `gray-500`

#### Accessibility

- **Keyboard:** Focusable via Tab, toggle with Space
- **Screen Reader:** Use `<input type="checkbox">` with `<label>`
- **ARIA:** `aria-checked="true|false|mixed"` for indeterminate state
- **Touch Target:** Expand label clickable area (min 44x44px)

#### Usage Guidelines

**When to use:**

- Multiple selections from a list
- Single toggle option ("Remember me", "I agree to terms")
- Nested lists (parent checkbox for "Select all")

**When NOT to use:**

- Mutually exclusive options (use Radio buttons)
- Binary on/off state with immediate effect (use Toggle Switch)

**Best practices:**

- Label should be next to checkbox (on the right)
- Label should be clickable (expands touch target)
- Group related checkboxes with fieldset + legend
- Use indeterminate state for "Select all" parent checkbox

#### Examples

**Single Checkbox:**

```html
<div class="checkbox-field">
  <input type="checkbox" id="remember" />
  <label for="remember">Remember me for 30 days</label>
</div>
```

**Checkbox List:**

```html
<fieldset>
  <legend>Select Classes</legend>
  <div class="checkbox-field">
    <input type="checkbox" id="math-p3" value="math-p3" />
    <label for="math-p3">Math Period 3</label>
  </div>
  <div class="checkbox-field">
    <input type="checkbox" id="english-p5" value="english-p5" />
    <label for="english-p5">English Period 5</label>
  </div>
</fieldset>
```

---

### 2.5 Radio Buttons

**Purpose:** Choose exactly one option from a list of mutually exclusive options.

#### Anatomy

```
◯  Option 1
●  Option 2  ← Selected (filled circle)
◯  Option 3
```

#### States

1. **Unselected (Default):**
   - Border: 2px solid `gray-300`
   - Background: `white`
   - Border radius: `rounded-full` (50%)
   - Size: 20x20px

2. **Selected:**
   - Border: 2px solid `primary-700`
   - Background: `white`
   - Inner circle: 10x10px, `primary-700` (centered)

3. **Hover (Unselected):**
   - Border: `gray-400`
   - Background: `gray-50`

4. **Hover (Selected):**
   - Border: `primary-600`
   - Inner circle: `primary-600`

5. **Focus:**
   - 3px ring in `primary-500` at 50% opacity

6. **Disabled (Unselected):**
   - Border: `gray-200`
   - Background: `gray-100`

7. **Disabled (Selected):**
   - Border: `gray-300`
   - Inner circle: `gray-400`

#### Accessibility

- **Keyboard:**
  - Tab focuses on group
  - Arrow keys navigate between options
  - Space selects focused option
- **Screen Reader:** Use `<input type="radio">` with same `name` attribute
- **ARIA:** `role="radiogroup"` on container, `aria-checked` on options
- **Touch Target:** Expand label clickable area (min 44x44px)

#### Usage Guidelines

**When to use:**

- 2-5 mutually exclusive options
- User must see all options at once
- Examples: Role selection (Teacher, Principal), Analysis type

**When NOT to use:**

- > 5 options (use Select dropdown)
- Multiple selections allowed (use Checkbox)
- Binary on/off (use Toggle Switch or single Checkbox)

**Best practices:**

- Vertical list preferred (easier to scan)
- Horizontal only if 2-3 short options
- One option pre-selected by default (if appropriate)
- Group with fieldset + legend

#### Examples

**Vertical Radio Group:**

```html
<fieldset>
  <legend>User Role *</legend>
  <div class="radio-field">
    <input type="radio" id="teacher" name="role" value="teacher" checked />
    <label for="teacher">Teacher</label>
  </div>
  <div class="radio-field">
    <input type="radio" id="principal" name="role" value="principal" />
    <label for="principal">Principal</label>
  </div>
  <div class="radio-field">
    <input type="radio" id="admin" name="role" value="admin" />
    <label for="admin">District Admin</label>
  </div>
</fieldset>
```

---

### 2.6 Toggle Switch

**Purpose:** Enable/disable a feature or setting with immediate effect.

#### Anatomy

```
┌─────────────┐
│  ○─────────│  ← OFF (circle on left)
└─────────────┘

┌─────────────┐
│  ─────────●│  ← ON (circle on right)
└─────────────┘
```

**Dimensions:**

- Track: 44px wide × 24px tall
- Knob: 20px diameter (4px margin from track edge)
- Border radius: `rounded-full`

#### States

1. **OFF (Default):**
   - Track background: `gray-300`
   - Knob: `white`, positioned left
   - Knob shadow: `shadow-sm`

2. **ON:**
   - Track background: `primary-600`
   - Knob: `white`, positioned right
   - Knob shadow: `shadow-sm`

3. **Hover (OFF):**
   - Track background: `gray-400`

4. **Hover (ON):**
   - Track background: `primary-500`

5. **Focus:**
   - 3px ring in `primary-500` at 50% opacity

6. **Disabled (OFF):**
   - Track background: `gray-200`
   - Knob: `gray-300`

7. **Disabled (ON):**
   - Track background: `primary-300`
   - Knob: `white`

#### Animation

- Transition: 200ms ease-out
- Knob slides smoothly from left to right (or vice versa)
- Track color fades between states

#### Accessibility

- **Keyboard:** Focusable via Tab, toggle with Space or Enter
- **Screen Reader:** Use `role="switch"`, `aria-checked="true|false"`
- **Label:** Always provide visible label next to switch
- **ARIA:** `aria-label` or `<label>` associated with switch

#### Usage Guidelines

**When to use:**

- Enable/disable features (e.g., "Enable email notifications")
- Settings with immediate effect (no "Save" button needed)
- Binary on/off states

**When NOT to use:**

- Mutually exclusive options (use Radio)
- Form submission required (use Checkbox)
- Actions that require confirmation (use Button)

**Best practices:**

- Label describes what the toggle controls ("Email Notifications")
- Label should be next to switch (left or right)
- Default state should be safe (e.g., notifications OFF)
- Immediate feedback when toggled (toast notification or inline message)

#### Examples

**Toggle Switch:**

```html
<div class="toggle-field">
  <label for="email-notifications">Email Notifications</label>
  <button role="switch" aria-checked="false" id="email-notifications" class="toggle-switch">
    <span class="toggle-knob"></span>
  </button>
</div>
```

---

### 2.7 Cards

**Purpose:** Group related content in a visually distinct, clickable (optional) container.

#### Anatomy

```
┌─────────────────────────────────────────┐
│  Card Header (Title + Actions)          │
├─────────────────────────────────────────┤
│  Card Body (Content)                    │
│  - Text, images, data, etc.             │
│                                         │
├─────────────────────────────────────────┤
│  Card Footer (Actions, metadata)        │
└─────────────────────────────────────────┘
```

#### Variants

**Basic Card** (Non-interactive)

- Background: `white`
- Border: 1px solid `gray-200` (optional, for subtle separation)
- Border radius: 8px (`rounded-lg`)
- Padding: 24px (`space-6`)
- Shadow: `shadow-sm` (subtle lift)

**Interactive Card** (Clickable)

- Same as basic card
- Hover: `shadow-md` (lift on hover)
- Cursor: `pointer`
- Transition: 200ms ease-out

**Highlighted Card** (Important or selected)

- Border: 2px solid `primary-500`
- Background: `primary-50` (very light blue)
- Shadow: `shadow-md`

**Student Card** (Specific to student roster)

- Includes: Student name, grade, class, analysis status
- Actions: "Analyze" button, "View History" link
- Status badge: "Analyzed", "Pending", "Flagged"

#### States

1. **Default:**
   - Background: `white`
   - Shadow: `shadow-sm`

2. **Hover (if interactive):**
   - Shadow: `shadow-md`
   - Transform: `translateY(-2px)` (subtle lift)
   - Transition: 200ms ease-out

3. **Focus (if interactive):**
   - 3px ring in `primary-500` at 50% opacity

4. **Selected/Active:**
   - Border: 2px solid `primary-500`
   - Background: `primary-50`

#### Card Header

- Font size: 20px (`heading-md`)
- Font weight: 600 (semibold)
- Color: `gray-900`
- Margin bottom: 16px (`space-4`)
- Optional: Action icons on right (menu, close, etc.)

#### Card Body

- Default text: `body-md` (16px)
- Color: `gray-700`
- Spacing between elements: 12px (`space-3`)

#### Card Footer

- Border top: 1px solid `gray-200`
- Padding top: 16px (`space-4`)
- Margin top: 16px (`space-4`)
- Typically contains: Buttons, links, timestamps, metadata

#### Accessibility

- **Keyboard:** If clickable, should be focusable (use `<button>` or `<a>` wrapper)
- **Screen Reader:** Use semantic HTML (`<article>`, `<section>`)
- **ARIA:** `aria-label` for card purpose if not obvious from content

#### Usage Guidelines

**When to use:**

- Student roster items
- Dashboard metric cards
- Analysis result summaries
- Settings sections

**When NOT to use:**

- Single piece of content (no grouping needed)
- Navigation menus (use Nav component)
- Modal dialogs (use Modal component)

**Best practices:**

- Keep card content focused (one purpose per card)
- Use consistent padding (24px)
- Limit actions in card (2-3 max)
- Use footer for less important actions or metadata

#### Examples

**Basic Card:**

```html
<div class="card">
  <div class="card-header">
    <h3>Marcus Johnson</h3>
  </div>
  <div class="card-body">
    <p>Grade: 4th | Class: Room 201</p>
    <p>Last analyzed: 2 days ago</p>
  </div>
  <div class="card-footer">
    <button class="btn-primary btn-small">Analyze</button>
    <a href="/students/123/history" class="btn-ghost btn-small">View History</a>
  </div>
</div>
```

**Interactive Student Card:**

```html
<button class="card card-interactive">
  <div class="card-header">
    <h3>Sarah Martinez</h3>
    <span class="badge badge-success">Analyzed</span>
  </div>
  <div class="card-body">
    <p>Grade: 5th | Class: Math Period 3</p>
    <p>Strengths: Problem-solving, collaboration</p>
    <p>Needs: Reading comprehension support</p>
  </div>
  <div class="card-footer">
    <span class="text-xs text-gray-600">Last updated: Oct 15, 2025</span>
  </div>
</button>
```

---

### 2.8 Tables / Data Grids

**Purpose:** Display structured data in rows and columns (student rosters, analysis history, reports).

#### Anatomy

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Header 1 ▲  │ Header 2    │ Header 3    │ Actions     │  ← Table Header
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Cell 1-1    │ Cell 1-2    │ Cell 1-3    │ [Edit] [X]  │  ← Row 1
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Cell 2-1    │ Cell 2-2    │ Cell 2-3    │ [Edit] [X]  │  ← Row 2 (alternate bg)
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### Variants

**Basic Table** (Read-only data)

- Background: `white`
- Border: 1px solid `gray-200` (outer border)
- Border radius: 8px (`rounded-lg`)
- Cell borders: 1px solid `gray-200`

**Sortable Table** (Column sorting)

- Header has sort icon (up/down arrows)
- Click header to sort ascending/descending
- Active sort column: Bold header text, visible sort icon

**Interactive Table** (Row actions)

- Row hover: `gray-50` background
- Clickable rows: Cursor `pointer`
- Action buttons in last column (Edit, Delete, View)

**Striped Table** (Alternate row colors)

- Odd rows: `white`
- Even rows: `gray-50`
- Improves scannability for large tables

#### Styling

**Table Container:**

- Overflow: `auto` (horizontal scroll on mobile)
- Border radius: 8px
- Shadow: `shadow-sm`

**Header Row:**

- Background: `gray-50`
- Font size: 14px (`body-sm`)
- Font weight: 600 (semibold)
- Color: `gray-700`
- Text transform: Uppercase
- Letter spacing: 0.05em
- Padding: 12px vertical, 16px horizontal
- Border bottom: 2px solid `gray-300`

**Body Rows:**

- Font size: 14px (`body-sm`)
- Color: `gray-900`
- Padding: 12px vertical, 16px horizontal
- Border bottom: 1px solid `gray-200`

**Hover State (Row):**

- Background: `gray-50`
- Transition: 100ms ease-out

**Selected Row:**

- Background: `primary-50`
- Border left: 3px solid `primary-500`

#### Column Types

**Text Column:**

- Left-aligned
- Truncate long text with ellipsis (...) if needed
- Tooltip shows full text on hover

**Numeric Column:**

- Right-aligned
- Monospace font (for alignment)

**Date Column:**

- Left-aligned or center-aligned
- Format: "Oct 15, 2025" or "2 days ago" (relative)

**Status Column:**

- Badge component (colored pill)
- Icons + text (e.g., checkmark + "Complete")

**Actions Column:**

- Right-aligned
- Icon buttons or text links
- Max 2-3 actions (more → dropdown menu)

#### Sorting

**Sort Icon:**

- Default (unsorted): Up/down arrow icon (`gray-400`)
- Ascending: Up arrow only (`gray-900`)
- Descending: Down arrow only (`gray-900`)
- Position: Right of header text

**Interaction:**

- Click header to sort ascending (first click)
- Click again to sort descending
- Click third time to remove sort (back to default)

#### Pagination

**Pagination Controls:**

- Position: Below table
- Layout: Total count, page numbers, Next/Previous buttons
- Example: "Showing 1-20 of 150 students"

**Pagination Buttons:**

- Previous/Next: Ghost buttons with icons
- Page numbers: Ghost buttons, current page is Primary button
- Mobile: Show only Previous/Next (no page numbers)

#### Accessibility

- **Keyboard:**
  - Focusable headers (for sorting)
  - Focusable row actions
  - Arrow keys navigate cells (optional, for complex tables)
- **Screen Reader:** Use `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` (semantic HTML)
- **ARIA:** `aria-sort` on sortable headers, `role="grid"` for interactive tables
- **Captions:** Use `<caption>` for table purpose

#### Usage Guidelines

**When to use:**

- Student rosters (20-500 students)
- Analysis history (multiple analyses per student)
- Reports and exports
- Admin user management

**When NOT to use:**

- <10 rows (use simple list or cards)
- Complex nested data (use expandable rows or separate pages)
- Mobile-first views (use cards on mobile, table on desktop)

**Best practices:**

- Limit columns (5-8 max for desktop, 3-4 for mobile)
- Use sticky headers for long tables
- Provide filters (search, status, date range)
- Enable sorting on key columns (name, date, status)
- Use pagination for >50 rows

#### Examples

**Basic Table:**

```html
<table class="table">
  <caption>
    Student Roster - 4th Grade Room 201
  </caption>
  <thead>
    <tr>
      <th>Student Name</th>
      <th>Grade</th>
      <th>Last Analysis</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Marcus Johnson</td>
      <td>4th</td>
      <td>2 days ago</td>
      <td><span class="badge badge-success">Analyzed</span></td>
      <td>
        <button class="btn-ghost btn-small">View</button>
        <button class="btn-ghost btn-small">Edit</button>
      </td>
    </tr>
    <!-- More rows... -->
  </tbody>
</table>
```

---

### 2.9 Modals / Dialogs

**Purpose:** Focus user attention on a specific task or message, blocking interaction with main content.

#### Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  Overlay (semi-transparent black)                           │
│    ┌─────────────────────────────────────────────────────┐  │
│    │  Modal Header                               [X]     │  │
│    ├─────────────────────────────────────────────────────┤  │
│    │  Modal Body                                         │  │
│    │  Content goes here (text, forms, images, etc.)     │  │
│    │                                                     │  │
│    ├─────────────────────────────────────────────────────┤  │
│    │  Modal Footer                                       │  │
│    │  [Cancel]                           [Primary Action]│  │
│    └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### Variants

**Small Modal** (Confirmations, alerts)

- Width: 400px (max)
- Use for: Simple confirmations, short messages

**Medium Modal** (Default, forms)

- Width: 600px (max)
- Use for: Forms, student details, analysis results

**Large Modal** (Complex content)

- Width: 800px (max)
- Use for: Multi-step wizards, detailed reports

**Full Screen Modal** (Mobile or immersive)

- Width: 100vw
- Height: 100vh
- Use for: Mobile views, image galleries

#### Styling

**Overlay:**

- Background: `rgba(0, 0, 0, 0.5)` (50% black)
- Backdrop filter: `blur(4px)` (optional, for glassmorphism effect)
- Z-index: 30 (modal layer)

**Modal Container:**

- Background: `white`
- Border radius: 12px (`rounded-xl`)
- Shadow: `shadow-2xl`
- Padding: 0 (padding applied to sections)
- Max height: 90vh (scrollable if content overflows)

**Modal Header:**

- Padding: 24px (`space-6`)
- Border bottom: 1px solid `gray-200`
- Font size: 24px (`heading-lg`)
- Font weight: 600 (semibold)
- Color: `gray-900`
- Close button: Top-right corner, icon button (X)

**Modal Body:**

- Padding: 24px (`space-6`)
- Overflow: `auto` (if content is tall)
- Max height: calc(90vh - header - footer)

**Modal Footer:**

- Padding: 24px (`space-6`)
- Border top: 1px solid `gray-200`
- Layout: Flexbox, buttons right-aligned
- Gap between buttons: 12px (`space-3`)

#### States

1. **Opening:**
   - Fade in: Opacity 0 → 1 (300ms)
   - Scale in: `scale(0.95)` → `scale(1)` (300ms)
   - Easing: `ease-out`

2. **Open:**
   - Fully visible
   - Focus trapped inside modal (can't tab to main page)

3. **Closing:**
   - Fade out: Opacity 1 → 0 (200ms)
   - Scale out: `scale(1)` → `scale(0.95)` (200ms)
   - Easing: `ease-in`

#### Close Interactions

**Methods to close:**

1. Click "X" button (top-right)
2. Click "Cancel" or secondary button (footer)
3. Click overlay (background) - only for non-critical modals
4. Press Escape key

**Destructive modals:**

- Require explicit confirmation (don't close on overlay click)
- Example: "Are you sure you want to delete this student?"

#### Accessibility

- **Keyboard:**
  - Focus trapped inside modal (Tab cycles through modal elements)
  - Escape closes modal
  - Focus returns to trigger element when closed
- **Screen Reader:**
  - `role="dialog"` or `role="alertdialog"` (for urgent messages)
  - `aria-modal="true"`
  - `aria-labelledby` (header ID)
  - `aria-describedby` (body ID)
- **Focus Management:** Autofocus on first interactive element (usually close button or first input)

#### Usage Guidelines

**When to use:**

- Confirmations (delete, cancel, discard changes)
- Forms (add student, edit analysis)
- Detailed views (analysis results, student history)
- Alerts (errors, warnings, success messages)

**When NOT to use:**

- Non-critical messages (use Toast notification)
- Navigation (use page transitions)
- Large amounts of content (use separate page)

**Best practices:**

- Keep modals focused (one task per modal)
- Provide clear close mechanism (X button, Cancel, Escape)
- Limit modal depth (avoid modal → modal → modal)
- Use clear action labels ("Delete Student", not "OK")
- Confirm destructive actions with explicit checkbox or text input

#### Examples

**Confirmation Modal:**

```html
<div class="modal-overlay">
  <div class="modal modal-small" role="dialog" aria-labelledby="modal-title">
    <div class="modal-header">
      <h2 id="modal-title">Delete Student?</h2>
      <button aria-label="Close" class="btn-icon">
        <svg><!-- X icon --></svg>
      </button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to delete Marcus Johnson? This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-danger">Delete Student</button>
    </div>
  </div>
</div>
```

---

### 2.10 Alerts / Notifications

**Purpose:** Provide feedback to users about system status, errors, warnings, or success.

#### Variants

**Inline Alerts** (Context-specific)

- Positioned near relevant content
- Persist until dismissed or action taken

**Toast Notifications** (Global)

- Fixed position (top-right corner)
- Auto-dismiss after 5 seconds
- Multiple toasts stack vertically

**Banner Alerts** (Page-level)

- Full-width at top of page
- For critical system messages (maintenance, errors)

#### Alert Types

**Success** (Action completed)

- Background: `secondary-100` (light green)
- Border left: 4px solid `secondary-600`
- Icon: Checkmark circle (`secondary-600`)
- Text color: `secondary-700`

**Error** (Something went wrong)

- Background: `error-100` (light red)
- Border left: 4px solid `error-600`
- Icon: X circle (`error-600`)
- Text color: `error-700`

**Warning** (Caution needed)

- Background: `warning-100` (light orange)
- Border left: 4px solid `warning-600`
- Icon: Exclamation triangle (`warning-600`)
- Text color: `warning-700`

**Info** (Helpful information)

- Background: `info-100` (light blue)
- Border left: 4px solid `info-600`
- Icon: Info circle (`info-600`)
- Text color: `info-700`

#### Anatomy

```
┌─────────────────────────────────────────────────────────┐
│ [Icon] Alert Title                               [X]    │
│        Supporting message with more context.            │
│        [Action Button]                                  │
└─────────────────────────────────────────────────────────┘
 ↑       ↑                                         ↑
 Icon    Text content                              Close button
```

#### Styling

**Container:**

- Padding: 16px (`space-4`)
- Border radius: 8px (`rounded-lg`)
- Border left: 4px solid (semantic color)
- Background: Semantic color (100 shade)
- Shadow: None (inline), `shadow-lg` (toast)

**Icon:**

- Size: 24px (`icon-md`)
- Color: Semantic color (600 shade)
- Position: Top-left, aligned with title

**Title:**

- Font size: 16px (`body-md`)
- Font weight: 600 (semibold)
- Color: Semantic color (700 shade)
- Margin bottom: 4px (`space-1`)

**Message:**

- Font size: 14px (`body-sm`)
- Color: Semantic color (700 shade)
- Line height: 1.5

**Close Button:**

- Position: Top-right
- Icon: X (`icon-sm`)
- Color: Semantic color (600 shade)
- Hover: Semantic color (700 shade)

**Action Button (optional):**

- Margin top: 12px (`space-3`)
- Use Ghost button (matches semantic color)

#### Toast Notifications

**Position:**

- Fixed: Top-right corner
- Offset: 24px from top, 24px from right
- Multiple toasts: Stack vertically with 12px gap

**Animation:**

- Enter: Slide in from right + fade in (300ms)
- Exit: Slide out to right + fade out (200ms)

**Auto-Dismiss:**

- Default: 5 seconds
- Error: 7 seconds (more time to read)
- Success: 3 seconds (quick confirmation)
- Hover: Pause auto-dismiss

**Interaction:**

- Click anywhere on toast to dismiss
- Click action button (performs action + dismisses)
- Hover pauses auto-dismiss timer

#### Accessibility

- **Screen Reader:**
  - `role="alert"` for urgent messages (errors)
  - `role="status"` for non-urgent (success, info)
  - `aria-live="assertive"` (errors) or `aria-live="polite"` (others)
- **Keyboard:** Close button focusable (Tab), dismiss with Enter or Escape
- **Color:** Never use color alone (always include icon + text)

#### Usage Guidelines

**When to use Inline Alerts:**

- Form validation errors (below form)
- Section-specific warnings (above section)
- Contextual information (related to specific content)

**When to use Toast Notifications:**

- Global actions (save, delete, update)
- Background task completion (CSV import finished)
- System notifications (session expiring soon)

**When to use Banner Alerts:**

- System-wide issues (maintenance mode, API outage)
- Critical updates (new features, policy changes)
- Emergency messages (security breach, immediate action required)

**Best practices:**

- Be specific ("Student saved successfully", not "Success")
- Provide actionable next steps ("Click here to view analysis")
- Limit simultaneous toasts (max 3 stacked)
- Don't overuse (toast fatigue is real)
- Use appropriate severity (not everything is an error)

#### Examples

**Success Toast:**

```html
<div class="toast toast-success" role="status">
  <svg class="icon-md"><!-- Checkmark icon --></svg>
  <div>
    <h4>Analysis Saved</h4>
    <p>Marcus Johnson's analysis has been saved successfully.</p>
  </div>
  <button aria-label="Dismiss" class="btn-icon">
    <svg class="icon-sm"><!-- X icon --></svg>
  </button>
</div>
```

**Error Inline Alert:**

```html
<div class="alert alert-error" role="alert">
  <svg class="icon-md"><!-- Error icon --></svg>
  <div>
    <h4>Unable to Save Analysis</h4>
    <p>Please check your internet connection and try again.</p>
    <button class="btn-ghost btn-small">Retry</button>
  </div>
  <button aria-label="Dismiss" class="btn-icon">
    <svg class="icon-sm"><!-- X icon --></svg>
  </button>
</div>
```

---

### 2.11 Loading States

**Purpose:** Indicate that content is being fetched or processed, preventing user confusion.

#### Variants

**Spinner** (Circular loading indicator)

- Size: 24px (default), 16px (small), 32px (large)
- Color: `primary-600` (default), `white` (on dark backgrounds)
- Animation: Rotate 360° continuously (1s linear infinite)

**Skeleton Loader** (Content placeholder)

- Gray blocks in shape of content
- Shimmer animation (left to right)
- Use for: Cards, tables, text blocks

**Progress Bar** (Determinate progress)

- Linear bar showing % complete
- Use for: File uploads, multi-step processes

**Loading Overlay** (Full-screen or section)

- Semi-transparent overlay with spinner
- Blocks interaction during loading

#### Spinner

**Styling:**

```css
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb; /* gray-200 */
  border-top: 3px solid #10507e; /* primary-700 */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

**Accessibility:**

- `role="status"`, `aria-live="polite"`, `aria-label="Loading"`

#### Skeleton Loader

**Styling:**

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f3f4f6 25%,
    /* gray-100 */ #e5e7eb 50%,
    /* gray-200 */ #f3f4f6 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

**Usage:**

- Matches content layout (same dimensions as real content)
- Example: Skeleton for student card = card-shaped block with name, grade placeholders

#### Progress Bar

**Styling:**

- Track: `gray-200`, 8px tall, `rounded-full`
- Fill: `primary-600`, same height, `rounded-full`
- Width: Fill width = percentage × total width

**With Percentage Label:**

```html
<div class="progress-bar">
  <div class="progress-track">
    <div class="progress-fill" style="width: 65%;"></div>
  </div>
  <span class="progress-label">65%</span>
</div>
```

**Accessibility:**

- `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

#### Loading Overlay

**Styling:**

- Overlay: `rgba(255, 255, 255, 0.8)` (80% white) for light backgrounds
- Spinner: Centered (horizontally and vertically)
- Z-index: 10 (above content, below modals)

**Usage:**

- Full-page loading (initial page load)
- Section loading (table refreshing, dashboard updating)

#### Accessibility

- **Screen Reader:** Announce loading status ("Loading student data")
- **ARIA:** `role="status"`, `aria-live="polite"`, `aria-busy="true"` on loading section
- **Focus Management:** Don't trap focus in loading overlay (it's temporary)

#### Usage Guidelines

**When to use Spinner:**

- Quick actions (<2 seconds)
- Button loading state (inline with button text)
- Small sections loading

**When to use Skeleton:**

- Page load (dashboard, student list)
- Perceived performance (show layout immediately)
- Long loading times (>2 seconds)

**When to use Progress Bar:**

- File uploads
- Multi-step wizards (step 2 of 5)
- Known duration processes

**Best practices:**

- Always provide loading feedback (never leave user guessing)
- Use skeleton for initial load (better perceived performance)
- Use spinner for actions triggered by user (button click)
- Timeout after 30 seconds with error message

#### Examples

**Button with Spinner:**

```html
<button class="btn-primary" disabled>
  <svg class="spinner icon-sm"><!-- Spinner --></svg>
  Saving...
</button>
```

**Skeleton for Student Card:**

```html
<div class="card">
  <div class="skeleton skeleton-text" style="width: 60%; height: 24px;"></div>
  <div class="skeleton skeleton-text" style="width: 40%; height: 16px; margin-top: 8px;"></div>
  <div class="skeleton skeleton-text" style="width: 80%; height: 16px; margin-top: 8px;"></div>
</div>
```

---

### 2.12 Empty States

**Purpose:** Communicate when no data exists, and guide user toward action.

#### Anatomy

```
┌─────────────────────────────────────────┐
│                                         │
│          [Illustration or Icon]         │
│                                         │
│          Empty State Title              │
│          Supporting message.            │
│                                         │
│          [Primary Action Button]        │
│                                         │
└─────────────────────────────────────────┘
```

#### Styling

**Container:**

- Centered (horizontally and vertically) in parent
- Padding: 48px (`space-12`)
- Text align: Center

**Icon/Illustration:**

- Size: 64px or 128px (depending on space)
- Color: `gray-400` (subtle)
- Margin bottom: 24px (`space-6`)

**Title:**

- Font size: 20px (`heading-md`)
- Font weight: 600 (semibold)
- Color: `gray-900`
- Margin bottom: 8px (`space-2`)

**Message:**

- Font size: 16px (`body-md`)
- Color: `gray-600`
- Max width: 400px (for readability)
- Margin bottom: 24px (`space-6`)

**Action Button:**

- Primary button (guides user to create content)
- Examples: "Add Your First Student", "Start Analysis"

#### Variants

**No Students Yet** (Teacher dashboard)

- Icon: User icon with plus sign
- Title: "No students yet"
- Message: "Add your first student to start analyzing and tracking progress."
- Action: "Add Student" button

**No Analyses Yet** (Student detail page)

- Icon: Document icon with magnifying glass
- Title: "No analyses for this student"
- Message: "Start your first analysis to identify strengths and areas for improvement."
- Action: "Start Analysis" button

**No Results** (Search or filter)

- Icon: Magnifying glass with X
- Title: "No students found"
- Message: "Try adjusting your filters or search term."
- Action: "Clear Filters" button

**No Data** (Principal dashboard)

- Icon: Chart icon with question mark
- Title: "No data available yet"
- Message: "Analyses will appear here as teachers complete them."
- Action: None (passive state)

#### Accessibility

- **Screen Reader:** Ensure title and message are read
- **Focus:** Action button should be focusable (if present)
- **ARIA:** Use semantic HTML (`<h2>` for title, `<p>` for message)

#### Usage Guidelines

**When to use:**

- Zero state (first-time user, no data created yet)
- Filtered state (search results empty)
- Error state (data failed to load, show error + retry action)

**When NOT to use:**

- Loading state (use Loading component)
- Temporary empty (data is loading, show skeleton)

**Best practices:**

- Be encouraging, not discouraging ("No students yet" vs. "Error: No students")
- Provide clear next step (action button)
- Use friendly, conversational tone
- Consider illustration over icon for friendlier feel

#### Examples

**No Students Empty State:**

```html
<div class="empty-state">
  <svg class="icon-xl text-gray-400"><!-- User + icon --></svg>
  <h2>No students yet</h2>
  <p>Add your first student to start analyzing and tracking progress.</p>
  <button class="btn-primary">Add Student</button>
</div>
```

---

### 2.13 Navigation

**Purpose:** Allow users to navigate between major sections of the application.

#### Variants

**Sidebar Navigation** (Desktop)

- Fixed left sidebar (240px width)
- Vertical list of nav items
- Persistent across pages

**Top Navigation** (Mobile)

- Fixed top bar (60px height)
- Horizontal nav items (scrollable if needed)
- Collapses to hamburger menu on small screens

**Hamburger Menu** (Mobile)

- Slide-in sidebar from left
- Overlay covers main content
- Close button or click overlay to dismiss

#### Styling

**Sidebar Navigation:**

Container:

- Width: 240px (desktop), 280px (tablet)
- Background: `gray-900` (dark theme) or `white` (light theme)
- Border right: 1px solid `gray-200` (light theme)
- Padding: 24px (`space-6`)
- Height: 100vh (full height)
- Position: Fixed

Nav Item (Default):

- Padding: 12px vertical, 16px horizontal
- Font size: 16px (`body-md`)
- Color: `gray-300` (dark theme), `gray-700` (light theme)
- Border radius: 6px
- Margin bottom: 4px

Nav Item (Hover):

- Background: `gray-800` (dark theme), `gray-100` (light theme)
- Color: `white` (dark theme), `gray-900` (light theme)

Nav Item (Active):

- Background: `primary-600`
- Color: `white`
- Font weight: 600 (semibold)
- Border left: 4px solid `primary-400` (optional accent)

Icon + Text:

- Icon size: 20px (`icon-sm`)
- Icon position: Left of text, 12px margin right
- Vertical alignment: Center

**Top Navigation Bar:**

Container:

- Height: 60px
- Background: `white`
- Border bottom: 1px solid `gray-200`
- Padding: 0 24px
- Position: Fixed (sticky at top)

Logo:

- Height: 32px
- Position: Left side

Nav Items:

- Layout: Horizontal (flexbox)
- Font size: 16px (`body-md`)
- Color: `gray-700`
- Padding: 12px horizontal
- Border bottom: 3px solid transparent (active: `primary-600`)

User Menu:

- Position: Right side
- Avatar + dropdown menu
- Click to reveal profile, settings, logout options

#### Sections

**Primary Navigation** (Main sections)

- Dashboard
- Students
- Analytics
- Settings

**Secondary Navigation** (Sub-sections)

- Appears below primary nav (in sidebar) or as tabs (in top nav)
- Example: Students → Roster, Archived

**Footer Navigation** (Help, legal)

- Position: Bottom of sidebar
- Links: Help, Privacy Policy, Terms

#### Accessibility

- **Keyboard:**
  - Tab navigates through nav items
  - Enter activates link
  - Arrow keys navigate (optional enhancement)
- **Screen Reader:**
  - `<nav role="navigation" aria-label="Main">`
  - Current page: `aria-current="page"`
- **Skip Link:** "Skip to main content" link (visible on focus, top of page)

#### Usage Guidelines

**When to use Sidebar:**

- Desktop/tablet views
- Many navigation items (5+)
- Persistent navigation needed

**When to use Top Nav:**

- Mobile views
- Few navigation items (3-5)
- Marketing or public pages

**Best practices:**

- Highlight active page clearly
- Limit primary nav items (5-7 max)
- Use icons + text (not icons alone)
- Provide visual feedback on hover
- Keep navigation consistent across pages

#### Examples

**Sidebar Navigation:**

```html
<nav class="sidebar" aria-label="Main navigation">
  <div class="nav-section">
    <a href="/dashboard" class="nav-item nav-item-active" aria-current="page">
      <svg class="icon-sm"><!-- Dashboard icon --></svg>
      Dashboard
    </a>
    <a href="/students" class="nav-item">
      <svg class="icon-sm"><!-- Students icon --></svg>
      Students
    </a>
    <a href="/analytics" class="nav-item">
      <svg class="icon-sm"><!-- Chart icon --></svg>
      Analytics
    </a>
  </div>
  <div class="nav-section nav-footer">
    <a href="/settings" class="nav-item">
      <svg class="icon-sm"><!-- Settings icon --></svg>
      Settings
    </a>
    <a href="/help" class="nav-item">
      <svg class="icon-sm"><!-- Help icon --></svg>
      Help
    </a>
  </div>
</nav>
```

---

## 3. Data Visualization Components

### 3.1 Charts (Trends, Metrics)

**Purpose:** Display quantitative data visually for insights and trend analysis.

**Library:** Recharts (React-based, composable, accessible)

#### Chart Types

**Bar Chart** (Compare categories)

- Use for: Class comparisons, grade-level metrics
- Orientation: Vertical (default), horizontal (long labels)

**Line Chart** (Show trends over time)

- Use for: Student progress, analysis frequency, trend tracking
- Multiple lines: Compare students or classes

**Pie Chart** (Show proportions)

- Use for: Status distribution (Analyzed vs. Pending)
- Limit slices: 5-7 max (more → combine into "Other")

**Donut Chart** (Variant of pie)

- Same as pie chart, with center label
- Use for: Completion percentage (e.g., "75% analyzed")

**Area Chart** (Show volume over time)

- Use for: Cumulative analyses, stacked categories

#### Styling

**Colors:**

- Use chart palette (colorblind-safe): `chart-1` through `chart-8`
- Avoid red/green only (add patterns if needed)

**Axes:**

- Font size: 12px (`body-xs`)
- Color: `gray-600`
- Grid lines: `gray-200` (subtle)

**Tooltips:**

- Background: `gray-900`
- Text: `white`
- Font size: 14px (`body-sm`)
- Border radius: 6px
- Shadow: `shadow-lg`

**Legend:**

- Position: Below chart (horizontal) or right (vertical)
- Font size: 14px (`body-sm`)
- Color: `gray-700`
- Clickable: Toggle series visibility

#### Accessibility

- **Screen Reader:** Provide data table alternative (visually hidden or toggle)
- **ARIA:** `role="img"`, `aria-label` describing chart purpose
- **Keyboard:** Interactive charts (tooltips, legends) must be keyboard-accessible
- **Color:** Never rely on color alone (use patterns, labels, legends)

#### Usage Guidelines

**When to use charts:**

- Visualize trends (line chart)
- Compare categories (bar chart)
- Show proportions (pie/donut chart)
- Dashboard metrics (small inline charts - sparklines)

**Best practices:**

- Keep charts simple (don't overwhelm with data)
- Label axes clearly
- Provide legend for multi-series charts
- Use appropriate chart type for data (don't force pie chart for time series)
- Responsive: Charts scale down on mobile (or switch to table)

---

## 4. Implementation Notes

### Component Library Framework

**Radix UI + Tailwind CSS**

- Radix UI: Unstyled, accessible primitives
- Tailwind CSS: Utility-first styling
- Custom components built on top

**File Structure:**

```
/apps/web/src/components/
  /ui/
    Button.tsx
    Input.tsx
    Select.tsx
    Modal.tsx
    Card.tsx
    Table.tsx
    ...
  /features/
    StudentCard.tsx
    AnalysisResultCard.tsx
    DashboardMetric.tsx
    ...
```

### Design Handoff Checklist

For each component, designer provides:

- [ ] Figma mockup (all states: default, hover, focus, error, disabled)
- [ ] Spacing annotations (multiples of 8px)
- [ ] Color tokens (CSS variable names, not hex codes)
- [ ] Typography specs (font size, weight, line height)
- [ ] Interaction notes (animations, transitions)
- [ ] Accessibility notes (ARIA labels, keyboard behavior)
- [ ] Responsive variants (mobile, tablet, desktop)

---

## Next Steps

1. **Figma Library:** Designer creates Figma component library matching these specifications
2. **Component Implementation:** Frontend team implements components in Next.js using Radix UI + Tailwind CSS
3. **Storybook:** Document components in Storybook for team reference
4. **Design QA:** Designer reviews implemented components for pixel-perfect accuracy
5. **Create Mockups:** Designer creates high-fidelity mockups for each page (auth, dashboards, analysis interface)

---

**Questions or Feedback?**

- Contact: Designer Agent
- Slack: #design-system
- Figma: [Growth Engine Component Library](https://figma.com/growth-engine-components)
