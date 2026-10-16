# Practical 12: Evidence and Screenshot Guidelines

**Student Name:** Abdulkadir Nursumar (AK Nursumar)  
**Course:** Advanced Web Development Frameworks (ITUE301)  

---

## Required Screenshots for Lab File

### Screenshot 1: Local Automated Test & CI Simulation Pass
- **How to capture:**
  1. Open a terminal in `Practical_12_GitHub_Actions_CICD`.
  2. Run:
     ```bash
     npm run ci:simulate
     ```
  3. Capture the terminal window displaying all 3 steps succeeding:
     - Node & npm version check
     - Static code linting
     - All 5 Jest integration tests passing with GREEN status.

### Screenshot 2: Deliberate CI Pipeline Failure (Red X on GitHub)
- **How to capture:**
  1. In `tests/tasks.test.js`, locate line 38:
     ```javascript
     expect(res.statusCode).toBe(200);
     ```
  2. Change it to:
     ```javascript
     expect(res.statusCode).toBe(201); // Deliberate failure for lab demonstration
     ```
  3. Commit and push to GitHub:
     ```bash
     git add tests/tasks.test.js
     git commit -m "test: induce deliberate assertion mismatch for CI failure demonstration"
     git push origin main
     ```
  4. Navigate to your repository's **Actions** tab on GitHub (`https://github.com/AKNursumar/<repo>/actions`).
  5. Click on the latest workflow run and expand the **Run Automated Integration Tests** step.
  6. Screenshot the red `✖` and the exact test failure output indicating `Expected: 201, Received: 200`.

### Screenshot 3: Fixed Passing CI Pipeline (Green Checkmark on GitHub)
- **How to capture:**
  1. Revert line 38 back to `200`:
     ```javascript
     expect(res.statusCode).toBe(200);
     ```
  2. Commit and push the fix:
     ```bash
     git add tests/tasks.test.js
     git commit -m "fix: resolve test assertion mismatch and restore passing CI"
     git push origin main
     ```
  3. Wait ~60 seconds for GitHub Actions to complete the run.
  4. Screenshot the green checkmark (`✔ Build, Lint & Automated Tests`) showing all steps green.
