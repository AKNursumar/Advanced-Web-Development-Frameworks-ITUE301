# Verification Report: Practical 7

**Practical:** Practical 7 — Authentication and Middleware Pipeline  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Date:** October 2026  
**Environment:** Windows, Node.js v22.17.0, npm v11.5.2, MongoDB v7/8 on 127.0.0.1:27017, bcryptjs v2.4.3, jsonwebtoken v9.0.2  

---

## Commands Executed & Verification Output

### 1. Backend Dependency Installation & Automated Auth Tests
```bash
cd backend && npm install && npm test
```
**Output:**
```text
> practical-07-backend@1.0.0 test
> jest --runInBand --detectOpenHandles --forceExit

  [MongoDB] Connected: awdf_tasks_practical7 @ 127.0.0.1:27017

PASS tests/auth.test.js (16.42 s)
  JWT Authentication & Middleware Pipeline Tests (Practical 7)
    POST /api/auth/register
      √ should register a new user, hash the password, and return a JWT (453 ms)
      √ should reject registration with duplicate email with 400 (131 ms)
      √ should reject password shorter than 6 characters with 400 (32 ms)
    POST /api/auth/login
      √ should login with correct credentials and return a token (192 ms)
      √ should reject login with wrong password with 401 (193 ms)
      √ should reject login with non-existent email with 401 (124 ms)
    GET /api/auth/me
      √ should return user profile when given valid Bearer token (122 ms)
    Protected Task Routes & Auth Middleware
      √ should reject requests without Authorization header with 401 (23 ms)
      √ should reject requests with invalid token format with 401 (27 ms)
      √ should reject requests with forged token signature with 401 (22 ms)
    User Data Isolation
      √ should isolate tasks so User B cannot see or manipulate User A tasks (320 ms)

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        17.078 s
Ran all test suites.
```
**Result:** Code 0 (Success). All 11 automated integration tests passed against live MongoDB.

### 2. Frontend Dependency Installation & Production Build
```bash
cd frontend && npm install && npm run build
```
**Output:**
```text
> practical-07-frontend@1.0.0 build
> vite build

vite v6.4.4 building for production...
transforming...
✓ 34 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.75 kB │ gzip:  0.43 kB
dist/assets/index-DtPITG_Z.css    7.16 kB │ gzip:  2.17 kB
dist/assets/index-5pwK2Koi.js   156.81 kB │ gzip: 50.27 kB
✓ built in 1.12s
```
**Result:** Code 0 (Success). Protected authentication UI and task manager built cleanly.

### 3. Verification Checklist
- [x] **Password Hashing:** Passwords hashed with bcrypt (salt rounds 10) prior to MongoDB insertion.
- [x] **Safe Serialization:** `password` excluded from response objects and `.toJSON()`.
- [x] **JWT Generation:** Signs tokens with 1-hour expiration.
- [x] **Authentication Guard:** Intercepts missing, malformed, or tampered tokens with HTTP 401.
- [x] **Tenancy Isolation:** User B cannot view or manipulate User A's tasks (confirmed via automated test).
- [x] **Protected UI:** Renders login/register modal when unauthenticated, and private dashboard with logout when authenticated.

**Status:** PASS
