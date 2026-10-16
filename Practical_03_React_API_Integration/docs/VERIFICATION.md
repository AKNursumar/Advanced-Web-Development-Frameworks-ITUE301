# Verification Report: Practical 3

**Practical:** Practical 3 — API Integration and Data Rendering in React  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Date:** October 2026  
**Environment:** Windows, Node.js v22.17.0, npm v11.5.2, Vite v6.4.4, React v18.3.1, React Router v6.28.0  

---

## Commands Executed & Verification Output

### 1. Live GitHub REST API Verification
Direct live Node test against `https://api.github.com/users/AKNursumar/repos`:
```text
Fetched repos count: 30
First repo sample: {
  name: 'Advanced-Web-Development-Frameworks-ITUE301',
  html_url: 'https://github.com/AKNursumar/Advanced-Web-Development-Frameworks-ITUE301',
  stargazers_count: 0,
  description: null
}
```
**Result:** Verified live connection to GitHub API for student profile `AKNursumar`.

### 2. Dependency Installation
```bash
npm install
```
**Result:** Code 0 (Success)  
`added 119 packages, and audited 120 packages in 17s.`

### 3. Production Build Execution
```bash
npm run build
```
**Output:**
```text
> practical-03-react-api-integration@1.0.0 build
> vite build

vite v6.4.4 building for production...
transforming...
✓ 45 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.92 kB │ gzip:  0.50 kB
dist/assets/index-D31fdj85.css    7.68 kB │ gzip:  2.23 kB
dist/assets/index-B7bMx0YV.js   184.61 kB │ gzip: 59.67 kB
✓ built in 1.37s
```
**Result:** Code 0 (Success). All API handling components and routes compiled cleanly into `dist/`.

### 4. Verification Checklist
- [x] **Independent Codebase:** Full working React app containing complete portfolio code with API integration.
- [x] **Real Public API:** Consumes `https://api.github.com/users/AKNursumar/repos` without fabricated or mocked responses.
- [x] **Configurable Username:** Clear setting in `src/config/github.js`.
- [x] **Three Distinct States:** `loading` (`<Spinner />`), `error` (`<ErrorMessage />`), and `data` (`<RepoCard />`).
- [x] **Client-Side Filtering:** Instant search bar filtering repositories by name without redundant network calls.
- [x] **Error Path & Retry Button:** Tested error state handling with live recovery upon retry.
- [x] **Zero Memory Leak / Infinite Loop:** Dependency array `[]` correctly configured in `useEffect`.

**Status:** PASS
