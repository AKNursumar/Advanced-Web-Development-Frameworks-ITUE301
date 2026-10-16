# Verification Report: Practical 5

**Practical:** Practical 5 — MongoDB Integration and Schema Design with Mongoose  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Date:** October 2026  
**Environment:** Windows, Node.js v22.17.0, npm v11.5.2, MongoDB v7/8 on 127.0.0.1:27017, Mongoose v8.9.3, Jest v29.7.0  

---

## Commands Executed & Verification Output

### 1. Dependency Installation
```bash
npm install
```
**Result:** Code 0 (Success)  
`added 377 packages, and audited 378 packages in 38s.`

### 2. Live Database Integration Tests
```bash
npm test
```
**Output:**
```text
> practical-05-mongodb-mongoose@1.0.0 test
> jest --runInBand --detectOpenHandles --forceExit

  [MongoDB] Connected to database: awdf_tasks_practical5 @ 127.0.0.1:27017

PASS tests/tasks.test.js (16.945 s)
  Task Management MongoDB / Mongoose API (Practical 5)
    GET /
      √ should return server metadata and 200 status (133 ms)
    GET /tasks
      √ should return empty list initially with 200 status (55 ms)
    POST /tasks
      √ should create and persist a new task document in MongoDB with 201 status (201 ms)
      √ should trim title whitespace using pre-save hook (39 ms)
      √ should reject task creation with missing title and return 400 validation error (41 ms)
      √ should reject invalid priority enum value and return 400 (34 ms)
    GET /tasks/:id
      √ should retrieve a task by valid MongoDB ObjectId with 200 status (45 ms)
      √ should return 400 when task ID is not a valid MongoDB ObjectId (44 ms)
      √ should return 404 when valid ObjectId does not exist in collection (43 ms)
    PUT /tasks/:id
      √ should update an existing task in MongoDB and return 200 status (77 ms)
    DELETE /tasks/:id
      √ should delete task document from MongoDB and return 200 status (52 ms)

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        17.5 s
Ran all test suites.
```
**Result:** Code 0 (Success). All 11 tests passed against the active MongoDB server.

### 3. Verification Checklist
- [x] **Self-Contained Implementation:** Node/Express application with Mongoose ODM in its own folder.
- [x] **Real Database Connection:** Connected to live local MongoDB on `127.0.0.1:27017`.
- [x] **Pre-Save Hook:** Verified title whitespace trimming before persisting document.
- [x] **Schema Validation:** Enforces required `title` and `priority` enum `['low', 'medium', 'high']`.
- [x] **ObjectId Format Validation:** Middleware checks 24-hex-character ObjectId and returns HTTP 400 for malformed IDs.
- [x] **Error Pipeline:** Formats Mongoose `ValidationError` and `CastError` into clean structured JSON.
- [x] **Zero Credentials in Git:** `.env` safely excluded via `.gitignore`; `.env.example` provided.

**Status:** PASS
