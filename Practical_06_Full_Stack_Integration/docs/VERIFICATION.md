# Verification Report: Practical 6

**Practical:** Practical 6 — Full Stack Integration (React + Node.js + MongoDB)  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Date:** October 2026  
**Environment:** Windows, Node.js v22.17.0, npm v11.5.2, Vite v6.4.4, React v18.3.1, Express v4.21.2, MongoDB v7/8  

---

## Commands Executed & Verification Output

### 1. Backend Dependencies Installation
```bash
cd backend && npm install
```
**Result:** Code 0 (Success)  
`added 91 packages, and audited 92 packages in 14s. Found 0 vulnerabilities.`

### 2. Frontend Dependencies Installation
```bash
cd frontend && npm install
```
**Result:** Code 0 (Success)  
`added 116 packages, and audited 117 packages in 13s. Found 0 vulnerabilities.`

### 3. Frontend Production Build Execution
```bash
cd frontend && npm run build
```
**Output:**
```text
> practical-06-frontend@1.0.0 build
> vite build

vite v6.4.4 building for production...
transforming...
✓ 33 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.74 kB │ gzip:  0.43 kB
dist/assets/index-YArKyzuu.css    6.76 kB │ gzip:  2.11 kB
dist/assets/index-3pcyxrnN.js   153.48 kB │ gzip: 49.42 kB
✓ built in 1.70s
```
**Result:** Code 0 (Success). Full-stack React dashboard compiled without warnings.

### 4. Integration Verification Checklist
- [x] **Monorepo Architecture:** Clean directory separation between `frontend/` and `backend/`.
- [x] **CORS Middleware:** Configured on Express backend for React dev server (`http://localhost:5173`).
- [x] **Full-Stack Persistence:** Tasks created through React UI are stored in MongoDB.
- [x] **State Synchronization:** Local state updates strictly after confirmed backend HTTP responses.
- [x] **Optimistic UI with Rollback:** Task completion toggles optimistically and safely rolls back upon server failure.
- [x] **Delete Confirmation Dialog:** Accessible modal prompts user before issuing DELETE.
- [x] **Toast Notifications:** Displays green success / red error alerts with auto-dismissal.

**Status:** PASS
