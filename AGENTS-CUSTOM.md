# Agent Instructions - Root Level (Playwright MCP Framework)

This file contains general instructions for AI agents working in this Playwright MCP project.

## Project Overview

This is a Playwright test automation framework with:
- **Test Framework**: Playwright for E2E testing
- **Architecture**: MCP (Model Context Protocol) integration
- **API Testing**: REST API endpoints
- **Visual Testing**: Screenshot-based regression testing
- **Agent Support**: Claude skills and workflows

## Project Structure

```
playwright-mcp/
├── .claude/                   # Agent configuration
│   ├── skills/               # Reusable agent skills
│   │   └── write-e2e-test/  # E2E test writing skill
│   └── hooks/                # Validation hooks (ESLint, etc.)
├── agents/                   # Agent configurations
├── workflows/                # Automation workflows
├── .vscode/                  # VS Code settings
├── specs/                    # Test specifications (or tests/)
│   ├── fixtures/            # Test fixtures and helpers
│   └── *.spec.ts            # Test files
├── test-results/            # Test execution results
├── tests/                   # Additional test files
├── playwright.config.ts     # Playwright configuration
└── package.json            # Dependencies and scripts
```

## General Coding Standards

### Code Quality
- Write clean, readable, maintainable code
- Follow existing code style and patterns
- Add comments for complex logic only
- Keep functions small and focused
- Use meaningful variable and function names
- Follow TypeScript best practices

### Testing Philosophy
- Tests should be reliable and deterministic
- Avoid flaky tests at all costs
- Tests should be independent and parallelizable
- Prefer integration tests over excessive mocking
- Test user workflows, not implementation details
- Use proper waiting strategies (no arbitrary timeouts)

### File Organization
- Group related files together
- One test feature per spec file
- Co-locate fixtures with tests
- Use clear, descriptive file names
- Follow the existing folder structure (specs/ or tests/)

## Framework-Specific Patterns

### MCP Integration
- This project uses Model Context Protocol for agent integration
- Agent configurations are in `agents/` directory
- Workflows define reusable automation patterns
- Skills provide structured guidance for specific tasks

### Test Organization
```
specs/ (or tests/)
├── feature-name/
│   ├── scenario-1.spec.ts
│   └── scenario-2.spec.ts
├── fixtures/
│   ├── api.ts              # API setup helpers
│   ├── visual.ts           # Visual testing utilities
│   └── test-data.ts        # Test data generators
└── shared/                  # Shared utilities
```

## Common Patterns

### Error Handling
- Always handle errors gracefully
- Provide meaningful error messages
- Log errors appropriately for debugging
- Don't swallow exceptions silently
- Use try-catch for async operations

### Async Operations
- Use async/await for asynchronous code
- Always await Playwright actions
- Handle promise rejections
- Avoid callback hell
- Use proper error boundaries

## Tools and Commands

### Install dependencies
```bash
npm install
```

### Run tests
```bash
npx playwright test                    # Run all tests
npx playwright test --ui               # Run in UI mode
npx playwright test --headed           # Run in headed mode
npx playwright test specs/feature/     # Run specific directory
npx playwright test -g "test name"     # Run specific test
```

### Debug tests
```bash
npx playwright test --debug            # Debug mode
npx playwright show-report             # Show HTML report
npx playwright codegen                 # Generate test code
```

### Linting
```bash
npm run lint                           # Check code quality
npm run lint:fix                       # Auto-fix issues
```

### Update snapshots
```bash
npx playwright test --update-snapshots  # Update visual regression snapshots
```

## Best Practices

1. **Read before writing** - Always check existing code patterns before implementing new features
2. **Test as you go** - Write tests alongside feature development
3. **Keep it simple** - Simplest solution that works is usually the best
4. **Think about users** - Code and tests should reflect actual user behavior
5. **Iterate** - It's okay to refactor and improve over time
6. **Use fixtures** - Leverage fixtures for setup and teardown
7. **Document assumptions** - If something is non-obvious, add a comment

## When Working on This Project

1. Check relevant AGENTS.md files in subdirectories for specific instructions
2. Use available skills (in `.claude/skills/`) when applicable
3. Run tests before completing any task
4. Follow the established patterns and conventions
5. Ask clarifying questions when requirements are unclear
6. Respect the MCP architecture and patterns

## Important Notes

- **Never commit** broken tests
- **Never use** `waitForTimeout()` in tests - use proper assertions instead
- **Never hardcode** sensitive data (API keys, passwords, tokens)
- **Always validate** your changes work as expected
- **Always read** the relevant AGENTS.md file before starting work in a subdirectory
- **Never use** CSS selectors when semantic queries are available
- **Always clean up** test data after tests complete

## Agent Skills Available

### write-e2e-test
Systematically write new Playwright E2E tests from planning through implementation.

**When to use:**
- User asks to "write an e2e test"
- User says "create e2e tests for [feature]"
- User mentions testing a feature with Playwright

**What it does:**
1. Asks clarifying questions about requirements
2. Researches actual implementation details
3. Presents test plan for approval
4. Implements the test following best practices
5. Validates the test runs successfully

## Workflows Available

Check the `workflows/` directory for available automation workflows that can be triggered or referenced.

## Project-Specific Conventions

### Naming Conventions
- Test files: `feature-name.spec.ts`
- Test titles: Start with "should" describing behavior
- Variables: camelCase for variables, PascalCase for classes
- Constants: UPPER_SNAKE_CASE for true constants

### Import Patterns
```typescript
// Playwright imports
import { test, expect } from '@playwright/test';

// Fixture imports
import { test, expect } from '../fixtures/api';

// Utility imports
import { generateUser } from '../fixtures/test-data';
```

### Test Structure
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup
  });

  test('should perform expected behavior', async ({ page }) => {
    // Given - Set up initial state
    // When - Perform action  
    // Then - Assert expected outcome
  });
});
```

## Getting Help

- Check `specs/AGENTS.md` (or `tests/AGENTS.md`) for testing-specific instructions
- Review `.claude/skills/write-e2e-test/SKILL.md` for the test writing workflow
- Look at existing test files for patterns and examples
- Ask the agent: "Explain the [feature] in this project"
- Check documentation in the `workflows/` directory

---

**Remember:** This is a living document. Update it as patterns evolve and new conventions emerge.
