# Authentication UI/UX Mockup

**Feature:** Authentication (Login, Registration, Password Reset, SSO)
**Designer Ticket:** GE-009
**Epic:** authentication
**Status:** Complete
**Last Updated:** December 30, 2025

---

## Overview

The authentication interface is the first touchpoint for all users (teachers and principals). It must build trust, provide multiple sign-in options (email/password and SSO), and accommodate users with varying technical proficiency.

**Design Goals:**
- Build trust through professional, clean design
- Prioritize SSO (Google/Microsoft) as primary auth method
- Support email/password as fallback
- Minimize cognitive load with clear, focused screens
- Mobile-responsive for teachers using tablets

**Target Personas:**
- Sarah Chen (moderate tech proficiency) - should find it simple
- Marcus Thompson (advanced tech) - should feel modern and efficient
- Jennifer Rodriguez (high tech) - should be fast and streamlined

---

## User Flow

```
Landing/Login Page
    ↓
    ├─→ SSO (Google/Microsoft) → OAuth Redirect → Dashboard
    ├─→ Email/Password Login → Dashboard
    ├─→ Forgot Password → Reset Email Sent → Reset Password Page → Success → Login
    └─→ Create Account → Registration Form → Email Verification → Dashboard
```

---

## Page Mockups

### 1. Login Page (Primary Screen)

**Layout:** Centered card on light background

```
┌─────────────────────────────────────────────────────────────────┐
│                        [Light gray-50 background]                │
│                                                                  │
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │                                             │          │
│        │         [Growth Engine Logo]                │          │
│        │      Empower Every Student                  │          │
│        │                                             │          │
│        │  ─────────────────────────────────────────  │          │
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  [Google Icon] Sign in with Google   │ │          │ ← Primary CTA (white bg, gray-300 border)
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  [Microsoft Icon] Sign in with       │ │          │ ← Primary CTA (white bg, gray-300 border)
│        │   │  Microsoft                           │ │          │
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │              ───── or ─────                 │          │ ← Divider with text
│        │                                             │          │
│        │   Email Address *                           │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  you@school.edu                      │ │          │
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   Password *                                │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  ••••••••••              [👁]        │ │          │ ← Show/hide toggle
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   ☐ Remember me for 30 days                │          │ ← Checkbox (optional)
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │           Sign In                    │ │          │ ← Primary button (primary-700)
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   Forgot password?  ·  Create account      │          │ ← Text links (primary-700)
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                  │
│                  Privacy Policy  ·  Terms of Service            │ ← Footer links (gray-600, small)
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Detailed Specifications:**

**Container:**
- Width: 480px (max)
- Background: white
- Border radius: 12px (rounded-xl)
- Shadow: shadow-xl
- Padding: 48px (space-12)
- Centered horizontally and vertically

**Logo & Header:**
- Logo: 48px height
- Tagline: 18px (body-lg), gray-600
- Margin bottom: 32px (space-8)

**SSO Buttons:**
- Height: 48px
- Width: 100%
- Border: 1px solid gray-300
- Border radius: 8px (rounded-lg)
- Font size: 16px (body-md), font-weight: 500
- Icon: 20px (icon-sm), positioned left with 12px margin-right
- Hover: gray-50 background, gray-400 border
- Focus: 3px ring (primary-500 at 50% opacity)
- Margin bottom: 12px (space-3) between buttons

**Divider:**
- Line: gray-200, 1px
- Text: "or" in gray-600, 12px (body-xs), uppercase
- Margin: 24px (space-6) top and bottom

**Form Inputs:**
- Label: 14px (body-sm), font-weight: 600, gray-700, margin-bottom: 8px
- Input field: Height 48px, padding: 12px vertical, 16px horizontal
- Border: 1px solid gray-300
- Border radius: 6px (rounded-md)
- Font size: 16px (body-md)
- Placeholder: gray-500
- Focus: Border primary-500 (2px), 3px ring (primary-500 at 50% opacity)
- Error: Border error-600 (2px), background error-50

**Password Toggle:**
- Eye icon: 20px (icon-sm), gray-600
- Position: Absolute right, vertical center
- Hover: gray-900
- Click: Toggle between "password" and "text" input type

**Remember Me Checkbox:**
- Checkbox: 20px square, border 2px gray-300, border-radius: 3px
- Checked: Background primary-700, checkmark white
- Label: 14px (body-sm), gray-700, margin-left: 8px
- Margin: 16px (space-4) top and bottom

**Sign In Button:**
- Height: 48px
- Width: 100%
- Background: primary-700
- Text: white, 16px (body-md), font-weight: 500
- Border radius: 8px (rounded-lg)
- Hover: primary-600
- Active: primary-800, transform: scale(0.98)
- Focus: 3px ring (primary-500 at 50% opacity)
- Disabled: gray-300 background, gray-500 text, cursor: not-allowed
- Margin top: 24px (space-6)

**Footer Links:**
- Font size: 14px (body-sm)
- Color: primary-700 (links)
- Hover: primary-600, underline
- Separator: " · " in gray-400
- Margin top: 16px (space-4)

**Responsive Behavior:**
- Mobile (<640px): Container width 100%, padding 24px (space-6), full-screen centered
- Tablet (640-1024px): Container width 480px, same centered layout
- Desktop (1024px+): Container width 480px, background pattern or illustration (optional)

---

### 2. Login Page - Loading State

**Changes from default:**
- Sign In button shows spinner + "Signing in..." text
- Button disabled (gray-300 background)
- SSO buttons and email/password inputs disabled (opacity: 0.6)

```
┌──────────────────────────────────────┐
│   [Spinner] Signing in...            │ ← Button with spinner (primary-700)
└──────────────────────────────────────┘
```

**Spinner:**
- Size: 20px (icon-sm)
- Color: white
- Animation: Rotate 360° (1s linear infinite)
- Position: Left of text, margin-right: 8px

---

### 3. Login Page - Error State

**Example Error: Invalid Credentials**

```
┌─────────────────────────────────────────────────────────────┐
│   Email Address *                                           │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  you@school.edu                                      │  │ ← Border: error-600 (2px)
│   └──────────────────────────────────────────────────────┘  │   Background: error-50
│                                                             │
│   Password *                                                │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  ••••••••••              [👁]                        │  │ ← Border: error-600 (2px)
│   └──────────────────────────────────────────────────────┘  │   Background: error-50
│                                                             │
│   [X Icon] Invalid email or password. Please try again.    │ ← Error message (error-700, icon error-600)
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │           Sign In                                    │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Error Message:**
- Background: error-100
- Border-left: 4px solid error-600
- Padding: 12px (space-3)
- Border radius: 6px (rounded-md)
- Font size: 14px (body-sm), color: error-700
- Icon: X in circle (icon-sm), error-600, margin-right: 8px
- Margin top: 16px (space-4), margin-bottom: 16px (space-4)

