# Hebrew Name Validation Fix

## Problem
The Students API (`/api/students` POST endpoint) was rejecting Hebrew names with "Name is required" error.

## Root Cause
The original validation code used ASCII-only `String.prototype.trim()` which doesn't properly handle Hebrew Unicode characters (U+0590-U+05FF). This caused Hebrew names to be treated as invalid/empty.

```typescript
// BEFORE (broken for Hebrew):
if (!name || name.trim().length === 0) {
  return NextResponse.json(
    { error: 'Name is required' },
    { status: 400 }
  );
}
```

## Solution
Implemented Unicode-aware validation with:

1. **Unicode Normalization (NFC)**: Converts Hebrew combining characters to canonical form
2. **Unicode-aware Trimming**: Handles Unicode whitespace characters (not just ASCII spaces)
3. **Hebrew Character Validation**: Uses regex pattern from architecture docs
4. **Hebrew Error Messages**: Returns errors in Hebrew as per design requirements

```typescript
// AFTER (supports Hebrew):
const trimUnicode = (str: string): string => {
  if (!str) return '';
  const normalized = str.normalize('NFC'); // Unicode normalization
  return normalized.replace(/^[\s\u200B-\u200D\uFEFF]+|[\s\u200B-\u200D\uFEFF]+$/g, '');
};

const trimmedName = trimUnicode(name);
if (!trimmedName || trimmedName.length === 0) {
  return NextResponse.json(
    { error: 'שם הוא שדה חובה' }, // Hebrew: "Name is required"
    { status: 400 }
  );
}

// Validate Hebrew/English characters only
const namePattern = /^[\u0590-\u05FFa-zA-Z\s'-]+$/;
if (!namePattern.test(trimmedName)) {
  return NextResponse.json(
    { error: 'השם יכול להכיל רק אותיות בעברית או באנגלית' },
    { status: 400 }
  );
}
```

## Test Cases

### Valid Names (should pass)
- "דוד כהן" - Hebrew only
- "David Cohen" - English only
- "David כהן" - Mixed Hebrew/English
- "שרה לוי-כהן" - Hebrew with hyphen
- "ג'ון סמית" - Hebrew with apostrophe

### Invalid Names (should fail with appropriate error)
- "   " - Only whitespace → "שם הוא שדה חובה"
- "" - Empty string → "שם הוא שדה חובה"
- "דוד123" - Contains numbers → "השם יכול להכיל רק אותיות בעברית או באנגלית"
- "דוד@כהן" - Special characters → "השם יכול להכיל רק אותיות בעברית או באנגלית"
- "דוד 😊" - Emoji → "השם יכול להכיל רק אותיות בעברית או באנגלית"

## Testing

Run the validation test suite:

```bash
cd /Users/ronisegal/Projects/growth-engine/packages/frontend
./scripts/test-hebrew-validation.sh
```

This script tests all the above cases against the API endpoint.

## Files Changed

### Modified
- `/packages/frontend/src/app/api/students/route.ts` (lines 90-134)
  - Added `trimUnicode()` helper function
  - Updated name validation to use Unicode-aware pattern
  - Added Hebrew error messages
  - Applied same normalization to grade and class fields

### Added
- `/packages/frontend/scripts/test-hebrew-validation.sh` - Test script for validation
- `/packages/frontend/HEBREW_VALIDATION_FIX.md` - This documentation

## Architecture Compliance

This fix implements the Hebrew & Unicode requirements from:
- `/docs/ARCHITECTURE.md` - Section: "Hebrew & Internationalization (i18n)"
- `/docs/DATABASE_SCHEMA.md` - Section: "Hebrew & Unicode Support"

Specifically:
- Unicode range: U+0590-U+05FF (Hebrew block)
- Regex pattern: `/^[\u0590-\u05FFa-zA-Z\s'-]+$/`
- Unicode normalization: NFC (Canonical Composition)
- Error messages: Hebrew (he-IL locale)

## Related Tickets
- GE-050: 3-Day MVP - Authentication Backend Implementation
- GE-052: 3-Day MVP - Student Management Backend
- GE-053: 3-Day MVP - Student Management Frontend

## Notes
- The same `trimUnicode()` pattern should be applied to other text input validation endpoints
- Consider extracting `trimUnicode()` to a shared utility file (`/app/api/lib/validation.ts`)
- Grade validation also updated to support Hebrew class names (e.g., "כיתה א")
