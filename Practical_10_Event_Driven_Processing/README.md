# Practical 10: Asynchronous Processing with Event-Driven Architecture

**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Roll / Class:** B.Tech Information Technology, Semester 5, DEPSTAR, CHARUSAT  
**Course:** Advanced Web Development Frameworks (ITUE301)  

---

## Overview
This project demonstrates asynchronous background processing in Node.js using the native `EventEmitter` module without external message broker dependencies. When a new task is created or deleted via the Express REST API, events are emitted to decouple time-consuming background operations (such as notifications and audit logging) from the critical HTTP request-response cycle.

---

## Features
- **Native `EventEmitter` Subclass:** `TaskEvents` singleton manages lifecycle events (`src/events/taskEvents.js`).
- **Asynchronous Listeners (`src/events/taskListeners.js`):**
  - `task-created`: Non-blocking notification dispatch with runtime execution logging.
  - `task-deleted`: Audit trail logging for task deletions.
  - `error`: Dedicated exception listener ensuring background errors never crash the Node.js server.
- **Immediate HTTP Response:** Returns `201 Created` to the client in ~15ms, executing background notification after the response is sent.
- **Audit Log Inspection Endpoint:** `GET /api/events/logs` returns historical event logs with exact timestamps.
- **Safe Error Testing Endpoint:** `POST /api/events/trigger-error` tests unhandled error safety.
- **MongoDB Persistence:** Stores real task documents in local MongoDB or MongoDB Atlas.

---

## Prerequisites
- Node.js (v18+ or v22 LTS)
- npm (v9+)
- Local MongoDB running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

---

## Quick Start

### 1. Install Dependencies
```bash
cd Practical_10_Event_Driven_Processing
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` if not already present:
```bash
cp .env.example .env
```
Ensure `MONGO_URI` points to your running MongoDB instance:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/awdf_tasks_practical10
NOTIFICATION_DELAY_MS=1500
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Run the Real-Time Timing Demonstration
```bash
npm run demo:timing
```
This runs `scripts/test_event_timing.js`, showing the exact HTTP response timestamp followed by the background listener completion 1500ms later.

### 5. Start the Live Server
```bash
npm start
```
The server will start on `http://localhost:5000`.

---

## API Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/tasks` | List all tasks from MongoDB | 200 OK |
| `GET` | `/tasks/:id` | Get single task by MongoDB ID | 200 OK / 404 Not Found |
| `POST` | `/tasks` | Create task, responds immediately, emits `task-created` | 201 Created |
| `PUT` | `/tasks/:id` | Update task fields | 200 OK / 404 Not Found |
| `DELETE` | `/tasks/:id` | Delete task, emits `task-deleted` | 200 OK / 404 Not Found |
| `GET` | `/api/events/logs` | Inspect recorded in-memory event audit logs | 200 OK |
| `POST` | `/api/events/trigger-error` | Verify safe `error` event handling | 200 OK |

---

## Troubleshooting Guide

| Symptom | Probable Cause | Solution |
|---|---|---|
| Notification log never appears | Listener module was not imported at startup | Ensure `require('./events/taskListeners')` runs in `src/app.js` |
| HTTP response feels delayed | Listener code was invoked synchronously before `res.status(201).json()` | Place `taskEvents.emit()` after `res.status(201).json()` and use async callbacks |
| Unhandled 'error' event crashes server | Emitted `'error'` event without an error listener | Register `taskEvents.on('error', (err) => ...)` to catch exceptions |
