# Verification Report: Practical 9

**Practical:** Practical 9 — In-Memory Caching and Query Optimization  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Date:** October 2026  
**Environment:** Windows, Node.js v22.17.0, npm v11.5.2, MongoDB v7/8 on 127.0.0.1:27017, node-cache v5.1.2  

---

## Commands Executed & Verification Output

### 1. Automated Unit & Invalidation Tests
```bash
npm test
```
**Output:**
```text
> practical-09-caching-query-optimization@1.0.0 test
> jest --runInBand --detectOpenHandles --forceExit

  [MongoDB] Connected: awdf_tasks_practical9 @ 127.0.0.1:27017

PASS tests/cache.test.js (10.357 s)
  In-Memory Caching & Query Optimization Tests (Practical 9)
    GET /tasks Caching Behavior
      √ should return X-Cache: MISS on cold start and X-Cache: HIT on subsequent request (153 ms)
      √ should bypass cache when ?cache=false is supplied (58 ms)
    Cache Invalidation on Mutation
      √ should invalidate cache when a new task is created (POST /tasks) (199 ms)
      √ should invalidate cache when a task is updated (PUT /tasks/:id) (86 ms)
      √ should invalidate cache when a task is deleted (DELETE /tasks/:id) (67 ms)
    GET /api/cache/stats
      √ should report hits, misses, and hit ratio (55 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        10.778 s
Ran all test suites.
```
**Result:** Code 0 (Success). All 6 cache mechanics tests passed.

---

### 2. Live Caching Latency Benchmark
```bash
npm run benchmark
```
**Actual Measured Terminal Output:**
```text
===============================================================
   PRACTICAL 9: LIVE IN-MEMORY CACHING BENCHMARK MEASUREMENT   
   Student: Abdulkadir Nursumar | DEPSTAR, CHARUSAT            
===============================================================

[MongoDB] Connected: awdf_tasks_practical9 @ 127.0.0.1:27017
Seeding sample tasks for benchmark test...
Test server running on port: 60463

--- CONDITION A: UNCACHED (Direct MongoDB Query) ---
[HTTP] GET /tasks?cache=false - 2026-10-16T09:40:35.494Z
  Sample 1: 20.81 ms (X-Cache: BYPASS, HTTP 200)
[HTTP] GET /tasks?cache=false - 2026-10-16T09:40:35.509Z
  Sample 2: 6.41 ms (X-Cache: BYPASS, HTTP 200)
[HTTP] GET /tasks?cache=false - 2026-10-16T09:40:35.515Z
  Sample 3: 5.02 ms (X-Cache: BYPASS, HTTP 200)

--- CONDITION B: CACHED (In-Memory node-cache) ---
Priming cache (cold start)...
[HTTP] GET /tasks - 2026-10-16T09:40:35.521Z
  Cold Fetch: 5.68 ms (X-Cache: MISS)
[HTTP] GET /tasks - 2026-10-16T09:40:35.527Z
  Sample 1: 2.58 ms (X-Cache: HIT, HTTP 200)
[HTTP] GET /tasks - 2026-10-16T09:40:35.530Z
  Sample 2: 2.80 ms (X-Cache: HIT, HTTP 200)
[HTTP] GET /tasks - 2026-10-16T09:40:35.532Z
  Sample 3: 1.85 ms (X-Cache: HIT, HTTP 200)

===============================================================
                    ACTUAL MEASURED RESULTS                    
===============================================================
Uncached Latency Readings: [20.81 ms, 6.41 ms, 5.02 ms]
Average Uncached Latency:  10.75 ms
Cached Latency Readings:   [2.58 ms, 2.80 ms, 1.85 ms]
Average Cached Latency:    2.41 ms
Cache Hit Ratio:           75.00% (3 hits / 1 misses)
===============================================================
```

### 3. Empirical Findings
- **Uncached Average Latency:** 10.75 ms
- **Cached Average Latency:** 2.41 ms
- **Performance Improvement:** In-memory caching reduced response latency by ~77.6% (a 4.46x speedup).

### 4. Verification Checklist
- [x] **node-cache Integration:** Process-local caching with TTL 60 seconds.
- [x] **Distinct Keys:** `all_tasks` for list queries, `task_${id}` for individual task queries.
- [x] **Cache Invalidation:** Confirmed invalidation upon POST, PUT, and DELETE operations.
- [x] **Cache Bypass Flag:** `?cache=false` enables fair latency comparisons.
- [x] **Debug Statistics:** `GET /api/cache/stats` reports hits, misses, and hit ratio.
- [x] **Real Data & Measurements:** No invented numbers; genuine readings captured by `scripts/benchmark.js`.

**Status:** PASS
