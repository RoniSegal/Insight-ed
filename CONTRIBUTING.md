# Contributing to Growth Engine

Thank you for contributing to Growth Engine! This document provides guidelines for development.

## Development Workflow

### 1. Setting Up Your Environment

```bash
# Install dependencies
npm install

# Build shared package (required before running frontend/backend)
npm run build --workspace=@growth-engine/shared

# Start development servers
npm run dev
```

### 2. Making Changes

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the appropriate package:
   - **Frontend changes:** `packages/frontend/`
   - **Backend changes:** `packages/backend/`
   - **Shared types:** `packages/shared/`

3. Follow coding standards:
   - Use TypeScript strict mode
   - Write tests for new features
   - Follow ESLint rules
   - Format code with Prettier

### 3. Testing Your Changes

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Tests
npm run test

# Format check
npm run format:check
```

### 4. Committing Changes

We use **Husky** for pre-commit hooks that automatically:
- Run ESLint on staged files
- Format code with Prettier
- Run type checking

```bash
# Stage your changes
git add .

# Commit (pre-commit hooks will run automatically)
git commit -m "feat: add new feature"
```

### Commit Message Conventions

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat: add student CSV import
fix: resolve authentication bug
docs: update API documentation
refactor: simplify dashboard queries
```

## Code Style Guidelines

### TypeScript

- Use strict mode
- Prefer `interface` over `type` for object shapes
- Use explicit return types for public functions
- Avoid `any` - use `unknown` if type is truly unknown

**Good:**
```typescript
interface Student {
  id: string;
  name: string;
}

function getStudent(id: string): Promise<Student> {
  // ...
}
```

**Bad:**
```typescript
function getStudent(id: any): any {
  // ...
}
```

### React / Next.js

- Use functional components with hooks
- Prefer named exports over default exports (except pages)
- Use TypeScript for component props
- Keep components small and focused

**Good:**
```typescript
interface StudentCardProps {
  student: Student;
  onSelect: (id: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onSelect }) => {
  return <div onClick={() => onSelect(student.id)}>{student.name}</div>;
};
```

### NestJS / Backend

- Use dependency injection
- Follow module-based architecture
- Use DTOs for validation
- Write unit tests for services

**Good:**
```typescript
@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<Student> {
    return this.prisma.student.findUnique({ where: { id } });
  }
}
```

## Package-Specific Guidelines

### Shared Package

When adding to `@growth-engine/shared`:

1. Add types to `src/types/`
2. Add constants to `src/constants/`
3. Add utilities to `src/utils/`
4. Export from `src/index.ts`
5. Rebuild package: `npm run build --workspace=@growth-engine/shared`

### Frontend Package

- Use Next.js App Router (`src/app/`)
- Use Tailwind CSS for styling
- Use Zustand for state management
- Support RTL (Hebrew) layout

### Backend Package

- Follow NestJS modular architecture
- Use Prisma for database access
- Write API endpoints according to API_CONTRACT.md
- Add Swagger documentation with decorators

## Testing Guidelines

### Unit Tests

- Write tests for all business logic
- Use Jest for testing
- Aim for 80%+ code coverage

```typescript
describe('StudentsService', () => {
  it('should find a student by ID', async () => {
    const student = await service.findOne('student-id');
    expect(student).toBeDefined();
  });
});
```

### E2E Tests

- Test critical user flows
- Use Playwright for E2E tests
- Cover happy paths and error cases

## Documentation

- Update documentation when adding features
- Add JSDoc comments for public APIs
- Update API_CONTRACT.md when adding endpoints
- Update DATABASE_SCHEMA.md when changing models

## Pull Request Process

1. **Ensure all checks pass:**
   - `npm run lint`
   - `npm run type-check`
   - `npm run test`
   - `npm run build`

2. **Update documentation** if needed

3. **Create pull request** with:
   - Clear title following commit conventions
   - Description of changes
   - Link to related ticket (if applicable)

4. **Request review** from team members

5. **Address feedback** and push updates

6. **Merge** once approved and checks pass

## Questions?

If you have questions or need help, please:
- Check existing documentation in `/docs`
- Review tickets in `/tickets`
- Ask in team chat or create a discussion

Thank you for contributing! 🎉
