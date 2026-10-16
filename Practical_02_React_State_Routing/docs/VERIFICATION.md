# Verification Report: Practical 2

**Practical:** Practical 2 — State Management and Routing in React  
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

### 2. Production Build Execution
```bash
npm run build
```
**Output:**
```text
> practical-02-react-state-routing@1.0.0 build
> vite build

vite v6.4.4 building for production...
transforming...
✓ 42 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.90 kB │ gzip:  0.48 kB
dist/assets/index-CkHsxfi1.css    9.29 kB │ gzip:  2.49 kB
dist/assets/index-WRVtiLF2.js   184.34 kB │ gzip: 59.60 kB
✓ built in 1.41s
```
**Result:** Code 0 (Success). All routes and components bundled into `dist/` cleanly without warnings or syntax errors.

### 3. Verification Checklist
- [x] **Independent Application:** Self-contained Vite project containing complete portfolio code with React Router.
- [x] **Client-Side Routing:** Four distinct routes (`/`, `/projects`, `/contact`, `*`) rendered cleanly via `Routes` and `Route`.
- [x] **Zero Page Reloads:** Navigation managed through `NavLink` and `Link` with active visual indicators.
- [x] **State Management (`useState`):**
  - Dark/Light mode theme state toggles `data-theme` attribute on the root DOM element.
  - Controlled inputs for contact form (`senderName`, `senderEmail`, `subject`, `message`).
  - Live character counter (`message.length / 300`) updates on every keystroke.
  - Real-time input echo box mirrors state synchronously.
  - UI visibility toggle for dismissible tip banner.
- [x] **Form Validation & Local Demo Notice:** Validates required fields and email syntax; explicitly states form is a local demonstration.
- [x] **404 Catch-All Route:** Renders custom `NotFoundPage` with recovery link for any unknown path.

**Status:** PASS
