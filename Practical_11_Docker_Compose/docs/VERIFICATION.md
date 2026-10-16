# Practical 11: Verification Record

**Date:** 2026-10-16  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**System:** Windows PowerShell, Node.js v22.17.0, npm 11.5.2  

---

## 1. Package Installation and Frontend Bundle Build Verification

### Frontend Build Test
Executed in `Practical_11_Docker_Compose/frontend`:
```bash
npm install
npm run build
```

Actual Terminal Output:
```
> practical-11-frontend@1.0.0 build
> vite build

vite v5.4.21 building for production...
transforming...
✓ 35 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.44 kB │ gzip:  0.30 kB
dist/assets/index-DU2MG9yH.css    2.24 kB │ gzip:  0.90 kB
dist/assets/index-CwPOM7cS.js   147.94 kB │ gzip: 47.69 kB
✓ built in 1.11s
```
*Result: PASS. Vite bundle compiled successfully with zero syntax or bundling errors.*

### Backend Dependencies Test
Executed in `Practical_11_Docker_Compose/backend`:
```bash
npm install
```
*Result: PASS. All 91 backend dependencies resolved and installed cleanly.*

---

## 2. Docker & Docker Compose Host Environment Check

Command executed:
```bash
docker --version; docker compose version
```

Actual Terminal Output:
```
docker : The term 'docker' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

### Truthful Status & Next Actions:
- **Local Host Status:** Docker Desktop is not currently installed or added to PATH on this Windows host.
- **Artifacts Prepared:**
  - `docker-compose.yml` (orchestrating `frontend`, `backend`, and `mongodb` with bridge network `app-network` and named volume `mongodb_data`)
  - `backend/Dockerfile` (Node 18 Alpine, non-root layer caching, port 5000)
  - `backend/.dockerignore`
  - `frontend/Dockerfile` (Multi-stage Node 18 build & preview server, port 5173)
  - `frontend/.dockerignore`
- **To Run On A Machine With Docker Desktop:**
  1. Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).
  2. Launch Docker Desktop and wait for the engine to initialize.
  3. Open PowerShell in `Practical_11_Docker_Compose` and run:
     ```bash
     docker compose up --build
     ```
  4. Open `http://localhost:5173` in your browser.
