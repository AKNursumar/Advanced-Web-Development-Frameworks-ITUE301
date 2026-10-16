# Practical 7 Lab Report: Authentication and Middleware Pipeline

**Course Code:** ITUE301 (Advanced Web Development Frameworks)  
**Academic Year:** 2026–2027 | Semester 5  
**Institute:** DEPSTAR, CHARUSAT  
**Student Name:** Abdulkadir Nursumar  
**CO/PO Mapping:** CO2, CO6 / PO3, PO5  

---

## 1. Aim
To implement user authentication and authorization using JSON Web Tokens (JWT) and bcrypt password hashing in an Express and Mongoose middleware pipeline, protect REST endpoints with authentication guards, and enforce multi-tenant user data isolation.

---

## 2. Theory Summary

### 2.1 Cryptographic Password Hashing with Bcrypt
Storing passwords in plain text or using fast general-purpose hash algorithms (like MD5 or SHA-256) is insecure because modern GPUs can compute billions of SHA hashes per second, making dictionary and rainbow-table attacks feasible.
**Bcrypt** is an adaptive cryptographic hash function based on the Blowfish cipher:
- It incorporates a **salt** (a cryptographically random string generated per user) to defeat precomputed rainbow tables.
- It employs a **work factor** (cost parameter, e.g. 10 rounds = $2^{10} = 1024$ key expansion iterations), deliberately introducing a computational delay (~100ms) to render brute-force attacks computationally infeasible.

### 2.2 JSON Web Tokens (JWT) Architecture
A JWT is a compact, URL-safe container consisting of three base64url-encoded parts separated by periods (`header.payload.signature`):
1. **Header:** Algorithm and token type (`{ "alg": "HS256", "typ": "JWT" }`).
2. **Payload:** Claims containing non-sensitive user identity (`{ "id": "...", "email": "...", "exp": 1730000000 }`).
3. **Signature:** Cryptographic verification hash: `HMACSHA256(base64Url(header) + "." + base64Url(payload), secret)`.
Because the server verifies the signature using the private `JWT_SECRET`, it can trust the authenticity of the token claims without querying a central session cache on every single HTTP request.

### 2.3 User Data Isolation
In a multi-user application, security requires that each user can only read, update, and delete their own resources. The authentication middleware extracts the authenticated user's ID from the verified token and attaches it to `req.user`. Every database operation explicitly filters on `{ user: req.user.id }`, ensuring complete tenancy isolation.

---

## 3. Architecture & Middleware Pipeline

```text
Incoming Request ──► [Logger] ──► [express.json()]
                                        │
                      ┌─────────────────┴─────────────────┐
                      ▼                                   ▼
         Public Routes (/api/auth)             Protected Routes (/api/tasks)
         ├── POST /register                    │
         └── POST /login                       ▼
                                       [authenticateToken Middleware]
                                       ├── Missing/Malformed Token ──► 401
                                       ├── Expired/Invalid Token  ──► 401
                                       └── Valid Signature: sets req.user
                                               │
                                               ▼
                                      [Task Controller]
                                      find({ user: req.user.id })
```

---

## 4. Test Procedure & Verification

Automated integration tests were authored in `backend/tests/auth.test.js` and executed against the live local MongoDB:
```bash
cd Practical_07_JWT_Authentication/backend
npm test
```
The test suite validates:
1. Registration generates bcrypt hash starting with `$2` and issues JWT token.
2. Strips password field when serializing user document.
3. Rejects duplicate emails with HTTP 400.
4. Rejects passwords shorter than 6 characters with HTTP 400.
5. Login returns JWT on valid credentials and HTTP 401 on incorrect password or unknown email.
6. `/api/auth/me` returns authenticated profile.
7. Rejects requests lacking `Authorization` header or bearing forged tokens with HTTP 401.
8. **User Isolation Verification:** Verified that User B cannot query or delete User A's tasks.

---

## 5. Observations & Result

