# Practical 08: Performance Optimization and Lazy Loading in React

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**CO/PO Mapping:** CO1 / PO3, PO5  

---

## 1. Aim & Objective
To optimize the frontend performance of a React single-page application by implementing route-level code splitting using `React.lazy()` and `Suspense`, reducing the initial bundle size transferred on first visit, and verifying chunk generation and network throttling behavior.

## 2. Features Implemented
- **Dynamic Route-Based Code Splitting:**
  - Critical Entry: `DashboardPage` loaded synchronously in initial bundle.
  - On-Demand Chunks: `TasksPage`, `AnalyticsPage`, and `ContactPage` imported dynamically via `React.lazy(() => import('./pages/...'))`.
- **Accessible `<SuspenseFallback />`:**
  - Renders an animated loading spinner with `role="status"` and `aria-live="polite"` status text while lazy chunks download over the network.
- **Rollup Chunk Architecture:**
  - Configured in `vite.config.js` to emit clean, traceable chunk files (`TasksPage-[hash].js`, `AnalyticsPage-[hash].js`, `ContactPage-[hash].js`).
- **Heavy Analytical Visualization Component (Supplementary):**
  - Includes a simulated metrics and velocity bar chart component (`AnalyticsPage.jsx`) to observe code splitting on data-heavy modules.

## 3. Project Structure
```text
Practical_08_React_Lazy_Loading/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── docs/
│   ├── PRACTICAL_REPORT.md
│   ├── VERIFICATION.md
│   └── EVIDENCE.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   ├── NavBar.jsx
    │   └── SuspenseFallback.jsx
    └── pages/
        ├── DashboardPage.jsx
        ├── TasksPage.jsx
        ├── AnalyticsPage.jsx
        └── ContactPage.jsx
```

## 4. Prerequisites
- **Node.js:** v18.0.0+ (Tested on Node.js v22.17.0)
- **npm:** v9.0.0+ (Tested on npm v11.5.2)

## 5. Installation & Run Instructions

```bash
# Navigate to practical directory
cd Practical_08_React_Lazy_Loading

# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:5173

# Execute production build to observe separate chunk generation
npm run build

# Preview production build locally
npm run preview
```

## 6. Real Measurement & Observation Guide (DevTools Network Tab)

1. Open `http://localhost:5173` in Google Chrome or Microsoft Edge.
2. Press `F12` to open Developer Tools and select the **Network** tab.
3. Check **"Disable cache"** at the top bar.
4. Set the Throttling dropdown from *No throttling* to **"Slow 3G"** (or Fast 3G).
5. Filter by **"JS"** in the resource filter bar.
6. Refresh the page:
   - Notice that only the initial bundle (`index.js` and `DashboardPage`) loads.
7. Click the **"Tasks (Lazy)"** navigation link:
   - Observe the accessible `<SuspenseFallback />` spinner rendering.
   - Notice a new asynchronous network request in the Network table fetching `TasksPage-[hash].js` dynamically!
8. Click **"Analytics (Lazy)"**:
   - Observe `AnalyticsPage-[hash].js` downloading on-demand.

## 7. Performance Comparison Table

| Metric / Attribute | Monolithic Baseline (Before Optimization) | Code-Split Architecture (After React.lazy) |
| :--- | :--- | :--- |
| **Initial JS Download** | Single monolithic bundle downloaded upfront | Minimal core bundle (`index.js`); deferred routes |
| **Tasks Route Chunk** | Bundled inside main file | Separate `TasksPage-[hash].js` on-demand |
| **Analytics Route Chunk** | Bundled inside main file | Separate `AnalyticsPage-[hash].js` on-demand |
| **Contact Route Chunk** | Bundled inside main file | Separate `ContactPage-[hash].js` on-demand |
| **First Contentful Paint (FCP)** | Slower due to parsing all routes upfront | Faster initial paint of requested landing view |
| **Bandwidth Utilization** | Downloads 100% of code even if unused | Zero bandwidth spent on unvisited routes |

## 8. Troubleshooting Guide
| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| `Element type is invalid error` | Lazy component lacks a default export | Ensure route file uses `export default function ComponentName()` |
| `Fallback UI never appears` | Connection too fast on localhost | Enable "Slow 3G" or "Fast 3G" throttling in DevTools Network tab |
| `No separate chunk files after build` | Used static `import X from './X'` | Verify route uses `React.lazy(() => import('./X'))` syntax |
| `Suspense fallback flashes entire screen` | Suspense placed above header/navbar | Wrap only the `<Routes>` block inside `<Suspense>` |
