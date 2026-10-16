# Practical 12: Verification Record

**Date:** 2026-10-16  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**System:** Windows PowerShell, Node.js v22.17.0, npm 11.5.2, MongoDB v7.0.14  

---

## 1. Local CI Workflow Simulation Run

Command executed:
```bash
npm run ci:simulate
```

Actual Terminal Output:
```
> practical-12-github-actions-cicd@1.0.0 ci:simulate
> node scripts/simulate_ci.js

================================================================
   PRACTICAL 12: GITHUB ACTIONS LOCAL WORKFLOW SIMULATOR
   Author: Abdulkadir Nursumar (AK Nursumar)
================================================================

▶ [CI Step] 1. Check Node.js and npm versions
  Executing: node -v && npm -v
v22.17.0
11.5.2
✔ [Passed] 1. Check Node.js and npm versions completed in 0.76s

▶ [CI Step] 2. Static Code Linting
  Executing: npm run lint

> practical-12-github-actions-cicd@1.0.0 lint
> node scripts/lint_check.js

--- [CI Linter Step] Running Static Code Quality Inspection ---
[LINT OK] Passed: src\app.js
[LINT OK] Passed: src\config\db.js
[LINT OK] Passed: src\middleware\errorHandler.js
[LINT OK] Passed: src\middleware\logger.js
[LINT OK] Passed: src\middleware\validate.js
[LINT OK] Passed: src\models\Task.js
[LINT OK] Passed: src\routes\taskRoutes.js
[LINT OK] Passed: tests\tasks.test.js

[LINT SUCCESS] All source and test files passed lint inspection with 0 errors.
✔ [Passed] 2. Static Code Linting completed in 1.05s

▶ [CI Step] 3. Automated Integration Tests
  Executing: npm test

> practical-12-github-actions-cicd@1.0.0 test
> jest --runInBand --detectOpenHandles --forceExit

  console.log
    [CI/CD API] GET /tasks - 2026-10-16T10:36:12.358Z
    [CI/CD API] POST /tasks - 2026-10-16T10:36:12.578Z
    [CI/CD API] POST /tasks - 2026-10-16T10:36:12.620Z
    [CI/CD API] GET /tasks/6ad1fe1c6e7d8939d4f74623 - 2026-10-16T10:36:12.646Z
    [CI/CD API] GET /non-existent-api-route - 2026-10-16T10:36:12.679Z

PASS tests/tasks.test.js (13.087 s)
  Practical 12: CI/CD Pipeline Automated Integration Test Suite
    √ GET /tasks returns status 200 and task list (167 ms)
    √ POST /tasks creates a new task with status 201 (183 ms)
    √ POST /tasks rejects empty title with status 400 (22 ms)
    √ GET /tasks/:id returns 404 for non-existent valid ObjectId (36 ms)
    √ GET /unknown-route returns structured 404 (26 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        13.686 s
Ran all test suites.
✔ [Passed] 3. Automated Integration Tests completed in 22.17s

================================================================
   OVERALL CI STATUS: ✔ GREEN / PASSING (All workflow jobs succeeded)
================================================================
```

---

## 2. GitHub Actions Workflow Configuration Status
- **Path Verified:** `.github/workflows/ci.yml` (exact location required by GitHub)
- **Workflow Triggers:** `push: [main]`, `pull_request: [main]`
- **Runner Configuration:** `runs-on: ubuntu-latest`
- **Ephemeral Database:** `services: mongodb: image: mongo:7.0 (port 27017:27017)`
- **Failure/Pass Toggle:** Line 38 of `tests/tasks.test.js` configured with clear instructions to induce a red failure and restore green status.
