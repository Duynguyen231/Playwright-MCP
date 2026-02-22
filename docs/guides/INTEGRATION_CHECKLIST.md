# Quick Integration Checklist ✅

Use this checklist to integrate agent skills into your existing Playwright MCP framework.

## Prerequisites
- [ ] You have an existing Playwright project
- [ ] You have `.claude/skills/write-e2e-test/SKILL.md` already (✅ Yes, you do!)
- [ ] You have Claude Code or another agent tool installed

---

## 🚀 Step 1: Add Root-Level Files (2 minutes)

```bash
# Copy AGENTS.md to root
cp AGENTS-CUSTOM.md ../your-project/AGENTS.md

# Copy ESLint config
cp .eslintrc.json ../your-project/.eslintrc.json
```

- [ ] AGENTS.md copied to root
- [ ] .eslintrc.json copied to root
- [ ] Review AGENTS.md and customize project structure if needed

---

## 🧪 Step 2: Add Test-Specific Files (3 minutes)

### Option A: If you use `tests/` folder
```bash
cd ../your-project

# Add AGENTS.md for tests
cp /path/to/setup/tests/AGENTS.md ./tests/AGENTS.md

# Create fixtures directory
mkdir -p tests/fixtures

# Copy fixtures
cp /path/to/setup/tests/fixtures/*.ts ./tests/fixtures/
```

### Option B: If you use `specs/` folder
```bash
cd ../your-project

# Add AGENTS.md for specs
cp /path/to/setup/tests/AGENTS.md ./specs/AGENTS.md

# Create fixtures directory  
mkdir -p specs/fixtures

# Copy fixtures
cp /path/to/setup/tests/fixtures/*.ts ./specs/fixtures/
```

- [ ] AGENTS.md copied to tests/ or specs/
- [ ] Fixtures directory created
- [ ] api.ts fixture copied
- [ ] visual.ts fixture copied
- [ ] test-data.ts fixture copied

---

## 🔧 Step 3: Install Dependencies (2 minutes)

```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-playwright
```

- [ ] Dependencies installed
- [ ] No installation errors

---

## 📝 Step 4: Update package.json (1 minute)

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint tests/**/*.ts specs/**/*.ts",
    "lint:fix": "eslint tests/**/*.ts specs/**/*.ts --fix"
  }
}
```

- [ ] Lint scripts added to package.json
- [ ] Run `npm run lint` to verify it works

---

## 🪝 Step 5: Add ESLint Hook (1 minute)

```bash
# Create hooks directory if it doesn't exist
mkdir -p .claude/hooks

# Copy lint hook
cp /path/to/setup/.claude/hooks/lint-e2e.sh ./.claude/hooks/

# Make it executable
chmod +x .claude/hooks/lint-e2e.sh
```

- [ ] .claude/hooks/ directory exists
- [ ] lint-e2e.sh copied
- [ ] Hook is executable (chmod +x)

---

## 📋 Step 6: Update SKILL.md (2 minutes)

Open `.claude/skills/write-e2e-test/SKILL.md` and add this at the top if not present:

```yaml
---
name: write-e2e-test
description: Systematically write new Playwright E2E tests from planning through implementation. Use when the user asks to "write an e2e test", "create e2e tests", "add e2e test for [feature]", or mentions testing a feature with Playwright. Covers test planning, implementation verification and test validation.
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      statusMessage: "Running lint checks..."
      hooks:
        - type: command
          command: "$CLAUDE_PROJECT_DIR/.claude/hooks/lint-e2e.sh"
