# Practical 01: React and Component Architecture

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**CO/PO Mapping:** CO1 / PO3, PO5  

---

## 1. Aim & Objective
To set up a modern React development environment using Vite and build a modular, responsive single-page portfolio user interface using independently structured, reusable functional components with unidirectional data flow via props.

## 2. Features Implemented
- **Vite + React Scaffolding:** Blazing-fast development environment using Vite 6 and React 18.
- **Independent Component Hierarchy:**
  - `NavBar.jsx`: Sticky navigation bar with live scroll-spy section highlighting.
  - `Header.jsx`: Hero showcase receiving `name`, `headline`, `role`, and dynamic `themeColor` as inline style.
  - `About.jsx`: Academic context (DEPSTAR, CHARUSAT, Semester 5) and verified hackathon/coding achievements.
  - `Skills.jsx`: Dynamically rendered skill categories using props and stable keys (`key={skill}`).
  - `Projects.jsx`: Modular card layout rendering verified student projects (Harborline, ReWear, BhoomiSetu, etc.).
  - `Footer.jsx`: Accessible social and contact links (`mailto:`, GitHub, LinkedIn, LeetCode).
- **Centralized Profile Config:** All personal details reside cleanly in `src/config/profile.js` for easy editing.
- **Design Aesthetics:** Custom dark-mode design system with CSS custom properties, glassmorphism, responsive grids, and typography from Google Fonts (Plus Jakarta Sans & JetBrains Mono).

## 3. Project Structure
```text
Practical_01_React_Component_Architecture/
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
    ├── config/
    │   └── profile.js
    └── components/
        ├── NavBar.jsx
        ├── Header.jsx
        ├── About.jsx
        ├── Skills.jsx
        ├── Projects.jsx
        └── Footer.jsx
```

## 4. Prerequisites
- **Node.js:** v18.0.0 or higher (Tested on Node.js v22.17.0)
- **npm:** v9.0.0 or higher (Tested on npm v11.5.2)

## 5. Installation & Run Instructions

```bash
# Navigate to the practical folder
cd Practical_01_React_Component_Architecture

# Install dependencies
npm install

# Start development server
npm run dev
# Server starts at http://localhost:5173

# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 6. Verification Checklist
- [x] Project runs without errors on `http://localhost:5173`.
- [x] Reusable functional components structured cleanly inside `src/components/`.
- [x] Props passed from `App.jsx` to `Header`, `About`, `Skills`, `Projects`, `Footer`.
- [x] Theme color prop applied as inline style on `Header.jsx`.
- [x] Array of skills dynamically mapped with stable keys without JSX duplication.
- [x] Active section in `NavBar.jsx` highlights smoothly on scroll.
- [x] `npm run build` succeeds generating optimized assets in `dist/`.

## 7. Troubleshooting Guide
| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| `Port 5173 is in use` | Another dev server is running | Run `npm run dev -- --port 5174` |
| `Props show as undefined` | Prop name mismatch between parent and child | Verify prop name in `App.jsx` matches destructured arguments in child component |
| `Component not visible` | Missing import or omitted from `App.jsx` JSX | Confirm import in `App.jsx` and inclusion inside the return block |
