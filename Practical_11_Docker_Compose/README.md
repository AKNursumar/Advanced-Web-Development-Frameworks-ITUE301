# Practical 11: Containerization with Docker and Docker Compose

**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Roll / Class:** B.Tech Information Technology, Semester 5, DEPSTAR, CHARUSAT  
**Course:** Advanced Web Development Frameworks (ITUE301)  

---

## Overview
This practical demonstrates the complete containerization of a multi-tier Task Management web application. The application stack is composed of three interconnected services orchestrating via Docker Compose:
1. **Frontend:** React + Vite Single Page Application running on port `5173`.
2. **Backend:** Node.js + Express REST API running on port `5000`.
3. **Database:** Official MongoDB 7.0 database container running on port `27017` with a persistent named volume.

---

## Directory Structure
```
Practical_11_Docker_Compose/
├── docker-compose.yml          # Top-level multi-container orchestration
├── .env.example                # Compose environment defaults
├── .gitignore                  # Git ignore rules
├── backend/
│   ├── Dockerfile              # Node.js Alpine backend image definition
│   ├── .dockerignore           # Excludes node_modules, .env from build context
│   ├── package.json
│   ├── server.js               # Entry point binding to 0.0.0.0:5000
│   └── src/                    # API routes, Mongoose models, and app factory
├── frontend/
│   ├── Dockerfile              # Multi-stage production build and preview
│   ├── .dockerignore           # Excludes node_modules, dist from build context
│   ├── package.json
│   ├── vite.config.js          # Configured for host: true (0.0.0.0)
│   ├── index.html
│   └── src/                    # React UI components and API client
└── docs/
    ├── PRACTICAL_REPORT.md     # Theory, diagrams, observations, viva questions
    ├── VERIFICATION.md         # Truthful build and environment audit
    └── EVIDENCE.md             # Screenshot guidelines for the lab file
```

---

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows or macOS) or Docker Engine + Docker Compose Plugin (Linux).

---

## Execution Guide

### 1. Start the Entire Multi-Container Stack
In the `Practical_11_Docker_Compose` directory, run:
```bash
docker compose up --build
```
*Docker Compose will build the frontend and backend images, pull MongoDB 7.0, initialize the bridge network (`app-network`), and mount the persistent volume (`mongodb_data`).*

### 2. Verify Running Containers
Open a new terminal window and verify all 3 services are running:
```bash
docker compose ps
```
Expected output:
- `awdf_mongodb` (Up / healthy, `0.0.0.0:27017->27017/tcp`)
- `awdf_backend` (Up, `0.0.0.0:5000->5000/tcp`)
- `awdf_frontend` (Up, `0.0.0.0:5173->5173/tcp`)

### 3. Access the Application
- **Frontend Web UI:** [http://localhost:5173](http://localhost:5173)
- **Backend API Health Check:** [http://localhost:5000/health](http://localhost:5000/health)
- **Backend Tasks Route:** [http://localhost:5000/tasks](http://localhost:5000/tasks)

### 4. Verify MongoDB Volume Persistence
1. Open [http://localhost:5173](http://localhost:5173) and add a task titled `"Docker Volume Test Task"`.
2. Stop and remove containers:
   ```bash
   docker compose down
   ```
3. Restart the containers:
   ```bash
   docker compose up -d
   ```
4. Reload [http://localhost:5173](http://localhost:5173). The task persists because MongoDB data is stored in the host-managed `mongodb_data` volume.

### 5. Inspect Service Logs
```bash
# Follow all container logs
docker compose logs -f

# Inspect only backend logs
docker compose logs -f backend
```

### 6. Stop and Clean Up
```bash
# Stop containers but keep database volume intact
docker compose down

# Stop containers AND delete persistent database volume (resets data)
docker compose down -v
```

---

## Troubleshooting

| Symptom | Cause | Solution |
|---|---|---|
| Backend fails to connect to MongoDB | Backend tried connecting to `localhost:27017` | Use Compose DNS `mongodb://mongodb:27017/awdf_tasks` |
| `port already in use` error | Local MongoDB (port 27017) or local Node server is running on host | Stop local MongoDB service (`net stop MongoDB`) or change host port in `docker-compose.yml` to `27018:27017` |
| Build is very slow | `node_modules` copied into build context | Verify `.dockerignore` exists in both `frontend` and `backend` |
