# Practical 8 Lab Report: Performance Optimization and Lazy Loading in React

**Course Code:** ITUE301 (Advanced Web Development Frameworks)  
**Academic Year:** 2026–2027 | Semester 5  
**Institute:** DEPSTAR, CHARUSAT  
**Student Name:** Abdulkadir Nursumar  
**CO/PO Mapping:** CO1 / PO3, PO5  

---

## 1. Aim
To improve frontend application performance and initial page load velocity by implementing route-level code splitting using `React.lazy()` and `Suspense`, isolating non-critical routes into on-demand asynchronous chunks and evaluating network transfer metrics under simulated throttling.

---

## 2. Theory Summary

### 2.1 The Single-Bundle Bottleneck
In conventional Single-Page Applications (SPAs) built with static top-level ES6 import statements (`import Tasks from './Tasks'`), the bundler traverses the entire dependency tree and concatenates all application code into a single monolithic JavaScript bundle (`bundle.js`).
As the application grows with multiple pages, charting libraries, and modal forms, the size of this initial bundle increases dramatically:
- The browser must download, parse, compile, and execute hundreds of kilobytes of JavaScript before rendering the very first interactive frame (First Contentful Paint / Time to Interactive).
- Users who only visit the home page waste network bandwidth downloading code for routes they never view.

### 2.2 Route-Level Code Splitting with `React.lazy()` and `Suspense`
Dynamic imports (`import('./path')`) leverage native browser ES Modules and bundler capabilities (Vite Rollup / Webpack) to slice code into distinct physical `.js` chunk files:
```javascript
const TasksPage = React.lazy(() => import('./pages/TasksPage'));
```
1. `React.lazy()` wraps the dynamic import promise.
2. The `<Suspense fallback={<Fallback />}>` component wraps the routed tree.
3. When the user navigates to `/tasks`, React triggers the dynamic import. While the network downloads `TasksPage-[hash].js`, React suspends rendering of that branch and renders the `fallback` UI without freezing the navigation bar.
4. Once the chunk resolves, React replaces the fallback with the fully instantiated component.

---

## 3. Architecture & Chunk Splitting Diagram

```text
Before Optimization (Single Monolithic Bundle):
  main.bundle.js ─────────────► [Dashboard][Tasks][Analytics][Contact] all loaded upfront

After Optimization (Code-Split on Demand):
  index.js (Core Entry) ──────► Loads immediately on first visit (Dashboard, NavBar, Router)
  ├── TasksPage-[hash].js      ──► Downloaded only when user navigates to /tasks
  ├── AnalyticsPage-[hash].js  ──► Downloaded only when user navigates to /analytics
  └── ContactPage-[hash].js    ──► Downloaded only when user navigates to /contact
```

---

## 4. Test Procedure & Verification

1. **Dependency Installation:**
   ```bash
   npm install
   ```
2. **Production Build & Chunk Verification:**
   ```bash
   npm run build
   ```
   Verified that Vite Rollup outputs distinct chunk files in `dist/assets/` corresponding to each `React.lazy()` boundary.
3. **Network Throttling Simulation (Slow 3G):**
   - Launched Vite preview (`npm run preview`).
   - In Browser DevTools Network tab, enabled "Disable cache" and selected **Slow 3G** throttling.
   - Clicked "Tasks (Lazy)" in navbar: observed `<SuspenseFallback />` animated spinner for ~1.5s while `TasksPage-[hash].js` was transferred.
   - Verified that subsequent clicks to the same route load instantaneously from browser memory without re-fetching.

---

## 5. Observations & Result

### Build Output Comparison & Chunk Metrics

| File Asset Emitted | Type | Role in Lifecycle |
| :--- | :--- | :--- |
| `index-[hash].js` | Initial Entry Bundle | Downloads immediately on first visit (React core, Router, Dashboard) |
| `TasksPage-[hash].js` | Code-Split Chunk | Downloaded on-demand when visiting `/tasks` |
| `AnalyticsPage-[hash].js` | Code-Split Chunk | Downloaded on-demand when visiting `/analytics` |
| `ContactPage-[hash].js` | Code-Split Chunk | Downloaded on-demand when visiting `/contact` |
| `index-[hash].css` | Stylesheet | Bundled global design system |

**Conclusion:** Implementing `React.lazy()` and `Suspense` reduced the critical initial bundle payload, deferred non-critical code, and verified seamless fallback transitions under simulated network throttling.

---

## 6. Viva Questions & In-Depth Answers

### Q1: What is the technical difference between a static import and a dynamic import?
**Answer:**
- A **static import** (`import X from './X'`) is evaluated at compile/bundle time. It must be declared at the top level of a file and forces the bundler to include module `X` in the immediate bundle chunk.
- A **dynamic import** (`import('./X')`) returns a JavaScript Promise that resolves to the module namespace object. It can be invoked conditionally or on-demand at runtime. Bundlers recognize dynamic imports as split points, creating separate output chunks.

### Q2: Why must a component imported via `React.lazy()` have a `default` export?
**Answer:** `React.lazy()` expects the Promise returned by `import()` to resolve to a module object with a `.default` property containing a valid React component: `{ default: Component }`. If a component uses a named export (`export function Component()`), `React.lazy()` will receive `{ Component }` instead of `.default`, causing an `Element type is invalid` runtime error. (To use a named export, one must chain `.then(module => ({ default: module.Named }))`).

### Q3: Why does lazy loading improve perceived performance even if total downloaded bytes over a full session remain identical?
**Answer:** Perceived performance is governed by **First Contentful Paint (FCP)** and **Largest Contentful Paint (LCP)**. Transferring a smaller initial bundle allows the browser to download, parse, and execute JavaScript much faster, rendering the requested page in milliseconds. Users rarely visit every page in an application during a single session, so unvisited routes never download at all, saving mobile data and device memory.

### Q4: When is lazy loading NOT recommended or counter-productive?
**Answer:**
1. **Critical Above-the-Fold Components:** Lazy loading the primary landing view or core navigation causes an unnecessary loading delay and visual layout shift (CLS).
2. **Very Small Components / Utilities:** If a component is only a few lines of code (e.g. 1 KB), the HTTP request overhead (TCP handshake, TLS negotiation, round-trip latency) outweighs the micro bundle reduction.
3. **High-Frequency Critical Workflows:** If users must transition rapidly between views, lazy loading without pre-fetching creates noticeable lag.

### Q5: What is the purpose of placing `<Suspense>` boundaries strategically in the component hierarchy?
**Answer:** The placement of `<Suspense>` determines how much of the UI is replaced by the fallback spinner. Wrapping the entire root application in a single `<Suspense>` boundary causes the navigation bar, footer, and shell to disappear while a sub-page loads. Wrapping only the `<Routes>` block ensures the navigation bar and global shell remain visible and interactive, providing an optimal user experience.
