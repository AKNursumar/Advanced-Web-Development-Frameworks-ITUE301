# Practical 12: CI/CD Pipeline with GitHub Actions

[![CI Pipeline](https://github.com/AKNursumar/portfolio-itue301/actions/workflows/ci.yml/badge.svg)](https://github.com/AKNursumar/portfolio-itue301/actions/workflows/ci.yml)

**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Roll / Class:** B.Tech Information Technology, Semester 5, DEPSTAR, CHARUSAT  
**Course:** Advanced Web Development Frameworks (ITUE301)  

---

## Overview
This practical demonstrates the design, configuration, and execution of an automated Continuous Integration and Continuous Deployment (CI/CD) pipeline using GitHub Actions. Every push or pull request to the `main` branch automatically triggers a multi-stage validation workflow running on Ubuntu Linux:
1. **Repository Checkout:** Clones the latest commit using `actions/checkout@v4`.
2. **Node.js Environment Setup:** Installs Node.js LTS with npm cache via `actions/setup-node@v4`.
3. **Database Service Container:** Automatically starts an ephemeral MongoDB 7.0 container with health checks.
4. **Static Linter Step:** Runs static code quality and syntax inspection.
5. **Automated Integration Testing:** Executes real HTTP API integration tests using Jest and Supertest.

---

## Directory Structure
```
Practical_12_GitHub_Actions_CICD/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow definition
├── package.json               # Scripts: test, lint, ci:simulate
├── .env.example               # Environment variables template
├── .env                       # Local development/testing environment
├── .gitignore                 # Ignores node_modules, .env, coverage
├── server.js                  # Standalone Express server entry point
├── src/
│   ├── app.js                 # App factory for testing without port conflicts
│   ├── config/db.js           # Mongoose connection manager
│   ├── models/Task.js         # Validated Task schema
│   ├── routes/taskRoutes.js   # REST API CRUD routes
│   └── middleware/            # Logger, validation, and error handler
├── tests/
│   └── tasks.test.js          # Automated Jest test suite
├── scripts/
│   ├── lint_check.js          # Static linter script
│   └── simulate_ci.js         # Local CI pipeline runner
└── docs/
    ├── PRACTICAL_REPORT.md    # Lab report, theory, viva Q&A
    ├── VERIFICATION.md        # Local verification log
    └── EVIDENCE.md            # Guidelines for failed/passed CI screenshots
```

---

## Quick Start & Local Verification

### 1. Install Dependencies
```bash
cd Practical_12_GitHub_Actions_CICD
npm install
```

### 2. Run Static Linter
```bash
npm run lint
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Run Complete Local CI Simulation
```bash
npm run ci:simulate
```
*Simulates the exact steps that will execute inside GitHub Actions.*

---

## Demonstrating CI Failure & Pass (Required for Evaluation)

1. Open `tests/tasks.test.js`.
2. On line 38, change `expect(res.statusCode).toBe(200);` to `expect(res.statusCode).toBe(201);`.
3. Commit and push:
   ```bash
   git add tests/tasks.test.js
   git commit -m "test: simulate intentional CI test failure"
   git push origin main
   ```
4. Check GitHub **Actions** tab: The run will fail with a **Red X**. Capture this screenshot!
5. Revert the line back to `200`, commit, and push again:
   ```bash
   git add tests/tasks.test.js
   git commit -m "fix: restore passing test assertion"
   git push origin main
   ```
6. The pipeline will now succeed with a **Green Checkmark**. Capture this screenshot!