**Error Variants:**
- "Invalid email or password. Please try again."
- "Your account has been locked. Please contact your administrator."
- "Unable to connect. Please check your internet connection."

---

### 4. Registration Page

**Layout:** Multi-step form (consider single page for MVP simplicity)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │                                             │          │
│        │         [Growth Engine Logo]                │          │
│        │      Create Your Account                    │          │
│        │                                             │          │
│        │  ─────────────────────────────────────────  │          │
│        │                                             │          │
│        │   Full Name *                               │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  Sarah Chen                          │ │          │
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   Email Address *                           │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  sarah.chen@lincoln.edu              │ │          │
│        │   └──────────────────────────────────────┘ │          │
│        │   This will be your login email            │          │ ← Helper text (gray-600, 12px)
│        │                                             │          │
│        │   Password *                                │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  ••••••••••              [👁]        │ │          │
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   Password must contain:                    │          │ ← Password requirements
│        │   ✓ At least 8 characters                   │          │ ← Checkmark when met (secondary-600)
│        │   ✓ Uppercase and lowercase letters         │          │
│        │   ✓ At least one number                     │          │
│        │   ○ Special character (recommended)         │          │ ← Unchecked (gray-400)
│        │                                             │          │
│        │   Role *                                    │          │
│        │   ○ Teacher    ● Principal                  │          │ ← Radio buttons
│        │                                             │          │
│        │   School (Optional)                         │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  Lincoln Elementary School           │ │          │
│        │   └──────────────────────────────────────┘ │          │
│        │   Your school may provide an access code   │          │ ← Helper text
│        │                                             │          │
│        │   ☑ I agree to the Terms of Service and    │          │ ← Checkbox required
│        │       Privacy Policy                        │          │
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │       Create Account                 │ │          │ ← Primary button
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   Already have an account? Sign in         │          │ ← Link to login
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Detailed Specifications:**