---
```

Also verify these sections exist in your SKILL.md:
- [ ] Prerequisites (view AGENTS.md)
- [ ] Phase 1: Define Test Requirements
- [ ] Phase 2: Verify Implementation Details
- [ ] Phase 3: Get User Approval
- [ ] Phase 4: Implement the Test
- [ ] Phase 5: Run Test in Isolation
- [ ] Phase 6: Final Checklist

If missing sections, refer to the complete SKILL.md in this setup.

- [ ] Hooks added to SKILL.md metadata
- [ ] All 6 phases present
- [ ] Skill mentions fixtures and AGENTS.md

---

## 🔍 Step 7: Customize for Your Project (5 minutes)

### Update AGENTS.md (root)
- [ ] Verify project structure matches your layout
- [ ] Update tool commands if you use different package manager (yarn/pnpm)
- [ ] Add any project-specific conventions

### Update tests/AGENTS.md (or specs/AGENTS.md)
- [ ] Update directory structure to match yours
- [ ] Adjust test file naming if different
- [ ] Update API endpoint examples to match your app

### Update Fixtures
- [ ] Edit `tests/fixtures/api.ts` (or `specs/fixtures/api.ts`)
- [ ] Change API base URLs to match your application
- [ ] Add any project-specific API helpers

---

## ✅ Step 8: Test the Setup (5 minutes)

### Test 1: Lint works
```bash
npm run lint
```
Expected: Should run without errors (or show existing issues)

- [ ] Lint command runs successfully

### Test 2: Existing tests still work
```bash
npx playwright test
```
Expected: Your existing tests pass as before

- [ ] Existing tests still pass

### Test 3: Agent skill works
```bash
# If using Claude Code
claude

# Then ask: "Write an e2e test for login"
```

Expected: Agent should:
1. Ask clarifying questions
2. Check your actual files
3. Present a plan
4. Generate working test code
5. Run the test to validate it

- [ ] Agent uses the skill
- [ ] Agent asks clarifying questions
- [ ] Agent checks implementation files
- [ ] Agent runs generated test

---

## 🎉 Final Verification

Run through this quick test:

```bash
# 1. Start your AI agent (e.g., Claude Code)
claude

# 2. Ask it to write a simple test
"Write an e2e test that navigates to the home page and checks the title"

# 3. Verify the agent:
# - Asks about where to put the test
# - Checks your actual components
# - Shows you a plan
# - Generates the test
# - Runs it 3+ times
# - Shows you working code
```

- [ ] Agent follows the 5-phase workflow
- [ ] Generated test follows best practices
- [ ] Test runs successfully
- [ ] ESLint passes

---

## 📚 What's Next?

### Immediate
- [ ] Read through both AGENTS.md files you created
- [ ] Try writing 2-3 tests using the agent
- [ ] Update AGENTS.md based on what works/doesn't

### This Week
- [ ] Add more API helpers to fixtures based on your needs
- [ ] Add custom ESLint rules for your team's conventions
- [ ] Share the setup with your team

### Ongoing
- [ ] Update AGENTS.md when you find new patterns
- [ ] Add more fixtures as needs arise
- [ ] Refine the SKILL.md workflow based on usage

---

## 🆘 Troubleshooting

### Issue: "Command not found: eslint"
**Solution:** Run `npm install` again

### Issue: "Permission denied: lint-e2e.sh"
**Solution:** Run `chmod +x .claude/hooks/lint-e2e.sh`

### Issue: Agent doesn't use the skill
**Solution:** Make sure you're using Claude Code or compatible agent tool

### Issue: Tests fail with import errors
**Solution:** Check fixture paths match your structure (tests/ vs specs/)

### Issue: Lint hook doesn't run
**Solution:** Verify hook path in SKILL.md matches actual file location

---

## 📊 Success Metrics

You know it's working when:
- ✅ Agent asks clarifying questions before writing tests
- ✅ Agent checks your actual component files for selectors
- ✅ Generated tests use proper locators (getByRole, getByLabel)
- ✅ Tests run successfully the first time
- ✅ ESLint passes automatically
- ✅ No more generic CSS selectors in new tests

---

**Time to complete:** ~20 minutes
**Effort level:** Easy
**Impact:** High - Much better test generation with AI!

Good luck! 🚀
