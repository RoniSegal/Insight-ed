# @growth-engine/shared

Shared TypeScript types, constants, and utilities for Growth Engine monorepo.

## Contents

- **types/** - Shared TypeScript interfaces and enums
- **constants/** - Application-wide constants
- **utils/** - Utility functions

## Usage

Import shared types in other packages:

```typescript
import { User, UserRole, ApiResponse } from '@growth-engine/shared';
```

## Development

```bash
# Build the package
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev

# Type checking
npm run type-check
```
