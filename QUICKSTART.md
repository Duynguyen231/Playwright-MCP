# Quick Start Guide

Get your Playwright project setup with AI agent skills in 5 minutes.

## Step 1: Copy Files to Your Project

```bash
# Navigate to your Playwright project
cd /path/to/your/project

# Copy the entire setup (adjust path as needed)
cp -r /path/to/this/setup/.claude .
cp -r /path/to/this/setup/tests/fixtures tests/
cp /path/to/this/setup/tests/AGENTS.md tests/
cp /path/to/this/setup/AGENTS.md .
cp /path/to/this/setup/.eslintrc.json .
```

## Step 2: Install Dependencies

```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-playwright
```

## Step 3: Update package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint tests/**/*.ts",
    "lint:fix": "eslint tests/**/*.ts --fix"
  }
}
```

## Step 4: Make Hook Executable

```bash
chmod +x .claude/hooks/lint-e2e.sh
```

## Step 5: Customize for Your Project

### Update AGENTS.md Files

1. Edit `AGENTS.md` - Add your project structure and conventions
2. Edit `tests/AGENTS.md` - Update with your testing patterns
3. Update API base URL in examples to match your app

### Update API Fixture

Edit `tests/fixtures/api.ts` to match your API endpoints:

```typescript
// Change this:
const response = await request.post('/api/users', { data: defaultUser });

// To match your API:
const response = await request.post('/api/v1/users', { data: defaultUser });
```

## Step 6: Test It Out

### With Claude Code

```bash
# Start Claude Code in your project
claude

# Ask Claude to write a test
"Write an e2e test for user login"
```

### Manual Test

```bash
# Run the example test
npx playwright test tests/e2e/auth/login.spec.ts

# Run in UI mode
npx playwright test --ui
```

## What You Get

✅ **Agent Skill** - Structured workflow for writing E2E tests
✅ **AGENTS.md Files** - Project context for AI agents
✅ **API Fixtures** - Fast test setup via API calls
✅ **Visual Testing** - Screenshot utilities ready to use
✅ **Test Data** - Generators for consistent test data
✅ **ESLint** - Automatic code quality checks
✅ **Example Tests** - Real-world patterns to follow

## Common Issues

### "Command not found: eslint"

Run: `npm install`

### "Permission denied: .claude/hooks/lint-e2e.sh"

Run: `chmod +x .claude/hooks/lint-e2e.sh`

### Tests fail due to wrong API endpoints

Update the API URLs in `tests/fixtures/api.ts` to match your application.

### Skill not being triggered

Make sure you're using an AI agent that supports skills (like Claude Code).

## Next Steps

1. Read through `tests/e2e/auth/login.spec.ts` for examples
2. Update `tests/AGENTS.md` with your project-specific patterns
3. Write your first test using the skill: "Write an e2e test for [your feature]"
4. Add more API helpers in `tests/fixtures/api.ts` as needed

## Need Help?

- Check `README.md` for detailed documentation
- Review `tests/AGENTS.md` for testing conventions
- Look at `.claude/skills/write-e2e-test/SKILL.md` to understand the workflow
- Ask your AI agent: "Explain the e2e test writing skill"

---

Happy testing! 🎭🤖
