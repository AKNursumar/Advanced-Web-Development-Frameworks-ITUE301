# Practical 10: Evidence and Screenshot Guidelines

**Student Name:** Abdulkadir Nursumar (AK Nursumar)  
**Course:** Advanced Web Development Frameworks (ITUE301)  

---

## Required Screenshots for Lab File

### Screenshot 1: Automated Test Suite Output
- **How to capture:**
  1. Open a terminal in `Practical_10_Event_Driven_Processing`.
  2. Run `npm test`.
  3. Capture the terminal window showing all 4 tests passing:
     - `POST /tasks responds with 201 immediately and emits task-created event`
     - `DELETE /tasks/:id removes task and emits task-deleted event`
     - `POST /api/events/trigger-error emits error event and is handled safely without crashing server`
     - `GET /api/events/logs returns the captured event audit log`

### Screenshot 2: Real-Time Event Timing Output
- **How to capture:**
  1. In the terminal, run `npm run demo:timing`.
  2. Capture the console showing:
     - The HTTP response timestamp logged immediately (~15-25ms).
     - The background notification listener completing 1500ms later.
     - The confirmation that the client was never blocked.

### Screenshot 3: Postman / Thunder Client Verification
- **How to capture:**
  1. Start the server with `npm start`.
  2. Send a `POST http://localhost:5000/tasks` request with body:
     ```json
     {
       "title": "Complete AI Innovation Presentation",
       "priority": "high",
       "assignedUser": "AK Nursumar"
     }
     ```
  3. Send `GET http://localhost:5000/api/events/logs` to see the live background listener audit trail.
  4. Screenshot the Postman JSON response.
