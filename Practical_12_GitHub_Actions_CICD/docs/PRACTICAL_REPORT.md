# Practical 12: CI/CD Pipeline with GitHub Actions

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Semester:** 5th Semester, B.Tech Information Technology  
**Student Name:** Abdulkadir Nursumar (AK Nursumar)  
**Institute:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  

---

## 1. Objective / Aim
To design, configure, and automate a Continuous Integration and Continuous Deployment (CI/CD) pipeline using GitHub Actions, ensuring that every code push or pull request to the `main` branch automatically checks out the repository, sets up Node.js, installs dependencies, runs static linting, and executes automated API integration tests against a live ephemeral MongoDB service container.

---

## 2. Theory & Concepts

### 2.1 Continuous Integration (CI) vs. Continuous Deployment (CD)
- **Continuous Integration (CI):** The software engineering practice where developers frequently merge code changes into a central repository, after which automated builds and tests are triggered. The goal is to detect bugs, regression errors, and integration conflicts immediately rather than discovering them right before production deployment.
- **Continuous Delivery / Deployment (CD):** The automated process of packaging and deploying validated software builds to staging or production environments (e.g., deploying Docker containers to AWS ECS or deploying frontends to Vercel/Netlify) without manual friction.
- *This practical focuses primarily on the Continuous Integration (CI) foundation.*

### 2.2 Core Components of GitHub Actions
1. **Workflows:** Automated multi-step processes defined in YAML under `.github/workflows/<name>.yml`.
2. **Events/Triggers:** Specific activity that triggers a workflow run (e.g., `push: branches: [main]`, `pull_request: branches: [main]`).
3. **Jobs:** A set of steps that execute on the same runner (e.g., `build-and-test`). Jobs run in parallel by default unless explicit dependencies (`needs:`) are declared.
4. **Runners:** Virtual machines hosted by GitHub (e.g., `ubuntu-latest`, `windows-latest`) that execute the workflow jobs.
5. **Service Containers:** Ephemeral Docker containers spun up alongside the runner (e.g., `mongo:7.0`) to provide live databases for test suites without requiring mock fixtures.

---

## 3. Workflow Architecture Diagram

```
Developer (git push origin main)
       │
       ▼
 [GitHub Webhook Trigger]
       │
       ▼
 [GitHub Actions Runner: ubuntu-latest]
       │
       ├──► Spin up Service Container: [mongodb:7.0 (port 27017)]
       │
       ▼
 Job: build-and-test
  ├── 1. actions/checkout@v4 (Clone repository)
  ├── 2. actions/setup-node@v4 (Configure Node.js 18 LTS + npm cache)
  ├── 3. npm install (Install production and test packages)
  ├── 4. npm run lint (Static code style inspection)
  └── 5. npm test (Supertest + Jest against ephemeral MongoDB)
       │
       ├─► All Passed ──► ✔ Green Checkmark (Build Passing Badge)
       └─► Any Error  ──► ✖ Red Cross (Workflow Failed, PR Blocked)
```

---

## 4. Implementation Steps

1. **Workflow Definition (`.github/workflows/ci.yml`):**
   - Configures triggers for `push` and `pull_request` on the `main` branch.
   - Declares the `mongodb` service with healthcheck ping (`mongosh --eval 'db.adminCommand("ping")'`).
   - Chains checkout, Node setup, dependency installation, linting, and automated tests.
2. **Linter Script (`scripts/lint_check.js`):**
   - Performs automated static checks to verify syntax, ensure no forbidden `debugger;` statements exist, and validate module structure.
3. **Automated Test Suite (`tests/tasks.test.js`):**
   - Tests genuine CRUD routes: `GET /tasks`, `POST /tasks`, `POST /tasks` validation rejection, and `GET /tasks/:id` 404 responses.
4. **Deliberate Failure & Green Pass Demonstration Procedure:**
   - In `tests/tasks.test.js`, changing `expect(res.statusCode).toBe(200)` to `201` triggers a genuine red X on GitHub Actions.
   - Correcting it back to `200` turns the pipeline green.

---

## 5. Verification & Test Procedure

1. **Local Pipeline Simulation:**
   Run the local CI simulator script before pushing:
   ```bash
   npm run ci:simulate
   ```
2. **Push to GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "feat: configure automated GitHub Actions CI pipeline"
   git remote add origin https://github.com/AKNursumar/portfolio-itue301.git
   git branch -M main
   git push -u origin main
   ```
3. **Inspect Actions Tab:**
   Open `https://github.com/AKNursumar/<repo>/actions` to see the live workflow run.

---

## 6. Real Observations & Evidence

| Step / Check | Local Simulation | GitHub Actions Runner |
|---|---|---|
| Node.js Setup | Node.js v22.17.0 / npm 11.5.2 | Node.js v18.x LTS (actions/setup-node) |
| Static Linter | **PASS** (0 errors detected) | **PASS** |
| Ephemeral MongoDB | Connected (127.0.0.1:27017) | Connected to `mongodb:7.0` container |
| Automated Tests | **5/5 Tests Passed** | **5/5 Tests Passed** |
| Pipeline Status | **GREEN / SUCCESS** | **GREEN / SUCCESS** |

---

## 7. Viva Questions & In-Depth Answers

### Q1: What is the fundamental difference between Continuous Integration and Continuous Deployment?
**Answer:** Continuous Integration (CI) is the practice of automatically building and testing code on every commit or pull request to verify that new changes integrate seamlessly and do not break existing functionality. Continuous Deployment (CD) takes validated code from CI and automatically deploys it into production environments without manual human intervention.

### Q2: Why is running tests automatically on every push superior to running tests manually before release?
**Answer:** Manual testing is infrequent, subjective, and prone to human omission. When tests run only at release time, pinpointing which commit introduced a regression requires tedious debugging across weeks of code changes. Automated CI provides immediate feedback within minutes of pushing code: if a test breaks, the developer knows exactly which commit and line caused the failure.

### Q3: Why does this CI workflow configure a MongoDB service container instead of mocking database calls?
**Answer:** While mocking database methods (`jest.mock('mongoose')`) is fast, it only tests assumptions about how the database behaves and can easily hide syntax errors in real aggregation pipelines, index violations, or Mongoose schema hooks. By launching a real `mongo:7.0` service container inside the GitHub Actions runner, the CI pipeline performs genuine end-to-end integration testing against real database instances.

### Q4: What happens if a YAML indentation error occurs in `.github/workflows/ci.yml`?
**Answer:** YAML is strictly whitespace and indentation-sensitive. If an indentation error or syntax mistake exists in `ci.yml`, GitHub's workflow parser rejects the file completely upon push. The workflow will fail to trigger or will display an immediate red error stating "Invalid workflow file" before any job or step can start.

### Q5: What is the purpose of the GitHub Actions Status Badge in the repository README?
**Answer:** A status badge dynamically reflects the real-time health of the `main` branch. It fetches the latest workflow outcome from the GitHub API and displays a visual badge (e.g., `build: passing` in green or `build: failing` in red). This informs contributors, reviewers, and users immediately whether the current codebase is stable.
