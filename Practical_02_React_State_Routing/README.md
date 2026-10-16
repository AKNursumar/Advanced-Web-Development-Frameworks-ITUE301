# Practical 02: State Management and Routing in React

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**CO/PO Mapping:** CO1 / PO3, PO5  

---

## 1. Aim & Objective
To implement reactive state management using the `useState` hook and multi-page client-side navigation using React Router v6 in an independent student portfolio application, preventing full-page browser reloads.

## 2. Features Implemented
- **React Router v6 Client-Side Navigation:**
  - Route `/`: Home page (Header, About, Skills, interactive dismissible tip).
  - Route `/projects`: Projects gallery with reactive tag filtering (`useState`).
  - Route `/contact`: Controlled contact form with real-time state echo, live character counter, and local submission feedback.
  - Route `*`: Dedicated 404 Not Found error page with a one-click return to Home.
- **`NavLink` Navigation Bar:**
  - Uses `NavLink` instead of plain `<a>` tags to eliminate page refreshes.
  - Active route highlighting using `isActive` callback.
- **Meaningful Reactive State (`useState`):**
  1. **Dark/Light Mode Theme Toggle:** Toggles root `data-theme` attribute between dark and light modes.
  2. **Controlled Contact Form:** Manages `senderName`, `senderEmail`, `subject`, and `message` states.
  3. **Live Character Counter:** Displays dynamic count `message.length / 300` in real time as the user types.
  4. **Live Typing Preview (Echo Box):** Renders form input synchronously as the user types.
  5. **Help Tip Visibility Toggle:** Toggles visibility of a dismissible lab notice banner.
- **Local Demo Clarification:** Explicit disclaimer that the form demonstrates state management without external server submission.

## 3. Project Structure
```text
Practical_02_React_State_Routing/
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
    ├── pages/
    │   ├── Home.jsx
    │   ├── ProjectsPage.jsx
    │   ├── ContactPage.jsx
    │   └── NotFoundPage.jsx
    └── components/
        ├── NavBar.jsx
        ├── Header.jsx
        ├── About.jsx
        ├── Skills.jsx
        ├── Projects.jsx
        └── Footer.jsx
```

## 4. Prerequisites
- **Node.js:** v18.0.0+ (Tested on Node.js v22.17.0)
- **npm:** v9.0.0+ (Tested on npm v11.5.2)

## 5. Installation & Run Instructions

```bash
# Navigate to the practical folder
cd Practical_02_React_State_Routing

# Install dependencies (including react-router-dom)
npm install

# Start development server
npm run dev
# Open http://localhost:5173

# Run production build check
npm run build

# Preview production build locally
npm run preview
```

## 6. Verification Checklist
- [x] Independent copy of Practical 1 cleanly extended with React Router v6.
- [x] Four distinct routes (`/`, `/projects`, `/contact`, `*`) rendered without full-page reloads.
- [x] `NavBar` uses `NavLink` with active route visual highlighting.
- [x] Theme toggle button in navbar switches between dark and light themes dynamically.
- [x] Contact form inputs are fully controlled components tied to `useState`.
- [x] Live character count updates dynamically under the message textarea.
- [x] Real-time preview box echoes form input immediately.
- [x] 404 page catches undefined paths (e.g. `http://localhost:5173/unknown-path`).
- [x] `npm run build` succeeds generating separate optimized assets.

## 7. Troubleshooting Guide
| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| `useRoutes() may be used only in the context of a <Router>` | `<App />` is not wrapped by `<BrowserRouter>` | Ensure `<BrowserRouter>` wraps `<App />` inside `src/main.jsx` |
| Clicking nav links causes full page reload | Used `<a href="...">` instead of `<NavLink to="...">` | Use React Router's `<NavLink>` or `<Link>` components |
| Form input does not update on typing | Missing `onChange` handler or missing state setter | Ensure `<input value={state} onChange={(e) => setState(e.target.value)} />` |
| 404 route never triggers | Order of routes or missing catch-all `*` | Define `<Route path="*" element={<NotFoundPage />} />` at the end of `<Routes>` |
