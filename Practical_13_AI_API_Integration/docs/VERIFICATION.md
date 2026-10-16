# Practical 13: Verification Record

**Date:** 2026-10-16  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**System:** Windows PowerShell, Node.js v22.17.0, npm 11.5.2, MongoDB v7.0.14  

---

## 1. Backend Integration Test Suite Run

Executed in `Practical_13_AI_API_Integration/backend`:
```bash
npm test
```

Actual Terminal Output:
```
> practical-13-backend@1.0.0 test
> jest --runInBand --detectOpenHandles --forceExit

  console.log
    [AI App] GET /api/ai/status - 2026-10-16T10:49:17.249Z
    [AI App] POST /api/ai/generate-description - 2026-10-16T10:49:17.473Z
    [AI App] POST /api/ai/generate-description - 2026-10-16T10:49:17.505Z
    [AI App] POST /tasks - 2026-10-16T10:49:17.530Z
    [AI App] POST /api/ai/generate-description - 2026-10-16T10:49:17.600Z
    [AI App] POST /api/ai/generate-description - 2026-10-16T10:49:17.622Z
    [AI App] POST /api/ai/generate-description - 2026-10-16T10:49:17.644Z

PASS tests/ai.test.js (12.47 s)
  Practical 13: AI Integration & Task Management Tests
    √ GET /api/ai/status returns provider info and strict privacy policy without exposing secrets (138 ms)
    √ POST /api/ai/generate-description rejects titles shorter than 3 characters with 400 (184 ms)
    √ POST /api/ai/generate-description gracefully handles unconfigured API key without server crash (29 ms)
    √ POST /tasks persists task in MongoDB with isAiGenerated flag (65 ms)
    √ AI rate limiter responds with 429 when threshold exceeded (71 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        12.992 s
Ran all test suites.
```
*Result: PASS. All 5 tests passed.*

---

## 2. Frontend Production Bundle Build Test

Executed in `Practical_13_AI_API_Integration/frontend`:
```bash
npm run build
```

Actual Terminal Output:
```
> practical-13-frontend@1.0.0 build
> vite build

vite v5.4.21 building for production...
transforming...
✓ 35 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.44 kB │ gzip:  0.30 kB
dist/assets/index-B3tPryEM.css    3.18 kB │ gzip:  1.15 kB
dist/assets/index-D9KAZrwm.js   150.23 kB │ gzip: 48.47 kB
✓ built in 1.70s
```
*Result: PASS. Vite production bundle compiled cleanly in 1.70s.*

---

## 3. Truthful Summary on AI Service Key Configuration
- **Graceful Fallback Mode:** Verified by automated tests. In absence of an external API key, the backend returns `{ fallback: true }` and core MongoDB task CRUD remains 100% operational.
- **Active Model Support:** Both Google Gemini (`gemini-1.5-flash`) and OpenAI (`gpt-4o-mini`) can be activated by providing a user-supplied key in `backend/.env`.
