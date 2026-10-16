# Practical 1 Lab Report: Introduction to React & Component Architecture

**Course Code:** ITUE301 (Advanced Web Development Frameworks)  
**Academic Year:** 2026–2027 | Semester 5  
**Institute:** DEPSTAR, CHARUSAT  
**Student Name:** Abdulkadir Nursumar  
**CO/PO Mapping:** CO1 / PO3, PO5  

---

## 1. Aim
To set up a React development environment using Vite and construct a modular, responsive single-page portfolio user interface utilizing independently structured, reusable functional components and unidirectional prop data flow.

---

## 2. Theory Summary

### 2.1 React & Component-Based Architecture
React is a declarative, component-driven JavaScript library for engineering responsive user interfaces. Rather than manipulating the browser DOM directly via imperative methods (`document.getElementById`, `innerHTML`), React constructs an in-memory representation termed the **Virtual DOM**. When state or props mutate, React computes minimal DOM diffs (reconciliation algorithm) and updates only the altered DOM nodes.

### 2.2 Functional Components and Return Statements
Functional components are pure JavaScript functions that accept `props` as an argument and return a React element tree expressed in JSX. Functional components eliminate `this` context binding bugs found in legacy class components and promote testability and functional composition.

### 2.3 Unidirectional Data Flow & Props
Props (properties) enable immutable parent-to-child data communication:
- Data flows strictly top-down: `App.jsx` &rarr; `Child.jsx`.
- Props are read-only (`Object.freeze`); a child component must never mutate incoming props.
- Re-rendering triggers automatically when a parent passes updated prop references.

### 2.4 Dynamic List Rendering & Key Prop
When rendering arrays via `.map()`, React requires a unique, stable `key` prop on the top-level returned JSX node. This key informs React's reconciliation engine which array elements have been added, moved, or deleted, avoiding wasteful DOM recreations.

---

## 3. Architecture & Component Tree

```text
App.jsx (Root Component, imports studentProfile from src/config/profile.js)
 ├── NavBar.jsx        (brandName="AK Nursumar", tracks active scroll section)
 ├── Header.jsx        (name, headline, role, themeColor inline style, social links)
 ├── About.jsx         (bio, institute, semester, achievements)
 ├── Skills.jsx        (skillCategories prop -> dynamically mapped categories & pills)
 ├── Projects.jsx      (projects prop -> dynamically mapped project cards)
 └── Footer.jsx        (name, institute, email mailto:, social links)
```

---

## 4. Test Procedure & Verification

1. **Dependency Installation:**
   ```bash
   npm install
   ```
2. **Local Development Execution:**
   ```bash
   npm run dev
   ```
   Verified that Vite starts on `http://localhost:5173` with fast hot-module replacement (HMR).
3. **Production Build Validation:**
   ```bash
   npm run build
   ```
   Verified Vite compiles static assets into `dist/` without TypeScript or syntax errors.
4. **Component Prop Audit:**
   Inspected React elements using Browser DevTools to verify that `themeColor` is applied as an inline style to `Header` and that `Skills` maps all skill categories without React console warnings.

---

## 5. Observations & Result

| Observation Item | Expected Outcome | Actual Observation | Status |
| :--- | :--- | :--- | :--- |
| Component Hierarchy | 6 distinct components composed cleanly in `App.jsx` | Header, About, Skills, Projects, Footer, NavBar render hierarchically | **Pass** |
| Dynamic Skills Render | Array rendered using `.map()` with stable string keys | Rendered without any `key` warning in browser console | **Pass** |
| Inline Style Application | `themeColor` prop applied to Header top border / button | Accent style dynamically rendered from config | **Pass** |
| Responsive Layout | Fluid adaptation on mobile and desktop viewports | CSS grid and media queries resize smoothly | **Pass** |
| Production Build | Zero build errors in Vite rollup bundler | `dist/index.html` and chunk bundle created successfully | **Pass** |

**Conclusion:** The React component architecture was implemented successfully adhering to industry modularity standards and unidirectional data flow.

---

## 6. Viva Questions & In-Depth Answers

### Q1: What is JSX, and how does the browser execute it?
**Answer:** JSX (JavaScript XML) is a syntax extension for JavaScript that permits writing HTML-like markup inside JavaScript files. Browsers cannot parse JSX directly. During build time, bundlers (such as Vite via Babel or esbuild) transpile JSX tags into standard JavaScript function calls: `React.createElement(component, props, ...children)` or the modern JSX transform `_jsx(type, props)`.

### Q2: Why is component reusability vital in production web applications?
**Answer:** Reusable components embody the DRY (Don't Repeat Yourself) principle. They:
1. Isolate functionality, rendering bugs easily localized and resolved in one file.
2. Standardize UI patterns across teams and screens.
3. Accelerate development velocity through component libraries and design systems.
4. Improve testability through isolated unit tests.

### Q3: Why must the `key` prop in list rendering be unique and stable? Why not use array index?
**Answer:** The `key` prop gives elements a persistent identity across renders during Virtual DOM reconciliation. If an array index is used as a key and items are inserted, deleted, or reordered, the index associated with each item shifts. This confuses React, causing incorrect state attachment in child components and degrading render performance. A unique, stable identifier (such as an ID or unique skill string) guarantees precise element matching.

### Q4: What occurs inside React when props passed to a child component change?
**Answer:** When a parent component re-renders with new props, React performs a shallow reference comparison (`Object.is`) of the incoming props. If any prop reference differs, React schedules a re-render of the child component. The child's JSX is re-evaluated, compared against its previous Virtual DOM tree, and changes are committed to the real DOM.

### Q5: What is the purpose of Vite over legacy Create React App (CRA)?
**Answer:** Create React App utilizes Webpack, which bundles the entire application before starting the development server. Vite uses native browser ES Modules (ESM) during development and compiles individual files on-demand using esbuild (written in Go, 10-100x faster than JS bundlers). For production, Vite utilizes Rollup for optimized tree-shaking, code-splitting, and minification.
