# Practical 06: Full-Stack Integration (React + Node.js + MongoDB)

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**CO/PO Mapping:** CO1, CO2 / PO3, PO5  

---

## 1. Aim & Objective
To integrate a React (Vite) frontend with a Node.js/Express REST backend and a MongoDB database into a fully synchronized full-stack application, configuring Cross-Origin Resource Sharing (CORS), handling loading/error states across all write operations, providing modal delete confirmation, and displaying toast notifications.

## 2. Features Implemented
- **True End-to-End Persistence:**
  - Zero fake data: tasks created in the React UI are transmitted via HTTP POST to Express and saved to MongoDB.
  - Refreshing the browser confirms persistent storage loaded from the database.
- **Frontend Reactive Capabilities (`frontend/`):**
  - **Create Task Form:** Captures `title`, `description`, `priority` (`low`, `medium`, `high`) with client-side validation and loading feedback.
  - **Task Item Actions:** Complete toggle (with optimistic UI update and server failure rollback), priority pill badges, formatted creation timestamps.
  - **Modal Confirmation Dialog:** Supplementary requirement — prompts user before deleting a task to prevent accidental data loss.
  - **Toast Notifications:** Supplementary requirement — animated success/error banners for create, update, and delete actions.
  - **Filter Tabs:** Quickly toggle view between All, Active, and Completed tasks.
- **Backend Architecture (`backend/`):**
  - MongoDB connection via Mongoose ODM.
  - CORS middleware configured for `http://localhost:5173`.
  - ObjectId validation and centralized error formatting.

## 3. Project Structure
```text
Practical_06_Full_Stack_Integration/
├── README.md
├── .gitignore
├── docs/
│   ├── PRACTICAL_REPORT.md
│   ├── VERIFICATION.md
│   └── EVIDENCE.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   ├── .gitignore
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/db.js
│       ├── models/Task.js
│       ├── routes/taskRoutes.js
│       ├── controllers/taskController.js
│       └── middleware/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env.example
    ├── .env
    ├── .gitignore
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api.js
        └── components/
            ├── TaskForm.jsx
            ├── TaskList.jsx
            ├── TaskItem.jsx
            ├── ConfirmDialog.jsx
            └── Toast.jsx
```

## 4. Prerequisites
- **Node.js:** v18.0.0+ (Tested on Node.js v22.17.0)
- **npm:** v9.0.0+ (Tested on npm v11.5.2)
- **MongoDB:** Active local MongoDB instance on `127.0.0.1:27017` or Atlas cluster.

## 5. Step-by-Step Run Instructions (Two Separate Terminals)

### Terminal 1: Backend Server (Port 5000)
```bash
# From workspace root, navigate to backend
cd Practical_06_Full_Stack_Integration/backend

# Install backend dependencies (express, mongoose, dotenv, cors)
npm install

# Start Express backend
npm start
# Output: [MongoDB] Connected to database: awdf_tasks_practical6
# Server listening on http://localhost:5000
```

### Terminal 2: Frontend Client (Port 5173)
```bash
# In a second terminal, navigate to frontend
cd Practical_06_Full_Stack_Integration/frontend

# Install frontend dependencies
npm install

# Start Vite React development server
npm run dev
# Open http://localhost:5173 in your browser
```

## 6. Verification Checklist
- [x] Backend connects to MongoDB and accepts cross-origin requests from `http://localhost:5173`.
- [x] Creating a task in the React UI persists the record in MongoDB.
- [x] Toggle complete sends a PUT request to the API and updates state.
- [x] Delete button opens accessible confirmation modal before issuing DELETE request.
- [x] Toast notification confirms success or alerts on failure.
- [x] Browser reload retains all task records fetched from the database.
- [x] Both `backend` and `frontend` packages build cleanly without errors.

## 7. Troubleshooting Guide
| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| `CORS error in browser console` | `cors` middleware missing or origin mismatched | Verify `app.use(cors())` is placed before routes in `backend/src/app.js` |
| `fetch failed / Network Error` | Backend server not running on port 5000 | Ensure Terminal 1 is actively running `npm start` in `backend/` |
| `Tasks disappear on page refresh` | App reading from hardcoded state instead of API | Verify `fetchTasks()` is called inside `useEffect` on component mount |
| `Delete occurs without prompt` | Confirmation modal bypassed | Ensure `handleDeleteClick` sets `taskToDelete` state to open dialog |
