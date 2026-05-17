# Tradeoffs & Design Rationale

This file summarizes important tradeoffs made to balance speed, cost, engineering complexity, and reviewer expectations for a short technical assessment.

1. Single LLM call with multiple agents
- Benefit: Faster, lower cost, and consistent cross-agent context.
- Tradeoff: Slightly more complex prompt engineering and larger prompt size.

2. Playwright primary, Cheerio fallback
- Benefit: Handles JS-heavy sites and still works for static pages.
- Tradeoff: Playwright increases resource usage and complexity; Cheerio may miss dynamic content.

3. No production database
- Benefit: Simplifies the assessment and keeps focus on end-to-end automation.
- Tradeoff: No persistence for leads or audit history; added local `reports/` folder as artifact store.

4. Gmail SMTP for email
- Benefit: Easy to configure and reliable for demos.
- Tradeoff: Not ideal for scale; production should use SendGrid/Mailgun/Postmark.

5. PDF via headless browser
- Benefit: Pixel-perfect rendering and CSS control for professional reports.
- Tradeoff: Puppeteer adds binary dependencies and increases build size.

6. Optional Google integrations
- Benefit: Bonus features included but disabled by default to avoid credential issues.
- Tradeoff: Adds more API surface and potential permission/configuration complexity.

7. Minimal auth/security scope
- Benefit: Focus on core workflow for the assessment.
- Tradeoff: Authentication, rate-limiting per user, and tenant isolation are left for production iterations.

These tradeoffs were chosen to maximize the deliverable value for a short technical assessment: a complete, demonstrable, and high-quality end-to-end workflow while keeping the implementation understandable and reviewable.
