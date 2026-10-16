# Practical 4 Lab Report: Building a RESTful API with Node.js and Express

**Course Code:** ITUE301 (Advanced Web Development Frameworks)  
**Academic Year:** 2026–2027 | Semester 5  
**Institute:** DEPSTAR, CHARUSAT  
**Student Name:** Abdulkadir Nursumar  
**CO/PO Mapping:** CO2 / PO3, PO5  

---

## 1. Aim
To design and implement a RESTful backend server with complete CRUD endpoints for a Task Management application, engineering an Express middleware pipeline with request logging, content-type enforcement, route-level parameter validation, and centralized error handling using an in-memory repository.

---

## 2. Theory Summary

### 2.1 The Express Request-Response Lifecycle
In Express.js, an incoming HTTP request flows sequentially through an array of handler functions termed the **middleware pipeline**. Each middleware possesses access to the request object (`req`), response object (`res`), and the next middleware trigger (`next`):
- If a middleware does not terminate the cycle by sending a response (`res.send()`, `res.json()`), it **must** call `next()` to yield control to the subsequent middleware. Failing to do so causes the client connection to hang until a timeout occurs.
- Middlewares execute in the precise textual order in which they are registered with `app.use()`.

### 2.2 Error-Handling Middleware
Express differentiates normal middleware from error-handling middleware by function arity: error-handling middleware **must accept four parameters**: `(err, req, res, next)`. When any route or middleware invokes `next(err)`, Express skips all remaining standard middleware in the pipeline and routes execution directly into the four-argument error handler.

### 2.3 HTTP Status Codes & Structured JSON Responses
Adhering to REST principles demands returning accurate status codes:
- `200 OK`: Successful read or update operation.
- `201 Created`: Successful resource creation.
- `400 Bad Request`: Client-side validation error (e.g. missing title, invalid JSON, wrong Content-Type).
- `404 Not Found`: Target resource or route does not exist.
- `500 Internal Server Error`: Unhandled server exception (safely masked without leaking stack traces).

---

## 3. Implementation Details

1. **`src/app.js`**: Decoupled application factory returning the configured Express app without binding a TCP socket port, enabling seamless programmatic testing with Supertest.
2. **`src/server.js`**: Binds the application instance to port 5000 for standard execution.
3. **`src/middleware/logger.js`**: Global logging of HTTP method, path, and ISO timestamp.
4. **`src/middleware/contentType.js`**: Intercepts POST/PUT requests and verifies `Content-Type: application/json`.
5. **`src/middleware/validateTaskId.js`**: Sanitizes and validates `req.params.id`.
6. **`src/middleware/errorHandler.js`**: Four-parameter error interceptor returning structured JSON `{ success: false, error: '...', message: '...' }`.
7. **`src/controllers/taskController.js`**: Manages CRUD logic over the in-memory array store.

---

## 4. Test Procedure & Verification

Automated integration tests were authored in `tests/tasks.test.js` using Jest and Supertest:
```bash
npm test
```
The test suite validates:
1. `GET /tasks`: Returns 200 and empty list.
2. `POST /tasks`: Creates task with 201 status and auto-generated UUID.
3. Content-Type Enforcer: Returns 400 when POST lacks `application/json` header.
4. Validation: Returns 400 when `title` is missing or `priority` is not in enum.
5. `GET /tasks/:id`: Returns 200 for valid ID and 404 for non-existent ID.
6. `PUT /tasks/:id`: Updates fields and timestamps correctly.
7. `DELETE /tasks/:id`: Removes item and confirms subsequent GET returns 404.
8. 404 Catch-All: Confirms undefined route returns structured JSON.

---

## 5. Observations & Result

| Test Case | Method & Endpoint | Payload / Condition | Expected Status | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Health Check | `GET /` | None | `200 OK` | `200 OK` | **Pass** |
| Get All Tasks | `GET /tasks` | None | `200 OK` | `200 OK` | **Pass** |
| Create Task | `POST /tasks` | Valid JSON | `201 Created` | `201 Created` | **Pass** |
| Content-Type Reject | `POST /tasks` | Text plain | `400 Bad Request` | `400 Bad Request` | **Pass** |
| Missing Title | `POST /tasks` | `{ description: '...' }` | `400 Bad Request` | `400 Bad Request` | **Pass** |
| Read Single Task | `GET /tasks/:id` | Valid UUID | `200 OK` | `200 OK` | **Pass** |
| Read Missing Task | `GET /tasks/:id` | Non-existent ID | `404 Not Found` | `404 Not Found` | **Pass** |
| Update Task | `PUT /tasks/:id` | Valid update JSON | `200 OK` | `200 OK` | **Pass** |
| Delete Task | `DELETE /tasks/:id` | Existing task | `200 OK` | `200 OK` | **Pass** |
| Undefined Route | `GET /unregistered` | None | `404 Not Found` | `404 Not Found` | **Pass** |

**Conclusion:** The RESTful Express API and full middleware pipeline were implemented and verified with 100% automated test coverage.

---

## 6. Viva Questions & In-Depth Answers

### Q1: Why must the centralized error-handling middleware be registered last in the Express middleware stack?
**Answer:** Middlewares execute in registration order. If an error handler is declared before route handlers, it will never receive errors thrown or passed via `next(err)` inside those routes. Placing it as the final `app.use()` guarantees that any error forwarded down the pipeline by preceding middleware or route controllers is intercepted before an unhandled promise rejection or crash occurs.

### Q2: What is the difference between `app.use()` and route-specific middleware like `router.get(path, middleware, controller)`?
**Answer:**
- `app.use()` applies the middleware **globally** to all incoming requests that match the path prefix (or all requests if no path is given), such as global loggers, body parsers, and CORS.
- Route-specific middleware is injected into a specific route definition. It executes only for that designated HTTP method and endpoint (e.g. validating an ID parameter only on `/tasks/:id`).

### Q3: Why is sending raw error stack traces (`err.stack`) to production API clients considered a dangerous vulnerability?
**Answer:** A stack trace exposes internal server architecture, exact operating system file paths, database library versions, internal variable names, and line numbers of failures. Attackers exploit this information (CWE-209: Information Exposure Through an Error Message) to map vulnerabilities and craft targeted exploits. In production, logs should be recorded securely server-side while clients receive a sanitized, structured JSON error.

### Q4: Why is it best practice to separate `createApp()` / `app.js` from `server.js`?
**Answer:** In `server.js`, `app.listen(port)` binds a physical TCP port on the network interface. In automated integration testing (such as with Supertest), Supertest can bind the Express app ephemerally in memory without opening a physical port or causing `EADDRINUSE` port collision errors during concurrent test runs. Separating `app.js` and `server.js` achieves high testability.

### Q5: What happens if a middleware function fails to invoke either `next()` or a response method (`res.send`, `res.json`)?
**Answer:** The request-response cycle stalls. The client's HTTP request remains pending indefinitely until the client or gateway server terminates the connection with a socket timeout error (HTTP 504 Gateway Timeout).
