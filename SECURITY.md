# Security & Data Handling

This section outlines the security considerations, data handling policies, and mitigation strategies implemented in this prototype.

1. Secrets & environment variables
- All credentials (API keys, SMTP passwords, Google credentials) are stored in environment variables and never committed. See `backend/.env.example` for required keys.

2. Least privilege for Google APIs
- Google Sheets/Drive integration requires a service account with the minimum scopes necessary. Integration is disabled by default.

3. Data retention
- Generated PDFs are stored locally in `backend/reports/`. For production, configure an object store (S3) and retention policy.

4. Input validation
- Lead form inputs are strictly validated with `Joi` to avoid injection attacks and malformed data.

5. Rate limiting and scraping politeness
- Scraper includes timeouts, retries, and should respect `robots.txt` in production. Rate limiting middleware can be enabled to avoid abuse.

6. Dependencies
- Keep dependencies up-to-date. Use `npm audit` and automated dependency updates in CI.

7. Logging & error handling
- Logs avoid printing secrets. Use structured logging and redact sensitive fields in production.

8. GDPR / PII
- Prototype stores only the submitted lead data and generated artifacts. For production usage, add clear privacy notices and opt-in flows.

If you need a security hardening checklist or a short remediation plan for production, I can add that as well.