| Test Case | Scenario / Condition | Expected Status | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| User Registration | Valid email & password | `201 Created` | Hashed in DB with bcrypt | **Pass** |
| Password Security | Direct DB inspection | No plain text | Saved as `$2a$10$...` | **Pass** |
| Duplicate Email | Register existing email | `400 Bad Request` | Prevented with clean message | **Pass** |
| Login Success | Valid credentials | `200 OK` | Valid signed JWT returned | **Pass** |
| Login Failure | Invalid password | `401 Unauthorized` | Rejected safely | **Pass** |
| Missing Token | Access `/api/tasks` | `401 Unauthorized` | Intercepted by auth guard | **Pass** |
| Tampered Token | Forged JWT signature | `401 Unauthorized` | Signature rejected | **Pass** |
| Data Isolation | User B queries User A's tasks | `count: 0` / `404` | Cross-user leakage prevented | **Pass** |

**Conclusion:** The JWT authentication pipeline, password hashing, and user data isolation mechanisms were successfully built and verified.

---

## 6. Viva Questions & In-Depth Answers

### Q1: Why must passwords never be stored in plain text or with standard MD5/SHA256 hashes?
**Answer:** Plaintext storage means any database compromise or leak instantly exposes user credentials. Fast hash algorithms like MD5 or SHA256 can be computed at rates exceeding billions of hashes per second using modern GPU arrays, allowing attackers to crack passwords in seconds using rainbow tables and dictionary attacks. Bcrypt introduces a mandatory salt (defeating precomputed tables) and a tunable work factor (causing an intentional algorithmic delay) that makes brute-force attacks computationally impossible.

### Q2: What information is contained in the three parts of a JWT? Can the client read the payload?
**Answer:** A JWT consists of:
1. **Header:** Token type (`JWT`) and signing algorithm (`HS256`).
2. **Payload:** Claims such as user ID (`id`), subject (`sub`), and expiration (`exp`).
3. **Signature:** Cryptographic hash verifying that the header and payload were signed by the server's private secret.
**Yes, the client can read the payload**, because it is merely base64url-encoded, not encrypted. Therefore, sensitive information such as passwords, credit card numbers, or secret keys must **never** be placed inside a JWT payload.

### Q3: What happens when `jwt.verify()` encounters an expired or tampered token?
**Answer:** `jwt.verify()` throws a synchronous exception:
- `TokenExpiredError`: If the current Unix timestamp exceeds the `exp` claim.
- `JsonWebTokenError`: If the signature does not match the computed hash of header + payload (indicating tampering or wrong secret key).
If this call is not wrapped in a `try/catch` block, the unhandled exception will crash the Express server. In our implementation, we catch the exception and return a clean HTTP 401 Unauthorized response.

### Q4: Compare storing JWT tokens in `localStorage` versus `httpOnly` Cookies.
**Answer:**
- **`localStorage`:** Easy to access and set via JavaScript. However, it is vulnerable to **Cross-Site Scripting (XSS)**: if an attacker injects malicious JavaScript, they can execute `localStorage.getItem('token')` and steal the credentials.
- **`httpOnly` Cookies:** Inaccessible to client-side JavaScript, entirely mitigating token theft via XSS. However, cookies are automatically sent with browser requests, requiring defenses against **Cross-Site Request Forgery (CSRF)** (e.g. `SameSite=Strict` cookies or anti-CSRF tokens).

### Q5: How is user data isolation implemented at the database query level?
**Answer:** In the Mongoose schema, each Task stores a foreign reference `user: ObjectId`. When an authenticated request arrives, the `authenticateToken` middleware populates `req.user.id` from the verified token. All controller queries explicitly inject `{ user: req.user.id }` into their criteria (e.g. `Task.findOne({ _id: taskId, user: req.user.id })`). Even if an attacker guesses another user's valid task ID, the query returns null, preventing unauthorized reads, updates, or deletions.
