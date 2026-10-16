# Practical 11: Evidence and Screenshot Guidelines

**Student Name:** Abdulkadir Nursumar (AK Nursumar)  
**Course:** Advanced Web Development Frameworks (ITUE301)  

---

## Required Screenshots for Lab File

### Screenshot 1: Docker Compose Up Terminal Output
- **How to capture:**
  1. Open a terminal in `Practical_11_Docker_Compose`.
  2. Run `docker compose up --build`.
  3. Capture the terminal showing:
     - Building frontend image and backend image
     - Starting `awdf_mongodb`, `awdf_backend`, and `awdf_frontend`
     - Healthcheck passing on `awdf_mongodb`
     - Backend log: `[MongoDB] Connected successfully to host: mongodb`

### Screenshot 2: Running Containers (`docker compose ps`)
- **How to capture:**
  1. Open a second terminal window.
  2. Run:
     ```bash
     docker compose ps
     ```
  3. Capture the table displaying all three services in `Up` / `healthy` state with mapped ports `0.0.0.0:5173->5173/tcp` and `0.0.0.0:5000->5000/tcp`.

### Screenshot 3: Browser Full-Stack Verification
- **How to capture:**
  1. Open Chrome/Edge at `http://localhost:5173`.
  2. Add a new task titled `"Containerized Task Demo"`.
  3. Screenshot the browser showing the task in the list with network activity in DevTools demonstrating successful calls to `http://localhost:5000/tasks`.

### Screenshot 4: Volume Persistence Verification
- **How to capture:**
  1. Run `docker compose down`.
  2. Run `docker compose up -d`.
  3. Refresh `http://localhost:5173` showing the previously created task remains intact in MongoDB.
