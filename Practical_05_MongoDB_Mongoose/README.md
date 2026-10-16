# Practical 05: MongoDB Integration and Schema Design with Mongoose

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**CO/PO Mapping:** CO2, CO3 / PO3, PO5  

---

## 1. Aim & Objective
To integrate a MongoDB database with an Express backend using the Mongoose Object Data Modeling (ODM) library, enforce schema validation (required fields, enum constraints, pre-save sanitization hooks), handle ObjectId validation, and execute persistent CRUD operations against a live database.

## 2. Features Implemented
- **Mongoose ODM Integration:**
  - Connects to local MongoDB (`mongodb://127.0.0.1:27017/awdf_tasks_practical5`) or MongoDB Atlas via `MONGO_URI` environment variable.
  - Safe error handling: fails cleanly if MongoDB is unreachable (no silent in-memory fallback).
- **Mongoose Task Schema Design:**
  - `title`: String, required, trimmed, maximum 120 characters.
  - `description`: String, trimmed, default empty string.
  - `completed`: Boolean, default `false`.
  - `priority`: String enum restricted to `['low', 'medium', 'high']`, default `'medium'`.
  - `createdAt`: Date timestamp, default `Date.now`.
  - `pre('save')` hook: automatically trims and sanitizes title whitespace.
- **Robust Middleware Pipeline:**
  - `requestLogger`: HTTP method, path, and timestamp logging.
  - `requireJsonContent`: Enforces `Content-Type: application/json` for write operations.
  - `validateObjectId`: Verifies that `:id` is a valid 24-character hexadecimal MongoDB ObjectId (returns 400 on malformed IDs).
  - `errorHandler`: Translates Mongoose `ValidationError` and `CastError` into clean structured JSON responses.
- **Zero Hardcoded Data:** Real MongoDB persistence; tasks are created by client requests.

## 3. Project Structure
```text
Practical_05_MongoDB_Mongoose/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── docs/
│   ├── PRACTICAL_REPORT.md
│   ├── VERIFICATION.md
│   └── EVIDENCE.md
├── tests/
│   └── tasks.test.js
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── db.js
    ├── models/
    │   └── Task.js
    ├── routes/
    │   └── taskRoutes.js
    ├── controllers/
    │   └── taskController.js
    └── middleware/
        ├── logger.js
        ├── contentType.js
        ├── validateObjectId.js
        └── errorHandler.js
```

## 4. Prerequisites
- **Node.js:** v18.0.0+ (Tested on Node.js v22.17.0)
- **npm:** v9.0.0+ (Tested on npm v11.5.2)
- **MongoDB:** Active MongoDB Community Server (running on `127.0.0.1:27017`) or a free-tier MongoDB Atlas cluster.

## 5. Configuration & Environment Variables

Create a local `.env` file in the root of `Practical_05_MongoDB_Mongoose` (copied from `.env.example`):
```env
# Local MongoDB Server
MONGO_URI=mongodb://127.0.0.1:27017/awdf_tasks_practical5

# Or MongoDB Atlas Cluster:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/awdf_tasks?retryWrites=true&w=majority

PORT=5000
```

## 6. Installation & Run Instructions

```bash
# Navigate to the practical folder
cd Practical_05_MongoDB_Mongoose

# Install dependencies
npm install

# Start the server (connects to MongoDB)
npm start
# Server listens on http://localhost:5000

# Run automated integration tests against live MongoDB
npm test
```

## 7. Testing Endpoints via cURL

### 1. Create a Task (POST /tasks)
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Complete Practical 5 Schema Report\", \"description\": \"Document Mongoose pre-save hooks and validation rules\", \"priority\": \"high\"}"
```

### 2. Get All Tasks (GET /tasks)
```bash
curl -X GET http://localhost:5000/tasks
```

### 3. Get Task By Mongo ObjectId (GET /tasks/:id)
```bash
# Replace <MONGO_OBJECT_ID> with the _id returned from POST
curl -X GET http://localhost:5000/tasks/<MONGO_OBJECT_ID>
```

### 4. Update Task (PUT /tasks/:id)
```bash
curl -X PUT http://localhost:5000/tasks/<MONGO_OBJECT_ID> \
  -H "Content-Type: application/json" \
  -d "{\"completed\": true}"
```

### 5. Delete Task (DELETE /tasks/:id)
```bash
curl -X DELETE http://localhost:5000/tasks/<MONGO_OBJECT_ID>
```

## 8. Troubleshooting Guide
| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| `MongoDB connection timed out` | MongoDB service not running or bad URI | Verify MongoDB service status or Atlas IP whitelist (0.0.0.0/0) |
| `CastError: Cast to ObjectId failed` | Sent malformed task ID | Check `:id` parameter; must be 24 hex characters |
| `ValidationError: Task title is required` | Sent empty or missing title in POST/PUT | Provide a non-empty `title` string in the request body |
| `Cannot find module 'dotenv'` | Package not installed | Run `npm install dotenv` |
