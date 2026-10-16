# Practical 5 Lab Report: MongoDB Integration and Schema Design with Mongoose

**Course Code:** ITUE301 (Advanced Web Development Frameworks)  
**Academic Year:** 2026–2027 | Semester 5  
**Institute:** DEPSTAR, CHARUSAT  
**Student Name:** Abdulkadir Nursumar  
**CO/PO Mapping:** CO2, CO3 / PO3, PO5  

---

## 1. Aim
To connect a MongoDB database to an Express backend server using the Mongoose ODM, design a validated data schema with required constraints and pre-save middleware hooks, and execute persistent CRUD operations with error mapping.

---

## 2. Theory Summary

### 2.1 NoSQL vs. Relational Databases & Schema Enforcers
MongoDB is a document-oriented NoSQL database that stores data as flexible, JSON-like BSON documents. While MongoDB collections are inherently schema-less at the engine layer, enterprise applications require data integrity and strict typing. **Mongoose** provides an Object Data Modeling (ODM) layer for Node.js, enforcing schema definitions, required field checks, default values, and type validation at the application tier before documents are serialized and dispatched over the database socket.

### 2.2 Schema Design & Pre-Save Middleware Hooks
Mongoose middleware (pre and post hooks) intercept document execution pipelines:
- **Pre-save hook:** `taskSchema.pre('save', function (next) { ... })` runs synchronously or asynchronously immediately before `document.save()` commits data to MongoDB. This enables automatic field sanitization (e.g. trimming whitespace, password hashing, timestamp computation).
- **Validators & Enums:** Enforce that attributes such as `priority` match designated enum arrays (`['low', 'medium', 'high']`), aborting the write operation if violated.

### 2.3 MongoDB ObjectId & Cast Errors
Every MongoDB document is indexed by an immutable primary key `_id` represented by an `ObjectId` (a 12-byte BSON type comprising timestamp, machine identifier, process ID, and incrementing counter, formatted as 24 hexadecimal characters). When an API endpoint queries by `:id`, Mongoose attempts to cast the string to an `ObjectId`. If the string is malformed, a `CastError` is thrown, which our middleware pipeline intercepts to return a structured HTTP 400 Bad Request instead of crashing.

---

## 3. Database Architecture & Schema

```text
Database: awdf_tasks_practical5 (MongoDB Community Server / Atlas)
 └── Collection: tasks
      ├── _id: ObjectId (Primary Key, 24 hex characters)
      ├── title: String (Required, trimmed, max 120 chars)
      ├── description: String (Default: '')
      ├── completed: Boolean (Default: false)
      ├── priority: String (Enum: ['low', 'medium', 'high'], Default: 'medium')
      ├── createdAt: Date (Default: Date.now)
      └── updatedAt: Date (Mongoose timestamps option)
```

---

## 4. Test Procedure & Verification

Automated integration tests were executed in `tests/tasks.test.js` against the live local MongoDB instance running on `127.0.0.1:27017`:
```bash
npm test
```
The test suite executed:
1. `GET /tasks`: Confirmed empty collection returns `count: 0`.
2. `POST /tasks`: Created document, verified `_id` assignment, and checked that `Task.findById()` directly in MongoDB returns the saved record.
3. Pre-Save Hook: Sent title with surrounding whitespace (`"   Trimmed Task Title   "`) and confirmed saved document has trimmed title.
4. Validation Enforcement: Sent request with missing title; confirmed Mongoose intercepted the write and returned HTTP 400.
5. Enum Enforcement: Sent invalid priority (`"extreme-priority"`); confirmed HTTP 400.
6. `GET /tasks/:id`: Verified HTTP 200 for valid ID and HTTP 400 for malformed ObjectId string.
7. `PUT /tasks/:id`: Updated document, confirmed persistence in database.
8. `DELETE /tasks/:id`: Deleted document, confirmed subsequent query yields null.

---

## 5. Observations & Result

| Test Case | Request / Condition | Expected Status | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| MongoDB Connection | `mongoose.connect(MONGO_URI)` | Successful TCP handshake | Connected to local MongoDB | **Pass** |
| Create Task | `POST /tasks` with valid JSON | `201 Created` | Document persisted with `_id` | **Pass** |
| Pre-Save Trim Hook | Title with leading/trailing spaces | Clean trimmed title | Whitespace trimmed automatically | **Pass** |
| Schema Validation | Missing `title` | `400 Bad Request` | Structured JSON validation error | **Pass** |
| Priority Enum | Invalid priority value | `400 Bad Request` | Clean error with allowed values | **Pass** |
| Malformed Mongo ID | Non-hex string in `:id` | `400 Bad Request` | Handled by `validateObjectId` | **Pass** |
| Non-existent Mongo ID | 24-char hex ID not in DB | `404 Not Found` | Handled with structured 404 | **Pass** |
| Data Persistence | Restart / query after creation | Record persists | Verified in active MongoDB | **Pass** |

**Conclusion:** Persistent MongoDB integration with Mongoose ODM was fully realized, validating schema constraints and handling data lifecycles cleanly.

---

## 6. Viva Questions & In-Depth Answers

### Q1: What is the purpose of a schema in Mongoose when MongoDB is schema-less?
**Answer:** While MongoDB does not force rigid column definitions at the storage engine level, real-world applications require consistent data structures, type safety, default values, and validation. Mongoose acts as an application-level guard. Defining a schema ensures that invalid, malformed, or unauthorized properties are rejected before they consume database resources, protecting data integrity.

### Q2: What is the difference between Mongoose schema validation and database-level validation?
**Answer:**
- **Mongoose validation** occurs within the Node.js application process memory *before* a command is sent over the network to MongoDB. It produces detailed JavaScript error objects and avoids wasteful database round-trips.
- **Database-level validation** (e.g. MongoDB JSON Schema Validator) is enforced by the database engine itself. It protects data regardless of which client (Node.js, Python script, or Compass GUI) writes to the collection.

### Q3: How does the Mongoose `pre('save')` hook function, and what must be passed to proceed?
**Answer:** A `pre('save')` hook is middleware that executes just before a document is written to the database. Inside the hook function, `this` refers to the document instance being saved. In callback-based syntax, the hook receives a `next` callback which must be called (`next()`) to permit the save operation to continue, or `next(err)` to abort the save and bubble the error to the calling controller.

### Q4: Why must database queries in Express route handlers always be wrapped in `try/catch` blocks?
**Answer:** Mongoose query methods (`find`, `create`, `findByIdAndUpdate`) return Promises. If a database query fails (due to connection loss, duplicate keys, or validation rejections) and is not wrapped in `try/catch` or an async wrapper, an **Unhandled Promise Rejection** occurs. In modern Node.js versions, unhandled rejections terminate the entire Node.js server process, causing total service downtime. Wrapping calls in `try/catch` enables passing the error to `next(err)` for centralized recovery.

### Q5: What is the difference between `findByIdAndUpdate()` and `save()` in Mongoose?
**Answer:**
- `findByIdAndUpdate()` issues a direct MongoDB update command (`findAndModify`) on the server. By default, it does **not** run Mongoose schema validators unless `{ runValidators: true }` is explicitly passed in options, and does **not** trigger `pre('save')` document hooks.
- `document.save()` executes the full document lifecycle, including all schema validation rules and `pre('save')` / `post('save')` hooks.
