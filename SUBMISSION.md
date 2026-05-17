# Submission Summary & Demo Notes

This file is intended to be included with the submission to SimplifIQ. It summarizes the deliverable, how to run the demo, and recommended talking points for an interview.

## What this submission includes

- Fully working prototype that automates: lead capture → enrichment → AI analysis → PDF generation → email delivery
- Professional PDF templates with industry-specific personalization
- Real-time workflow status via Server-Sent Events
- Toggle-enabled Google Sheets & Drive integrations (disabled by default)
- Extensive documentation: setup, API, testing, assumptions, tradeoffs, security

## How to run the demo

1. Configure `backend/.env` (see `SETUP.md`) and ensure at least one AI key is present.
2. Start backend and frontend (see `TESTING.md`).
3. Open the frontend in a browser and submit a lead.
4. Observe real-time status and verify email + PDF.

## Demo talking points (2–6 minutes)

1. Show README and architecture diagram — explain 2-tier scraping and single LLM multi-agent approach.
2. Submit a lead in the UI — emphasize real-time SSE updates.
3. Explain how PDF personalization is produced from scraped data + AI insights.
4. Show the generated PDF and explain prioritized recommendations.
5. Discuss robustness: Playwright fallback, retry & backoff, error logging.
6. Mention bonus features (Sheets/Drive) and how they'd be enabled in production.

## Contact

If you need a short walkthrough video or additional tests, I can provide them on request.

Thank you for reviewing this submission — I look forward to discussing the design and implementation in detail.
