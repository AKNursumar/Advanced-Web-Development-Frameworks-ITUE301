# Lab Evidence & Screenshot Guide: Practical 9

**Student Name:** Abdulkadir Nursumar  
**Practical:** Practical 9 — In-Memory Caching and Query Optimization  

Capture the following genuine screenshots from your local environment for your practical submission:

### Required Screenshots
1. **`01_cache_benchmark_terminal.png`**:
   - Terminal showing `npm run benchmark` with the live measurement table comparing 3 uncached vs 3 cached readings.
2. **`02_postman_uncached_miss.png`**:
   - Postman showing `GET /tasks` with header `X-Cache: MISS` and response duration.
3. **`03_postman_cached_hit.png`**:
   - Postman showing second `GET /tasks` with header `X-Cache: HIT` and significantly reduced response time.
4. **`04_postman_cache_invalidation.png`**:
   - Postman showing `POST /tasks` creating a task, followed immediately by `GET /tasks` showing `X-Cache: MISS` (proving cache invalidation occurred).
5. **`05_cache_stats_endpoint.png`**:
   - Postman showing `GET /api/cache/stats` with hits, misses, hit ratio, and active keys.
6. **`06_automated_jest_tests.png`**:
   - Terminal showing all tests passing in `npm test`.