**Password Strength Indicator:**
- Checklist: 12px (body-xs), gray-700
- Met: Checkmark icon (secondary-600), text (gray-700)
- Unmet: Circle icon (gray-400), text (gray-500)
- Margin top: 8px (space-2)
- Each item: 4px (space-1) margin bottom

**Role Selection (Radio Buttons):**
- Radio size: 20px diameter
- Unselected: Border 2px gray-300, background white
- Selected: Border 2px primary-700, inner circle 10px primary-700
- Label: 16px (body-md), gray-900, margin-left: 8px
- Layout: Horizontal (if space allows), vertical on mobile
- Margin: 12px (space-3) between options

**Terms & Privacy Checkbox:**
- Checkbox: 20px square, border 2px gray-300
- Checked: Background primary-700, checkmark white
- Label: 14px (body-sm), gray-700
- Links in label: primary-700, underline on hover
- Margin: 20px (space-5) top and bottom

**Validation:**
- Real-time validation on blur (not every keystroke)
- Email: Check format (regex)
- Password: Update checklist as user types
- Name: Minimum 2 characters
- Terms: Must be checked to enable "Create Account" button

---

### 5. Registration Success Screen

**After account creation:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │                                             │          │
│        │         [Checkmark Icon - Large]            │          │ ← 48px icon, secondary-600
│        │                                             │          │
│        │        Account Created Successfully!        │          │ ← heading-xl (30px)
│        │                                             │          │
│        │   We've sent a verification email to        │          │ ← body-md (16px)
│        │   sarah.chen@lincoln.edu                    │          │ ← gray-900, semibold
│        │                                             │          │
│        │   Please check your inbox and click the     │          │
│        │   verification link to activate your        │          │
│        │   account.                                  │          │
│        │                                             │          │
│        │   Didn't receive the email?                 │          │
│        │   Check spam or Resend verification email   │          │ ← Link (primary-700)
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │       Go to Dashboard                │ │          │ ← Primary button (if verified)
│        │   └──────────────────────────────────────┘ │          │   or "Waiting for verification..." (disabled)
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- If user clicks "Go to Dashboard" without verifying email, show banner: "Please verify your email to access all features"
- Auto-refresh every 10 seconds to check verification status
- "Resend verification email" link: Shows toast notification "Email sent!" on click, disables for 60 seconds to prevent spam

---

### 6. Forgot Password Page

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │                                             │          │
│        │         [Growth Engine Logo]                │          │
│        │         Reset Your Password                 │          │
│        │                                             │          │
│        │  ─────────────────────────────────────────  │          │
│        │                                             │          │
│        │   Enter your email address and we'll send   │          │ ← body-md (16px), gray-700
│        │   you a link to reset your password.        │          │
│        │                                             │          │
│        │   Email Address *                           │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  you@school.edu                      │ │          │
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │       Send Reset Link                │ │          │ ← Primary button
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   Remember your password? Sign in          │          │ ← Link to login
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 7. Password Reset Email Sent Confirmation

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │                                             │          │
│        │         [Email Icon - Large]                │          │ ← 48px icon, info-600
│        │                                             │          │
│        │          Check Your Email                   │          │ ← heading-xl (30px)
│        │                                             │          │
│        │   We've sent a password reset link to       │          │ ← body-md (16px)
│        │   you@school.edu                            │          │ ← gray-900, semibold
│        │                                             │          │
│        │   Click the link in the email to reset      │          │
│        │   your password. The link expires in        │          │
│        │   30 minutes.                               │          │
│        │                                             │          │
│        │   Didn't receive the email?                 │          │
│        │   Check spam or Resend reset link           │          │ ← Link (primary-700)
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │       Back to Sign In                │ │          │ ← Secondary button
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8. Reset Password Page (Accessed from Email Link)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │                                             │          │
│        │         [Growth Engine Logo]                │          │
│        │      Create a New Password                  │          │
│        │                                             │          │
│        │  ─────────────────────────────────────────  │          │
│        │                                             │          │
│        │   New Password *                            │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  ••••••••••              [👁]        │ │          │
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   Password must contain:                    │          │
│        │   ✓ At least 8 characters                   │          │
│        │   ✓ Uppercase and lowercase letters         │          │
│        │   ✓ At least one number                     │          │
│        │   ○ Special character (recommended)         │          │
│        │                                             │          │
│        │   Confirm New Password *                    │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │  ••••••••••              [👁]        │ │          │
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │       Reset Password                 │ │          │ ← Primary button
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Validation:**
- New password: Must meet all requirements (checklist updates in real-time)
- Confirm password: Must match new password exactly
- If mismatch: Show error "Passwords do not match" below confirm field
- If expired token: Show error banner "This reset link has expired. Please request a new one."

