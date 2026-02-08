# Directory Structure

```
playwright-skills-setup/
│
├── .claude/                          # Agent configuration
│   ├── skills/
│   │   └── write-e2e-test/
│   │       └── SKILL.md              # E2E test writing skill with 5-phase workflow
│   └── hooks/
│       └── lint-e2e.sh               # ESLint validation hook (makes lint errors blocking)
│
├── tests/
│   ├── e2e/                          # Test specs organized by feature
│   │   └── auth/
│   │       └── login.spec.ts         # Example login test with best practices
│   │
│   ├── fixtures/                     # Custom Playwright fixtures
│   │   ├── api.ts                    # API fixture for fast state setup
│   │   ├── visual.ts                 # Visual regression utilities
│   │   └── test-data.ts              # Test data generators
│   │
│   └── AGENTS.md                     # Testing-specific agent instructions
│
├── AGENTS.md                         # Root-level project instructions
├── playwright.config.ts              # Playwright configuration
├── .eslintrc.json                   # ESLint config with Playwright rules
├── package.json                      # Dependencies and npm scripts
├── README.md                         # Comprehensive documentation
└── QUICKSTART.md                     # 5-minute setup guide
```

## Key Components

### 1. Agent Skill (.claude/skills/write-e2e-test/SKILL.md)
5-phase workflow for writing tests:
- Phase 1: Define Requirements (clarifying questions)
- Phase 2: Verify Implementation (check actual code)
- Phase 3: Get Approval (present plan)
- Phase 4: Implement Test (write the test)
- Phase 5: Validate (run in isolation)

### 2. AGENTS.md Files
Layered instructions for AI agents:
- Root AGENTS.md: General project conventions
- tests/AGENTS.md: Testing-specific patterns and best practices

### 3. Test Fixtures
Reusable test utilities:
- **api.ts**: Create users, authenticate, setup state via API (auto-cleanup)
- **visual.ts**: Screenshot utilities for visual regression
- **test-data.ts**: Generate consistent, unique test data

### 4. ESLint Configuration
Enforces best practices:
- No waitForTimeout()
- No networkidle
- Test titles must start with "should"
- Prefer web-first assertions
- No force options

### 5. Validation Hook
Automatic lint checking after code generation
- Converts ESLint errors to blocking errors
- Agent must fix issues before showing you the test

## Files You Need to Copy to Your Project

**Essential:**
- `.claude/` directory (skills and hooks)
- `AGENTS.md` (root level)
- `tests/AGENTS.md`
- `tests/fixtures/` directory
- `.eslintrc.json`

**Optional but Recommended:**
- `README.md` (documentation)
- `QUICKSTART.md` (quick reference)
- `playwright.config.ts` (if starting fresh)
- `tests/e2e/auth/login.spec.ts` (example)

## What Makes This Setup Special

✅ **Self-validating** - Tests run 3+ times before delivery
✅ **Research-driven** - Agent checks actual code before writing
✅ **Structured** - 5-phase workflow ensures quality
✅ **Automatic linting** - Catches issues before you see them
✅ **Best practices** - Built-in patterns for locators, API waiting, etc.
✅ **Fast setup** - API fixtures for quick state initialization
✅ **Visual testing** - Screenshot utilities ready to use
✅ **Customizable** - Easy to adapt to your project
