# Lab Evidence & Screenshot Guide: Practical 8

**Student Name:** Abdulkadir Nursumar  
**Practical:** Practical 8 — Performance Optimization and Lazy Loading in React  

Capture the following genuine screenshots from your local environment for your practical submission:

### Required Screenshots
1. **`01_vite_build_separate_chunks.png`**:
   - Terminal showing `npm run build` output displaying separate chunks generated for `TasksPage`, `AnalyticsPage`, and `ContactPage`.
2. **`02_initial_dashboard_load.png`**:
   - Browser showing `http://localhost:5173/` with Network tab open, confirming only the initial bundle is requested on first visit.
3. **`03_slow_3g_suspense_fallback.png`**:
   - Browser DevTools with "Slow 3G" throttling enabled, showing the `<SuspenseFallback />` animated spinner while navigating to `/tasks`.
4. **`04_on_demand_chunk_download.png`**:
   - Browser Network tab showing the dynamic HTTP request for `TasksPage-[hash].js` appearing immediately upon navigation.
5. **`05_heavy_analytics_chunk.png`**:
   - Browser showing the rendered Analytics view after the chunk download completes.
6. **`06_react_devtools_profiler.png`**:
   - React DevTools Profiler tab showing recorded commit times and render durations.
