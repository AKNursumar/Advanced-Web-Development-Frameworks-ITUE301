# Verification Report: Practical 4

**Practical:** Practical 4 — Building a RESTful API with Node.js and Express  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Date:** October 2026  
**Environment:** Windows, Node.js v22.17.0, npm v11.5.2, Express v4.21.2, Jest v29.7.0, Supertest v7.0.0  

---

## Commands Executed & Verification Output

### 1. Dependency Installation
```bash
npm install
```
**Result:** Code 0 (Success)  
`added 357 packages, and audited 358 packages in 45s.`

### 2. Automated Test Suite Execution
```bash
npm test
```
**Output:**
```text
> practical-04-express-rest-api@1.0.0 test
> jest --runInBand --detectOpenHandles

PASS tests/tasks.test.js (11.666 s)
  Task Management REST API Endpoints (Practical 4)
    GET /
      √ should return API metadata and 200 status (118 ms)
    GET /tasks
      √ should return empty task list initially with 200 status (28 ms)
    POST /tasks
      √ should create a new task with 201 status when payload is valid (272 ms)
      √ should reject requests without Content-Type: application/json with 400 (26 ms)
      √ should reject task creation with missing title with 400 (27 ms)
      √ should reject invalid priority enum value with 400 (24 ms)
    GET /tasks/:id
      √ should retrieve a task by valid ID with 200 status (37 ms)
      √ should return 404 when task ID does not exist (33 ms)
      √ should return 400 when task ID format is invalid (19 ms)
    PUT /tasks/:id
      √ should update an existing task with 200 status (32 ms)
      √ should return 404 when updating non-existent task (15 ms)
    DELETE /tasks/:id
      √ should delete an existing task and return 200 status (48 ms)
      √ should return 404 when attempting to delete non-existent task (17 ms)
    404 Undefined Route Handler
      √ should return structured 404 JSON for unknown routes (15 ms)

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        12.879 s
Ran all test suites.
```
**Result:** Code 0 (Success). All 14 automated tests passed without failure.

### 3. Verification Checklist
- [x] **Independent Codebase:** Self-contained Node.js / Express backend in its own directory.
- [x] **Complete CRUD Endpoints:** GET `/tasks`, GET `/tasks/:id`, POST `/tasks`, PUT `/tasks/:id`, DELETE `/tasks/:id`.
- [x] **In-Memory Store:** Uses array storage cleanly fulfilling Practical 4 syllabus requirements.
- [x] **Middleware Pipeline:**
  - Request logging middleware logs method, URL, and timestamp.
  - JSON body parsing (`express.json()`).
  - Content-Type enforcement middleware rejects POST/PUT without `application/json` (400).
  - Task ID format validation middleware.
  - 404 handler for unknown routes.
  - Global error handler configured last.
- [x] **Test Decoupling:** `src/app.js` and `src/server.js` cleanly separated for programmatic Supertest execution without port conflicts.

**Status:** PASS
