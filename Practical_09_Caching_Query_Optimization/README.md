# Practical 09: In-Memory Caching and Query Optimization

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**CO/PO Mapping:** CO2, CO4 / PO3, PO5  

---

## 1. Aim & Objective
To implement server-side in-memory caching using `node-cache` in an Express and MongoDB REST API, design cache invalidation strategies across write operations, expose cache performance metrics, and measure empirical response time differences with a benchmark script.

## 2. Features Implemented
- **In-Memory Caching Engine (`node-cache`):**
  - Caches `GET /tasks` under key `'all_tasks'` with a 60-second TTL (`CACHE_TTL=60`).
  - Caches `GET /tasks/:id` under distinct key `'task_' + id`.
  - Injects `X-Cache: HIT` or `X-Cache: MISS` HTTP response headers.
  - Supports cache bypass via query parameter: `GET /tasks?cache=false` for fair latency comparisons.
- **Cache Invalidation Architecture:**
  - `POST /tasks`: Invalidates `'all_tasks'`.
  - `PUT /tasks/:id`: Invalidates `'all_tasks'` and `'task_' + id`.
  - `DELETE /tasks/:id`: Invalidates `'all_tasks'` and `'task_' + id`.
- **Metrics & Debug Endpoint (`GET /api/cache/stats`):**
  - Exposes `hits`, `misses`, `totalRequests`, `hitRatio`, and active keys count without exposing private task data.
- **Repeatable Measurement Benchmark (`npm run benchmark`):**
  - Executes genuine HTTP requests against the active database, records high-resolution timing readings, and prints a comparative table.
- **Process-Local Memory Limitation (Lab Note):**
  - `node-cache` stores objects in the heap of the active Node.js process. It resets on server restart and is **not shared** across multiple clustered instances or load-balanced containers. Distributed architectures require Redis or Memcached.

## 3. Endpoints Documentation

| Method | Endpoint | Cache Behavior | Invalidation Triggered |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Checks `'all_tasks'` (TTL 60s) | None (Read) |
| `GET` | `/tasks?cache=false` | Bypasses cache (forces DB read) | None |
| `GET` | `/tasks/:id` | Checks `'task_' + id` | None (Read) |
| `POST` | `/tasks` | Bypasses cache | Deletes `'all_tasks'` |
| `PUT` | `/tasks/:id` | Bypasses cache | Deletes `'all_tasks'` and `'task_' + id` |
| `DELETE` | `/tasks/:id` | Bypasses cache | Deletes `'all_tasks'` and `'task_' + id` |
| `GET` | `/api/cache/stats` | Dynamic metrics report | None |
| `POST` | `/api/cache/flush` | Flushes all keys | Wipes entire in-memory cache |

## 4. Prerequisites
- **Node.js:** v18.0.0+ (Tested on Node.js v22.17.0)
- **MongoDB:** Active MongoDB instance on `127.0.0.1:27017` or Atlas.

## 5. Installation & Execution Instructions

```bash
# Navigate to practical directory
cd Practical_09_Caching_Query_Optimization

# Install dependencies
npm install

# Run automated test suite (verifies cache hits, misses, and invalidation)
npm test

# Run the live benchmark to record genuine latency measurements
npm run benchmark

# Start the API server
npm start
# Server listens on http://localhost:5000
```

## 6. Troubleshooting Guide
| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| `Updated task not reflected in GET /tasks` | Cache was not invalidated after PUT/DELETE | Call `cache.del('all_tasks')` in update/delete controllers |
| `Every request returns X-Cache: MISS` | Cache key is unstable or TTL is set to 0 | Verify consistent static key `'all_tasks'` and positive TTL |
| `Cache disappears on server restart` | Expected behavior of process-local memory | Note as standard in-memory limitation; use Redis for multi-instance |
