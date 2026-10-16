# Practical 04: Building a RESTful API with Node.js and Express

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**CO/PO Mapping:** CO2 / PO3, PO5  

---

## 1. Aim & Objective
To design and implement a production-grade RESTful backend server with complete CRUD endpoints for a Task Management application, engineering a structured Express middleware pipeline with request logging, content-type enforcement, route-level parameter validation, and centralized error handling using an in-memory repository.

## 2. Architecture & Middleware Pipeline

```text
Incoming HTTP Request (Client / Postman / Supertest)
  │
  ▼
[1. Request Logger Middleware] ──► Logs: METHOD URL - ISO Timestamp
  │
  ▼
[2. express.json() Body Parser] ──► Parses incoming JSON request payloads
  │
  ▼
[3. Content-Type Enforcer] ──► Rejects POST/PUT without Content-Type: application/json (400)
  │
  ▼
[4. Task ID Validator] ──► Validates ID formatting on parameterized routes (400)
  │
  ▼
[5. Express Router & Controllers] ──► Executes CRUD operations against in-memory store
  │
  ▼ (if uncaught error occurs or route undefined)
[6. 404 Handler] ──► Structured JSON response for undefined routes (404)
  │
  ▼
[7. Global Centralized Error Handler] ──► Last middleware (err, req, res, next) (500)
```

## 3. Endpoints Documentation

| Method | Endpoint | Description | Request Body | Success Code | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | API Root / Health Check | None | `200 OK` | `500` |
| `GET` | `/tasks` | Retrieve all tasks | None | `200 OK` | `500` |
| `GET` | `/tasks/:id` | Retrieve single task by ID | None | `200 OK` | `400, 404` |
| `POST` | `/tasks` | Create new task | `{ "title": "...", "description": "...", "priority": "low\|medium\|high" }` | `201 Created` | `400, 500` |
| `PUT` | `/tasks/:id` | Update task by ID | `{ "title": "...", "completed": true, "priority": "..." }` | `200 OK` | `400, 404, 500` |
| `DELETE` | `/tasks/:id` | Remove task by ID | None | `200 OK` | `400, 404, 500` |

*Note: In Practical 4, data is stored in memory and resets on server restart as required by the syllabus. MongoDB persistence is implemented in Practical 5.*

## 4. Prerequisites
- **Node.js:** v18.0.0+ (Tested on Node.js v22.17.0)
- **npm:** v9.0.0+ (Tested on npm v11.5.2)

## 5. Installation & Run Instructions

```bash
# Navigate to the folder
cd Practical_04_Express_REST_API

# Install dependencies (Express, Jest, Supertest, UUID)
npm install

# Start the server
npm start
# Server listens on http://localhost:5000

# Execute automated test suite
npm test
```

## 6. Testing Endpoints via cURL

### 1. Create a Task (POST /tasks)
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Study Express Middleware Lifecycle\", \"description\": \"Understand app.use vs router middleware\", \"priority\": \"high\"}"
```

### 2. Get All Tasks (GET /tasks)
```bash
curl -X GET http://localhost:5000/tasks
```

### 3. Get Task By ID (GET /tasks/:id)
```bash
# Replace <TASK_ID> with the ID returned by POST
curl -X GET http://localhost:5000/tasks/<TASK_ID>
```

### 4. Update Task (PUT /tasks/:id)
```bash
curl -X PUT http://localhost:5000/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -d "{\"completed\": true, \"priority\": \"medium\"}"
```

### 5. Delete Task (DELETE /tasks/:id)
```bash
curl -X DELETE http://localhost:5000/tasks/<TASK_ID>
```

### 6. Test Error Path (Reject missing Content-Type)
```bash
curl -X POST http://localhost:5000/tasks \
  -d "title=PlainTextTask"
# Returns HTTP 400 Bad Request
```

## 7. Troubleshooting Guide
| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| `Request hangs indefinitely` | Middleware omitted `next()` and did not send a response | Ensure every middleware calls `next()` or returns `res.json()` |
| `req.body is undefined` | `express.json()` middleware placed after routes | Define `app.use(express.json())` prior to route mounting |
| `Cannot GET /tasks` | Route path typo or server running on different port | Check endpoint spelling and server port in `server.js` |
| `Error handler never fires` | Error handler defined before routes or errors not passed via `next(err)` | Move error handler to be the last `app.use()` in the chain |
