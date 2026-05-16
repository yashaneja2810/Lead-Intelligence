# Backend - AI Lead Enrichment Platform

Production-grade Node.js backend with TypeScript, multi-agent AI pipeline, and comprehensive automation.

## 🏗️ Architecture

```
src/
├── config/           # Configuration management
├── controllers/      # Request handlers
├── middleware/       # Express middleware
├── providers/        # AI provider implementations
│   ├── gemini.provider.ts
│   └── groq.provider.ts
├── prompts/          # AI agent prompts
├── routes/           # API routes
├── services/         # Business logic
│   ├── scraper.service.ts
│   ├── pdf.service.ts
│   ├── email.service.ts
│   ├── google-sheets.service.ts
│   ├── google-drive.service.ts
│   └── workflow.service.ts
├── templates/        # PDF templates
├── types/            # TypeScript definitions
├── utils/            # Utilities
└── index.ts          # Entry point
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Development
npm run dev

# Production
npm run build
npm start
```

## 🔑 Key Components

### 1. Scraper Service

**Features:**
- Playwright for JavaScript-heavy sites
- Cheerio fallback for static sites
- Multi-page scraping
- Screenshot capture
- Tech stack detection
- Retry logic with exponential backoff

**Usage:**
```typescript
import scraperService from './services/scraper.service';

const data = await scraperService.scrapeWebsite('https://example.com');
```

### 2. AI Providers

**Gemini Provider:**
```typescript
import geminiProvider from './providers/gemini.provider';

const insights = await geminiProvider.generateInsights(scrapedData, lead);
```

**Groq Provider:**
```typescript
import groqProvider from './providers/groq.provider';

const insights = await groqProvider.generateInsights(scrapedData, lead);
```

### 3. Multi-Agent Pipeline

Six specialized agents:

1. **Research Agent**: Business model analysis
2. **Business Analyst**: SWOT analysis
3. **SEO Expert**: Technical SEO audit
4. **UX Critic**: User experience evaluation
5. **AI Consultant**: AI opportunity identification
6. **Report Composer**: Synthesis and executive summary

### 4. PDF Service

Generates professional reports using:
- Puppeteer for PDF rendering
- Custom HTML/CSS templates
- Embedded charts and visualizations
- Professional consulting style

### 5. Workflow Orchestrator

Coordinates the entire pipeline:
```typescript
import workflowService from './services/workflow.service';

const report = await workflowService.executeWorkflow(leadData);
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Submit Lead (Fire and Forget)
```
POST /api/leads/submit
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "companyName": "Acme Inc",
  "websiteUrl": "https://acme.com",
  "industry": "SaaS",
  "aiProvider": "gemini",
  "additionalNotes": "Focus on SEO"
}
```

### Submit Lead with Status (SSE)
```
POST /api/leads/submit-with-status
Content-Type: application/json

Returns: Server-Sent Events stream with workflow progress
```

## 🔐 Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AI Providers
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_app_password
EMAIL_FROM=your_email
EMAIL_FROM_NAME=Lead Enrichment AI

# Google APIs
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
GOOGLE_SHEETS_SPREADSHEET_ID=your_id
GOOGLE_DRIVE_FOLDER_ID=your_id

# Optional
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

## 🛡️ Error Handling

The backend implements comprehensive error handling:

- **Retry mechanisms** for API calls
- **Fallback strategies** for scraping
- **Graceful degradation** for optional services
- **Detailed logging** with Winston
- **User-friendly error messages**

## 📊 Logging

Winston logger with multiple transports:
- Console (development)
- File (error.log, combined.log)
- Structured JSON format

## 🔒 Security

- **Helmet.js** for security headers
- **Rate limiting** on API endpoints
- **Input validation** with Joi
- **CORS** configuration
- **Environment variable** protection

## 🧪 Testing

```bash
# Lint
npm run lint

# Type check
npm run build
```

## 📦 Dependencies

### Core
- express
- typescript
- dotenv

### AI
- @google/generative-ai
- groq-sdk

### Scraping
- playwright
- cheerio
- axios

### PDF
- puppeteer

### Email & Storage
- nodemailer
- googleapis

### Utilities
- joi (validation)
- winston (logging)
- helmet (security)
- express-rate-limit

## 🚀 Deployment

### Railway
```bash
railway up
```

### Render
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Troubleshooting

### Playwright Issues
```bash
npx playwright install
npx playwright install-deps
```

### Google API Setup
1. Create service account
2. Download JSON credentials
3. Share spreadsheet/folder with service account email
4. Add credentials to .env

### SMTP Issues
- Use app-specific password for Gmail
- Enable "Less secure app access" if needed
- Check firewall settings

## 📈 Performance

- **Concurrent scraping**: Multiple pages in parallel
- **Caching**: Reuse browser instances
- **Streaming**: SSE for real-time updates
- **Async/await**: Non-blocking operations

## 🎯 Best Practices

1. **Modular design**: Each service is independent
2. **Type safety**: Full TypeScript coverage
3. **Error resilience**: Graceful fallbacks
4. **Logging**: Comprehensive debugging info
5. **Configuration**: Environment-based settings

## 📝 Notes

- Playwright requires system dependencies
- Google APIs need service account setup
- SMTP requires app-specific passwords
- Rate limiting protects against abuse