---

### 9. Reset Password Success

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │                                             │          │
│        │         [Checkmark Icon - Large]            │          │ ← 48px icon, secondary-600
│        │                                             │          │
│        │      Password Reset Successfully!           │          │ ← heading-xl (30px)
│        │                                             │          │
│        │   Your password has been updated. You can   │          │ ← body-md (16px)
│        │   now sign in with your new password.       │          │
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │       Sign In                        │ │          │ ← Primary button
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Auto-redirect to login page after 3 seconds
- "Sign In" button immediately redirects to login page

---

### 10. SSO Flow - OAuth Redirect Loading

**When user clicks "Sign in with Google" or "Sign in with Microsoft":**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                                                                  │
│                                                                  │
│                     [Spinner - Large]                            │ ← 48px spinner, primary-700
│                                                                  │
│                Redirecting to Google...                          │ ← body-lg (18px), gray-700
│                                                                  │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Full-screen loading overlay (white background, centered content)
- Text updates based on provider: "Redirecting to Google..." or "Redirecting to Microsoft..."
- Auto-redirect to OAuth provider in <2 seconds
- If redirect fails after 5 seconds: Show error "Unable to connect to [Provider]. Please try again or sign in with email."

---

### 11. SSO Callback Processing Screen

**After user authorizes on Google/Microsoft and returns to app:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                                                                  │
│                                                                  │
│                     [Spinner - Large]                            │ ← 48px spinner, primary-700
│                                                                  │
│                Completing sign-in...                             │ ← body-lg (18px), gray-700
│                                                                  │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Processes OAuth token exchange
- Creates or updates user session
- On success: Redirect to dashboard (or onboarding if first-time user)
- On error: Redirect to login with error message

---

### 12. SSO Error States

**Example: User Denied OAuth Consent**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │                                             │          │
│        │         [Warning Icon - Large]              │          │ ← 48px icon, warning-600
│        │                                             │          │
│        │      Sign-In Cancelled                      │          │ ← heading-xl (30px)
│        │                                             │          │
│        │   You cancelled the Google sign-in process. │          │ ← body-md (16px)
│        │   No account access was granted.            │          │
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │       Try Again                      │ │          │ ← Primary button
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   Or sign in with email                     │          │ ← Link to login
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Other SSO Error Variants:**
- "Account Not Found: This email is not registered. Please create an account first."
- "SSO Failed: Unable to verify your [Google/Microsoft] account. Please try again or contact support."
- "Permission Required: Growth Engine needs access to your email address to create your account."

---

### 13. Account Linking Screen

**When SSO email matches existing email/password account:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│        ┌─────────────────────────────────────────────┐          │
│        │                                             │          │
│        │         [Info Icon - Large]                 │          │ ← 48px icon, info-600
│        │                                             │          │
│        │      Link Your Account?                     │          │ ← heading-xl (30px)
│        │                                             │          │
│        │   An account with sarah.chen@lincoln.edu    │          │ ← body-md (16px)
│        │   already exists.                           │          │
│        │                                             │          │
│        │   Would you like to link your Google account│          │
│        │   to your existing Growth Engine account?   │          │
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │       Link Accounts                  │ │          │ ← Primary button
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   ┌──────────────────────────────────────┐ │          │
│        │   │       Cancel                         │ │          │ ← Secondary button
│        │   └──────────────────────────────────────┘ │          │
│        │                                             │          │
│        │   You can sign in with either email or      │          │ ← Helper text (gray-600, 12px)
│        │   Google after linking.                     │          │
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- "Link Accounts" → Merge accounts, redirect to dashboard
- "Cancel" → Return to login page

