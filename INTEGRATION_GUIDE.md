# Integration Guide for Your Existing Playwright Framework

This guide will help you enhance your existing Playwright MCP framework with the agent skills setup.

## Current Structure Analysis

Based on your screenshot, you have:
```
playwright-mcp/
├── .claude/
│   └── skills/
│       └── write-e2e-test/
│           └── SKILL.md          # ✅ Already exists!
├── agents/                        # Your agent configs
├── workflows/                     # Your workflows
├── .vscode/                       # VS Code settings
├── node_modules/
├── specs/                         # Your test specs
├── test-results/                  # Test artifacts
├── tests/                         # Test files
├── .gitignore
├── package-lock.json
├── package.json
└── playwright.config.ts
```

## What's Missing (That Will Boost Your AI Agent Testing)

### 1. AGENTS.md Files
**Location to add:**
- `AGENTS.md` (root level)
- `tests/AGENTS.md` or `specs/AGENTS.md`

**Why:** These files give AI agents context about your project structure, testing conventions, and best practices.

### 2. Test Fixtures
**Location to add:**
- `tests/fixtures/api.ts` (or `specs/fixtures/api.ts`)
- `tests/fixtures/visual.ts`
- `tests/fixtures/test-data.ts`

**Why:** Reusable test utilities for API setup, visual regression, and test data generation.

### 3. ESLint Configuration
**Location to add:**
- `.eslintrc.json` (root level)
- `.claude/hooks/lint-e2e.sh`

**Why:** Automatic code quality checks that run after the agent generates test code.

## Step-by-Step Integration

### Step 1: Add AGENTS.md Files

Create `AGENTS.md` in your root directory:
```bash
# Copy from the setup
cp /path/to/playwright-skills-setup/AGENTS.md ./AGENTS.md
```

Then customize it with:
- Your project's tech stack
- Your testing conventions
- Your folder structure (agents/, workflows/, specs/, tests/)

Create `tests/AGENTS.md` (or `specs/AGENTS.md` if you use specs for tests):
```bash
cp /path/to/playwright-skills-setup/tests/AGENTS.md ./tests/AGENTS.md
# or
cp /path/to/playwright-skills-setup/tests/AGENTS.md ./specs/AGENTS.md
```

### Step 2: Add Test Fixtures

Create fixtures directory:
```bash
mkdir -p tests/fixtures
# or
mkdir -p specs/fixtures
```

Copy fixture files:
```bash
cp /path/to/playwright-skills-setup/tests/fixtures/*.ts ./tests/fixtures/
# or
cp /path/to/playwright-skills-setup/tests/fixtures/*.ts ./specs/fixtures/
```

### Step 3: Add ESLint Configuration

Install dependencies:
```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-playwright
```

Copy ESLint config:
```bash
cp /path/to/playwright-skills-setup/.eslintrc.json ./.eslintrc.json
```

Add to your `package.json`:
```json
{
  "scripts": {
    "lint": "eslint tests/**/*.ts specs/**/*.ts",
    "lint:fix": "eslint tests/**/*.ts specs/**/*.ts --fix"
  }
}
```

Create the lint hook:
```bash
mkdir -p .claude/hooks
cp /path/to/playwright-skills-setup/.claude/hooks/lint-e2e.sh ./.claude/hooks/
chmod +x .claude/hooks/lint-e2e.sh
```

### Step 4: Update Your Existing SKILL.md

Your `.claude/skills/write-e2e-test/SKILL.md` might need updates. Compare it with the new one and add:

1. **Hook configuration** at the top:
```yaml
---
name: write-e2e-test
description: ...
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      statusMessage: "Running lint checks..."
      hooks:
        - type: command
          command: "$CLAUDE_PROJECT_DIR/.claude/hooks/lint-e2e.sh"
---
```

2. **Updated workflow sections** for:
   - API fixture usage
   - Visual regression testing
   - Self-validation phase

### Step 5: Update .gitignore

Add to your `.gitignore`:
```
# Test artifacts
test-results/
playwright-report/
playwright/.cache/
screenshots/

# ESLint
.eslintcache
```

## Customization for Your Framework

### If You Use `specs/` Instead of `tests/`

Update paths in:
- `AGENTS.md` → Change `tests/` references to `specs/`
- `.eslintrc.json` → Update file patterns
- Fixtures imports → Adjust paths

### If You Have Custom API Structure

Update `tests/fixtures/api.ts`:
```typescript
// Change API endpoints to match your application
const response = await request.post('/your-api/users', { data: defaultUser });
```

### If You Have Different Test Organization

Update `tests/AGENTS.md` to reflect your actual structure:
```markdown
## Test Directory Structure

```
specs/
├── feature-a/
│   ├── test-case-1.spec.ts
│   └── test-case-2.spec.ts
├── feature-b/
│   └── test-case-3.spec.ts
└── fixtures/
    ├── api.ts
    └── visual.ts
```
```

## Testing the Setup

### 1. Verify ESLint Works
```bash
npm run lint
```

### 2. Test the Agent Skill
If using Claude Code:
```bash
claude
# Then: "Write an e2e test for login functionality"
```

### 3. Check Hooks Work
The lint hook should automatically run when agent edits/writes files.

### 4. Run Example Test
```bash
npx playwright test
```

## What You'll Gain

### Before:
```
You: "Write a test for user login"
Agent: [generates test with generic selectors, no validation]
```

### After:
```
You: "Write a test for user login"
Agent: 
1. ✅ Asks clarifying questions
2. ✅ Checks your actual components for correct selectors
3. ✅ Presents plan for approval
4. ✅ Writes test following your conventions
5. ✅ Runs test 3+ times to verify it works
6. ✅ Auto-lints the code
7. ✅ Shows you working, tested code
```

## Folder Structure After Integration

```
playwright-mcp/
├── .claude/
│   ├── skills/
│   │   └── write-e2e-test/
│   │       └── SKILL.md          # Enhanced with hooks
│   └── hooks/
│       └── lint-e2e.sh           # NEW: Lint validation
├── agents/                        # Your existing agent configs
├── workflows/                     # Your existing workflows
├── tests/ (or specs/)
│   ├── fixtures/                  # NEW: Test utilities
│   │   ├── api.ts
│   │   ├── visual.ts
│   │   └── test-data.ts
│   ├── AGENTS.md                  # NEW: Test instructions
│   └── *.spec.ts                  # Your test files
├── AGENTS.md                      # NEW: Root instructions
├── .eslintrc.json                 # NEW: Lint config
├── package.json                   # Updated with lint scripts
└── playwright.config.ts
```

## Next Steps

1. Follow Steps 1-5 above
2. Review and customize the AGENTS.md files for your project
3. Update fixture paths if you use `specs/` instead of `tests/`
4. Test the setup with a simple test request to your AI agent
5. Iterate on AGENTS.md files based on agent behavior

## Common Questions

**Q: Will this break my existing tests?**
A: No! All additions are opt-in. Your existing tests continue to work as-is.

**Q: Do I need to rewrite my existing SKILL.md?**
A: No, but you should add the hooks section and compare for improvements.

**Q: Can I use this with GitHub Copilot or other AI tools?**
A: The AGENTS.md files work with any AI tool that reads project context. The skill is specifically for Claude Code and similar agentic tools.

**Q: What if I don't want ESLint?**
A: Remove the hooks section from SKILL.md. The rest still works!

## Support

If you run into issues:
1. Check file paths match your structure
2. Verify hook script is executable: `chmod +x .claude/hooks/lint-e2e.sh`
3. Ensure ESLint dependencies are installed
4. Review AGENTS.md files match your actual conventions
