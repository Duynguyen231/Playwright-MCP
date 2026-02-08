# Agent Instructions - Root Level

This file contains general instructions for AI agents working in this project.

## Project Overview

This is a web application project with:
- Frontend: Modern JavaScript framework (React/Vue/Angular)
- Testing: Playwright for E2E tests
- API: REST API endpoints
- Visual Testing: Screenshot-based regression testing

## Project Structure

```
├── src/                    # Application source code
│   ├── components/         # UI components
│   ├── api/               # API client code
│   └── services/          # Business logic
├── tests/                 # Test directory
│   ├── e2e/              # E2E test specs
│   ├── fixtures/         # Test fixtures and helpers
│   └── AGENTS.md         # Testing-specific instructions
├── .claude/              # Agent configuration
│   ├── skills/           # Reusable agent skills
│   └── hooks/            # Validation hooks
└── playwright.config.ts  # Playwright configuration
```

## General Coding Standards

### Code Quality
- Write clean, readable, maintainable code
- Follow existing code style and patterns
- Add comments for complex logic only
- Keep functions small and focused
- Use meaningful variable and function names

### Testing Philosophy
- Tests should be reliable and deterministic
- Avoid flaky tests at all costs
- Tests should be independent and parallelizable
- Prefer integration tests over mocking when reasonable
- Test user workflows, not implementation details

### File Organization
- Group related files together
- One component/module per file
- Co-locate tests with the code they test (when applicable)
- Use clear, descriptive file names

## Common Patterns

### Error Handling
- Always handle errors gracefully
- Provide meaningful error messages
- Log errors appropriately
- Don't swallow exceptions silently

### Async Operations
- Use async/await for asynchronous code
- Handle promise rejections
- Avoid callback hell
- Use proper error boundaries

## Tools and Commands

### Install dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### Run tests
```bash
npx playwright test                    # Run all tests
npx playwright test --ui               # Run in UI mode
npx playwright test --headed           # Run in headed mode
npx playwright test tests/e2e/login/   # Run specific directory
```

### Debug tests
```bash
npx playwright test --debug            # Debug mode
npx playwright show-report             # Show HTML report
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

## When Working on This Project

1. Check relevant AGENTS.md files in subdirectories for specific instructions
2. Use available skills (in `.claude/skills/`) when applicable
3. Run tests before completing any task
4. Follow the established patterns and conventions
5. Ask clarifying questions when requirements are unclear

## Important Notes

- **Never commit** broken tests
- **Never use** `waitForTimeout()` in tests - use proper assertions instead
- **Never hardcode** sensitive data (API keys, passwords, etc.)
- **Always validate** your changes work as expected
- **Always read** the relevant AGENTS.md file before starting work in a subdirectory
