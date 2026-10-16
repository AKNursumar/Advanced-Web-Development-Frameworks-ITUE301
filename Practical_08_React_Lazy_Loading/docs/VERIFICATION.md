# Verification Report: Practical 8

**Practical:** Practical 8 — Performance Optimization and Lazy Loading in React  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Date:** October 2026  
**Environment:** Windows, Node.js v22.17.0, npm v11.5.2, Vite v6.4.4, React v18.3.1, React Router v6.28.0  

---

## Commands Executed & Verification Output

### 1. Dependency Installation
```bash
npm install
```
**Result:** Code 0 (Success)  
`added 119 packages, and audited 120 packages in 21s.`

### 2. Production Build Execution (Dynamic Chunk Verification)
```bash
npm run build
```
**Output:**
```text
> practical-08-react-lazy-loading@1.0.0 build
> vite build

vite v6.4.4 building for production...
transforming...
✓ 38 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                          0.89 kB │ gzip:  0.47 kB
dist/assets/index-D2Vtu-z7.css           4.33 kB │ gzip:  1.52 kB
dist/assets/ContactPage-CnxYpALx.js      1.90 kB │ gzip:  0.81 kB
dist/assets/TasksPage-DMLShsBl.js        2.29 kB │ gzip:  1.11 kB
dist/assets/AnalyticsPage-Dfo21zBB.js    2.49 kB │ gzip:  1.07 kB
dist/assets/index-Dn1uckrn.js          171.77 kB │ gzip: 56.26 kB
✓ built in 1.27s
```
**Result:** Code 0 (Success). Verified that Rollup produced 3 independent dynamic route chunks (`TasksPage`, `AnalyticsPage`, `ContactPage`) separated from the core entry bundle (`index-Dn1uckrn.js`).

### 3. Chunk Size Breakdown

| Chunk File | Raw Size | Gzip Size | Trigger / Route |
| :--- | :--- | :--- | :--- |
| `index-Dn1uckrn.js` | 171.77 kB | 56.26 kB | Initial Page Visit (Core React, Router, Dashboard) |
| `TasksPage-DMLShsBl.js` | 2.29 kB | 1.11 kB | On-demand navigation to `/tasks` |
| `AnalyticsPage-Dfo21zBB.js` | 2.49 kB | 1.07 kB | On-demand navigation to `/analytics` |
| `ContactPage-CnxYpALx.js` | 1.90 kB | 0.81 kB | On-demand navigation to `/contact` |

### 4. Verification Checklist
- [x] **Dynamic Route Code Splitting:** `React.lazy()` applied to `TasksPage`, `AnalyticsPage`, and `ContactPage`.
- [x] **Default Exports:** All lazy-loaded components use `export default`.
- [x] **Accessible Suspense Fallback:** `<SuspenseFallback />` provides `role="status"` and `aria-live="polite"` text with animated spinner.
- [x] **Network Throttling Validation:** Tested with DevTools Slow 3G throttling.
- [x] **Heavy Analytical Component:** Included `AnalyticsPage` to demonstrate chunk isolation for heavier visualization modules.

**Status:** PASS
