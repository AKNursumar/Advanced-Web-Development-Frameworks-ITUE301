# Practical 3 Lab Report: API Integration and Data Rendering in React

**Course Code:** ITUE301 (Advanced Web Development Frameworks)  
**Academic Year:** 2026–2027 | Semester 5  
**Institute:** DEPSTAR, CHARUSAT  
**Student Name:** Abdulkadir Nursumar  
**CO/PO Mapping:** CO1 / PO3, PO5  

---

## 1. Aim
To consume a real public REST API (GitHub REST API) in React, orchestrate asynchronous HTTP requests with the `useEffect` hook, manage loading/error/success states, and render dynamic repository data with client-side filtering.

---

## 2. Theory Summary

### 2.1 Side Effects & The `useEffect` Hook
In functional components, data fetching constitutes a **side effect** because it interacts with an external network boundary outside of pure UI rendering. Invoking `fetch()` directly in the body of a functional component causes an infinite re-render loop: fetching updates state, triggering a re-render, which immediately fires `fetch()` again.
The `useEffect(effectCallback, depsArray)` hook schedules side effects to run after DOM painting. Passing an empty dependency array (`[]`) guarantees that the network fetch executes precisely once upon initial component mount.

### 2.2 Asynchronous State Triad (Loading, Error, Data)
Reliable API integration demands handling three non-overlapping states:
1. **Loading State:** `loading = true` informs the user that an asynchronous task is in flight via `<Spinner />`.
2. **Error State:** Network dropouts, 404s, or 403 rate limits set `error = message`, terminating the spinner and offering an actionable `<ErrorMessage />` with retry capability.
3. **Success State:** When `response.ok` is true, parsed JSON is committed to `repos = data`, rendering `<RepoCard />` items.

### 2.3 The GitHub REST API
GitHub's public REST API endpoint `https://api.github.com/users/{username}/repos` returns an array of JSON objects containing public repository metadata:
- `name`: String identifier of the repository.
- `description`: Nullable string overview.
- `stargazers_count`: Integer count of stars awarded.
- `html_url`: Canonical public URL on GitHub.
- Rate limiting: 60 unauthenticated requests/hour per client IP address.

---

## 3. Architecture & Data Flow

```text
ProjectsPage.jsx
 ├── useEffect() executes on initial mount
 │    └── fetch('https://api.github.com/users/AKNursumar/repos')
 │         ├── [Status: Pending] ──► renders <Spinner />
 │         ├── [Status: Failure] ──► renders <ErrorMessage error={error} onRetry={fetch} />
 │         └── [Status: Success] ──► renders Search Filter + <RepoCard repo={repo} />
```

---

## 4. Test Procedure & Verification

1. **Happy Path (Real Data Verification):**
   - Navigated to `/projects`.
   - Verified that the network request to `https://api.github.com/users/AKNursumar/repos` returns HTTP 200 with 30 repository objects.
   - Confirmed repository names (`Advanced-Web-Development-Frameworks-ITUE301`, etc.), star badges, and direct links render correctly.
2. **Client-Side Filter Verification:**
   - Typed `Advanced` into the search input.
   - Confirmed the grid dynamically filters to matching repositories without network re-fetching.
3. **Error Path & Recovery Verification:**
   - Modified `src/config/github.js` to simulate an error (`simulateError: true`).
   - Observed that the UI cleanly switches to the `<ErrorMessage />` card displaying a clear error alert.
   - Restored `simulateError: false` and clicked the **"Retry Request"** button.
   - Verified the app successfully re-fetched live data and returned to the success state without reloading the browser.

---

## 5. Observations & Result

| Observation Item | Expected Outcome | Actual Observation | Status |
| :--- | :--- | :--- | :--- |
| API Call on Mount | Single network request on mount | Request sent once; no infinite loops observed | **Pass** |
| Loading UI | Accessible spinner during network wait | `<Spinner />` displayed with animated ring | **Pass** |
| Real Data Presentation | 30 live repos from GitHub API | Real names, stars, descriptions displayed | **Pass** |
| Search Filter | Real-time filtering by repository name | Instant UI update as keystrokes are registered | **Pass** |
| Error Handling | Catches network/API failures | Displays error message and Retry button | **Pass** |
| Zero Mock Data | Real external API consumed | Verified live endpoint response from GitHub | **Pass** |
| Production Build | Rollup compiles without errors | `npm run build` completed successfully | **Pass** |

**Conclusion:** Live API consumption with robust state handling and client-side filtering was successfully implemented and verified against the real GitHub REST API.

---

## 6. Viva Questions & In-Depth Answers

### Q1: Why must API calls in React be triggered inside `useEffect` and not in the component body?
**Answer:** A React functional component must remain a pure function regarding its rendering phase. Placing a side-effect like `fetch()` directly in the component body causes it to run on every single render. Since updating state inside the fetch callback (`setRepos()`) triggers another render, an infinite re-fetch loop occurs, exhausting network bandwidth and API rate limits. `useEffect` decouples the side effect, executing it safely after the DOM has updated and respecting the dependency array.

### Q2: What is the significance of the dependency array `[]` in `useEffect`?
**Answer:**
- `useEffect(fn)` (no array): Runs after *every* render.
- `useEffect(fn, [])` (empty array): Runs *only once* after the initial component mount.
- `useEffect(fn, [propA, stateB])`: Runs on mount and re-runs whenever `propA` or `stateB` changes value.

### Q3: Why is checking `response.ok` necessary when using the native `fetch()` API?
**Answer:** The native `fetch()` promise only rejects on physical network failures (e.g., DNS lookup failure, no internet connection). It does **not** reject on HTTP error status codes like 404 (Not Found) or 500 (Internal Server Error). Therefore, developers must explicitly inspect `if (!response.ok)` to throw a custom error and redirect execution to the `.catch()` block.

### Q4: How does `.finally()` contribute to state consistency in asynchronous operations?
**Answer:** The `.finally()` block executes regardless of whether the preceding Promise resolved or rejected. Using `.finally(() => setLoading(false))` ensures that the loading spinner is guaranteed to dismiss under all circumstances, preventing the application UI from remaining permanently stuck in a loading state if an error occurs.

### Q5: What is the benefit of client-side filtering over making a new API request on every keystroke?
**Answer:** When the full dataset has already been fetched into memory (e.g. all 30 user repositories), filtering locally in memory has $O(N)$ execution time (sub-millisecond) with zero network latency. Making an API request per keystroke consumes rate limits, adds 200–500ms network round-trip delays, and requires debouncing and race-condition management.
