# Testing & Validation

This file explains how to manually and programmatically validate the end-to-end workflow.

## Manual End-to-End Test (recommended for demo)

1. Start services:

```bash
# from repo root
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
```

2. Open `http://localhost:3000` and submit the lead form.
3. Watch the SSE status updates in the UI.
4. Confirm PDF appears in `backend/reports/` and email delivered to the configured SMTP address.

## Quick curl test

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"QA Test","email":"qa@example.com","companyName":"TestCo","industry":"Consulting","websiteUrl":"https://example.com","aiProvider":"groq"}'
```

Then watch server logs for workflow progress and check `backend/reports/`.

## Unit & Integration

- The repo includes a `tsconfig.json` and can be extended with Jest or Vitest for unit tests.
- Recommended tests:
  - Validation schema tests (Joi)
  - Scraper parsing functions (Cheerio fixtures)
  - PDF template rendering (snapshot)
  - Email service integration mocked with `nodemailer-mock`

## Edge Cases to Verify

- Missing or invalid `websiteUrl`
- Slow or JS-heavy sites (Playwright timeouts)
- AI provider failures / invalid API keys
- SMTP failures (wrong credentials)
- Google API disabled vs enabled flows

If you want, I can add a small test harness and a few unit tests to this repo.
