# Verification Report: Practical 1

**Practical:** Practical 1 — Introduction to React and Component Architecture  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Date:** October 2026  
**Environment:** Windows, Node.js v22.17.0, npm v11.5.2, Vite v6.4.4, React v18.3.1  

---

## Commands Executed & Verification Output

### 1. Dependency Installation
```bash
npm install
```
**Result:** Code 0 (Success)  
`added 116 packages, and audited 117 packages in 35s. Found 0 vulnerabilities.`

### 2. Production Build Execution
```bash
npm run build
```
**Output:**
```text
> practical-01-react-component-architecture@1.0.0 build
> vite build

vite v6.4.4 building for production...
transforming...
✓ 34 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.90 kB │ gzip:  0.50 kB
dist/assets/index-FQkHud-1.css    6.60 kB │ gzip:  2.00 kB
dist/assets/index-B7oby2QX.js   154.03 kB │ gzip: 49.45 kB
✓ built in 1.21s
```
**Result:** Code 0 (Success). All assets bundled into `dist/` cleanly without any warnings or syntax errors.

### 3. Component & Prop Verification Checklist
- [x] **Component Hierarchy:** `App.jsx` cleanly composes `NavBar`, `Header`, `About`, `Skills`, `Projects`, and `Footer`.
- [x] **Props Passed to Minimum 2 Components:** Props passed to all 6 components (`Header`, `About`, `Skills`, `Projects`, `Footer`, `NavBar`).
- [x] **Dynamic Skills Render:** Dynamic `.map()` rendering with stable keys (`key={skill}`).
- [x] **Theme Color Prop:** Passed to `Header` and rendered as inline style on top border and CTA buttons.
- [x] **Active Section Navbar:** Live scroll-spy updating `activeSection` state.
- [x] **Verified Student Profile:** Configured in `src/config/profile.js` for Abdulkadir Nursumar, DEPSTAR, CHARUSAT.

**Status:** PASS
