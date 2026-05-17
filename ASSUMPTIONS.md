# Assumptions

This document lists the explicit assumptions made while building the SimplifIQ assessment submission. Stating these clearly helps reviewers understand tradeoffs, limitations, and the intended scope.

1. Public data is available: The system assumes the target company's website is publicly accessible and not behind authentication.
2. Respect robots.txt and rate limits: Scraping is conservative (timeouts, retries, and rate limiting) and intended for non-protected endpoints only.
3. No persistent database required: The prototype uses local artifacts (PDFs in `reports/`) and in-memory state; a real deployment would add a persistent store.
4. Email via SMTP: Email delivery uses Gmail SMTP with an app password for simplicity. Production should use a transactional email provider.
5. AI provider keys required: Either `GROQ_API_KEY` or `GEMINI_API_KEY` (or both) must be provided for full functionality.
6. Google integrations optional: Sheets and Drive integrations are toggle-enabled via environment variables and disabled by default.
7. Limited scraping depth: The scraper collects main pages (home, about, services, pricing, blog) — not full site crawls.
8. Privacy-aware: No PII beyond lead form data is stored persistently; reports and screenshots are kept locally in `reports/` and `screenshots/`.
9. Time budgets: Typical workflow budget is 30–60 seconds (scrape + AI + PDF + email). Long-running sites may lead to degraded results.

If any of these assumptions should be changed for your evaluation, let me know and I will adapt the implementation and documentation accordingly.