---

## Component Usage (From COMPONENTS.md)

### Components Used in Authentication:

1. **Buttons**
   - Primary Button: "Sign In", "Create Account", "Reset Password"
   - Secondary Button: "Cancel", "Back to Sign In"
   - Ghost Button: "Try Again", links
   - Link Button: "Forgot password?", "Create account", "Sign in"

2. **Form Inputs**
   - Text Input: Name, Email
   - Password Input: Password with show/hide toggle
   - Checkbox: "Remember me", "I agree to Terms"
   - Radio Buttons: Role selection (Teacher/Principal)

3. **Alerts / Notifications**
   - Error Inline Alert: Invalid credentials, validation errors
   - Success Toast: "Account created successfully!"
   - Info Banner: "Please verify your email to access all features"

4. **Loading States**
   - Spinner: Button loading, page loading, SSO redirect
   - Full-screen loading overlay: OAuth processing

5. **Modals / Dialogs**
   - Not used in auth (all full-page screens)

6. **Cards**
   - Login/Registration container card (white card on gray background)

---

## Responsive Behavior

### Desktop (1024px+)
- Container: 480px width, centered
- Background: Subtle pattern or illustration (optional, e.g., abstract shapes in primary-50)
- Logo: 48px height
- Font sizes: As specified in design system

### Tablet (640-1024px)
- Container: 480px width, centered
- Background: Solid gray-50
- Same layout as desktop

### Mobile (<640px)
- Container: 100% width, padding 24px (space-6) sides
- Logo: 40px height (slightly smaller)
- Font sizes: Slightly reduced (heading-xl → heading-lg for page titles)
- SSO buttons: Full width, stacked vertically
- Form inputs: Full width
- Bottom sheet for password requirements (collapsible on mobile)

---

## Accessibility Considerations

### Keyboard Navigation
- Tab order: Logo → SSO buttons → Email input → Password input → Remember me → Sign In → Links
- Enter key: Submit form from any input field
- Escape key: Clear focused input (if typed)
- Space key: Toggle checkbox/radio buttons

### Screen Reader Support
- Page title: "Sign In - Growth Engine" (for browser tab and screen readers)
- ARIA labels:
  - "Sign in with Google button"
  - "Sign in with Microsoft button"
  - "Email address input, required"
  - "Password input with show/hide toggle, required"
  - "Remember me for 30 days checkbox"
  - "Sign In button"
- Form validation: `aria-invalid="true"` on error, `aria-describedby` links to error message
- Loading states: `role="status"`, `aria-live="polite"`, `aria-label="Signing in, please wait"`

### Focus Management
- Login page: Autofocus on email input (first interactive element)
- Registration page: Autofocus on name input
- Forgot password: Autofocus on email input
- Reset password: Autofocus on new password input
- Error state: Focus on first field with error

### Color Contrast
- All text meets WCAG 2.1 AA standards (4.5:1 for body text, 3:1 for large text)
- Error states: error-700 text on error-100 background (9.2:1 contrast)
- Primary buttons: white text on primary-700 background (7.8:1 contrast)
- Links: primary-700 on white background (7.8:1 contrast)

### Error Handling
- Never use color alone: Errors have icon + text + border
- Error messages are descriptive: "Invalid email or password" (not "Error")
- Inline validation: Show errors on blur, not on every keystroke (less annoying)
- Helpful guidance: "Password must contain at least 8 characters" (not "Password invalid")

---

## Interactive States Summary

### All Interactive Elements

**Default → Hover → Focus → Active → Disabled**

**SSO Buttons:**
- Default: White background, gray-300 border
- Hover: gray-50 background, gray-400 border
- Focus: 3px ring (primary-500 at 50%)
- Active: gray-100 background, transform: scale(0.98)
- Disabled: gray-100 background, gray-400 text, cursor: not-allowed

**Primary Button (Sign In, Create Account):**
- Default: primary-700 background, white text
- Hover: primary-600 background
- Focus: 3px ring (primary-500 at 50%)
- Active: primary-800 background, transform: scale(0.98)
- Disabled: gray-300 background, gray-500 text, cursor: not-allowed

