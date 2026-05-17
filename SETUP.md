# Setup & Configuration

This document gives concise, copy-paste steps to get the project running locally for evaluation.

1. Prerequisites

- Node.js 18+ and npm
- A Gmail account with an app password (for SMTP) or a transactional email account
- (Optional) Groq/Gemini API keys

2. Backend environment

Copy the example env and edit values:

```powershell
cd backend
copy .env.example .env
```

Fill in the following keys in `backend/.env`:

- `PORT` (default 5000)
- `GROQ_API_KEY` or `GEMINI_API_KEY` (one required for AI)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_FROM_NAME`
- `ENABLE_GOOGLE_INTEGRATIONS=false` (default)

3. Install & Run

```bash
# root
npm install

# backend
cd backend
npm install
npm run dev

# frontend
cd ../frontend
npm install
npm run dev
```

4. Run demo

- Open `http://localhost:3000`
- Submit lead form and watch for email + generated PDF in `backend/reports/`

5. Notes

- If Playwright needs browser binaries, run `npx playwright install` in the backend.
- For production, set `ENABLE_GOOGLE_INTEGRATIONS=true` and configure service account JSON.
