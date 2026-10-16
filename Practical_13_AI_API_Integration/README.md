# Practical 13: AI API Integration into a Web Application

**Student:** Abdulkadir Nursumar (AK Nursumar)  
**Roll / Class:** B.Tech Information Technology, Semester 5, DEPSTAR, CHARUSAT  
**Course:** Advanced Web Development Frameworks (ITUE301)  

---

## Overview
This project integrates external Generative AI capabilities into the full-stack Task Management web application. Users can enter a task title and click **✨ Auto-Describe** to have an AI model (Google Gemini 1.5 Flash or OpenAI GPT-4o-mini) generate a professional 2-3 sentence task description.

The implementation strictly demonstrates enterprise best practices:
- **Server-Side API Key Isolation:** Secret keys are stored exclusively in backend `.env` and never exposed to the frontend or git.
- **Graceful Degradation:** If the AI service is offline, times out, or no API key is provided, the application automatically falls back to manual entry without disrupting core task CRUD.
- **Human-in-the-Loop:** Suggestions are rendered in an editable textarea for review before database persistence.
- **Rate Limiting:** Protects against excessive requests using a sliding window rate limiter.
- **Data Minimization:** Only task titles are transmitted; private tokens and sensitive records are never sent to external AI models.

---

## Architecture
```
Practical_13_AI_API_Integration/
├── .env.example              # Root template
├── .gitignore                # Excludes node_modules, .env, dist
├── backend/
│   ├── package.json
│   ├── .env.example          # Backend environment template
│   ├── .env                  # Local secret configuration
│   ├── server.js             # Starts server on port 5000
│   ├── src/
│   │   ├── app.js            # Express application factory
│   │   ├── config/db.js      # MongoDB connection
│   │   ├── models/Task.js    # Task schema with isAiGenerated flag
│   │   ├── services/         # aiService.js (Gemini & OpenAI integration)
│   │   ├── routes/           # aiRoutes.js & taskRoutes.js
│   │   └── middleware/       # rateLimiter, logger, validate, errorHandler
│   └── tests/
│       └── ai.test.js        # Automated integration tests
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/                  # React UI with AI generation button & disclaimer
└── docs/
    ├── PRACTICAL_REPORT.md   # Academic report, theory, viva Q&A
    ├── VERIFICATION.md       # Truthful test execution logs
    └── EVIDENCE.md           # Screenshot guidelines
```

---

## Quick Start

### 1. Install Backend Dependencies
```bash
cd Practical_13_AI_API_Integration/backend
npm install
```

### 2. Configure Backend Environment & API Key
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/awdf_tasks_practical13
FRONTEND_URL=http://localhost:5173

# Choose 'gemini' (recommended) or 'openai'
AI_PROVIDER=gemini

# Obtain a free Google Gemini key from https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

AI_RATE_LIMIT_PER_MINUTE=5
```
*(Note: If you leave `GEMINI_API_KEY` empty, the system runs in Graceful Fallback Mode, keeping core task management 100% operational).*

### 3. Run Backend Integration Tests
```bash
npm test
```

### 4. Install Frontend Dependencies & Start App
In a second terminal:
```bash
cd Practical_13_AI_API_Integration/frontend
npm install
npm run dev
```

In the first terminal, start the backend:
```bash
cd Practical_13_AI_API_Integration/backend
npm start
```

### 5. Access Application
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/ai/status` | Returns provider status & privacy statement (keys hidden) |
| `POST` | `/api/ai/generate-description` | Generates editable task description from `{ title }` |
| `GET` | `/tasks` | Retrieves all tasks from MongoDB |
| `POST` | `/tasks` | Persists task in MongoDB (stores `isAiGenerated` flag) |
| `PUT` | `/tasks/:id` | Updates task status or fields |
| `DELETE` | `/tasks/:id` | Deletes task from MongoDB |
