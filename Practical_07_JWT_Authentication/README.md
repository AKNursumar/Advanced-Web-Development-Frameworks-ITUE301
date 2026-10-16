# Practical 07: Authentication and Middleware Pipeline

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**CO/PO Mapping:** CO2, CO6 / PO3, PO5  

---

## 1. Aim & Objective
To engineer a secure JSON Web Token (JWT) authentication flow and request validation pipeline in Express and Mongoose, enforcing password hashing with bcrypt, protecting task routes with custom authentication middleware, and ensuring strict multi-tenant user data isolation.

## 2. Features Implemented
- **Mongoose User Model & Password Hashing:**
  - Unique, normalized (lowercase, trimmed) email validation.
  - One-way cryptographic password hashing using `bcryptjs` with 10 salt rounds before database persistence.
  - Passwords are automatically stripped from JSON outputs via a custom `toJSON()` transform.
- **JWT Generation & Verification Pipeline:**
  - Signs tokens on successful login and registration with configurable expiration (`JWT_EXPIRES_IN=1h`).
  - Secret key kept strictly on the backend (`JWT_SECRET` in `.env`).
  - `authenticateToken` middleware safely parses `Authorization: Bearer <token>`, catches missing/malformed/expired tokens, and returns structured HTTP 401 responses.
- **User Data Isolation:**
  - Tasks are linked via `user: ObjectId ref 'User'`.
  - Queries (`find`, `findOne`, `findOneAndUpdate`, `findOneAndDelete`) enforce `{ user: req.user.id }`.
  - User A cannot view, edit, or delete User B's records under any circumstance.
- **Protected Endpoint `/api/auth/me`:**
  - Returns the authenticated user's safe profile.
- **Token Storage Strategy & Security Trade-Offs (Lab Documentation):**
  - *Current Implementation:* The frontend stores the token in `localStorage` for simple client-side state access and offline persistence.
  - *Security Trade-Off Analysis:* `localStorage` is accessible to JavaScript running in the browser, making it susceptible to Cross-Site Scripting (XSS) attacks. In high-assurance production systems, storing tokens inside `httpOnly`, `SameSite=Strict`, `Secure` cookies prevents client-side script access, but requires Cross-Site Request Forgery (CSRF) mitigation.

## 3. Endpoints Documentation

| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user & hash password | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | Public | Verify password & sign JWT | `{ "email": "...", "password": "..." }` |
| `GET` | `/api/auth/me` | Protected | Return authenticated user profile | Header: `Authorization: Bearer <token>` |
| `GET` | `/api/tasks` | Protected | Retrieve authenticated user's tasks | Header: `Authorization: Bearer <token>` |
| `POST` | `/api/tasks` | Protected | Create task for authenticated user | `{ "title": "...", "priority": "..." }` |
| `PUT` | `/api/tasks/:id` | Protected | Update task owned by user | `{ "completed": true }` |
| `DELETE` | `/api/tasks/:id` | Protected | Delete task owned by user | Header: `Authorization: Bearer <token>` |

## 4. Prerequisites
- **Node.js:** v18.0.0+ (Tested on Node.js v22.17.0)
- **npm:** v9.0.0+ (Tested on npm v11.5.2)
- **MongoDB:** Active MongoDB instance on `127.0.0.1:27017` or Atlas.

## 5. Installation & Run Instructions

### Backend (Terminal 1)
```bash
cd Practical_07_JWT_Authentication/backend
npm install
npm test    # Runs automated auth & user isolation integration tests
npm start   # Starts server on http://localhost:5000
```

### Frontend (Terminal 2)
```bash
cd Practical_07_JWT_Authentication/frontend
npm install
npm run dev # Starts Vite on http://localhost:5173
```

## 6. Troubleshooting Guide
| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| `401 Unauthorized on every request` | Authorization header missing or malformed | Ensure header is formatted as `Authorization: Bearer <token>` with a single space |
| `Server crashes on invalid token` | `jwt.verify()` called without try/catch | Wrap `jwt.verify` in a try/catch block and return 401 |
| `Login always fails with correct password` | Compared plain password to hashed with `===` | Use `await bcrypt.compare(plainPassword, hashedPassword)` |
| `User B can see User A tasks` | Query omitted `{ user: req.user.id }` | Scope all Mongoose query filters to `req.user.id` |
