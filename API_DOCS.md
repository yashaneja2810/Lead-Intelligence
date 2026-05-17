# API Documentation

This document describes the main HTTP endpoints used for the assessment demo and the request/response formats.

Base URL (development): `http://localhost:5000`

## POST /api/leads

Submits a new lead and kicks off the asynchronous enrichment workflow. The endpoint returns `202 Accepted` and streams status updates to the registered SSE endpoint.

Request body (application/json):

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "companyName": "ExampleCo",
  "industry": "SaaS",
  "websiteUrl": "https://example.com",
  "aiProvider": "groq" // or "gemini"
}
```

Success: `202 Accepted` with a JSON payload containing `workflowId` and `message`.

Validation errors: `400 Bad Request` with detailed Joi error messages.

## GET /api/workflow/:id/stream (SSE)

Server-Sent Events endpoint used by the frontend to receive real-time workflow updates. Subscribe with `EventSource` and handle `message` events containing JSON status objects.

Event format:

```json
{
  "step": "scraping",
  "status": "in-progress|completed|failed",
  "message": "Human readable message",
  "timestamp": "2026-05-17T...Z"
}
```

## Error Cases

- `500 Internal Server Error` on unexpected failures (backend logs contain detailed error traces).
- `422 Unprocessable Entity` may be used for semantic validation errors (optional).

## Examples (curl)

Submit lead:

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","companyName":"ExampleCo","industry":"SaaS","websiteUrl":"https://example.com","aiProvider":"groq"}'
```

SSE client (browser):

```js
const es = new EventSource('/api/workflow/<WORKFLOW_ID>/stream');
es.onmessage = (e) => console.log('status', JSON.parse(e.data));
```

If you'd like, I can also add an OpenAPI spec file (`openapi.yaml`) to this repo.
