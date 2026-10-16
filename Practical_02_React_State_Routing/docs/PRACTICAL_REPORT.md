# Practical 2 Lab Report: State Management and Routing in React

**Course Code:** ITUE301 (Advanced Web Development Frameworks)  
**Academic Year:** 2026–2027 | Semester 5  
**Institute:** DEPSTAR, CHARUSAT  
**Student Name:** Abdulkadir Nursumar  
**CO/PO Mapping:** CO1 / PO3, PO5  

---

## 1. Aim
To implement reactive state management using the `useState` hook and client-side multi-page routing using React Router v6 in an independent student portfolio application, enabling seamless view transitions without browser document reloads.

---

## 2. Theory Summary

### 2.1 Client-Side Routing vs. Multi-Page Applications (MPAs)
In traditional MPAs, clicking an anchor tag (`<a href="...">`) requests a new HTML file from the web server, destroying the existing JavaScript runtime state and triggering white-flash screen repaints. In a Single Page Application (SPA) powered by React Router:
- The browser URL is synced with the React component tree via the HTML5 History API (`pushState`, `replaceState`, `popstate`).
- Only the routed sub-component unmounts and mounts; parent layouts and styles persist in memory.

### 2.2 The `useState` Hook & Component Lifecycle
`useState` is a React Hook that declares a persistent state variable inside a functional component. It returns a tuple:
```javascript
const [state, setState] = useState(initialValue);
```
When `setState(newValue)` is called:
1. React queues a re-render for the component and its children.
2. If `Object.is(state, newValue)` is false, React re-invokes the component function.
3. React's Virtual DOM compares previous output against the newly generated JSX and applies minimal batch updates to the real DOM.

### 2.3 Controlled Form Components
In HTML, form elements like `<input>` and `<textarea>` maintain their own internal state. In a React **controlled component**, the input value is bound directly to React state (`value={state}`) and updated strictly through event handlers (`onChange={(e) => setState(e.target.value)}`). This provides a "single source of truth," allowing instant character counting, validation, formatting, and live preview rendering.

---

## 3. Architecture & Routing Diagram

```text
App.jsx (wrapped in <BrowserRouter> inside main.jsx)
 │
 ├── NavBar.jsx (NavLink to "/", "/projects", "/contact", theme toggle)
 │
 ├── <Routes>
 │    ├── Route path="/"         ──► <Home />          (Header, About, Skills, Tip Toggle)
 │    ├── Route path="/projects" ──► <ProjectsPage />  (Project Cards + Tag Filter State)
 │    ├── Route path="/contact"  ──► <ContactPage />   (Controlled Form, Live Echo, Character Counter)
 │    └── Route path="*"         ──► <NotFoundPage />  (Custom 404 handler)
 │
 └── Footer.jsx
```

---

## 4. Test Procedure & Verification

1. **Route Transition Audit:**
   - Clicked "Projects" and "Contact" in the navigation bar.
   - Observed that URLs change to `/projects` and `/contact` instantaneously without browser tab spinning or page reload.
2. **Controlled Form & Character Counter Audit:**
   - Typed characters into the Message textarea on the `/contact` route.
   - Verified that the character counter updates on each keystroke (`X / 300`) and stops accepting input past the 300-character boundary.
   - Verified that the Live Preview Box echoes the user's name, email, and message synchronously.
3. **Dark / Light Theme Toggle Audit:**
   - Clicked the theme toggle button (☀️ / 🌙) in the navigation bar.
   - Verified that `data-theme` attribute on the root element toggles between `dark` and `light`, applying appropriate CSS colors.
4. **404 Not Found Route Audit:**
   - Navigated to `http://localhost:5173/non-existent-route`.
   - Verified that `NotFoundPage` renders with a 404 code and a working Return to Home button.
5. **Build Test:**
   - Executed `npm run build` to confirm zero compilation errors.

---

## 5. Observations & Result

| Observation Item | Expected Outcome | Actual Observation | Status |
| :--- | :--- | :--- | :--- |
| SPA Navigation | Route changes without page reload | Smooth client-side transitions via `NavLink` | **Pass** |
| Active Nav Indicator | Active link receives `.active` class | Active link visually highlighted with border & color | **Pass** |
| Theme State (`useState`) | Toggle switches between dark/light | Root `data-theme` updates dynamically | **Pass** |
| Controlled Inputs | Input values mirror state | Real-time echo in preview card upon typing | **Pass** |
| Character Counter | Dynamically updates length | Accurately shows `N / 300` characters | **Pass** |
| Catch-All 404 Route | Unknown URLs render custom 404 | Dedicated 404 page rendered for invalid paths | **Pass** |
| Production Build | Clean rollup bundle generated | Assets built into `dist/` successfully | **Pass** |

**Conclusion:** Reactive state management with `useState` and multi-page routing with React Router v6 were successfully engineered and verified.

---

## 6. Viva Questions & In-Depth Answers

### Q1: What is the difference between `<Link>` / `<NavLink>` and a standard HTML `<a>` anchor tag?
**Answer:** An `<a>` tag with an `href` triggers a default browser navigation event, requesting a fresh document from the server and causing a full page refresh. React Router's `<Link>` and `<NavLink>` intercept the click event (`e.preventDefault()`), call `history.pushState()` to update the URL in the browser bar, and instruct React Router to render the matching component without dropping application state or making an HTTP document request. `<NavLink>` additionally provides an `isActive` callback for styling active tabs.

### Q2: Why is the `BrowserRouter` component placed at the root level?
**Answer:** `BrowserRouter` establishes the routing context using React Context API. All routing hooks (`useNavigate`, `useLocation`, `useParams`) and components (`<Routes>`, `<Route>`, `<Link>`) must be nested inside `BrowserRouter` to access navigation history and current pathname. Defining it once in `main.jsx` ensures the entire app shares this navigation context.

### Q3: What is the purpose of controlled inputs, and how do they differ from uncontrolled inputs?
**Answer:** 
- In **controlled components**, the input element's value is controlled by React state (`value={state}`). The DOM element does not maintain its own state; any user input fires an `onChange` handler that updates React state, which then re-renders the input with the updated value.
- In **uncontrolled components**, the DOM itself manages the form data, and values are accessed imperatively using React refs (`useRef()`). Controlled inputs are preferred when instant validation, conditional submit disabling, or live character counting is required.

### Q4: How does React handle state batching in React 18+?
**Answer:** React 18 introduced **Automatic Batching**. Multiple state updates occurring inside event handlers, asynchronous callbacks (`fetch`, `setTimeout`), or promises are batched together into a single re-render. This optimizes rendering performance by preventing redundant DOM reconciliations.

### Q5: Why is a catch-all route (`path="*"`) essential in client-side routing?
**Answer:** In a client-side application, users may mistype URLs or follow outdated links. Without a catch-all route (`path="*"`), React Router will render a completely blank layout when no defined route matches, leading to poor user experience. The `*` route captures all unmatched paths and displays a descriptive 404 Not Found component with recovery navigation.
