# Practical 6 Lab Report: Full Stack Integration (React + Node + MongoDB)

**Course Code:** ITUE301 (Advanced Web Development Frameworks)  
**Academic Year:** 2026–2027 | Semester 5  
**Institute:** DEPSTAR, CHARUSAT  
**Student Name:** Abdulkadir Nursumar  
**CO/PO Mapping:** CO1, CO2 / PO3, PO5  

---

## 1. Aim
To wire a React (Vite) frontend with a Node.js/Express REST backend and a MongoDB database into a fully synchronized full-stack application, configuring Cross-Origin Resource Sharing (CORS), handling loading/error states across all write operations, providing modal delete confirmation, and displaying toast notifications.

---

## 2. Theory Summary

### 2.1 Full-Stack Architecture & The Single Origin Policy (SOP)
Browsers implement the **Same-Origin Policy (SOP)** as a fundamental security boundary: a web application executing on origin `http://localhost:5173` cannot make HTTP requests to a different origin (`http://localhost:5000`) unless the target server explicitly grants permission via **Cross-Origin Resource Sharing (CORS)** headers (`Access-Control-Allow-Origin`).
In the Express backend, installing and configuring `cors()` middleware sends the appropriate preflight (`OPTIONS`) and response headers, allowing the React dev server to communicate with the REST API.

### 2.2 Client-Server State Synchronization & Optimistic UI
When a user updates a task (e.g. marking it complete):
- **Optimistic UI:** The frontend updates its local state *immediately* before waiting for server confirmation, creating an instantaneous, snappy user experience.
- **Rollback Mechanism:** If the backend network call fails (HTTP 500 or timeout), the frontend detects the rejection in the `.catch()` block and rolls back the UI state to its previous snapshot, informing the user via a Toast alert.

### 2.3 User Experience in Destructive Actions
Accidental deletions can lead to irrecoverable data loss. Implementing an accessible, focus-trapped **Confirmation Modal Dialog** forces intentional user confirmation before dispatching an HTTP `DELETE` command to the database.

---

## 3. System Architecture & Data Flow

```text
React Frontend (localhost:5173)
  │
  ├── [User Submits TaskForm] ──► POST /tasks ──► Express Backend (localhost:5000)
  │                                                      │ Mongoose ODM
  │                                                      ▼
  │                                              MongoDB Database
  │                                                      │
  │   ◄── Returns 201 Created Document ──────────────────┘
  │
  ├── Local State Updated (prepends new task)
  └── Toast Notification ("Task created successfully!")
```

---

## 4. Test Procedure & Verification

1. **Backend Initialization:**
   ```bash
   cd Practical_06_Full_Stack_Integration/backend
   npm install && npm start
   ```
   Confirmed backend connects to MongoDB on `127.0.0.1:27017` and starts on port 5000.
2. **Frontend Initialization & Build:**
   ```bash
   cd Practical_06_Full_Stack_Integration/frontend
   npm install && npm run build
   ```
   Confirmed Vite compiles the React single-page dashboard without warnings.
3. **End-to-End Flow Verification:**
   - **Create:** Submitted a new task ("Verify Full-Stack Integration") with priority "high". Confirmed it appears in the list and shows a success toast.
   - **Persist:** Reloaded browser tab (`F5`). Confirmed the task remains loaded from MongoDB.
   - **Update:** Toggled completion checkbox. Confirmed strikethrough styling and successful update toast.
   - **Delete with Confirmation:** Clicked "Delete". Observed modal overlay; clicked "Cancel" (task remained); clicked "Delete" and "Yes, Delete" (task removed from MongoDB and UI).

---

## 5. Observations & Result

| Step | Action Performed | Expected Behavior | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| CORS Preflight | React calls Express API | Allowed by `cors` middleware | No CORS errors in console | **Pass** |
| Task Creation | Submit TaskForm | HTTP POST 201, saved to Mongo | Saved with ObjectId | **Pass** |
| Data Persistence | Browser refresh | Database records fetched | All tasks persist across reloads | **Pass** |
| Toggle Complete | Checkbox clicked | HTTP PUT 200, state synced | Status updated dynamically | **Pass** |
| Delete Modal | Click Delete button | Modal prompts for confirmation | Prevents accidental deletion | **Pass** |
| Toast Alert | Any CRUD action | Toast popups with feedback | Colored toasts appear and auto-dismiss | **Pass** |

**Conclusion:** The React, Express, and MongoDB full-stack architecture was successfully integrated and verified end-to-end.

---

## 6. Viva Questions & In-Depth Answers

### Q1: What is CORS, and why does an Express API require it when connected to a React frontend?
**Answer:** CORS (Cross-Origin Resource Sharing) is an HTTP-header-based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources. Because Vite runs on `http://localhost:5173` and Express on `http://localhost:5000`, they constitute different origins under the browser's Same-Origin Policy. Without the `cors()` middleware on Express returning `Access-Control-Allow-Origin: http://localhost:5173`, the browser blocks responses from reaching React.

### Q2: Why should state synchronization occur only after backend confirmation rather than silently assuming success?
**Answer:** If the frontend assumes success without checking the server response, any backend validation rejection (e.g. invalid title length), network disconnect, or database timeout will cause the frontend to display data that does not exist in the database. When the user refreshes the page, the "ghost" data disappears, causing confusion. Confirming the backend operation ensures the UI state remains consistent with the database.

### Q3: What is the concept of Optimistic UI, and what risk does it entail?
**Answer:** Optimistic UI is an interaction pattern where the client updates its interface immediately under the assumption that the backend operation will succeed, eliminating perceived network latency. The primary risk is failure handling: if the server rejects the write, the client must implement an automatic rollback to restore the previous state and notify the user of the failure.

### Q4: Why is storing backend credentials or secrets in Vite environment variables (`.env`) dangerous?
**Answer:** Any environment variable prefixed with `VITE_` (e.g. `VITE_API_BASE_URL`) is embedded directly into the publicly downloaded JavaScript bundle during build time. Any user can view these variables in plain text using Browser DevTools. Therefore, sensitive secrets like database URIs, API secret keys, and JWT secrets must strictly remain on the backend server.

### Q5: What is the role of a confirmation modal before deletion?
**Answer:** Deletion is a destructive and irreversible operation in persistent databases. Confirmation modals introduce deliberate friction (two-step verification), preventing accidental data loss caused by unintentional taps or misclicks.