**Text Input:**
- Default: gray-300 border, white background
- Hover: gray-400 border
- Focus: primary-500 border (2px), 3px ring (primary-500 at 50%)
- Error: error-600 border (2px), error-50 background
- Disabled: gray-200 border, gray-100 background, gray-500 text

**Checkbox/Radio:**
- Default (unchecked): gray-300 border, white background
- Hover: gray-400 border, gray-50 background
- Focus: 3px ring (primary-500 at 50%)
- Checked: primary-700 background and border, white checkmark/dot
- Disabled: gray-200 border, gray-100 background

**Links:**
- Default: primary-700 text, no underline
- Hover: primary-600 text, underline
- Focus: 3px ring (primary-500 at 50%)
- Active: primary-800 text
- Visited: Same as default (no special visited state)

---

## Edge Cases & Error Scenarios

### Account Locked
- After 5 failed login attempts: Show error "Your account has been locked for security. Reset your password or contact support."
- Provide "Reset Password" link in error message
- Lock expires after 30 minutes

### Email Not Verified
- User can log in but sees banner: "Please verify your email to access all features. Resend verification email"
- Some features disabled until verified (e.g., cannot export PDFs)

### Expired Reset Token
- If user clicks old password reset link: Show error "This reset link has expired. Please request a new one."
- Provide "Request New Link" button (pre-fills email from expired token if available)

### Network Error
- If login request fails: Show error "Unable to connect. Please check your internet connection and try again."
- Provide "Retry" button
- Disable form temporarily (3 seconds) to prevent spam

### SSO Domain Mismatch
- If school requires SSO with specific domain (e.g., @lincoln.edu): Block email/password login, show: "Your school requires signing in with Google Workspace. Please use your @lincoln.edu email."

### Duplicate Account
- If user tries to create account with existing email: Show error "An account with this email already exists. Sign in or reset your password."
- Provide "Sign In" and "Forgot Password" links

### Browser Compatibility
- Tested on: Chrome, Firefox, Safari, Edge (latest 2 versions)
- IE 11: Not supported (show banner: "Please use a modern browser like Chrome, Firefox, or Edge")
- Mobile browsers: Chrome (Android), Safari (iOS)

---

## Microcopy & Messaging

### General Tone
- Friendly but professional
- Clear and concise
- Supportive, not technical
- Avoid jargon

### Example Messages

**Success:**
- "Welcome back, Sarah!"
- "Account created successfully!"
- "Password reset successfully! You can now sign in."

**Error (Friendly):**
- "Invalid email or password. Please try again." (not "Authentication failed")
- "Please enter a valid email address." (not "Invalid input")
- "Your account is locked. Please reset your password." (not "Error 403: Account locked")

**Helper Text:**
- "This will be your login email" (under email input in registration)
- "Your school may provide an access code" (under school input)
- "We'll never share your password" (reassurance)

**Call-to-Action:**
- "Sign In" (not "Login" or "Submit")
- "Create Account" (not "Register" or "Sign Up")
- "Send Reset Link" (not "Submit Request")

---

## Design Assets Needed

### Icons
- Google logo (SVG, official brand icon) - 20px (icon-sm) for SSO button
- Microsoft logo (SVG, official brand icon) - 20px (icon-sm) for SSO button
- Eye icon (show password) - Heroicon: eye - 20px (icon-sm)
- Eye-slash icon (hide password) - Heroicon: eye-slash - 20px (icon-sm)
- Checkmark icon (success) - Heroicon: check-circle (solid) - 48px (icon-xl) for large status
- X icon (error) - Heroicon: x-circle (solid) - 20px (icon-sm) for inline errors
- Warning icon (caution) - Heroicon: exclamation-triangle (solid) - 48px (icon-xl) for large status
- Info icon (information) - Heroicon: information-circle (solid) - 48px (icon-xl) for large status
- Email icon (email sent) - Heroicon: envelope (solid) - 48px (icon-xl) for large status
- Spinner icon (loading) - Heroicon: arrow-path (animated) - 20px (icon-sm) in buttons, 48px (icon-xl) for full-page loading

### Logo
- Growth Engine logo (SVG)
- Minimum size: 40px height (mobile)
- Recommended size: 48px height (desktop)
- Color: Full-color (primary-700 + accent)
- Monochrome variant: For favicons, small sizes

