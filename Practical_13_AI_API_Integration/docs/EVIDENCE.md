# Practical 13: Evidence and Screenshot Guidelines

**Student Name:** Abdulkadir Nursumar (AK Nursumar)  
**Course:** Advanced Web Development Frameworks (ITUE301)  

---

## Required Screenshots for Lab File

### Screenshot 1: Automated Integration Test Suite Run
- **How to capture:**
  1. Open a terminal in `Practical_13_AI_API_Integration/backend`.
  2. Run:
     ```bash
     npm test
     ```
  3. Capture the terminal showing all 5 tests passing:
     - Safe status check without leaking keys
     - 400 validation rejection for short titles
     - Graceful fallback when API key is missing
     - Successful task persistence with `isAiGenerated: true`
     - 429 rate limiter response when threshold is exceeded

### Screenshot 2: Graceful Degradation / Fallback Mode (Without API Key)
- **How to capture:**
  1. Leave `GEMINI_API_KEY=` empty in `backend/.env`.
  2. Start backend (`npm start`) and frontend (`npm run dev`).
  3. In the browser (`http://localhost:5173`), type title: `"Configure Nginx Reverse Proxy"`.
  4. Click **✨ Auto-Describe**.
  5. Capture the browser showing the amber alert:
     `AI suggestion disabled: No valid GEMINI_API_KEY configured in backend .env. Manual entry remains available.`
  6. Fill in the description manually, save the task, and show that task creation succeeds in MongoDB!

### Screenshot 3: Active AI Generation (With User Key)
- **How to capture:**
  1. Add your free Gemini API key to `backend/.env` (`GEMINI_API_KEY=AIzaSy...`).
  2. Restart backend: `npm start`.
  3. Reload `http://localhost:5173` (Notice top badge changes to `Provider: GEMINI ✔ Active`).
  4. Type title: `"Implement Redis Caching Layer"`.
  5. Click **✨ Auto-Describe**.
  6. Capture the browser showing the AI-generated description in the textarea with the cyan disclaimer:
     `✨ Description auto-generated! Please review, edit, or adjust it before saving.`
  7. Click "Save Task to Database" showing the task card rendered with the `AI Assisted` badge.
