# Practical 03: API Integration and Data Rendering in React

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**CO/PO Mapping:** CO1 / PO3, PO5  

---

## 1. Aim & Objective
To consume a real public REST API (GitHub REST API) in React, handle asynchronous data retrieval using the `useEffect` hook, and manage distinct loading, error, and success states with user feedback.

## 2. Features Implemented
- **Live Real-World API Integration:**
  - Consumes `https://api.github.com/users/{username}/repos` with default configured user `AKNursumar`.
  - Zero fake data: fetches and renders real public repositories, actual star counts (`stargazers_count`), descriptions, and live GitHub URLs.
- **Three-Tier Asynchronous State Management:**
  - `data`: Stores the array of repository objects.
  - `loading`: Triggers an accessible, animated `<Spinner />` while network request is active.
  - `error`: Displays a structured `<ErrorMessage />` on HTTP or network failures with an interactive **"Retry Request"** button.
- **Configuration & Rate Limit Handling:**
  - Configured in `src/config/github.js`.
  - Checks `response.ok`, identifies HTTP 403 rate limits (60 unauthenticated reqs/hr) and HTTP 404 user not found.
  - Clean dependency management (`[]`) to prevent infinite fetch loops.
- **Client-Side Search / Filter:**
  - Instant client-side search input filtering fetched repositories by name in real time.
- **Attribution & Navigation:**
  - Direct profile attribution link to `https://github.com/AKNursumar`.

## 3. Project Structure
```text
Practical_03_React_API_Integration/
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
    │   ├── profile.js
    │   └── github.js
    ├── pages/
    │   ├── Home.jsx
    │   ├── ProjectsPage.jsx
    │   ├── ContactPage.jsx
    │   └── NotFoundPage.jsx
    └── components/
        ├── Spinner.jsx
        ├── ErrorMessage.jsx
        ├── RepoCard.jsx
        ├── NavBar.jsx
        ├── Header.jsx
        ├── About.jsx
        ├── Skills.jsx
        └── Footer.jsx
```

## 4. Prerequisites
- **Node.js:** v18.0.0+ (Tested on Node.js v22.17.0)
- **npm:** v9.0.0+ (Tested on npm v11.5.2)
- **Network Access:** Stable internet connection to connect to `api.github.com`.

## 5. Installation & Run Instructions

```bash
# Navigate to the practical folder
cd Practical_03_React_API_Integration

# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:5173 and click "Live GitHub Repos"

# Run production build
npm run build

# Preview production build locally
npm run preview
```

## 6. How to Test Success and Error Paths
1. **Happy / Success Path:**
   - Launch app and navigate to `http://localhost:5173/projects`.
   - Observe the loading spinner while fetching, followed by real repository cards for `AKNursumar` (e.g. `Advanced-Web-Development-Frameworks-ITUE301`).
2. **Error & Retry Path:**
   - Open `src/config/github.js`.
   - Option A: Change `GITHUB_USERNAME` to an invalid user (e.g. `__invalid_user_99999999__`).
   - Option B: Set `simulateError: true`.
   - Refresh the page and observe the `<ErrorMessage />` card and retry button.
   - Revert the change and click **"Retry Request"** to confirm recovery without page reload.

## 7. Troubleshooting Guide
| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| `Infinite network requests in console` | Missing dependency array in `useEffect` | Add `[]` as the second argument to `useEffect` |
| `Spinner never disappears` | `setLoading(false)` omitted in error path | Use `.finally(() => setLoading(false))` to guarantee loading terminates |
| `GitHub API rate limit exceeded (403)` | 60 unauthenticated requests reached from your IP | Wait a short period or test with alternate Wi-Fi/hotspot |
| `App crashes on API failure` | Reading properties of undefined before data loads | Ensure `loading` and `error` guard clauses precede data rendering |
