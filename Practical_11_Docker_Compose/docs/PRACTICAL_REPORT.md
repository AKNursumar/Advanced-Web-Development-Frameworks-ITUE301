# Practical 11: Containerization with Docker and Docker Compose

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Semester:** 5th Semester, B.Tech Information Technology  
**Student Name:** Abdulkadir Nursumar (AK Nursumar)  
**Institute:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  

---

## 1. Objective / Aim
To containerize a full-stack Task Management application (React frontend, Express backend, and MongoDB database) into standardized OCI containers using Docker, and orchestrate their execution, networking, and persistent storage using Docker Compose.

---

## 2. Theory & Concepts

### 2.1 The Need for Containerization
In modern software engineering, software runs in diverse environments: developer laptops (Windows, macOS, Linux), staging servers, and cloud production environments. Differences in operating systems, Node.js runtime versions, and system libraries frequently cause the classic "it works on my machine" defect.

Docker addresses this by packaging an application and all its runtime dependencies, system binaries, and configuration files into an immutable, lightweight container image.

### 2.2 Orchestration with Docker Compose
A multi-tier web application consists of several interdependent services:
1. Client-facing Single Page Application (React)
2. RESTful Backend API (Express.js)
3. Document Database (MongoDB)

Starting and connecting these services manually with separate `docker run` commands is error-prone. Docker Compose provides declarative Infrastructure-as-Code via `docker-compose.yml`, enabling developers to define services, networks, volumes, health checks, and environment variables, and launch the entire application stack with a single command:
```bash
docker compose up --build
```

### 2.3 Container Networking & Service Discovery
Within a Docker network:
- Containers cannot reach each other via `localhost`, because `localhost` refers to the container's own internal loopback interface.
- Docker provides built-in DNS resolution: services can address each other using their Docker Compose service name. Thus, the Express backend connects to MongoDB using:
  ```
  mongodb://mongodb:27017/awdf_tasks
  ```
- The host machine's browser accesses the frontend on `http://localhost:5173` and the backend on `http://localhost:5000` via explicit port mappings (`ports: "host_port:container_port"`).

---

## 3. Architecture & Container Network Topology

```
Host Browser (localhost:5173 / localhost:5000)
       │
       ▼
 ┌────────────────────────────────────────────────────────────┐
 │ Docker Bridge Network: app-network                         │
 │                                                            │
 │   ┌─────────────────┐           ┌─────────────────┐       │
 │   │ frontend        │           │ backend         │       │
 │   │ (Node 18 Build) │──────────►│ (Express API)   │       │
 │   │ Port: 5173      │           │ Port: 5000      │       │
 │   └─────────────────┘           └────────┬────────┘       │
 │                                          │                 │
 │                                          │ DNS: "mongodb"  │
 │                                          ▼                 │
 │                                 ┌─────────────────┐       │
 │                                 │ mongodb         │       │
 │                                 │ (Mongo 7.0)     │       │
 │                                 │ Port: 27017     │       │
 │                                 └────────┬────────┘       │
 └──────────────────────────────────────────┼─────────────────┘
                                            ▼
                           Named Volume: [mongodb_data]
                           (Persistent host storage)
```

---

## 4. Implementation Steps

1. **Backend Dockerfile (`backend/Dockerfile`):**
   - Base image: `node:18-alpine`
   - Layer caching: Copies `package*.json` first, runs `npm install --omit=dev`, then copies application code.
   - Exposes port `5000`.
2. **Frontend Dockerfile (`frontend/Dockerfile`):**
   - Multi-stage build compiling React into a production Vite bundle.
   - Exposes port `5173` with `--host 0.0.0.0`.
3. **Database & Orchestration (`docker-compose.yml`):**
   - Configures `mongodb` service with healthcheck ping (`db.adminCommand('ping')`).
   - Declares `depends_on: mongodb: condition: service_healthy` so Express waits until MongoDB is ready.
   - Declares named volume `mongodb_data` mounted to `/data/db` to survive container deletions.
4. **Build Optimization (`.dockerignore`):**
   - Prevents host `node_modules`, `.env`, and git history from bloating the build context.

---

## 5. Verification & Testing Procedure

1. **Prerequisites Check:**
   Verify Docker Engine and Docker Compose CLI availability:
   ```bash
   docker --version
   docker compose version
   ```
2. **Stack Launch:**
   Build images and start all 3 services in foreground or detached mode:
   ```bash
   docker compose up --build
   ```
3. **Service Verification:**
   Inspect running containers and port mappings:
   ```bash
   docker compose ps
   ```
4. **Data Persistence Test:**
   - Open `http://localhost:5173` in a browser and create a new task: `"Test Persistent Docker Volume"`.
   - Shut down all containers:
     ```bash
     docker compose down
     ```
   - Restart the stack without rebuilding:
     ```bash
     docker compose up -d
     ```
   - Refresh `http://localhost:5173`. Confirm the task is still displayed, verifying that `mongodb_data` volume preserved data.

---

## 6. Viva Questions & In-Depth Answers

### Q1: Why does the backend container need to reference MongoDB by service name `mongodb` rather than `localhost`?
**Answer:** Each container in Docker operates in its own isolated network namespace with its own private loopback network (`127.0.0.1` / `localhost`). Inside the `backend` container, `localhost:27017` refers to the backend container itself, which has no database listening. Docker Compose creates a user-defined bridge network with automatic internal DNS resolution, allowing the backend to reach MongoDB using the hostname corresponding to its service name (`mongodb:27017`).

### Q2: What is the difference between `EXPOSE` in a Dockerfile and `ports` in `docker-compose.yml`?
**Answer:** `EXPOSE` is purely documentation and metadata specifying which ports the containerized process listens on internally; it does not make the port accessible to the host machine. The `ports` directive in `docker-compose.yml` (`5000:5000`) actually binds the host machine's network interface to the container's port using iptables/NAT rules, allowing external web browsers and HTTP clients on the host to communicate with the container.

### Q3: Why is it considered bad practice to copy `node_modules` from the host into a Docker image?
**Answer:** Copying local `node_modules` into an image:
1. Causes architecture and OS incompatibility if binary native addons (such as `bcrypt` or `sharp`) were compiled for the host OS (e.g., Windows x64) rather than the container OS (e.g., Linux Alpine).
2. Dramatically slows down Docker build context transfer (hundreds of megabytes).
3. Breaks Docker layer caching.
The best practice is to add `node_modules` to `.dockerignore` and run `npm install` directly inside the Linux container.

### Q4: How does a Docker named volume ensure database persistence?
**Answer:** Standard container filesystems are ephemeral (copy-on-write union filesystems) and are wiped whenever a container is removed. A named Docker volume (`mongodb_data:/data/db`) mounts a dedicated storage directory directly managed by Docker on the host machine. When the MongoDB container writes database files to `/data/db`, writes bypass the union filesystem and persist on host storage, remaining intact even after `docker compose down`.

### Q5: What does the `--build` flag in `docker compose up --build` do, and when is it required?
**Answer:** By default, `docker compose up` uses previously built local cached images if they exist. If a developer edits application source code, Dockerfile instructions, or packages, running `docker compose up` without `--build` may run the stale cached container. Specifying `--build` forces Docker Compose to evaluate the build contexts, rebuild modified image layers, and ensure new code is reflected in the running stack.