### Background (Optional)
- Abstract pattern or illustration (subtle, primary-50 tint)
- Educational-themed illustration (e.g., geometric shapes, books, growth metaphor)
- Low opacity (10-20%) to not distract from content

---

## Figma Link

**Placeholder for Figma Design File:**
[Figma: Growth Engine - Authentication UI](https://figma.com/growth-engine-auth)

**Prototype Link:**
[Figma Prototype: Auth Flow](https://figma.com/proto/growth-engine-auth)

---

## Implementation Notes

### Frontend Framework
- Next.js 14+ (App Router)
- React 18+
- Tailwind CSS 3+ for styling
- Radix UI for accessible form primitives

### Authentication Library
- NextAuth.js for SSO (Google, Microsoft OAuth)
- Custom email/password with JWT tokens
- Password hashing: bcrypt or Argon2

### Form Validation
- Zod for schema validation
- React Hook Form for form state management
- Real-time validation on blur (not on keystroke)

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Special character recommended (not required for MVP)

### Security
- HTTPS only (enforce HSTS)
- CSRF protection (NextAuth.js built-in)
- Rate limiting: 5 login attempts per 15 minutes
- Password reset tokens: Expire after 30 minutes, single-use
- Session tokens: HTTP-only cookies, secure flag, SameSite=Strict

### Analytics
- Track events:
  - Login success/failure
  - Registration success/failure
  - SSO provider used (Google vs. Microsoft)
  - Password reset requested/completed
  - Average time to login
- Privacy: No PII in analytics (use hashed user IDs)

---

## Testing Checklist

### Functionality
- [ ] Email/password login works
- [ ] Google SSO login works
- [ ] Microsoft SSO login works
- [ ] Registration creates account
- [ ] Email verification sends email and verifies
- [ ] Password reset sends email
- [ ] Password reset updates password
- [ ] "Remember me" persists session for 30 days
- [ ] Account linking works when SSO email matches existing account
- [ ] Form validation prevents invalid inputs
- [ ] Error messages display correctly

### Accessibility
- [ ] All text meets WCAG 2.1 AA contrast ratios
- [ ] Keyboard navigation works (Tab, Enter, Space, Escape)
- [ ] Focus visible on all interactive elements
- [ ] Screen reader announces all elements correctly
- [ ] Form errors associated with inputs (aria-describedby)
- [ ] Loading states announced to screen readers

### Responsive
- [ ] Mobile (<640px): Layout works, touch targets adequate
- [ ] Tablet (640-1024px): Layout centered, all features accessible
- [ ] Desktop (1024px+): Optimal layout, background pattern visible

### Security
- [ ] HTTPS enforced
- [ ] Passwords not visible in network tab
- [ ] Session tokens HTTP-only and secure
- [ ] Rate limiting prevents brute force
- [ ] Password reset tokens expire
- [ ] CSRF protection enabled

### Browser Compatibility
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)
- [ ] Mobile Safari (iOS 14+)
- [ ] Mobile Chrome (Android 10+)

---

## Open Questions

1. **SSO-Only Schools:** Should we allow email/password login for schools that require SSO only? (Decision: Add setting per school to disable email/password login)

2. **First-Time User Onboarding:** Should we show a welcome modal/tour after first login? (Decision: Defer to post-MVP, use contextual tooltips instead)

3. **Multi-Factor Authentication (MFA):** Required for MVP? (Decision: No, defer to post-MVP security enhancement)

4. **Password-less Login:** Magic links via email? (Decision: No, defer to Phase 2)

5. **Session Timeout:** How long before requiring re-authentication? (Decision: 7 days default, 30 days with "Remember me")

6. **Account Deletion:** Self-serve or require admin approval? (Decision: Admin approval only, FERPA compliance concern)

---

## Summary

This authentication UI provides:
- **Trust-building** design with professional, clean layout
- **Multiple auth options** (SSO preferred, email/password fallback)
- **Comprehensive flows** (login, registration, password reset, SSO, account linking)
- **Accessibility-first** approach (WCAG 2.1 AA compliant, keyboard navigation, screen reader support)
- **Mobile-responsive** design (works on phones, tablets, desktops)
- **Clear error handling** with friendly, actionable messages
- **Security best practices** (HTTPS, rate limiting, password requirements, session management)

Ready for frontend implementation with complete specifications, component usage, and edge case handling.
